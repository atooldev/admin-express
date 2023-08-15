import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, user => user.roles)
  @JoinTable()
  users: User[];
}
