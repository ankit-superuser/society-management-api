import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column()
    phone: string;

    @Column({ default: 'active' })
    status: string;

    @Column()
    role_id: number;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @CreateDateColumn()
    created_at: Date;
}