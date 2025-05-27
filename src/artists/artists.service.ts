import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ArtistDto, isArtistDto } from './dto/artist.dto';
import { Artist } from './entities/artist.entity';
import { checkUUID } from 'src/services';

let artists: Artist[] = [];

@Injectable()
export class ArtistsService {
  create(createArtistDto: ArtistDto) {
    if (!isArtistDto(createArtistDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newArtist = {
      id: uuid(),
      ...createArtistDto,
    };
    artists = [...artists, newArtist];
    return newArtist;
  }

  findAll() {
    return artists;
  }

  findOne(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        'artist with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  update(id: string, updateArtistDto: ArtistDto) {
    if (!isArtistDto(updateArtistDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const artist = this.findOne(id);
    const updatedArtist = {
      ...artist,
      ...updateArtistDto,
    };
    artists = artists.map((artist) =>
      artist.id === id ? updatedArtist : artist,
    );
    return updatedArtist;
  }

  remove(id: string) {
    const artist = this.findOne(id);
    artists = artists.filter((artist) => artist.id !== id);
    return artist;
  }
}
