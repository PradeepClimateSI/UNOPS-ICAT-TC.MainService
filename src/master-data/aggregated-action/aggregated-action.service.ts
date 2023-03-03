import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ClimateAction } from 'src/climate-action/entity//climate-action.entity';
import { AggregatedAction } from './entity/aggregated-action.entity';
import { ActionArea } from '../action-area/entity/action-area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NdcService extends TypeOrmCrudService<AggregatedAction> {
 
  constructor(
    @InjectRepository(AggregatedAction) repo,
    @InjectRepository(ActionArea)
    public actionAreaRepo: Repository<ActionArea>
    ) {
    super(repo);
  }


  async ndcSectorDetails(
    options: IPaginationOptions,
    sectorIds: string[],
    countryIdFromTocken: number,
       sectorIdFromTocken: number
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `dr.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorIds && sectorIds.length>0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and dr.sectorId  IN  (:...sectorIds) `;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `dr.sectorId IN  (:...sectorIds) `;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('dr')
   
    .where(filter, {
      sectorIds,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('dr.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    console.log(resualt)
    if (resualt) {
      return resualt;
    }
  }

  async ndcSectorDetailsDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
       sectorIdFromTocken: number
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `dr.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorId!=0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and dr.sectorId = :sectorId`;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `dr.sectorId = :sectorId`;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('dr')
    .leftJoinAndMapMany(
      'dr.subNdc',
      ActionArea,
      'sub',
      'sub.ndcId = dr.id',
    )
    .innerJoinAndMapMany(
      'dr.project',
      ClimateAction,
      'pro',
      'pro.ndcId = dr.id',
    )
    .where(filter, {
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('dr.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    console.log(resualt)
    if (resualt) {
      return resualt;
    }
  }


  async getNdcForDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
       sectorIdFromTocken: number,
       moduleLevelsFromTocken:number[]
  ): Promise<Pagination<any>>{
    let filter: string = '';

    if(moduleLevelsFromTocken[3]==1 ||moduleLevelsFromTocken[4]==1){
      if (filter) {
        filter = `${filter}   and asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    }else if(moduleLevelsFromTocken[1]==1 || moduleLevelsFromTocken[2]==1){
      if (filter) {
        filter = `${filter}  and  asse.isProposal= true and proj.projectApprovalStatusId in (1,4) `;
      } else {
        filter = `asse.isProposal= true and proj.projectApprovalStatusId in (1,4) `;
      }

    }else{
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    }


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.countryId = :countryIdFromTocken`;
      } else {
        filter = `proj.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and proj.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `proj.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorId && sectorId!=0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and proj.sectorId = :sectorId`;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `proj.sectorId = :sectorId`;
    }
  }


}

    let data = this.repo
    .createQueryBuilder('ndc')
    .select([ 
      'ndc.id',
      'ndc.name'  ,
      'asse.id as asseId' ,
      'asseRslt.id as asseRsltId ',
      'asseRslt.totalEmission ',
      'proj.projectApprovalStatusId'
      ])
    // .innerJoinAndMapMany(
    //   'ndc.assesment',
    //   Assessment,
    //   'asse',
    //   'asse.ndcId = ndc.id and asse.assessmentType = "Ex-post"',
    // )
    .innerJoinAndMapOne(
      'asse.project',
      ClimateAction,
      'proj',
      'asse.projectId = proj.id ',
    )
    // .innerJoinAndMapMany(
    //   'asse.assessmentResult',
    //   AssessmentResault,
    //   'asseRslt',
    //   'asseRslt.assementId = asse.id ',
    // )
    .where(filter, {
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken
    })
    .orderBy('ndc.createdOn', 'ASC'); 


    let resualt = await paginate(data, options);
    // let resualt = await data.getMany();


    if (resualt) {
      return resualt;
    }
  }

  
 async getSubNdc(ndcID: number) {
  let result = await this.actionAreaRepo.find({ where: { id: ndcID } });
  console.log("#####actionArea######",result)

  

  // console.log('resualt', resualt);
  return result;



}
}
