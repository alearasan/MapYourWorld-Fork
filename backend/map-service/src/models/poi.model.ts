import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Geometry } from 'geojson';
import { District } from './district.model';
import { User } from '../../../auth-service/src/models/user.model';

export enum Category {
  MONUMENTOS = 'MONUMENTOS',
  ESTACIONES = 'ESTACIONES',
  MERCADOS = 'MERCADOS',
  PLAZAS = 'PLAZAS'
}

@Entity('point_of_interest')
export class PointOfInterest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: false })
  location!: Geometry;

  @Column({ type: 'enum', enum: Category })
  category!: Category;

  @Column()
  images!: string;

  @Column()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => District, (district) => district.id)
  @JoinColumn({ name: 'districtId' })
  district!: District;
}