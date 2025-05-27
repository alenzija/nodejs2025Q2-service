import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Track } from './entities/track.entity';
import { TrackDto, isTrackDto } from './dto/track.dto';
import { checkUUID } from 'src/services';

let tracks: Track[] = [];

@Injectable()
export class TracksService {
  create(createTrackDto: TrackDto) {
    if (!isTrackDto(createTrackDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newTrack = {
      id: uuid(),
      ...createTrackDto,
    };
    tracks = [...tracks, newTrack];
    return newTrack;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('track does not exist', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  update(id: string, updateTrackDto: TrackDto) {
    if (!isTrackDto(updateTrackDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const track = this.findOne(id);
    const updatedTrack = {
      ...track,
      name: 'name' in updateTrackDto ? updateTrackDto.name : track.name,
      artistId:
        'artistId' in updateTrackDto ? updateTrackDto.artistId : track.artistId,
      albumId:
        'albumId' in updateTrackDto ? updateTrackDto.albumId : track.albumId,
      duration:
        'duration' in updateTrackDto ? updateTrackDto.duration : track.duration,
    };
    tracks = tracks.map((track) => (track.id === id ? updatedTrack : track));
    return track;
  }

  remove(id: string) {
    const track = this.findOne(id);
    tracks = tracks.filter((track) => track.id !== id);
    return track;
  }
}
