import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TrackDto, isTrackDto } from './dto/track.dto';
import { checkUUID } from '../services';
import { DbService } from '../db/db.service';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => DbService))
    private dbService: DbService,
  ) {}
  create(createTrackDto: TrackDto) {
    if (!isTrackDto(createTrackDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack = {
      id: uuid(),
      ...createTrackDto,
    };
    this.dbService.tracks = [...this.dbService.tracks, newTrack];
    return newTrack;
  }

  findAll() {
    return this.dbService.tracks;
  }

  findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'Track id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track was not found', httpStatus);
    }
    return track;
  }

  update(id: string, updateTrackDto: TrackDto) {
    if (!isTrackDto(updateTrackDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = this.findOne(id);
    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };
    this.dbService.tracks = this.dbService.tracks.map((track) =>
      track.id === id ? updatedTrack : track,
    );
    return updatedTrack;
  }

  remove(id: string) {
    const track = this.findOne(id);
    this.dbService.tracks = this.dbService.tracks.filter(
      (track) => track.id !== id,
    );
    this.dbService.favorites.tracks = this.dbService.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return track;
  }
}
