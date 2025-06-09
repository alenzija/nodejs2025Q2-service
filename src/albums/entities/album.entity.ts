import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  year: number;

  @ManyToOne(() => Artist, {
    cascade: ['update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  artist: Artist; // refers to Artist

  @OneToMany(() => Track, (track) => track.album)
  track: Track;
}
