import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { ArtistsModule } from '../artists/artists.module';
import { Album } from './entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), forwardRef(() => ArtistsModule)],
  exports: [AlbumsService],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
