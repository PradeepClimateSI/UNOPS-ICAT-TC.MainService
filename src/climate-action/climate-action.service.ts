import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ClimateAction } from './entity/climate-action.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { PolicyBarriers } from './entity/policy-barriers.entity';
import { Repository } from 'typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { PolicySector } from './entity/policy-sectors.entity';

@Injectable()
export class ProjectService extends TypeOrmCrudService<ClimateAction> {
 
  constructor(
    @InjectRepository(ClimateAction) repo,
    @InjectRepository(PolicyBarriers) public PolicyBarriersRepo: Repository<PolicyBarriers>,
    @InjectRepository(PolicySector) private readonly PolicySectorsRepo: Repository<PolicySector>,
) {
    super(repo);
  }
  async create(req:ClimateAction):Promise<ClimateAction>{
    console.log( "req",req)
    return await this.repo.save(req)
     
  }

  async getProjectDetails(  
    options: IPaginationOptions,
    filterText: string,
    sectorId: number,
    statusId: number,
    mitigationActionTypeId: number,
    editedOn: string,
  ): Promise<Pagination<ClimateAction>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(dr.policyName LIKE :filterText OR dr.contactPersoFullName LIKE :filterText OR sec.name LIKE :filterText OR mit.name LIKE :filterText OR pst.name LIKE :filterText OR dr.editedOn LIKE :filterText)';
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    if (statusId != 0) {
      console.log(filter,"----------")
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :statusId`;
      } else {
        filter = `dr.projectStatusId = :statusId`;
      }
      console.log(filter,"----------")
    }

    if (mitigationActionTypeId != 0) {
      if (filter) {
        filter = `${filter}  and dr.mitigationActionTypeId = :mitigationActionTypeId`;
      } else {
        filter = `dr.mitigationActionTypeId = :mitigationActionTypeId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        mitigationActionTypeId,
        sectorId,
        statusId,
        editedOn,
      })
      .orderBy('dr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);
    

    if (resualt) {
      return resualt;
    }
  }
async save(req:PolicyBarriers[]){
  for(let re of req){
    console.log("barrier", re)
    await this.PolicyBarriersRepo.save(re);
  }
  return req;
}

async savepolicySectors(req:PolicySector[]){
  for(let re of req){
    console.log("sector", re)
    await this.PolicySectorsRepo.save(re);
  }
  return req;
}



async allProject(
  options: IPaginationOptions,
  filterText: number){
    console.log("22222222222222222")

    const policies = await this.repo.createQueryBuilder('climateAction')
      .select(['climateAction.id', 'climateAction.policyName'])
      .where('projectApprovalStatusId=' + filterText)
      .getMany();
  console.log("22222222222222222",policies)
   return policies
}



  async findAllPolicies(): Promise<ClimateAction[]> {
      return this.repo.find({
        relations: [],
      });
  }

  async getIntervention(id:number):Promise<ClimateAction> {
    const policy = await this.repo
          .createQueryBuilder("intervetion")
          .where("intervetion.id = :id", { id: id })
          .getOne()

    return policy;
  }
  

  async getAllCAList(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
   
    countryId: number,
    sectorId: number,
  ): Promise<Pagination<ClimateAction>> {

    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText OR pas.description LIKE :filterText  OR dr.typeofAction LIKE :filterText OR pst.name LIKE :filterText OR dr.projectStatus LIKE :filterText  OR dr.contactPersonDesignation LIKE :filterText OR dr.email LIKE :filterText )';
    }
   // console.log("hello");
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

   

    // if isactive = 0 ---> all climate actions
    // if isactive = 1 ---> active climate actions
    // if active = 2 ---> 

   
       
      // if (filter) {
      //   filter = `${filter}  and pas.id !=4 `; // no proposed CA s all climate
      // } else {
      //   filter = `pas.id !=4`;
      // }
    
    

    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
        

      )
      
      
    /* 
      .leftJoinAndMapMany(
        'asse.parameter',
        Parameter,
        'para',
        'para.assessmentId = asse.id',
      )
     */

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        countryId,
        sectorId,
        isDelete: true,
      })
      .orderBy('dr.createdOn', 'ASC');
    console.log(
      '=====================================================================',
    );
    //console.log(data.getQuery());

    let result = await paginate(data, options);
    console.log(result);
    if (result) {
      return result;
    }
  }





  async getAllProjectDetails(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    Active: number,
    countryId: number,
    sectorId: number,
    
  ): Promise<Pagination<ClimateAction>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    if (projectStatusId !=0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (assessmentStatusName != null && assessmentStatusName != undefined && assessmentStatusName != '') {
      if (filter) {
        filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
      } else {
        filter = `asse.assessmentStage = :assessmentStatusName`;
      }
    }  


// if active = 0 ---> whole climateactions list
// if active = 1 ---> all climate actions
// if active = 2 ---> active climate actions

    if (Active == 1) {
    // console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id != 1 `; // no proposed CA s all climate
      } else {
        filter = `pas.id != 1`;
      }
    } 
    else if (Active == 2) {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id = 3 `; // only active CA s
      } else {
        filter = `pas.id = 3 `;
      }
     
    } 

    
     

    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }


    

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapMany(
        'dr.assessement',
        'asse',
        'asse.projectId = dr.id',
      )

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        Active,
        countryId,
        sectorId,
      })
      .orderBy('dr.createdOn', 'DESC'); 
    // console.log(
    //   '=====================================================================',
   // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async findPolicySectorData(policyID: number){
    return this.PolicySectorsRepo.find({
      relations: ['sector'],
      where: { intervention: { id: policyID } },
    });
  }
  
  async findPolicyBarrierData(policyID: number){
    return this.PolicyBarriersRepo.find({
      relations: ['barriers','characteristics'],
      where: { climateAction: { id: policyID } },
    });
  }
  


}
