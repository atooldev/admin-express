import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class UserEnity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean
}
export default UserEnity