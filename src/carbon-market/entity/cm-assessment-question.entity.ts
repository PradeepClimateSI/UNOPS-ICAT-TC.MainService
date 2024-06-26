import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMQuestion } from './cm-question.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { CMAssessmentAnswer } from './cm-assessment-answer.entity';
import { PortfolioSdg } from 'src/investor-tool/entities/portfolio-sdg.entity';


@Entity()
export class CMAssessmentQuestion extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, type: 'varchar', length: 1000})
  comment: string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  assessment: Assessment

  @Column({ nullable: true })
  enterDataAssumption: string;

  @Column({nullable: true})
  sdgIndicator: string

  @Column({nullable: true})
  startingSituation: string

  @Column({nullable: true})
  expectedImpact: string

  @Column({nullable: true})
  uploadedDocumentPath: string

  @Column({nullable: true})
  relevance: number

  @Column({nullable: true})
  adaptationCoBenifit: string

  @ManyToOne((type) => Characteristics, {nullable: true})
  @JoinColumn()
  characteristic: Characteristics
  

  @ManyToOne((type) => PortfolioSdg, { nullable: true })
  @JoinColumn()
  selectedSdg: PortfolioSdg

  @ManyToOne((type) => CMQuestion, { nullable: true })
  @JoinColumn()
  question: CMQuestion

  @ManyToMany((type) => CMAssessmentAnswer, (assessmentAnswer)=> assessmentAnswer.assessment_question)
  assessmentAnswers: CMAssessmentAnswer[]

}
