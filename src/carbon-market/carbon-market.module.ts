import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentCMDetail } from "./entity/assessment-cm-detail.entity";
import { AssessmentCMDetailService } from "./service/assessment-cm-detail.service";
import { CMQuestion } from "./entity/cm-question.entity";
import { CMAnswer } from "./entity/cm-answer.entity";
import { Section } from "./entity/section.entity";
import { Criteria } from "./entity/criteria.entity";
import { CMAssessmentQuestion } from "./entity/cm-assessment-question.entity";
import { CMAssessmentAnswer } from "./entity/cm-assessment-answer.entity";
import { AssessmentCMDetailController } from "./controller/assessment-cm-detail.controller";
import { CMQuestionService } from "./service/cm-question.service";
import { CMQuestionController } from "./controller/cm-question.controller";
import { CMAssessmentQuestionController } from "./controller/cm-assessment-question.controller";
import { CMAssessmentQuestionService } from "./service/cm-assessment-question.service";
import { CMAssessmentAnswerController } from "./controller/cm-assessment-answer.controller";
import { CMAssessmentAnswerService } from "./service/cm-assessment-answer.service";
import { CMSeedController } from "./controller/cm-seed.controller";
import { CMSeedService } from "./service/cm-seed.service";
import { Results } from "src/methodology-assessment/entities/results.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { ParameterRequest } from "src/data-request/entity/data-request.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { UsersService } from "src/users/users.service";
import { Audit } from "src/audit/entity/audit.entity";
import { Country } from "src/country/entity/country.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { User } from "src/users/entity/user.entity";
import { UserType } from "src/users/entity/user.type.entity";
import { EmailNotificationService } from "src/notifications/email.notification.service";
import { TokenDetails } from "src/utills/token_details";
import { MasterDataService } from "src/shared/entities/master-data.service";
import { SdgAssessment } from "src/investor-tool/entities/sdg-assessment.entity";
import { StorageService } from "src/storage/storage.service";
import { AuditDetailService } from "src/utills/audit_detail.service";
import { HttpModule } from "@nestjs/axios";
import { CMDefaultValue } from "./entity/cm-default-value.entity";
import { MethodologyAssessmentService } from "src/methodology-assessment/methodology-assessment.service";
import { MethodologyAssessmentModule } from "src/methodology-assessment/methodology-assessment.module";
import { GeographicalAreasCovered } from "src/investor-tool/entities/geographical-areas-covered.entity";
import { InvestorSector } from "src/investor-tool/entities/investor-sector.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentCMDetail,
      CMQuestion,
      CMAnswer,
      Section,
      Criteria,
      CMAssessmentQuestion,
      CMAssessmentAnswer,
      Results,
      Assessment,
      ParameterRequest,
      Characteristics,
      Category,
      User, UserType, Institution, Country,Audit,
      SdgAssessment,
      CMDefaultValue,
      GeographicalAreasCovered,
      InvestorSector
    ]),
    HttpModule,
    MethodologyAssessmentModule
  ],
  controllers: [
    AssessmentCMDetailController,
    CMQuestionController,
    CMAssessmentQuestionController,
    CMAssessmentAnswerController,
    CMSeedController,
  ],
  providers: [
    AssessmentCMDetailService,
    CMQuestionService,
    CMAssessmentQuestionService,
    CMAssessmentAnswerService,
    CMSeedService,
    TokenDetails, EmailNotificationService,
    UsersService,
    MasterDataService,StorageService,
    MasterDataService,
    AuditDetailService,
  ],
  exports: [CMAssessmentQuestionService, AssessmentCMDetailService],
})
export class CarbonMarketModule {}
