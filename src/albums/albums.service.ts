import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumDto, isAlbumDto } from './dto/album.dto';
import { checkUUID } from '../services';
import { Album } from './entities/album.entity';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albums: Repository<Album>,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
  ) {}

  async create(createAlbumDto: AlbumDto) {
    if (!isAlbumDto(createAlbumDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum = new Album();
    newAlbum.name = createAlbumDto.name;
    newAlbum.year = createAlbumDto.year;

    const artist = createAlbumDto.artistId
      ? await this.artistsService.findOne(
          createAlbumDto.artistId,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      : null;

    newAlbum.artist = artist;

    await this.albums.save(newAlbum);
    return newAlbum;
  }

  async findAll() {
    return await this.albums.find();
  }

  async findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'Album id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.albums.findOneBy({ id });
    if (!album) {
      throw new HttpException('Album was not found', httpStatus);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: AlbumDto) {
    if (!isAlbumDto(updateAlbumDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.findOne(id);
    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };
    await this.albums.save(updatedAlbum);
    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    await this.albums.delete({ id });
    return album;
  }
}
