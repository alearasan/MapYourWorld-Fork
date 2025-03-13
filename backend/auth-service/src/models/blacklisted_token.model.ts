import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  tokenHash!: string;

  @Column({ type: 'timestamp with time zone' })
  expiresAt!: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}