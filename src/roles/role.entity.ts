import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from "../users/users.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}