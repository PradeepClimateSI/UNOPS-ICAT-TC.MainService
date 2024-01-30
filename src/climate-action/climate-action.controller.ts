import { Body, Controller, Get, InternalServerErrorException, Param, Patch, Post, Query, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Repository } from 'typeorm-next';

import { ClimateAction } from './entity/climate-action.entity';
import { ProjectService } from './climate-action.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, fileLocation } from './entity/file-upload.utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { AllBarriersSelected, AllPolicySectors } from './dto/selected-barriers.dto';
import { AuditDetailService } from 'src/utills/audit_detail.service';
const fs = require('fs');
var multer = require('multer');

@Crud({
  model: {
    type: ClimateAction,
  },
  query: {
    join: {
      projectStatus: {
        eager: true,
      },
      subSector: {
        eager: true,
      },
      aggregatedAction: {
        eager: true,
      },
      actionArea: {
        eager: true,
      },
      projectOwner: {
        eager: true,
      },
      financingScheme: {
        eager: true,
      },
      assessments: {
        eager: true,
      },
      country: {
        eager: true,
      },
      mitigationActionType: {
        eager: true,
      },
      projectApprovalStatus: {
        eager: true,
      },
      policySector: {
        eager: true,
      },

    },
    exclude: ['id']
  },
})
@Controller('climateAction')
export class ProjectController implements CrudController<ClimateAction> {
  constructor(
    public service: ProjectService,
    public mailService: EmailNotificationService,
    @InjectRepository(ClimateAction)
    private readonly projectRepository: Repository<ClimateAction>,
    private readonly tokenDetails: TokenDetails,
    private auditDetailService: AuditDetailService
  ) { }

  filename: any = [];
  originalname: any = [];

  fname: any = [];
  oname: any = [];

  get base(): CrudController<ClimateAction> {
    return this;
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.MRV_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.TECNICAL_TEAM, LoginRole.INSTITUTION_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.EXTERNAL_USER]))
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ClimateAction,
  ): Promise<ClimateAction> {
    let details = await this.auditDetailService.getAuditDetails()
    let obj = {
      description: "Propose Intervention"
    }
    let body = { ...details, ...obj }
    try {
      let ca = await this.base.createOneBase(req, dto);
      body = { ...body, ...{ actionStatus: "Intervention proposed successfully", } }
      this.auditDetailService.log(body)
      return ca;
    } catch (error) {
      body = { ...body, ...{ actionStatus: "Failed to propose intervention", } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException(error)
    }

  }

  @Post('createNewCA')
  async createNewCA(@Body() req: ClimateAction): Promise<ClimateAction> {
    return await this.service.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findAllPolicies')
  async findAllPolicies() {
    const policies = await this.service.findAllPolicies();
    return policies;
  }

  @UseGuards(JwtAuthGuard)
  @Get('findAllPoliciesForReport')
  async findAllPoliciesForReport() {
    const policies = await this.service.findAllPoliciesForReport();
    return policies;
  }
  @Get('getIntervention')
  async getIntervention(@Query('id') id: number): Promise<ClimateAction> {
    let intervention = await this.service.getIntervention(id);
    return intervention;
  }


  @UseGuards(JwtAuthGuard)
  @Get('typeofAction')
  async findTypeofAction(): Promise<any[]> {
    let res = await this.service.findTypeofAction();
    return res;

  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'AllClimateAction/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:countryId/:sectorId',
  )
  async getAllClimateActionList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    return await this.service.getAllCAList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,

      countryId,
      sectorId,
    );
  }

  @Post('uploadFiles')
  @UseInterceptors(
    FilesInterceptor('files',5)
  )
  async uploadFile2(
    @UploadedFiles() files,
    @Req() req: CrudRequest,
    @Request() request,

  ) {
    ;
    for (let e of files) {
      this.filename = e.filename;
      this.originalname = e.originalname;

      this.fname.push(this.filename);
      this.oname.push(this.originalname);
    };
    ;

  }



  @Get(
    'project/projectinfo/:page/:limit/:sectorId/:statusId/:mitigationActionTypeId/:editedOn/:filterText',
  )
  async getClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('statusId') statusId: number,
    @Query('mitigationActionTypeId') mitigationActionTypeId: number,
    @Query('editedOn') editedOn: string,
    @Query('filterText') filterText: string,

  ): Promise<any> {
    return await this.service.getProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      sectorId,
      statusId,
      mitigationActionTypeId,
      editedOn,
    );
  }
  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN]))
  @Get(
    'AllClimateActions/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:Active/:countryId/:sectorId',
  )
  async getAllClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('assessmentStatusName') assessmentStatusName: string,
    @Query('Active') Active: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;


    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,

    ]);
    return await this.service.getAllProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,
      Active,
      countryIdFromTocken,
      sectorId,
    );
  }
  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN]))
  @Patch('updateOneClimateAction')
  async updateOneClimateAction(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ClimateAction,
  ): Promise<any> {
    let project = await this.projectRepository.findOne({
      where: { id: dto.id },
      relations: ['projectApprovalStatus'],
    });

    let updateData = await this.base.updateOneBase(req, dto);
    const baseurl = process.env.ClientURl;


    if (
      dto.projectApprovalStatus &&
      dto.projectApprovalStatus.id !== project.projectApprovalStatus.id
    ) {
      if (dto.projectApprovalStatus.id === 1) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-approved-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );

        this.mailService.sendMail(
          project.email,
          'Approval Status Approved',
          'Approval Status Approved',
          emailTemplate,
        );
      }
      if (dto.projectApprovalStatus.id === 2) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-rejected-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );
        this.mailService.sendMail(
          project.email,
          'Approval Status Rejected',
          'Approval Status Rejected',
          emailTemplate,
        );
      }
      if (dto.projectApprovalStatus.id === 3) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-datarequest-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );
        this.mailService.sendMail(
          project.email,
          'Data request sent successfully',
          'Data request sent successfully',
          emailTemplate,
        );
      }
    }
  }

  @Post("policybar")
  async policyBar(@Body() req: AllBarriersSelected) {
    return await this.service.save(req);
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN]))
  @Post("policySectors")
  async policySectors(@Body() req: AllPolicySectors) {
    return await this.service.savepolicySectors(req.allSectors);
  }


  @Get('allProjectApprove')
  async allProjectApprove(
    @Request() request,
    @Query('filterText') filterText: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<any> {

    return await this.service.allProject(
      {
        limit: limit,
        page: page,
      },
      filterText,
    )
  }


  @Get('findPolicySectorData/:policyID')
  async findPolicySectorData(@Param('policyID') policyID: number) {
    return await this.service.findPolicySectorData(policyID);
  }

  @Get('findPolicyBarrierData/:policyID')
  async findPolicyBarrierData(@Param('policyID') policyID: number) {
    return await this.service.findPolicyBarrierData(policyID);
  }

  @Get('getLastID')
  async getLastID() {
    return await this.service.getLastID();
  }

}

