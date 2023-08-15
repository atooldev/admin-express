import { CreateDateColumn, Entity, PrimaryGeneratedColumn, BaseEntity as TypeORMBaseEntity, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity extends TypeORMBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}