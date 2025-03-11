import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('regions')
export class Region {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    description!: string;
}