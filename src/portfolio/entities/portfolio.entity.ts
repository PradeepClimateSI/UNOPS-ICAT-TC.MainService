
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entity/user.entity";

@Entity()
export class Portfolio {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    portfolioId : string; 

    @Column({ nullable: true })
    portfolioName : string; 

    @Column({  type:"mediumtext" ,nullable: true })
    description : string; 

    @Column({ nullable: true })
    person : string; 

    @Column({ nullable: true })
    IsPreviousAssessment : string; 

    @Column({  type:"mediumtext" , nullable: true })
    objectives : string; 

    @Column({  type:"mediumtext" , nullable: true })
    audience : string; 

    @Column({  type:"mediumtext" , nullable: true })
    opportunities : string; 

    @Column({ nullable: true })
    principles : string; 

    @ManyToOne((type) => User, { cascade: false, eager: true, })
    user?: User;
    
    @Column({ nullable: true })
    date: string;

    @Column({ type:"mediumtext" , nullable: true })
    link: string;

}
