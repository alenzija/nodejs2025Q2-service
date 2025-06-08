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
    return await this.tracks.find();
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
    return track;
  }

  async update(id: string, updateTrackDto: TrackDto) {
    if (!isTrackDto(updateTrackDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.findOne(id);
    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };
    await this.tracks.save(updatedTrack);
    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    await this.tracks.delete({ id });
    return track;
  }
}
