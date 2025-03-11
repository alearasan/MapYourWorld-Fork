import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../..//auth-service/src/models/user.model';

@Entity('maps')
export class Map {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'date', nullable: false })
    createdAt!: Date;

    @ManyToMany(() => User, (user) => user.maps_joined)
    users_joined!: User[];

}
