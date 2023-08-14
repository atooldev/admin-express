import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class UserProfile extends BaseEntity {

  @Column()
  fullName: string;

  @OneToOne(() => User, user => user.profile)
  user: User;
}