import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('societies')   // ⭐ THIS FIXES EVERYTHING
export class Society {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  adminName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  plan: string;
}