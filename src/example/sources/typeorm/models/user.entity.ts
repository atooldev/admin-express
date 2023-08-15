import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { Role } from './role.entity';
import { UserProfile } from './profile.entity';
import { Col } from 'sequelize/types/utils';


export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

@Entity()
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column()
    email: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @ManyToMany(() => Role, role => role.users)
    roles: Role[];


    @OneToOne(() => UserProfile, profile => profile.user)
    @JoinColumn()
    profile: UserProfile;


    @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
    gender: Gender;


}
