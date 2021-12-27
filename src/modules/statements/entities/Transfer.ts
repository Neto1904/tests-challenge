import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
  } from 'typeorm';
  import { v4 as uuid } from 'uuid';
  
  @Entity('transfers')
  export class Transfer {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
  
    @Column('uuid')
    sender_id: string;

    @Column('uuid')
    receiver_id: string;
  
    @Column()
    description: string;
  
    @Column('decimal', { precision: 5, scale: 2 })
    amount: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @CreateDateColumn()
    updated_at: Date;
  
    constructor() {
      if (!this.id) {
        this.id = uuid();
      }
    }
  }
  