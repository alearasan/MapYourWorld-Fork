import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../../../auth-service/src/models/user.model';

@Entity('maps')
export class Map {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'date', nullable: false })
    createdAt!: Date;

    @Column({ type: 'boolean', default: false })
    is_colaborative!: Boolean;
    

    @ManyToMany(() => User, (user) => user.maps_joined)
    users_joined!: User[];

    @ManyToOne(() => User, (user) => user.id)
    user_created!: User; 

}
