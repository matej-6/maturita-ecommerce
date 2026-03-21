import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { UsersModule } from 'src/users/users.module';
import { OptionalAuthGuard } from './optional-auth.guard';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

@Global()
@Module({
  imports: [AuthModule, UsersModule],
  providers: [AuthGuard, OptionalAuthGuard, AdminGuard],
  exports: [AuthGuard, OptionalAuthGuard, AdminGuard],
})
export class GuardsModule {}
