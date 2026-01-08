import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThirdPartyAuthService } from './auth.service';

@Injectable()
export class ProviderGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: ThirdPartyAuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const providers = this.reflector.get<string[]>('provider', context.getHandler());
    const requiredClaims = this.reflector.get<string[]>('claims', context.getHandler());

    // Ensure providers exist
    if (!providers || providers.length === 0) {
      throw new ForbiddenException('Provider must be specified');
    }

    // Ensure claims exist (should have at least one claim)
    if (!requiredClaims || requiredClaims.length === 0) {
      throw new ForbiddenException('At least one claim must be specified');
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Authorization header is missing or invalid');
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    if (!token) {
      throw new ForbiddenException('Token is missing');
    }

    try {
      // Validate and decode the token
      const user = await this.authService.getDecodedToken(token);

      // Provider check: check if user's provider matches any of the required providers
      if (!providers.includes(user.provider)) {
        throw new ForbiddenException(`User is missing the required providers: ${providers.join(', ')}`);
      }

      // Claims check: Ensure the user has all required claims
      const userClaims = user.claims || [];
      const missingClaims = requiredClaims.filter(claim => !userClaims.includes(claim));

      if (missingClaims.length > 0) {
        throw new ForbiddenException(`User is missing the required claims: ${missingClaims.join(', ')}`);
      }

      return true; // Grant access
    } catch (error) {
      console.error('Authorization error:', error.message);
      throw new ForbiddenException('Authorization failed');
    }
  }
}
