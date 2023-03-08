import { Controller, Get } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserType } from 'src/users/user.type.entity';
import { UserTypeService } from './user-type.service';
import { Request, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Crud({
  model: {
    type: UserType,
  },
  
})
@Controller('usertype')
export class UserTypeController implements CrudController<UserType> {
  constructor(
    public service: UserTypeService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  get base(): CrudController<UserType> {
    return this;
  }

  @Get('usertype/GetUserTypes')
  async GetUserTypes(@Request() request): Promise<any> {
    return await this.service.GetUserTypes();
  }

  
}
