import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AlbumDto, isAlbumDto } from './dto/album.dto';
import { Album } from './entities/album.entity';
import { checkUUID } from 'src/services';
import { TracksService } from 'src/tracks/tracks.service';

let albums: Album[] = [];

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  create(createAlbumDto: AlbumDto) {
    if (!isAlbumDto(createAlbumDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newAlbum = {
      id: uuid(),
      ...createAlbumDto,
    };
    albums = [...albums, newAlbum];
    return newAlbum;
  }

  findAll() {
    return albums;
  }

  findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('album with this id does not exist', httpStatus);
    }
    return album;
  }

  updateByArtistId(id: string) {
    albums = albums.map((album) =>
      album.artistId === id ? { ...album, artistId: null } : album,
    );
  }

  update(id: string, updateAlbumDto: AlbumDto) {
    if (!isAlbumDto(updateAlbumDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const album = this.findOne(id);
    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };
    albums = albums.map((album) => (album.id === id ? updatedAlbum : album));
    return updatedAlbum;
  }

  remove(id: string) {
    const album = this.findOne(id);
    albums = albums.filter((album) => album.id !== id);
    this.tracksService.updateByAlbumId(id);
    return album;
  }
}
