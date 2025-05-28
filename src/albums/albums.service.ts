import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AlbumDto, isAlbumDto } from './dto/album.dto';
import { checkUUID } from '../services';
import { DbService } from '../db/db.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => DbService))
    private dbService: DbService,
  ) {}

  create(createAlbumDto: AlbumDto) {
    if (!isAlbumDto(createAlbumDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newAlbum = {
      id: uuid(),
      ...createAlbumDto,
    };
    this.dbService.albums = [...this.dbService.albums, newAlbum];
    return newAlbum;
  }

  findAll() {
    return this.dbService.albums;
  }

  findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('album with this id does not exist', httpStatus);
    }
    return album;
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
    this.dbService.albums = this.dbService.albums.map((album) =>
      album.id === id ? updatedAlbum : album,
    );
    return updatedAlbum;
  }

  remove(id: string) {
    const album = this.findOne(id);
    this.dbService.albums = this.dbService.albums.filter(
      (album) => album.id !== id,
    );
    this.dbService.tracks = this.dbService.tracks.map((track) =>
      track.albumId === id ? { ...track, albumId: null } : track,
    );
    this.dbService.favorites.albums = this.dbService.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return album;
  }
}
