import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AlbumDto, isAlbumDto } from './dto/album.dto';
import { Album } from './entities/album.entity';
import { checkUUID } from 'src/services';

let albums: Album[] = [];

@Injectable()
export class AlbumsService {
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

  findOne(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'album with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
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
    albums = albums.map((album) => (album.id === id ? updatedAlbum : album));
    return updatedAlbum;
  }

  remove(id: string) {
    const album = this.findOne(id);
    albums = albums.filter((album) => album.id !== id);
    return album;
  }
}
