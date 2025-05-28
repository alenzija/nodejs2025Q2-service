import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [forwardRef(() => TracksModule)],
  exports: [AlbumsService],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
