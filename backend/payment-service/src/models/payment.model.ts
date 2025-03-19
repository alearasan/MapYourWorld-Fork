import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
  } from 'typeorm';
  
  // TODO: Importar la entidad Subscription cuando esté implementada
  // import { Subscription } from '../../../subscription-service/src/models/subscription.model';
  
  @Entity('payments')
  export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    // TODO: Relación con Subscription (comentada hasta que la entidad esté lista)
    // @ManyToOne(() => Subscription, (subscription) => subscription.payments)
    // subscription!: Subscription;
    
    @Column({ type: 'uuid' })
    subscription_id!: string;
  
    @Column({ type: 'numeric' })
    amount!: number;
  
    @Column({ type: 'varchar', length: 10 })
    currency!: string;
  
    @Column({ type: 'varchar', length: 50 })
    status!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  