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
    return {
      ...newAlbum,
      artistId: newAlbum.artist ? newAlbum.artist.id : null,
      artist: undefined,
    };
  }

  async findAll() {
    const albums = await this.albums.find();
    return albums.map((album) => ({
      ...album,
      artistId: album.artist ? album.artist.id : null,
      artist: undefined,
    }));
  }

  async findOne(id: string, httpStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'Album id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.albums.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) {
      throw new HttpException('Album was not found', httpStatus);
    }
    return {
      ...album,
      artistId: album.artist ? album.artist.id : null,
      artist: undefined,
    };
  }

  async update(id: string, updateAlbumDto: AlbumDto) {
    if (!isAlbumDto(updateAlbumDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.findOne(id);
    const artist = updateAlbumDto.artistId
      ? await this.artistsService.findOne(
          updateAlbumDto.artistId,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      : null;
    const updatedAlbum = {
      id,
      artist,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
    };
    await this.albums.save(updatedAlbum);
    return {
      ...updatedAlbum,
      artistId: updatedAlbum.artist && updatedAlbum.artist.id,
      artist: undefined,
    };
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    await this.albums.delete({ id });
    return album;
  }
}
