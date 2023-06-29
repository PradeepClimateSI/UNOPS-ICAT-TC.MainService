import { Module } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { InvestorToolController } from './investor-tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ImpactCovered } from './entities/impact-covered.entity';
import { InvestorTool } from './entities/investor-tool.entity';
import { InvestorSector } from './entities/investor-sector.entity';
import { InvestorImpacts } from './entities/investor-impact.entity';
import { InvestorAssessment } from './entities/investor-assessment.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { InvestorQuestions } from './entities/investor-questions.entity';
import { IndicatorDetails } from './entities/indicator-details.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { PortfolioSdg } from './entities/portfolio-sdg.entity';
import { SdgAssessment } from './entities/sdg-assessment.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Assessment,
    ImpactCovered,
    InvestorTool,
    InvestorSector,
    InvestorImpacts,
    InvestorAssessment, 
    Results,
    InvestorQuestions,
    IndicatorDetails,
    Category,
    ParameterRequest,
    InvestorAssessment,
    SdgAssessment,
    PortfolioSdg,
    PolicySector
  ])],
  controllers: [InvestorToolController],
  providers: [InvestorToolService]
})
export class InvestorToolModule {}
