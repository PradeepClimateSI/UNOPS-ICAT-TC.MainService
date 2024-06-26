import { Injectable } from '@nestjs/common';
import { CreateComparisonReportDto, CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AssessmentDto } from './dto/assessment.dto';
import {
  ReportDto,
  ReportCoverPage,
  ReportContentOne,
  ReportContentTwo,
  ComparisonReportDto,
  ComparisonReportReportCoverPage,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentTwo,
  ComparisonReportReportContentThree,
  ComparisonReportReportContentFour,
  ReportCarbonMarketDto,
  ReportCarbonMarketDtoContentOne,
  ReportCarbonMarketDtoContentThree,
  ReportCarbonMarketDtoContentTwo,
  ReportCarbonMarketDtoContentFour,
  ReportCarbonMarketDtoContentFive,
  ReportCarbonMarketDtoCoverPage,
  ReportContentThree,
  ComparisonReportReportContentFive,
  ComparisonReportReportContentSix,
} from './dto/report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Report } from './entities/report.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from 'src/country/entity/country.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { UsersService } from 'src/users/users.service';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { ComparisonDto, ComparisonTableDataDto } from 'src/portfolio/dto/comparison.dto';
import { Portfolio, } from 'src/portfolio/entities/portfolio.entity';
import { PortfolioAssessment } from 'src/portfolio/entities/portfolioAssessment.entity';
import { InvestorTool } from 'src/investor-tool/entities/investor-tool.entity';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { CMScoreDto } from 'src/carbon-market/dto/cm-result.dto';
import { User } from 'src/users/entity/user.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';
import { isNull } from 'util';



@Injectable()
export class ReportService extends TypeOrmCrudService<Report> {
  constructor(
    @InjectRepository(Report) repo,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(PortfolioAssessment) private portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(PolicySector) private readonly policySectorsRepo: Repository<PolicySector>,
    private usersService: UsersService,
    public assessmentService: AssessmentService,
    private readonly investorToolService: InvestorToolService,
    private readonly portfolioService: PortfolioService,
    private readonly cmAssessmentQuestionService : CMAssessmentQuestionService
  ) {
    super(repo);
  }
  cmResult:any;
  cmScores :CMScoreDto;
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
  async findReportByID(id: number):Promise<Report> {
    
    
    return await this.repo
    .createQueryBuilder('report')
    .where('report.id = :id', {id})
    .getOne();
  }
  async genarateReportDto(
    createReportDto: CreateReportDto,
  ): Promise<ReportDto> {
    const reportDto = new ReportDto();
    reportDto.reportName = createReportDto.reportName;
    reportDto.coverPage = this.genarateReportDtoCoverPage(
      createReportDto.reportTitle,createReportDto.tool
    );
    reportDto.contentOne = await this.genarateReportDtoContentOne(
      createReportDto.assessmentId,createReportDto.tool
    );
    reportDto.contentTwo = await this.genarateReportDtoContentTwo(
      createReportDto.assessmentId,createReportDto.tool
    );
    reportDto.contentThree = await this.genarateReportDtoContentThree(
      createReportDto.assessmentId,createReportDto.tool
    );
    return reportDto;
  }

  genarateReportDtoCoverPage(title: string,tool:string): ReportCoverPage {
    var moment = require('moment');
    const coverPage = new ReportCoverPage();
    coverPage.tool = tool;
    coverPage.generateReportName = "TRANSFORMATIONAL CHANGE ASSESSMENT REPORT GENERAL INTERVENTIONS TOOL";
    coverPage.reportDate = moment().format("DD/MM/YYYY");
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink =  process.env.MAIN_SERVER_URL + '/report/cover/icatlogo.png';
    return coverPage;

  }

  async saveReport(
    name: string,
    fileName: string,
    UsernnameFromTocken: string,
    climateAction: ClimateAction,
    portfolioid:number,
    tool:string,
    type:string
  ) {
   let res1 = await this.userRepo.findOne({
      where: {
        email: UsernnameFromTocken ,
      },
      relations: ['country'],
    });
    let country = new Country()
    if(res1 .userType.name =="External"){
      country.id=0;
    }
    else if(res1 .userType.name !="External"){
      country.id= res1.country.id;
    }
    let report = new Report();
    report.reportName = name;
    report.generateReportName = fileName;
    report.savedLocation = 'reports/' + fileName;
    report.tool = tool;
    report.type = type;
    if(portfolioid&&portfolioid!=0){
      let portfolio=new Portfolio()
      portfolio.id=portfolioid
      report.portfolio = portfolio;
    }
    report.thumbnail =
      'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg';
    report.country = country;
    if (climateAction.id) {
      report.climateAction = climateAction;
    }
    return await this.repo.save(report);
  }

  async getReports(
    climateAction: string,
    reportName: string,
    countryIdFromTocken: number,
    type: string,
    tool: string
  ) {
    const currentUser = await this.usersService.currentUser();
    let res: Report[] = [];
    if(type){
      if(type=='Result'){
        
        if (!climateAction && !reportName) {
       
          res = await this.repo.find({
            where: {
              type:type,
              country: { id: countryIdFromTocken },
            },
            relations: ['climateAction','country'],
          });
        } else {
          if(tool){
            res = await this.repo.find({
              where: {
                tool:tool,
                climateAction: { policyName: Like(`%${climateAction}%`) },
                reportName: Like(`%${reportName}%`),
                country: { id: countryIdFromTocken },
              }, relations: ['climateAction','country'],
            });
          }else{
            res = await this.repo.find({
              where: {
                climateAction: { policyName: Like(`%${climateAction}%`) },
                reportName: Like(`%${reportName}%`),
                country: { id: countryIdFromTocken },
              }, relations: ['climateAction','country'],
            });
          }
         
        }
    
      }else{
        if (!climateAction && !reportName) {
          res = await this.repo.find({
            where: {
              type:type,
              country: { id: countryIdFromTocken },
            },
            relations: ['portfolio','country'],
          });
        } else {
          res = await this.repo.find({
            where: {
              portfolio: { portfolioName: Like(`%${reportName}%`) },
              reportName: Like(`%${reportName}%`),
              country: { id: countryIdFromTocken },
            },
            relations: ['portfolio','country'],
          });
        }

      }
    }
    else{
      if (!climateAction && !reportName) {
        res = await this.repo.find({
          where: {
            country: { id: countryIdFromTocken },
          },
          relations: ['climateAction','portfolio','country'],
        });
      } else {
        res = await this.repo.find({
          where: {
            climateAction: { policyName: Like(`%${climateAction}%`) },
            reportName: Like(`%${reportName}%`),
            country: { id: countryIdFromTocken },
          },
          relations: ['climateAction','portfolio','country'],
        });
      }
  
    }

    let reportList: Report[] = [];
    const isUserExternal = currentUser?.userType?.name === 'External';
    for await  (const x of await res) {
      let isSameUser:boolean;
      let isMatchingCountry :boolean;
      let isUserInternal :boolean;
      if(x.climateAction !=null || x.climateAction != undefined){
        if(x.climateAction?.user !=null || x.climateAction?.user != undefined){
          isSameUser = x.climateAction?.user?.id === currentUser?.id;
          isMatchingCountry = x.climateAction?.country?.id === currentUser?.country?.id;
         isUserInternal =  x.climateAction?.user?.userType?.name !== 'External';
        }        
      }
      else if(x.portfolio !=null || x.portfolio != undefined){
        if(x.portfolio?.user !=null || x.portfolio?.user != undefined){
          isSameUser = x.portfolio?.user?.id === currentUser?.id;
          isMatchingCountry = x.country?.id === currentUser?.country?.id;
         isUserInternal =  x.portfolio?.user?.userType?.name !== 'External';
        }        
      }
      if ((isUserExternal && isSameUser) ||(!isUserExternal && isMatchingCountry && isUserInternal)) {
        reportList.push(x);
      }
    }
    return reportList;
  }

  async genarateReportDtoContentOne(
    assessmentId: number,
    tool:string
  ): Promise<ReportContentOne> {
    const reportContentOne = new ReportContentOne();
    let investorTool = new InvestorTool();
    let isInvestment:boolean = false;
    let asse = await this.assessmentService.findbyIDforReport(assessmentId);
    if(tool=='Investment tool'){
  
      investorTool = await this.investorToolService.getResultByAssessment(assessmentId)
      isInvestment = true;
    }
   
    reportContentOne.opportunities = asse.opportunities ? asse.opportunities : 'N/A';
    reportContentOne.assessmetType = asse.assessmentType ? asse.assessmentType : 'N/A';
    reportContentOne.principles = asse.principles ? asse.principles : 'N/A';
    reportContentOne.sectorCoverd = asse.investor_sector && asse.investor_sector.length ? asse.investor_sector
      ?.map((a) => a.sector.name)
      .join(',') : 'N/A';
    reportContentOne.geograpycalCover = asse.geographical_areas_covered && asse.geographical_areas_covered.length ? asse.geographical_areas_covered
      ?.map((a) => a.name)
      .join(',') : 'N/A';;
    reportContentOne.policyOrActionsDetails = [
      {
        information: 'Title of the intervention',
        description: asse.climateAction.policyName ? asse.climateAction.policyName : 'N/A',
      },
      {
        information: 'Description of the intervention',
        description: asse.climateAction.description ? asse.climateAction.description : 'N/A',
      },
      {
        information: 'Status',
        description: asse.climateAction.projectStatus
          ? asse.climateAction.projectStatus.name
          : 'N/A'
      },
      {
        information: 'Date of implementation',
        description: asse.climateAction.dateOfImplementation
          ? new Date(
            asse.climateAction.dateOfImplementation,
          ).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Date of completion (if relevant)',
        description: asse.climateAction.dateOfCompletion
          ? new Date(asse.climateAction.dateOfCompletion).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Implementing entity or entities',
        description: asse.climateAction.implementingEntity ? asse.climateAction.implementingEntity : 'N/A',
      },
      {
        information: 'Objectives and intended impacts or benefits of the intervention ',
        description: asse.climateAction.objective ? asse.climateAction.objective : 'N/A',
      },
      {
        information: 'Level of intervention ',
        description: asse.climateAction.levelofImplemenation ? asse.climateAction.levelofImplemenation : 'N/A',
      },
      {
        information: 'Geographic coverage',
        description: asse.climateAction.geographicCoverage
          ? asse.climateAction.geographicCoverage
          : 'N/A',
      },
      {
        information: 'Sectors covered ',
        description: asse.climateAction.policy_sector
          ? asse.climateAction.policy_sector.map((a) => a.sector.name).join(',')
          : 'N/A',
      },
      {
        information: 'Total investment (in USD)',
        isInvestment: isInvestment,
        description: investorTool.total_investment
          ? this.thousandSeperate(investorTool.total_investment, 2)
          : 'N/A',
      },
      {
        information: 'Investment instrument(s) used',
        isInvestment: isInvestment,
        description: investorTool.total_investements
          ? investorTool.total_investements
          : 'N/A',
      },
      {
        information: 'Proportion of total investment',
        isInvestment: isInvestment,
        description: investorTool.total_investements
          ? investorTool.total_investements
          : 'N/A',
      },
      {
        information: 'Related interventions ',
        description: asse.climateAction.related_policies
          ? asse.climateAction.related_policies
          : 'N/A',
      },
      {
        information: 'Reference',
        description: asse.climateAction.reference
          ? asse.climateAction.reference
          : 'N/A',
      },
    ];



    reportContentOne.understanPolicyOrActions = [
      {

        Time_periods: 'Description of the vision for desired societal, environmental and technical changes',

        description: asse.envisioned_change ? asse.envisioned_change : 'N/A',

      },
      {

        Time_periods: 'Long term (≥15 years)',

        description: asse.vision_long ? asse.vision_long : 'N/A',

      },

      {

        Time_periods: 'Medium term (5-15 years)',

        description: asse.vision_medium ? asse.vision_medium : 'N/A',

      },

      {

        Time_periods: 'Short term (&lt; 5 years)',

        description: asse.vision_short ? asse.vision_short : 'N/A',

      },

      {

        Time_periods: 'Phase of transformation',

        description: asse.phase_of_transformation ? asse.phase_of_transformation : 'N/A',

      },

    ];



    reportContentOne.barriers = []

    asse.policy_barrier.map(a => {

      reportContentOne.barriers.push({
        barrier: a.barrier ? a.barrier : 'N/A',

        explanation: a.explanation ? a.explanation : 'N/A',

        characteristics_affected: a.barrierCategory ? a.barrierCategory.map(b => b.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")).join(',') : 'N/A',

        barrier_directly_targeted: a.is_affected ? 'Yes' : 'No',
      })

    })

    reportContentOne.contextOfPolicy = [];

    let catagoryProcess = [];
    let catagoryOutcome = [];
    reportContentOne.outcomecharacteristics = catagoryOutcome;

    reportContentOne.prossescharacteristics = catagoryProcess;



    return reportContentOne;

  }

  getrelavance(number: number): string {

    switch (number) {

      case 0: {

        return 'Not relevant';
        

      }

      case 1: {

        return 'Possibly relevant';

      }

      case 2: {

        return ' Relevant';

      }

    }

  }

  getScore(number: number): string {

    switch (number) {

      case 3: {

        return 'Major';

      }

      case 2: {

        return 'Moderate';

      }

      case 1: {

        return 'Minor';

      }

      case 0: {

        return 'None';

      }

      case -1: {

        return 'Minor Negative';

      }

      case -2: {

        return 'Moderate Negative';

      }

      case -3: {

        return 'Major Negative';

      }
      case 99: {

        return 'Outside assessment boundaries';

      }
      default: {
        return '-';
      }

    }

  }

  getScoreSustained(number: number): string {

    switch (number) {

      case 3: {

        return 'Very likely (90-100%)';

      }

      case 2: {

        return 'Likely (60-90%)';

      }

      case 1: {

        return 'Possible (30-60%)';

      }

      case 0: {

        return 'Unlikely (10-30%)';

      }

      case -1: {

        return 'Very unlikely (0-10%)';

      }
      case 99: {

        return 'Outside assessment boundaries';

      }

    default: {
      return '-';
    }

    }

  }
  getScoreLikelihood(number: number): string {

    switch (number) {

      case 4: {

        return 'Very likely (90-100%)';

      }

      case 3: {

        return 'Likely (60-90%)';

      }

      case 2: {

        return 'Possible (30-60%)';

      }

      case 1: {

        return 'Unlikely (10-30%)';

      }

      case 0: {

        return 'Very unlikely (0-10%)';

      }
    

    default: {
      return '-';
    }

    }

  }

  async genarateReportDtoContentTwo(

    assessmentId: number,
    tool:string

  ): Promise<ReportContentTwo> {

    const reportContentTwo = new ReportContentTwo();
    reportContentTwo.tool = tool;
    let asssIndicatorsProcess =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'process',

        '',

        '',

      );

    let catagoryProcess = [];

    let catagoryProcessExAnteAssessment = [];

    if (asssIndicatorsProcess) {

      reportContentTwo.assessmentType = asssIndicatorsProcess.assessmentType;



      for (let invesass of asssIndicatorsProcess.investor_assessment) {
      
        let cat = catagoryProcess.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics.name

              ? invesass.characteristics.name

              : '-',

            relavance: invesass.relavance!=null&&invesass.relavance!=undefined

              ? this.getrelavance(invesass.relavance)

              : '-',

              question: invesass.characteristics.main_question
            ? invesass.characteristics.main_question
            : '-',

            likelihoodscore: invesass.likelihood!=null&&invesass.likelihood!=undefined ?this.getScoreLikelihood(invesass.likelihood): '-',
            

            rationalejustifying: invesass.likelihood_justification

              ? invesass.likelihood_justification

              : '-',

            Supportingsdocumentssupplied: invesass.uploadedDocumentPath?'Yes':'No',

          });

          cat.rows = cat.characteristics.length;

        } else {

          catagoryProcess.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics.name,

                relavance: invesass.relavance!=null&&invesass.relavance!=undefined

                  ? this.getrelavance(invesass.relavance)

                  : '-',
                  question: invesass.characteristics.main_question
            ? invesass.characteristics.main_question
            : '-',

                likelihoodscore: invesass.likelihood!=null&&invesass.likelihood!=undefined

                  ? this.getScoreLikelihood(invesass.likelihood)

                  : '-',

                rationalejustifying: invesass.likelihood_justification

                  ? invesass.likelihood_justification

                  : '-',

                Supportingsdocumentssupplied: invesass.uploadedDocumentPath?'Yes':'No',

              },

            ],

          });

        }

      }

    }

    let asssCharacteristicasscaleghg =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_GHG',

        '',

      );

    let scale_ghg = [];

    if (asssCharacteristicasscaleghg) {

      for (let invesass of asssCharacteristicasscaleghg.investor_assessment) {



        let cat = scale_ghg.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:

            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes')

               ,

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_ghg.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:

                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

                : 'Yes'),

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.scale_ghg = scale_ghg;

    }



    let asssCharacteristicassustained_ghg =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_GHG',

        '',

      );

    let sustained_ghg = [];

    if (asssCharacteristicassustained_ghg) {

      for (let invesass of asssCharacteristicassustained_ghg.investor_assessment) {

        let cat = sustained_ghg.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),

            score: invesass.score != null && invesass.score != undefined

              ? this.getScoreSustained(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_ghg.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScoreSustained(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.sustained_ghg = sustained_ghg;

    }



    let asssCharacteristicasscale_adaptation =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_ADAPTATION',

        '',

      );

    let scale_adaptation = [];

    if (asssCharacteristicasscale_adaptation) {

      for (let invesass of asssCharacteristicasscale_adaptation.investor_assessment) {

        let cat = scale_adaptation.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),


            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_adaptation.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),


                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.scale_adaptation = scale_adaptation;

    }







    let asssCharacteristicassustained_adaptation =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_ADAPTATION',

        '',

      );

    let sustained_adaptation = [];

    if (asssCharacteristicassustained_adaptation) {

      for (let invesass of asssCharacteristicassustained_adaptation.investor_assessment) {

        let cat = sustained_adaptation.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),

            score: invesass.score != null && invesass.score != undefined

              ? this.getScoreSustained(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_adaptation.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

                : 'Yes'),


                score: invesass.score != null && invesass.score != undefined

                  ? this.getScoreSustained(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.sustained_adaptation = sustained_adaptation;

    }











    let asssCharacteristicasscalesd =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_SD',

        '',

      );



    let scale_sd: { rows: number, name: string, sdg: { rows: number, name: string, impact: string, characteristics: any[] }[] } = { rows: 0, name: '', sdg: [] };





    if (asssCharacteristicasscalesd) {
      scale_sd.name = 'SDG Scale of the Outcome';

      const filterinsass = asssCharacteristicasscalesd.investor_assessment.filter(a => a.portfolioSdg);

      scale_sd.rows = filterinsass.length



      for (let invesass of filterinsass) {





        let cat = scale_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_sd.sdg.push({

            rows: 1,

            name: invesass.portfolioSdg.name,

            impact: invesass.portfolioSdg?.sdg_assessment.answer ? invesass.portfolioSdg.sdg_assessment.answer : 'N/A',

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

                : 'Yes'),


                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],
          }



          )

        }







      }



    }

    reportContentTwo.scale_sd = scale_sd;

    let asssCharacteristicassustainedsd =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_SD',

        '',

      );



    let sustained_sd: { rows: number, name: string, sdg: { rows: number, name: string, impact: string, characteristics: any[] }[] } = { rows: 0, name: '', sdg: [] };



    if (asssCharacteristicassustainedsd) {

      sustained_sd.name = 'SDG Time frame over which the outcome is sustained';



      const filterinsasssustained_sd = asssCharacteristicassustainedsd.investor_assessment.filter(a => a.portfolioSdg);

      sustained_sd.rows = filterinsasssustained_sd.length

      for (let invesass of filterinsasssustained_sd) {





        let cat = sustained_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

            : 'Yes'),

            score: invesass.score != null && invesass.score != undefined

              ? this.getScoreSustained(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_sd.sdg.push({

            rows: 1,

            name: invesass.portfolioSdg.name,

            impact: invesass.portfolioSdg?.sdg_assessment.answer ? invesass.portfolioSdg.sdg_assessment.answer : 'N/A',

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'No'

                : 'Yes'),

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScoreSustained(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],
          }



          )

        }







      }



    }

    reportContentTwo.sustained_sd = sustained_sd;





    let res = await this.investorToolService.calculateNewAssessmentResults(assessmentId);

    reportContentTwo.process_categories_assessment = res.processData;
   
    reportContentTwo.outcomes_categories_assessment = res.outcomeData;
    reportContentTwo.processScore = res.processScore;
    reportContentTwo.outcomeScore = res.outcomeScore;
    




    reportContentTwo.prossesAssesmentStartingSituation1 = catagoryProcess.slice(0,catagoryProcess.length/2);
    reportContentTwo.prossesAssesmentStartingSituation2 = catagoryProcess.slice(catagoryProcess.length/2,catagoryProcess.length);

    reportContentTwo.prossesExAnteAssessment = catagoryProcessExAnteAssessment;

    return reportContentTwo;

  }

   async genarateReportDtoContentThree( assessmentId: number,
    tool:string):Promise<ReportContentThree>{
    const contentThree=new ReportContentThree()
 
   return contentThree
}

  async genarateReportCarbonMarketDto(
    createReportDto: CreateReportDto,
  ): Promise<ReportCarbonMarketDto> {
    const reportCarbonMarketDto = new ReportCarbonMarketDto();
    reportCarbonMarketDto.reportName = createReportDto.reportName;
    reportCarbonMarketDto.coverPage = this.genarateReportCarbonMarketDtoCoverPage(
      createReportDto.reportTitle,
    );
    reportCarbonMarketDto.contentOne = await this.genarateReportCarbonMarketDtoContentOne(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentTwo = await this.genarateReportCarbonMarketDtoContentTwo(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentThree = await this.genarateReportCarbonMarketDtoContentThree(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentFour = await this.genarateReportCarbonMarketDtoContentFour(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentFive = await this.genarateReportCarbonMarketDtoContentFive(
      createReportDto.assessmentId,
    );
  
    return reportCarbonMarketDto;
  }
  
  genarateReportCarbonMarketDtoCoverPage(
    title:string
  ): ReportCarbonMarketDtoCoverPage{

    var moment = require('moment');
    const coverPage=new ReportCarbonMarketDtoCoverPage()
   
    coverPage.generateReportName = 'TRANSFORMATIONAL CHANGE ASSESSMENT REPORT  CARBON MARKET TOOL';
    coverPage.reportDate = moment().format("DD/MM/YYYY");
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink =  process.env.MAIN_SERVER_URL +  '/report/cover/icatlogo.png';
    return coverPage;


  }
 async genarateReportCarbonMarketDtoContentOne(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentOne>{
    const contentOne=new ReportCarbonMarketDtoContentOne()
    let asse = await this.assessmentService.findbyIDforCarbonMarketReport(assessmentId);
    let int_cm_approaches = [
      { id: 1, name: "Article 6.2", code: "ARTICLE_6.2" },
      { id: 2, name: "Article 6.4", code: "ARTICLE_6.4" },
      { id: 2, name: "Gold Standard", code: "GOLD_STANDARD" },
      { id: 2, name: "Verified Carbon Standard", code: "VERIFIED_CARBON_STANDARD" },
      { id: 2, name: "Plan Vivo", code: "PLAN_VIVO" },
      { id: 2, name: "American Carbon Registry", code: "AMERICAN_CARBON_REGISTRY" },
      { id: 2, name: "Climate Action Reserve", code: "CLIMATE_ACTION_RESERVE" },
      { id: 2, name: "Other", code: "OTHER" },
    ]
    let scale_of_activity = [
      { id: 1, name: 'Project', code: 'PROJECT'},
      { id: 2, name: 'Programme', code: 'PROGRAMME'}
    ]
    let cmApproache = int_cm_approaches.find(o => o.code === asse.cmAssessmentDetails.intCMApproach);
    let scale =  scale_of_activity.find(o => o.code === asse.cmAssessmentDetails.scale);

    contentOne.policyOrActionsDetails = [
      {
        information: 'Title of the intervention',
        description: asse.climateAction.policyName ? asse.climateAction.policyName : 'N/A',
      },
      {
        information: 'Description of the intervention',
        description: asse.climateAction.description ? asse.climateAction.description : 'N/A',
      },
      {
        information: 'Date of implementation',
        description: asse.climateAction.dateOfImplementation
          ? new Date(
            asse.climateAction.dateOfImplementation,
          ).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Date of completion (if relevant)',
        description: asse.climateAction.dateOfCompletion
          ? new Date(asse.climateAction.dateOfCompletion).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Implementing entity or entities',
        description: asse.climateAction.implementingEntity ? asse.climateAction.implementingEntity : 'N/A',
      },
      {
        information: 'Objectives and intended impacts or benefits of the intervention ',
        description: asse.climateAction.objective ? asse.climateAction.objective : 'N/A',
      },
      {
        information: 'Level of the policy or action ',
        description: asse.climateAction.levelofImplemenation ? asse.climateAction.levelofImplemenation : 'N/A',
      },
      {
        information: 'Geographic coverage',
        description: asse.climateAction.geographicCoverage
          ? asse.climateAction.geographicCoverage
          : 'N/A',
      },
      {
        information: 'Sectors covered ',
        description: asse.climateAction.policy_sector
          ? asse.climateAction.policy_sector.map((a) => a.sector.name).join(',')
          : 'N/A',
      },
      {
        information: 'Related interventions ',
        description: asse.climateAction.related_policies
          ? asse.climateAction.related_policies
          : 'N/A',
      },
      {
        information: 'Reference',
        description: asse.climateAction.reference
          ? asse.climateAction.reference
          : 'N/A',
      },
    ];

    //table 1.2
    contentOne.characteristics = [
      {
        information: 'Selection of the activity',
        description: asse.climateAction.policyName
      },
      {
        information: 'Scale of the activity',
        description: scale?.name
      },
      {
        information: 'Assessment boundaries',
        description: asse.cmAssessmentDetails.boundraries
      },
      {
        information: 'International carbon market approach used ',
        description: cmApproache?.name
      },
      {
        information: 'Baseline and monitoring methodology applied by the activity ',
        description: asse.cmAssessmentDetails.appliedMethodology
      },
    ]

    contentOne.transformational = [
    
      {

        information: 'Description of the vision for desired societal, environmental and technical changes',

        description: asse.envisioned_change ? asse.envisioned_change : 'N/A',

      },
      {

        information: 'Long term (≥15 years)',

        description: asse.vision_long ? asse.vision_long : 'N/A',

      },

      {

        information: 'Medium term (5-15 years)',

        description: asse.vision_medium ? asse.vision_medium : 'N/A',

      },

      {

        information: 'Short term (&lt; 5 years)',

        description: asse.vision_short ? asse.vision_short : 'N/A',

      },

      {

        information: 'Phase of transformation',

        description: asse.phase_of_transformation ? asse.phase_of_transformation : 'N/A',

      },

    ];
    contentOne.barriers = []

    asse.policy_barrier.map(a => {

      contentOne.barriers.push({
        barrier: a.barrier ? a.barrier : 'N/A',

        explanation: a.explanation ? a.explanation : 'N/A',

        characteristics_affected: a.barrierCategory ? a.barrierCategory.map(b => b.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")).join(',') : 'N/A',

        barrier_directly_targeted: a.is_affected ? 'Yes' : 'No',
      })

    })
    //table 1.4
    contentOne.assessmetType = asse.assessmentType;
    contentOne.geograpycalCover = asse.geographical_areas_covered.map(a=>a.name).join('')
    contentOne.sectorCoverd = asse.investor_sector.map(a=>a.sector.name).join('')

    return contentOne
  }
  async genarateReportCarbonMarketDtoContentTwo(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentTwo>{
    const contentTwo=new ReportCarbonMarketDtoContentTwo()
    this.cmResult = await this.cmAssessmentQuestionService.getResults(assessmentId)
    let safeguardsArray = new Array();
    let preventionGHGArray = new Array();
    let preventionAvoidanceArray = new Array();
    let questions:any[] = this.cmResult.questions

    if(questions)
    {
      questions.sort((a, b) => {
        const questionNumberA = parseInt(a.question.label.match(/\d+/)[0])
        const questionNumberB = parseInt(b.question.label.match(/\d+/)[0])
    
        return questionNumberA - questionNumberB;
        });
      for  (const res of questions) {
        if(res.criteria == 'Criterion 1: Safeguards for environmental integrity'){
          safeguardsArray.push(res)
        }
        else if(res.criteria == 'Criterion 2: Prevention of GHG emissions lock-in'){
          preventionGHGArray.push(res)
        }
        else if(res.criteria =='Criterion 3: Prevention/avoidance of negative environmental and social impacts'){
          preventionAvoidanceArray.push(res)
        }
      }
    contentTwo.safeguards=safeguardsArray
    contentTwo.prevention_ghg_emissions = preventionGHGArray;
    contentTwo.prevention_negative_environmental = preventionAvoidanceArray ;
   
    let outcomes = this.cmResult.result['Section 2: Environmental and social integrity preconditions']

    contentTwo.outcomes = outcomes?[...outcomes].reverse():[];
    }

    return contentTwo;
  }
  async genarateReportCarbonMarketDtoContentThree(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentThree>{
    const contentThree=new ReportCarbonMarketDtoContentThree()
    let processData = this.cmResult.processData;
    this.cmScores = await this.cmAssessmentQuestionService.calculateResult(assessmentId)
    if(this.cmScores.outcome_score){
      contentThree.outcomes_categories_assessment = this.cmScores.outcome_score;
      contentThree.outcomeScore = this.cmScores.outcome_score.outcome_score;
      contentThree.processScore = this.cmScores.process_score;
    }
    if(processData?.data.length>0){
      contentThree.process_categories_assessment = processData.data;
      for (let cat of processData?.data) {
        let category:any={};
        let categoryarray = new Array()
        category.name = cat.name;
        category.characteristics = cat.characteristic.map(a=>{
          a.relevance=this.mapRelevance(a.relevance);
          return a
        });
        let rows:number=0;
        for (let char of cat.characteristic) {
          if(!char.raw_questions.length){

            char.raw_questions.push({question:null,score:null,justification:null,document:null})
          }
          rows += char.raw_questions.length
        }
        
        category.rows = rows;

          categoryarray.push(category)
          contentThree.prossesAssesmentStartingSituation.push(categoryarray)
    
        
      }
   
    }
    if(this.cmResult.outComeData?.scale_GHGs && this.cmResult.outComeData?.scale_GHGs.length>0 ){
      contentThree.scale_ghg = this.cmResult.outComeData.scale_GHGs.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
      
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
      
    }
    if(this.cmResult.outComeData?.sustained_GHGs && this.cmResult.outComeData?.sustained_GHGs.length>0 ){
      contentThree.sustained_ghg = this.cmResult.outComeData.sustained_GHGs.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
        a.outcome_score_explain=this.mapScoreforCarbonMarcket(a.outcome_score);
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
    }
    if(this.cmResult.outComeData?.scale_adaptation && this.cmResult.outComeData?.scale_adaptation.length>0 ){
      contentThree.scale_adaptation = this.cmResult.outComeData.scale_adaptation.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
      
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
    }
    if(this.cmResult.outComeData?.sustained_adaptation && this.cmResult.outComeData?.sustained_adaptation.length>0 ){
      contentThree.sustained_adaptation = this.cmResult.outComeData.sustained_adaptation.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
        a.outcome_score_explain=this.mapScoreforCarbonMarcket(a.outcome_score);
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
    }
    if(this.cmResult.outComeData?.scale_SDs && this.cmResult.outComeData?.scale_SDs.length>0 ){
      contentThree.scale_sd = this.cmResult.outComeData.scale_SDs.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
    
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
    }
    if(this.cmResult.outComeData?.sustained_SDs && this.cmResult.outComeData?.sustained_SDs.length>0 ){
      contentThree.sustained_sd = this.cmResult.outComeData.sustained_SDs.map(a=>{
        a.characteristic=this.mapCharacteristicsnamesforCarbonMarcket(a.characteristic);
        a.outcome_score_explain=this.mapScoreforCarbonMarcket(a.outcome_score);
        a.outcome_score=this.changeScoreforCarbonMarcket(a.outcome_score)
        return a
      })
    }
    return contentThree
  }
  async genarateReportCarbonMarketDtoContentFour(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentFour>{
    const contentFour=new ReportCarbonMarketDtoContentFour()
    if(this.cmScores.process_score!=null ||this.cmScores.process_score!=undefined){
      contentFour.processScore = this.cmScores.process_score
    }
    if(this.cmScores.outcome_score?.outcome_score!=null ||this.cmScores.outcome_score?.outcome_score!=undefined){
      contentFour.outcomeScore = this.cmScores.outcome_score.outcome_score
    }
    

return contentFour
  }
  async genarateReportCarbonMarketDtoContentFive(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentFive>{
    const contentFive=new ReportCarbonMarketDtoContentFive()
    contentFive.annex = await this.cmAssessmentQuestionService.getDocumentListForReport(assessmentId);
    return contentFive
  }














  genarateAssessmentDto(): AssessmentDto {

    return new AssessmentDto();

  }









  async genarateComparisonReportDto(

    createReportDto: CreateComparisonReportDto,

  ): Promise<ComparisonReportDto> {
    var moment = require('moment');
    const comparisonReportDto = new ComparisonReportDto();
    comparisonReportDto.reportName = createReportDto.reportName;
    comparisonReportDto.coverPage = this.genarateComparisonReportDtoCoverPage(
      createReportDto.reportTitle,
    );
    comparisonReportDto.contentOne = await this.genarateComparisonReportDtoContentOne(createReportDto.portfolioId);


    let result: ComparisonTableDataDto = await this.portfolioService.getPortfolioComparisonData(createReportDto.portfolioId);



    comparisonReportDto.contentTwo = await this.genarateComparisonReportDtoContentTwo(result.process_data, result.outcome_data
    );
    comparisonReportDto.contentThree = await this.genarateComparisonReportDtoContentThree(result.aggregation_data
    );
    comparisonReportDto.contentFour = await this.genarateComparisonReportDtoContentFour(result.alignment_data
    );
    comparisonReportDto.contentFive = await this.genarateComparisonReportDtoContentFive(createReportDto.portfolioId
      );
      comparisonReportDto.contentSix = await this.genarateComparisonReportDtoContentSix(comparisonReportDto.contentOne
        );
    comparisonReportDto.coverPage = this.genarateComparisonReportDtoCoverPage(createReportDto.reportTitle,);

    return comparisonReportDto;

  }





  genarateComparisonReportDtoCoverPage(title: string): ReportCoverPage {
    var moment = require('moment');
    const coverPage = new ComparisonReportReportCoverPage();

    coverPage.generateReportName = title;

    coverPage.reportDate = moment().format("DD/MM/YYYY");

    coverPage.document_prepared_by = 'user';

    coverPage.companyLogoLink = process.env.MAIN_SERVER_URL +  '/report/cover/icatlogo.png';
      

    return coverPage;

  }

  async genarateComparisonReportDtoContentOne(portfolioId: number): Promise<ComparisonReportReportContentOne> {
    let portfolio = new Portfolio();
    let assessment: PortfolioAssessment[] = []
    portfolio = await this.portfolioRepo.findOne({ where: { id: portfolioId } });
    assessment = await this.portfolioAssessRepo.find({
      relations: ['assessment'], where: { portfolio: { id: portfolioId } },
    });
    const contentOne = new ComparisonReportReportContentOne();

    for (let ass of assessment) {
     contentOne.intervation_details.push(
      {
        id: ass.assessment.climateAction.intervention_id,
        climateAction_id: ass.assessment.climateAction.id,
        name: ass.assessment.climateAction.policyName,
        assessmentType: ass.assessment.assessmentType,
        assessmentPeriodfrom: ass.assessment.from,
        assessmentPeriodto: ass.assessment.to,
      }
     ) 
    }

      contentOne.portfolio_details = [
        {
          information: 'Portfolio ID',
          description: portfolio.portfolioId ? portfolio.portfolioId : 'N/A',
        },
        {
          information: 'Name',
          description: portfolio.portfolioName ? portfolio.portfolioName : 'N/A',
        },
        {
          information: 'Description of the Portfolio',
          description: portfolio.description ? portfolio.description : 'N/A',
        },
        {
          information: 'Date',
          description: portfolio.date ? portfolio.date : 'N/A',
        },
        {
          information: 'Objectives of the assessment',
          description: portfolio.objectives ? portfolio.objectives : 'N/A',
        },
        {
          information: 'Intended audience(s) of the assessment',
          description: portfolio.audience ? portfolio.audience : 'N/A',
        },
        {
          information: 'Previous assessments the present assessment is an update of',
          description: portfolio.IsPreviousAssessment == 'Yes' ? portfolio.link : 'N/A',
        },
      ]

      contentOne.portfolioId=portfolioId;
      return contentOne;
    }
    genarateComparisonReportDtoContentTwo(process_data: ComparisonDto[], outcome_data: ComparisonDto[]): ComparisonReportReportContentTwo {
      const contentTwo = new ComparisonReportReportContentTwo();
console.log(process_data)

      const tech = process_data.find(a => a.col_set_1.some(b => b.label == 'Category - Technology'));

      if (tech) {
        contentTwo.prosses_tech = tech.interventions;

      }

      const agent = process_data.find(a => a.col_set_1.some(b => b.label == 'Category - Agents'));

      if (agent) {
        contentTwo.prosses_agent = agent.interventions;

      }
      const incen = process_data.find(a => a.col_set_1.some(b => b.label == 'Category - Incentives'));

      if (incen) {
        contentTwo.prosses_incentive = incen.interventions;
    

      }
      const norm = process_data.find(a => a.col_set_1.some(b => b.label == 'Category - Norms and behavioral change'));

      if (norm) {
        contentTwo.prosses_norms = norm.interventions;
      }

      const process_score = process_data.find(a => a.col_set_1.length > 2);

      if (process_score) {
        contentTwo.process_score = process_score.interventions;

      }


      const ghg_scale = outcome_data.find(a => a.col_set_1.some(b => b.label == 'GHG') && a.comparison_type == 'Scale comparison');
      if (ghg_scale) {
        contentTwo.ghg_scale = ghg_scale.interventions;
      }

      const ghg_sustaind = outcome_data.find(a => a.col_set_1.some(b => b.label == 'GHG' && a.comparison_type == 'Sustained in time comparison'));
      if (ghg_sustaind) {
        contentTwo.ghg_sustaind = ghg_sustaind.interventions;
      }

      const ghg_scale_sustaind_comparison = outcome_data.find(a => a.comparison_type_2 == 'GHG Outcomes' && a.comparison_type == 'Scale & Sustained in time comparison');
      if (ghg_scale_sustaind_comparison) {

        contentTwo.ghg_scale_sustaind_comparison = ghg_scale_sustaind_comparison.interventions;
      }

      const adaptation_scale = outcome_data.find(a => a.col_set_1.some(b => b.label == 'Adaptation') && a.comparison_type == 'Scale comparison');
      if (adaptation_scale) {
        contentTwo.adaptation_scale = adaptation_scale.interventions;
      }

      const adaptation_sustaind = outcome_data.find(a => a.col_set_1.some(b => b.label == 'Adaptation') && a.comparison_type == 'Sustained in time comparison');
      if (adaptation_sustaind) {
        contentTwo.adaptation_sustaind = adaptation_sustaind.interventions;
      }

      const adaptation_scale_sustaind_comparison = outcome_data.find(a => a.comparison_type_2 == 'Adaptation Outcomes' && a.comparison_type == 'Scale & Sustained in time comparison');
      if (adaptation_scale_sustaind_comparison) {
        contentTwo.adaptation_scale_sustaind_comparison = adaptation_scale_sustaind_comparison.interventions;
      }

      outcome_data.filter(a => a.col_set_1.some(b => b.label.includes('SDG')) && a.col_set_1.length < 3).forEach(c => {

        let sdg = contentTwo.allsdg.find(d => d.sdg_name == c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim());

        if (sdg) {
          if (c.comparison_type == 'Scale comparison') {
            sdg.sdg_scale = c.interventions;
          }
          if (c.comparison_type == 'Sustained in time comparison') {
            sdg.sdg_sustaind = c.interventions;
          }
        } else {

          if (c.comparison_type == 'Scale comparison') {

            contentTwo.allsdg.push({
              sdg_name: c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim(),
              sdg_scale: c.interventions,
              sdg_sustaind: []
            })
          }
          if (c.comparison_type == 'Sustained in time comparison') {

            contentTwo.allsdg.push({
              sdg_name: c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim(),
              sdg_scale: [],
              sdg_sustaind: c.interventions
            })
          }


        }

      });
      outcome_data.filter(a => a.comparison_type == 'Sustained in time comparison' && a.comparison_type_2.includes('SDG')).forEach(c => {
        contentTwo.sdg_scale_sustaind_comparison.push({sdg_name:c.comparison_type_2,data:c.interventions})

      })

      const sacle_comparison = outcome_data.find(a => a.col_set_1.length > 2 && a.comparison_type == 'Scale comparison');
      if (sacle_comparison) {
        contentTwo.sacle_comparison = sacle_comparison.interventions;
      }
      const sustaind_comparison = outcome_data.find(a => a.comparison_type == 'Sustained comparison' && a.col_set_1.length > 2);
      if (sustaind_comparison) {
        contentTwo.sustaind_comparison = sustaind_comparison.interventions;
      }
      const outcome_level = outcome_data.find(a => a.comparison_type == 'Outcome level comparison');
      if (outcome_level) {
        contentTwo.outcome_level = outcome_level.interventions;
      }



      return contentTwo;
    }


    genarateComparisonReportDtoContentThree(aggregation_data: ComparisonDto): ComparisonReportReportContentThree {
      const content = new ComparisonReportReportContentThree();

      content.aggregation = { total: aggregation_data.total, data: aggregation_data.interventions }
      return content;
    }
    genarateComparisonReportDtoContentFour(alignment_data: ComparisonDto): ComparisonReportReportContentFour {
      const contentOne = new ComparisonReportReportContentFour();
      contentOne.alignment_table = alignment_data;
      return contentOne;

    }

    async genarateComparisonReportDtoContentFive(portfolioId: number): Promise<ComparisonReportReportContentFive> {
      const contentOne = new ComparisonReportReportContentFive();
      //@ts-ignore
      contentOne.scores=(await this.investorToolService.getDashboardAllDataFilter( {page:1,limit:1000}, '',portfolioId)).items.map(item => {return {outcomeScore: item.result.averageOutcome, processScore: item.result.averageProcess,}});
 
      return contentOne;

    }
    async genarateComparisonReportDtoContentSix(comparisonReportReportContentOne:ComparisonReportReportContentOne): Promise<ComparisonReportReportContentSix> {
      const contentOne = new ComparisonReportReportContentSix();
 
  const data=await this.investorToolService.findAllSectorCount(comparisonReportReportContentOne.portfolioId)

   const url=await this.generateAndSavePieChart(data, '');

    contentOne.link=url;
return contentOne;

    }



    async generateAndSavePieChart(data: any[], outputPath: string): Promise<string> {
     
     const sector_color_map = [
        {id: 1, sectorNumber: 1, color: '#003360'},
        {id: 2, sectorNumber: 3, color: '#A52A2A'},
        {id: 3, sectorNumber: 2, color: '#C0C0C0'},
        {id: 4, sectorNumber: 5, color: '#8B4513'},
        {id: 5, sectorNumber: 4, color: '#808080'},
        {id: 6, sectorNumber: 6, color: '#008000'},
        {id: 7, sectorNumber: 7, color: '#007BA7'},
        {id: 8, sectorNumber: 8, color: '#483C32'},
      ]
    const  defaulColors =[
        'rgba(153, 102, 255, 1)',
        'rgba(75, 192, 192,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(123, 122, 125, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(70, 51, 102, 1)',
        'rgba(40, 102, 102, 1)',
        'rgba(27, 74, 107, 1)',
        'rgba(75, 74, 77, 1)',
        'rgba(121, 27, 53, 1)',
        'rgba(121, 98, 20, 1)',
        'rgba(51, 0, 51, 1)',
        'rgba(25, 25, 112, 1)',
        'rgba(139, 0, 0, 1)',
        'rgba(0, 0, 139, 1)',
        'rgba(47, 79, 79, 1)',
        'rgba(139, 69, 19, 1)'
      ]
      const width = 800; // Width of the canvas
      const height = 550; // Height of the canvas
  
      // Configure chart options
     const counts= data.map(item => item.count);
     const total = counts.reduce((acc, val) => acc + val, 0);
   


     const secbgColors : string[] = [];
     data.forEach((sd: any) => {
      let color = sector_color_map.find(o => o.sectorNumber === sd.sector_id)
      if (color) {
       secbgColors.push(color.color)
      } else {
        secbgColors.push(defaulColors[sd.sector_id])
      }
    })

    const { Chart, ChartConfiguration, registerables  } = require('chart.js');
    Chart.register(...registerables);

      const chartOptions = {

        type: 'pie',
        data: {
          labels: data.map(item => item.sector),
          datasets: [{
            data: counts,
            backgroundColor: secbgColors,
          }],
        },
     
        options: {
          labels: {
            render: 'label'
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins:{
            legend:{
              position: 'right',
              font: {
                size: 24,
              },
              labels: {
              }
            },

       
          
         }
  
        },
      };
  
     
      const { createCanvas } = require('canvas');
   
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

    
//@ts-ignore
      const chart = new Chart(ctx,chartOptions);
      
      return canvas.toDataURL();

    }


    mapRelevance(value: number) {
      switch (value) {
        case 0:
          return 'Not relevant';
        case 1:
          return 'Possibly relevant';
        case 2:
          return 'Relevant';
      }
    }
    mapCharacteristicsnames(name: string) {
      if(name=='International/global level'){
        return 'Global level'
      }
      else if(name=='National/Sectorial level'){
        return 'National/sectoral level'
      }
      else if(name=='Subnational/regional/municipal or sub sectorial level'){
        return 'Subsectoral level'
      }
      if(name=='Short term (<5 years)'){
        return 'Short term (&#60 5 years)'
      }
      if(name=='Medium term (5-15 years)'){
        return 'Medium term (5-15 years)'
      }
      else{
        return name
      }
    }

    mapCharacteristicsnamesForSustaind(name: string) {
      if(name=='International/global level'){
        return 'Global level'
      }
      else if(name=='National/Sectorial level'){
        return 'National/sectoral level'
      }
      else if(name=='Subnational/regional/municipal or sub sectorial level'){
        return 'Subsectoral level'
      }
      if(name=='Short term (<5 years)'){
        return 'Short term (&#60 5 years)'
      }
      if(name=='Medium term (5-15 years)'){
        return 'Medium term (5-15 years)'
      }
      else{
        return name
      }
    }

    mapCharacteristicsnamesforCarbonMarcket(name: string) {
      if(name=='International/global level'){
        return 'Global level'
      }
      else if(name=='National/Sectorial level'){
        return 'National/sectoral level'
      }
      else if(name=='Subnational/regional/municipal or sub sectorial level'){
        return 'Subsectoral level'
      } 
      if(name=='Long term (>15 years)'){
        return 'Global level'
      }
      if(name=='Medium term (5-15 years)'){
        return 'National/sectoral level'
      }
      if(name=='Short term (<5 years)'){
        return 'Subsectoral level'
      }
      else{
        return name
      }
    }

    mapScoreforCarbonMarcket(name: string) {
      if(name=='-1'){
        return 'Expected negative impact'
      }
      else if(name=='0'){
        return 'No expected impact on the selected scale'
      }
      else if(name=='1'){
        return 'Expected positive impact of 0-10 years on the selected scale'
      } 
      if(name=='2'){
        return 'Expected positive impact of 11-20 years on the selected scale '
      }
      if(name=='3'){
        return 'Expected positive impact of over 20 years on the selected scale'
      }
    
    
      else{
        return'N/A'
      }
    }

    changeScoreforCarbonMarcket(name: string) {
      if(name=='-99'){
        return 'Outside assessment boundaries'
      }
      if(name==null || name ==undefined){
        return '-'
      }
      else{
        return name
      }
    }

    thousandSeperate(value: any, decimals: number){
      if ((value !== undefined)) {
        if (value === '-'){
          return value
        } else if (isNull(value)) {
          return '-'
        } else {
          return parseFloat(value.toFixed(decimals)).toLocaleString('en')
        }
      } else {
        return '-'
      }
    }

  }
  


