import { Module } from '@nestjs/common';
import { MethodologyAssessmentService } from './methodology-assessment.service';
import { MethodologyAssessmentController } from './methodology-assessment.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristics } from './entities/characteristics.entity';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import { Methodology } from './entities/methodology.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Barriers } from './entities/barriers.entity';
import { AssessmentBarriers } from './entities/assessmentbarriers.entity';
import { BarriersCategory } from './entities/barrierscategory.entity';
import { ParameterStatus } from './entities/parameterStatus.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { Indicators } from './entities/indicators.entity';
import { AssessmentCharacteristics } from './entities/assessmentcharacteristics.entity';
import { MethodologyIndicators } from './entities/methodologyindicators.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { InstitutionService } from 'src/institution/service/institution.service';
import { TokenDetails } from 'src/utills/token_details';
import { Results } from './entities/results.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { BarriersCharacteristics } from './entities/barriercharacteristics.entity';
import { MethodologyParameters } from './entities/methodologyParameters.entity';
import { CalcParameters } from './entities/calcParameters.entity';


@Module({
  controllers: [MethodologyAssessmentController],
  providers: [
    MethodologyAssessmentService,
    ProjectService,
    PolicyBarriers,
    TokenDetails
  ],
  imports: [TypeOrmModule.forFeature([
    Methodology,
    Category,
    Characteristics,
    MethodologyAssessmentParameters,
    AssessmentBarriers,
    Assessment,
    ClimateAction,
    Barriers,
    BarriersCategory,
    ParameterStatus,
    PolicyBarriers,
    Indicators,
    AssessmentCharacteristics,
    MethodologyIndicators,
    Results,
    Institution,
    ParameterRequest,
    BarriersCharacteristics,
    MethodologyParameters,
    CalcParameters,
    
  ])],
  exports: [
    MethodologyAssessmentService,
    ProjectService ,
    
  ]
})
export class MethodologyAssessmentModule { }
