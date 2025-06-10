import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToMany(() => Artist, {
    cascade: ['remove'],
  })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Track, { cascade: ['remove'] })
  @JoinTable()
  tracks: Track[];

  @ManyToMany(() => Album, { cascade: ['remove'] })
  @JoinTable()
  albums: Album[];
}
