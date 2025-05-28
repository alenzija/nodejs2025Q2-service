import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Favorites } from './entities/favorite.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';

const favorites: Favorites = {
  albums: [],
  artists: [],
  tracks: [],
};

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  findAll() {
    return {
      albums: favorites.albums.map((albumId) =>
        this.albumsService.findOne(albumId),
      ),
      artists: favorites.artists.map((artistId) =>
        this.artistsService.findOne(artistId),
      ),
      tracks: favorites.tracks.map((trackId) =>
        this.tracksService.findOne(trackId),
      ),
    };
  }

  addTrack(id: string) {
    const track = this.tracksService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    favorites.tracks = [...favorites.tracks, track.id];

    return track;
  }

  deleteTrack(id: string) {
    if (!favorites.tracks.find((trackId) => trackId === id)) {
      throw new HttpException(
        'this track is not favorite',
        HttpStatus.NOT_FOUND,
      );
    }

    favorites.tracks = favorites.tracks.filter((trackId) => trackId !== id);
  }

  addAlbum(id: string) {
    const album = this.albumsService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    favorites.albums = [...favorites.albums, album.id];

    return album;
  }

  deleteAlbum(id: string) {
    if (!favorites.albums.find((albumId) => albumId === id)) {
      throw new HttpException(
        'this album is not favorite',
        HttpStatus.NOT_FOUND,
      );
    }

    favorites.albums = favorites.albums.filter((albumId) => albumId !== id);
  }

  addArtist(id: string) {
    const artist = this.artistsService.findOne(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    favorites.artists = [...favorites.artists, artist.id];

    return artist;
  }

  deleteArtist(id: string) {
    if (!favorites.artists.find((artistId) => artistId === id)) {
      throw new HttpException(
        'this artist is not favorite',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    favorites.artists = favorites.artists.filter((artistId) => artistId !== id);
  }
}
