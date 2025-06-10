import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackDto, isTrackDto } from './dto/track.dto';
import { checkUUID } from '../services';
import { Track } from './entities/track.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracks: Repository<Track>,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

  async create(createTrackDto: TrackDto) {
    if (!isTrackDto(createTrackDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack = new Track();
    newTrack.duration = createTrackDto.duration;
    newTrack.name = createTrackDto.name;

    if (createTrackDto.artistId) {
      const artist = await this.artistsService.findOne(
        createTrackDto.artistId,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      newTrack.artist = artist;
    } else {
      newTrack.artist = null;
    }

    if (createTrackDto.albumId) {
      const album = await this.albumsService.findOne(
        createTrackDto.albumId,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      newTrack.album = album;
    } else {
      newTrack.album = null;
    }

    await this.tracks.save(newTrack);
    return {
      ...newTrack,
      artistId: newTrack.artist ? newTrack.artist.id : null,
      albumId: newTrack.album ? newTrack.album.id : null,
      artist: undefined,
      album: undefined,
    };
  }

  async findAll() {
    const tracks = await this.tracks.find({
      relations: ['artist', 'album'],
    });
    return tracks.map((track) => ({
      ...track,
      artistId: track.artist ? track.artist.id : null,
      albumId: track.album ? track.album.id : null,
      artist: undefined,
      album: undefined,
    }));
  }

  async findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'Track id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.tracks.findOneBy({ id });
    if (!track) {
      throw new HttpException('Track was not found', httpStatus);
    }
    return {
      ...track,
      artistId: track.artist ? track.artist.id : null,
      albumId: track.album ? track.album.id : null,
      artist: undefined,
      album: undefined,
    };
  }

  async update(id: string, updateTrackDto: TrackDto) {
    if (!isTrackDto(updateTrackDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.findOne(id);
    const artist = updateTrackDto.artistId
      ? await this.artistsService.findOne(
          updateTrackDto.artistId,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      : null;
    const album = updateTrackDto.albumId
      ? await this.albumsService.findOne(
          updateTrackDto.albumId,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      : null;

    const updatedTrack = {
      id,
      album,
      artist,
      duration: updateTrackDto.duration,
      name: updateTrackDto.name,
    };
    await this.tracks.save(updatedTrack);
    return {
      ...updatedTrack,
      album: undefined,
      artist: undefined,
      albumId: updatedTrack.album && updatedTrack.album.id,
      artistId: updatedTrack.artist && updatedTrack.artist.id,
    };
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    await this.tracks.delete({ id });
    return track;
  }
}
