import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class SystemStatus extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    isDeploying: number;


}
