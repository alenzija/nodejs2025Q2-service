import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistDto, isArtistDto } from './dto/artist.dto';
import { checkUUID } from '../services';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artists: Repository<Artist>,
  ) {}
  async create(createArtistDto: ArtistDto) {
    if (!isArtistDto(createArtistDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newArtist = new Artist();
    newArtist.name = createArtistDto.name;
    newArtist.grammy = createArtistDto.grammy;

    await this.artists.save(newArtist);
    return newArtist;
  }

  async findAll() {
    return await this.artists.find();
  }

  async findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.artists.findOneBy({ id });
    if (!artist) {
      throw new HttpException('Artist was not found', httpStatus);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: ArtistDto) {
    if (!isArtistDto(updateArtistDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.findOne(id);
    const updatedArtist = {
      ...artist,
      ...updateArtistDto,
    };
    await this.artists.save(updatedArtist);
    return updatedArtist;
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    await this.artists.delete({ id });

    return artist;
  }
}
