import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { RedisModule } from 'src/redis/redis.module';
import { AuthController } from './auth.controller';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';

@Global()
@Module({
  imports: [UsersModule, RedisModule, ImageStorageModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
