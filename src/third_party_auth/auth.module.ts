// auth.module.ts
import { Module } from '@nestjs/common';
import { ThirdPartyAuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { ProviderGuard } from './provider.guard';


@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_THIRDPARTY, // It's better to use ConfigService here
    }),
  ],
  controllers: [],
  providers: [ThirdPartyAuthService, JwtStrategy,ProviderGuard],
  exports: [ThirdPartyAuthService, JwtModule, PassportModule],
})
export class AuthModule {}
