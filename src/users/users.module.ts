import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [forwardRef(() => DbModule)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
