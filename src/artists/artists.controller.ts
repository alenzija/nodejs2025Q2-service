import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createArtistDto: ArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.artistsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: ArtistDto) {
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.artistsService.remove(id);
  }
}
