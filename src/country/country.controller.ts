import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Repository } from 'typeorm';
import { CountryService } from './country.service';
import { CountrySector } from './entity/country-sector.entity';
import { Country } from './entity/country.entity';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';

@Crud({
  model: {
    type: Country,
  },
  query: {
    join: {
      countrysector: {
        eager: true,
      },
      sector: {
        eager: true,
      }
    },
  },
})

@Controller('country')
export class CountryController implements CrudController<Country>{

  constructor(
    public service: CountryService,
    @InjectRepository(Country)
    public CountryRepo: Repository<Country>,
    @InjectRepository(CountrySector)
    public CountrySectorRepo: Repository<CountrySector>,
    private readonly auditService: AuditService,


  ) { }

  get base(): CrudController<Country> {
    return this;
  }


  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @UseGuards(JwtAuthGuard)
  @Override()
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Country,
  ) {
    let coun_sec = dto.countrysector;

    let old_countrysector = (await this.CountryRepo.findOne({where:{id:dto.id}})).countrysector;
    let coun = await this.base.updateOneBase(req, dto);
    coun_sec.forEach((a) => { a.country.id = dto.id, this.CountrySectorRepo.save(a) });

   
    return coun;
  }


  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Country,
  ): Promise<Country> {

    dto.isSystemUse = true;

    var x: number = 0;
    dto.countrysector.map((a) => {

      a.country.id = dto.id;
      x++;

    });


    try {
      dto.countrysector.map(async (a) => {
        let lms = await this.CountrySectorRepo.save(await a);
      });
    } catch (error) {
    }

    let coun = await this.base.createOneBase(req, dto);

    let audit: AuditDto = new AuditDto();
    audit.action = coun.name + ' Country Activated';
    audit.comment = "Country Activated";
    audit.actionStatus = 'Activated';
    return coun;
  }

  @Get('country1')
  async getCountry(
    @Query('countryId') countryId: number,
  ): Promise<any> {
    return await this.service.getCountry(countryId);
  }


  @Post('synccountry')
  async syncCountry(
    @Body() dto: any,
  ): Promise<any> {
    this.CountryRepo.save(dto);
  }

  @Get('country-sector')
  async getCountrySector(
    @Query('countryId') countryId: number,
  ): Promise<any> {
    return await this.service.getCountrySector(countryId);
  }

  @Get('find-All')
  async findall():Promise<Country[]>{
    let allCountries= await this.CountryRepo.find();
    let countriesWithoutzero=allCountries.filter(object => {
      return object.id !== 0;});
    return countriesWithoutzero;
  }


}
