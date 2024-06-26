import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InstitutionCategory } from '../entity/institution.category.entity';

@Injectable()
export class InstitutionCategoryService extends TypeOrmCrudService<InstitutionCategory>{
    constructor(@InjectRepository(InstitutionCategory) repo){
        super(repo);
    }


    async getInstitution() {

          return this.repo.find();
        
      }
}
