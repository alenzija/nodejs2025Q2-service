import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ArtistDto, isArtistDto } from './dto/artist.dto';
import { checkUUID } from '../services';
import { DbService } from '../db/db.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => DbService))
    private dbService: DbService,
  ) {}
  create(createArtistDto: ArtistDto) {
    if (!isArtistDto(createArtistDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newArtist = {
      id: uuid(),
      ...createArtistDto,
    };
    this.dbService.artists = [...this.dbService.artists, newArtist];
    return newArtist;
  }

  findAll() {
    return this.dbService.artists;
  }

  findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('artist with this id does not exist', httpStatus);
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
    this.dbService.artists = this.dbService.artists.map((artist) =>
      artist.id === id ? updatedArtist : artist,
    );
    return updatedArtist;
  }

  remove(id: string) {
    const artist = this.findOne(id);
    this.dbService.artists = this.dbService.artists.filter(
      (artist) => artist.id !== id,
    );
    this.dbService.tracks = this.dbService.tracks.map((track) =>
      track.artistId === id ? { ...track, artistId: null } : track,
    );
    this.dbService.albums = this.dbService.albums.map((album) =>
      album.artistId === id ? { ...album, artistId: null } : album,
    );
    this.dbService.favorites.artists = this.dbService.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return artist;
  }
}
