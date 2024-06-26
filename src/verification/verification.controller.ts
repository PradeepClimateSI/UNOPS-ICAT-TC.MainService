import { Body, Controller, Get, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { VerificationDetail } from './entity/verification-detail.entity';
import { VerificationService } from './verification.service';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';

@Crud({
  model: {
    type: VerificationDetail,
  },
})
@Controller('verification')
export class VerificationController
  implements CrudController<ParameterRequest>
{
  constructor(public service: VerificationService,
    private readonly tokenDetails:TokenDetails,
    ) {}


  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.SECTOR_ADMIN]))
  @Get('verification/GetVRParameters/:page/:limit/:statusId/:filterText')
  async GetVRParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {

    let countryIdFromTocken:number ;
    [countryIdFromTocken] =    this.tokenDetails.getDetails([TokenReqestType.countryId])
   
    return await this.service.GetVRParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.VERIFIER]))
  @Get('verification/GetVerifierParameters/:page/:limit/:statusId/:filterText')
  async GetVerifierParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {

    let countryIdFromTocken:number ;
    let userNameFromTocken:number ;
    [countryIdFromTocken, userNameFromTocken] =    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.username ])
    
    return await this.service.GetVerifierParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken,
      userNameFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.SECTOR_ADMIN, LoginRole.VERIFIER]))
  @Get('getVerificationDetails/:assessmentId')
  async getVerificationDetails(
    @Param('assessmentId') assessmentId: number,
  ): Promise<VerificationDetail[]> {
    return await this.service.getVerificationDetails(assessmentId);
  }

  @Put('saveVerificationDetails')
  @ApiBody({ type: [VerificationDetail] })
  async saveVerificationDetails(
    @Body() verificationDetail: VerificationDetail[],
  ): Promise<boolean> {
    verificationDetail.map((a) =>
      a.parameter?.id === undefined ? (a.parameter = null) : 1 + 1,
    );
    await this.service.saveVerificationDetail(verificationDetail);
    return true;
  }
}
