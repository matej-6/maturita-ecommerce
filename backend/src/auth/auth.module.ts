import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { RedisModule } from 'src/redis/redis.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, RedisModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
