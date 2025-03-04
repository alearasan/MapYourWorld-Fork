import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('point_of_interest')
export class PointOfInterest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('json')
  location!: {
    latitude: number;
    longitude: number;
  };

  @Column()
  type!: string;

  @Column()
  category!: string;

  @Column('simple-array')
  tags!: string[];

  @Column('simple-array')
  images!: string[];

  @Column()
  createdBy!: string;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;

  @Column('int')
  visitCount!: number;

  @Column('float')
  rating!: number;

  @Column()
  isActive!: boolean;

  @Column()
  districtId!: string;
}