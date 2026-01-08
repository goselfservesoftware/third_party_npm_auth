// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./third_party_auth/auth.module";
import { ConfigModule } from "@nestjs/config"; // Import ConfigModule
import { ThirdPartyAuthService } from "./third_party_auth/auth.service";
import { JwtStrategy } from "./third_party_auth/jwt.strategy";
import { ProviderGuard } from "./third_party_auth/provider.guard";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, AuthModule],
  controllers: [AppController],
  providers: [ThirdPartyAuthService, JwtStrategy, ProviderGuard, AppService],
})
export class AppModule {}
