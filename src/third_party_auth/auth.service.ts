import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from './error-message';

@Injectable()
export class ThirdPartyAuthService {
  private secretKey: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET_THIRDPARTY');
  }

  // Extract and decode token
  private extractToken(token: string): any {
    if (!token) {
      throw new HttpException(ERROR_MESSAGES.TOKEN_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: this.secretKey });
      console.log('Decoded Token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error.message);
      throw new HttpException(
        ERROR_MESSAGES.INVALID_TOKEN,
        error.name === 'TokenExpiredError' ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN
      );
    }
  }

  // Get the decoded token
  async getDecodedToken(token: string): Promise<any> {
    return this.extractToken(token);
  }

  // Validate claims against required claims
  validateClaims(userClaims: string[], requiredClaims: string[]): boolean {
    return requiredClaims.every(claim => userClaims.includes(claim));
  }

  // Authorize user by validating token and claims
  async authorize(token: string, requiredClaims: string[]): Promise<boolean> {
    const decodedToken = this.extractToken(token);
    return this.validateClaims(decodedToken.claims || [], requiredClaims);
  }
}
