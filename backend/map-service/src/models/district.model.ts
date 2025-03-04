import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Geometry } from 'geojson';

@Entity('districts')
export class District {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'geometry', spatialFeatureType: 'MultiPolygon', srid: 4326, nullable: false })
    boundaries!: Geometry;

    @Column({ type: 'boolean', default: false })
    isUnlocked!: boolean;
}


