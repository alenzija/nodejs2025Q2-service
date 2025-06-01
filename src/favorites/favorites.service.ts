import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { DbService } from '../db/db.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => DbService))
    private dbService: DbService,
  ) {}

  findAll() {
    return {
      albums: this.dbService.favorites.albums.map((albumId) =>
        this.albumsService.findOne(albumId),
      ),
      artists: this.dbService.favorites.artists.map((artistId) =>
        this.artistsService.findOne(artistId),
      ),
      tracks: this.dbService.favorites.tracks.map((trackId) =>
        this.tracksService.findOne(trackId),
      ),
    };
  }

  addTrack(id: string) {
    const track = this.tracksService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    this.dbService.favorites.tracks = [
      ...this.dbService.favorites.tracks,
      track.id,
    ];

    return track;
  }

  deleteTrack(id: string) {
    if (!this.dbService.favorites.tracks.find((trackId) => trackId === id)) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }

    this.dbService.favorites.tracks = this.dbService.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  addAlbum(id: string) {
    const album = this.albumsService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    this.dbService.favorites.albums = [
      ...this.dbService.favorites.albums,
      album.id,
    ];

    return album;
  }

  deleteAlbum(id: string) {
    if (!this.dbService.favorites.albums.find((albumId) => albumId === id)) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }

    this.dbService.favorites.albums = this.dbService.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  addArtist(id: string) {
    const artist = this.artistsService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    this.dbService.favorites.artists = [
      ...this.dbService.favorites.artists,
      artist.id,
    ];

    return artist;
  }

  deleteArtist(id: string) {
    if (!this.dbService.favorites.artists.find((artistId) => artistId === id)) {
      throw new HttpException(
        'Artist was not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.dbService.favorites.artists = this.dbService.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
