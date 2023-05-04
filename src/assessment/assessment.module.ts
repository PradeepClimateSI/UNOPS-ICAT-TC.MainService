import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TokenDetails } from 'src/utills/token_details';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Institution } from 'src/institution/entity/institution.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { InvestorTool } from 'src/investor-tool/entities/investor-tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment,User,Institution,UserType,Country,InvestorTool]),UsersModule],
  controllers: [AssessmentController],
  providers: [AssessmentService,TokenDetails,UsersService,EmailNotificationService]
})
export class AssessmentModule {}
