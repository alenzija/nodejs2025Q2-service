import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Artist, {
    cascade: ['update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  artist: Artist;

  @ManyToOne(() => Album, {
    cascade: ['update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  album: Album;

  @Column({
    type: 'int',
    nullable: false,
  })
  duration: number;
}
