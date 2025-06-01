import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [forwardRef(() => DbModule)],
  exports: [AlbumsService],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
