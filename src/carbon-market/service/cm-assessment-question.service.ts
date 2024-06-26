import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMResultDto, CMScoreDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { In, Repository } from "typeorm";
import { Results } from "src/methodology-assessment/entities/results.entity";
import { Approach } from "../enum/answer-type.enum";
import { ParameterRequest } from "src/data-request/entity/data-request.entity";
import { Tool } from "src/data-request/enum/tool.enum";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { Criteria } from "../entity/criteria.entity";
import { Section } from "../entity/section.entity";
import { UsersService } from "src/users/users.service";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { MasterDataService } from "src/shared/entities/master-data.service";
import { SdgAssessment } from "src/investor-tool/entities/sdg-assessment.entity";
import { AssessmentCMDetailService } from "./assessment-cm-detail.service";
import { CMDefaultValue } from "../entity/cm-default-value.entity";
import { CMAssessmentAnswerService } from "./cm-assessment-answer.service";
import * as moment from "moment";
import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Country } from "src/country/entity/country.entity";
import { PortfolioSdg } from "src/investor-tool/entities/portfolio-sdg.entity";

@Injectable()
export class CMAssessmentQuestionService extends TypeOrmCrudService<CMAssessmentQuestion> {

  constructor(
    @InjectRepository(CMAssessmentQuestion) repo,
    @InjectRepository(CMAssessmentAnswer) private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(CMAssessmentQuestion) private assessmentQuestionRepo: Repository<CMAssessmentQuestion>,
    @InjectRepository(Results) private resultsRepo: Repository<Results>,
    @InjectRepository(Assessment) private assessmentRepo: Repository<Assessment>,
    @InjectRepository(ParameterRequest) private parameterRequestRepo: Repository<ParameterRequest>,
    @InjectRepository(SdgAssessment) private sdgAssessmentRepo: Repository<SdgAssessment>,
    @InjectRepository(CMDefaultValue) private cmDefaultValueRepo: Repository<CMDefaultValue>,
    private userService: UsersService,
    private masterDataService: MasterDataService,
    private assessmentCMDetailService: AssessmentCMDetailService,
    private cMAssessmentAnswerService: CMAssessmentAnswerService
  ) {
    super(repo);
  }

  async create(question: CMAssessmentQuestion) {
    return await this.repo.save(question)
  }

  async deleteRemovedSDGS(assessmentId: number, selectedSDGS: number[]){
    if (!Array.isArray(selectedSDGS)) selectedSDGS = [selectedSDGS]
    selectedSDGS = selectedSDGS.map(i => +i)
    let savedSDGS = await this.sdgAssessmentRepo.find({where: {assessment: {id: assessmentId}}})
    if (savedSDGS.length > 0) {
      for (let ex of savedSDGS) {
        if (!selectedSDGS.find(o => o === ex.sdg.id)) {
          let res = await this.sdgAssessmentRepo.delete({id: ex.id})
          let assessmentQuestion = await this.repo.find({where: {assessment: {id: assessmentId}, selectedSdg: {id: ex.sdg.id}}})
          let qids = assessmentQuestion.map(q => q.id)
          let assessmentAnswers = await this.assessmentAnswerRepo.find({where: {assessment_question: {id: In(qids)}}})
          let aids = assessmentAnswers.map(a => a.id)
          if (aids.length > 0) await this.assessmentAnswerRepo.delete(aids)
          if (qids.length > 0) await this.repo.delete(qids)
        } 
      }
    }
  }


  async saveResult(result: CMResultDto[], assessment: Assessment, isDraft: boolean, name: string, type: string, expectedGHGMitigation: number, score = 1) {
    let a_ans: any[]
    let _answers = []
    let allSdgs = []
    let selectedSdgs = []
    let savedSdgs = []
    let exists = []
    let results = []
    results = [...result]

    try {
      for await (let res of results) {
        if (res.selectedSdg?.id !== undefined ) allSdgs.push(res.selectedSdg)
        if (res.selectedSdg?.id !== undefined && !savedSdgs.includes(res.selectedSdg?.id)) {
          let exist = await this.sdgAssessmentRepo.find({ where: { sdg: { id: res.selectedSdg.id }, assessment: { id: assessment.id } } })
          if (exist.length === 0) {
            let obj = new SdgAssessment()
            obj.assessment = assessment
            obj.sdg = res.selectedSdg
            savedSdgs.push(res.selectedSdg.id)
            selectedSdgs.push(obj)
          } else exists.push(res.selectedSdg.id)
        }
      }
      if (isDraft) {
        assessment.isDraft = isDraft;
        assessment.lastDraftLocation = type;
        if (type == "prose") {
          assessment.processDraftLocation = name;
        } else if (type == "out") {
          assessment.outcomeDraftLocation = name;
        }
        this.assessmentRepo.save(assessment)
      }
      for await (let res of results) {
        let ass_question = new CMAssessmentQuestion()
        ass_question.assessment = assessment;
        ass_question.comment = res.comment;
        ass_question.question = res.question;
        if (res.question?.id === undefined) ass_question.question = undefined
        ass_question.characteristic = res.characteristic;
        if (res.characteristic?.id === undefined) ass_question.characteristic = undefined
        ass_question.sdgIndicator = res.sdgIndicator;
        ass_question.startingSituation = res.startingSituation;
        ass_question.expectedImpact = res.expectedImpact;
        if (res.selectedSdg?.id) ass_question.selectedSdg = res.selectedSdg;
        ass_question.uploadedDocumentPath = res.filePath;
        ass_question.relevance = res.relevance;
        ass_question.adaptationCoBenifit = res.adaptationCoBenifit;
        if (res.assessmentQuestionId) ass_question.id = res.assessmentQuestionId
        if (ass_question.relevance === 0) {
          ass_question.question = undefined
          ass_question.comment = undefined
        }
        let q_res
        try {
          q_res = await this.repo.save(ass_question)
        } catch (err) {
          return new InternalServerErrorException()
        }

        if (res.type === 'INDIRECT') {
          let ass_answer = new CMAssessmentAnswer()
          ass_answer.institution = res.institution
          ass_answer.assessment_question = q_res
          ass_answer.approach = Approach.INDIRECT
          _answers.push(ass_answer)
        } else {
          let ass_answer = new CMAssessmentAnswer()
          ass_answer.institution = undefined
          if (res.answer && res.answer.id !== undefined) {
            ass_answer.answer = res.answer
            ass_answer.score = res.answer.score_portion * res.answer.weight / 100
          }
          if (res.selectedScore && res.selectedScore.value) {
            if (res.isGHG || res.isAdaptation) {
              ass_answer.score = (res.selectedScore.value / 6)
            }
            if (res.isSDG) {
              ass_answer.score = (res.selectedScore.value / ((selectedSdgs.length + exists.length) * 3))
            }
          }
          ass_answer.assessment_question = q_res
          ass_answer.selectedScore = res.selectedScore?.code
          ass_answer.approach = Approach.DIRECT
          if (res.assessmentAnswerId) {
            ass_answer.id = res.assessmentAnswerId
            if (ass_question.relevance === 0) {
              this.assessmentAnswerRepo.delete(ass_answer.id)
            }
          }

          if (ass_question.relevance !== 0) {
            _answers.push(ass_answer)
          }
        }
      }
      try {
        if (selectedSdgs.length > 0) {
          let res = await this.sdgAssessmentRepo.save(selectedSdgs)
        }
        a_ans = await this.assessmentAnswerRepo.save(_answers)
      } catch (err) {
        throw new InternalServerErrorException()
      }
      await this.saveDataRequests(_answers);

      if (assessment.assessment_approach === 'DIRECT' && !isDraft) {
        assessment.isDraft = isDraft;
        this.assessmentRepo.save(assessment);
        let resultObj = new Results();
        let res = await this.calculateResult(assessment.id);
        let exist = await this.resultsRepo.findOne({where: {assessment: {id: assessment.id}}})
        if (exist && exist.id) {
          resultObj.id = exist.id
        }
        resultObj.assessment = assessment;
        resultObj.averageProcess = res.process_score;
        resultObj.averageOutcome = res.outcome_score?.outcome_score;
        await this.resultsRepo.save(resultObj);

        this.saveTcValue(assessment.id, res);
      }
      if (expectedGHGMitigation || expectedGHGMitigation === null || expectedGHGMitigation === 0) {
        let cm_detail = await this.assessmentCMDetailService.getAssessmentCMDetailByAssessmentId(assessment.id)
        if (cm_detail) {
          cm_detail.expected_ghg_mitigation = expectedGHGMitigation;
          cm_detail.cmassessment = undefined
          cm_detail.geographicalAreasCovered = undefined
          cm_detail.sectorsCovered = undefined
          this.assessmentCMDetailService.save(cm_detail)
        }
      }
      return a_ans
    } catch (error) {
      throw new InternalServerErrorException(error)
    }


  }


  async calculateResult(assessmentId: number): Promise<CMScoreDto> {
    let response: CMScoreDto = new CMScoreDto()
    let cmAssessmentQuestions_process = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .where('assessment.id = :id and category.type = "process"', { id: assessmentId })
      .getMany()

    let cmAssessmentQuestions_outcome = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .leftJoinAndSelect(
        'aq.selectedSdg',
        'selectedSdg',
        'aq.selectedSdgId = selectedSdg.id'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .where('assessment.id = :id and category.type = "outcome"', { id: assessmentId })
      .getMany();

    if (cmAssessmentQuestions_process.length > 0) {
      response.process_score = await this.calculateProcessResult(cmAssessmentQuestions_process);
    } else {
      response.message += 'No questions found for process. ';
    }

    if (cmAssessmentQuestions_outcome.length > 0) {
      response.outcome_score = await this.calculateOutcomeResult(cmAssessmentQuestions_outcome, assessmentId);
    } else {
      response.message += 'No questions found for outcome. ';
    }

    return response
  }

  async calculateProcessResult(questions: CMAssessmentQuestion[]) {


    let categories = [...new Set(questions.map(q => q.characteristic.category.code))]
    let obj = {}

    for (let cat of categories) {
      let qs = questions.filter(o => o.characteristic.category.code === cat)
      let chs = this.group(qs, 'characteristic', 'code')
      let ch_data = Object.keys(chs).map(ch => {
        let _obj: CharacteristicData = new CharacteristicData()
        _obj.characteristic = chs[ch][0].characteristic.code
        _obj.relevance = chs[ch][0].relevance
        let weight = chs[ch][0].characteristic.cm_weight
        let score = null
        chs[ch].forEach(_ch => {
          if (_ch.assessmentAnswers[0]) {
            score += _ch.assessmentAnswers[0].score
          }
        })
        _obj.score = _obj.relevance === '0' ? null : (_obj.relevance === '1' ? Math.round(score * weight / 2 / 100) : Math.round(score * weight / 100))
        return _obj
      })
      let cat_data = { characteristics: ch_data, weight: qs[0].characteristic.category.cm_weight }
      obj[cat] = cat_data
    }

    let resObj = {}
    for (let key of Object.keys(obj)) {
      let score = null
      obj[key].characteristics.forEach(ch => {
        if (ch.relevance !== 0) {
          score += ch.score
        }
      })
      resObj[key] = { score: score, weight: obj[key].weight }
    }

    let process_score = null
    for (let key of Object.keys(resObj)) {
      process_score === null ? (resObj[key].score === null ? process_score === null : process_score = Math.round(resObj[key].score * resObj[key].weight / 100)) :
        process_score += Math.round(resObj[key].score * resObj[key].weight / 100)
    }

    return process_score
  }

  async calculateOutcomeResult(questions: CMAssessmentQuestion[], assessementId: number) {
    let categories = [...new Set(questions.map(q => q.characteristic.category.code))]
    let sdgs = await this.getSelectedSDGs(assessementId)
    const uniqueSdgNamesSet = [...new Set(sdgs.map(assessment => assessment.sdg.name))];
    let obj = {}
    let sdgs_score = {}
    let valid_sdg_score_count = {}
    for (let cat of categories) {
      let selected_sdg_count = 0
      let qs = questions.filter(o => o.characteristic.category.code === cat)
      let score: number
      if (qs.every(q => +q.assessmentAnswers[0]?.selectedScore === -99)) {
        score = null
        if (cat === 'SCALE_SD' || cat === 'SUSTAINED_SD') {
          qs.forEach((object) => {
           sdgs_score[object.selectedSdg?.id] = null
          })
        }
      } else {
        if (cat === 'SCALE_SD' || cat === 'SUSTAINED_SD') {
          selected_sdg_count = uniqueSdgNamesSet.length === 0 ? 1 : uniqueSdgNamesSet.length
          score = qs.reduce((accumulator, object) => {
            let _score = +object.assessmentAnswers[0]?.selectedScore
            if (sdgs_score[object.selectedSdg?.id]) sdgs_score[object.selectedSdg?.id] += _score === -99 ? 0 : _score;
            else sdgs_score[object.selectedSdg?.id] = _score === -99 ? 0 : _score;
            return accumulator + (_score === -99 ? 0 : _score);
          }, 0);
          qs.forEach(o => {
            if (+o.assessmentAnswers[0]?.selectedScore !== -99) {
              if (valid_sdg_score_count[o.selectedSdg?.id]) valid_sdg_score_count[o.selectedSdg?.id] += 1
              else valid_sdg_score_count[o.selectedSdg?.id] = 1
            }
          })
          let valid_scores_sdg = qs.reduce((total, x) => (+x.assessmentAnswers[0]?.selectedScore  !== -99 ? total + 1 : total), 0)
          score = score / valid_scores_sdg

        } else {
          score = qs.reduce((accumulator, object) => {
            let score = (+object.assessmentAnswers[0]?.selectedScore === -99 ? 0 : +object.assessmentAnswers[0]?.selectedScore)
            return accumulator + score;
          }, 0);
          let valid_scores = qs.reduce((total, x) => ((+x.assessmentAnswers[0]?.selectedScore  !== -99) ? total + 1 : total), 0)
          score = score / valid_scores
        }
      }
      obj[cat] = {
        score: score,
        weight: qs[0].characteristic.category.cm_weight
      }
    }

    for (let key of Object.keys(sdgs_score)) {
      sdgs_score[key] = sdgs_score[key] === null ? null : Math.floor(sdgs_score[key] / valid_sdg_score_count[key])
    }

    let ghg_score = null; let sdg_score = null; let adaptation_score = null
    let scale_ghg_score = null; let scale_sdg_score = null; let scale_adaptation_score = null;
    let sustained_ghg_score = null; let sustained_sdg_score = null; let sustained_adaptation_score = null;
    let outcome_score = null
    if (obj['SCALE_GHG']) {
      scale_ghg_score = obj['SCALE_GHG'].score
      sustained_ghg_score = obj['SUSTAINED_GHG']?.score
      ghg_score = scale_ghg_score === null && sustained_ghg_score === null ? null : (scale_ghg_score + sustained_ghg_score) / 2;
      ghg_score  !== null ? outcome_score += (ghg_score * obj['SCALE_GHG'].weight / 100) : outcome_score = outcome_score
    }
    if (obj['SCALE_SD']) {
      scale_sdg_score = obj['SCALE_SD'].score
      sustained_sdg_score = obj['SUSTAINED_SD']?.score
      sdg_score = scale_sdg_score === null && sustained_sdg_score === null ? null : (scale_sdg_score + sustained_sdg_score) / 2;
      sdg_score !== null ? outcome_score += (sdg_score * obj['SCALE_SD'].weight / 100) : outcome_score = outcome_score
    }
    if (obj['SCALE_ADAPTATION']) {
      scale_adaptation_score = obj['SCALE_ADAPTATION'].score
      sustained_adaptation_score = obj['SUSTAINED_ADAPTATION'].score
      adaptation_score = scale_adaptation_score === null && sustained_adaptation_score === null ? null : (scale_adaptation_score + sustained_adaptation_score) / 2;
      adaptation_score !== null ? outcome_score += (adaptation_score * obj['SCALE_ADAPTATION']?.weight / 100) : outcome_score = outcome_score
    }

    return {
      ghg_score: ghg_score === null ? null : Math.floor(ghg_score),
      sdg_score: sdg_score === null ? null : Math.floor(sdg_score),
      adaptation_score: adaptation_score === null ? null : Math.floor(adaptation_score),
      outcome_score: outcome_score === null ? null : Math.floor(outcome_score),
      scale_ghg_score: scale_ghg_score === null ? null : Math.floor(scale_ghg_score),
      sustained_ghg_score: sustained_ghg_score === null ? null : Math.floor(sustained_ghg_score),
      scale_sdg_score: scale_sdg_score === null ? null : Math.floor(scale_sdg_score),
      sustained_sdg_score: sustained_sdg_score === null ? null : Math.floor(sustained_sdg_score),
      scale_adaptation_score: scale_adaptation_score === null ? null : Math.floor(scale_adaptation_score),
      sustained_adaptation_score: sustained_adaptation_score === null ? null : Math.floor(sustained_adaptation_score),
      sdgs_score: sdgs_score
    }
  }

  async getResults(assessmentId: number) {
    let result = []
    let processData: { technology: any[], incentives: any[], norms: any[], } = { technology: [], incentives: [], norms: [] };
    let outcomeData: { scale_GHGs: any[], sustained_GHGs: any[], scale_SDs: any[], sustained_SDs: any[], scale_adaptation: any[], sustained_adaptation: any[] } = { scale_GHGs: [], sustained_GHGs: [], scale_SDs: [], sustained_SDs: [], scale_adaptation: [], sustained_adaptation: [] };

    let questions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .where('assessment.id = :id', { id: assessmentId })
      .getMany()

    if (questions.length > 0) {
      let qIds: number[] = questions.map((q) => q.id)
      let answers = await this.assessmentAnswerRepo
        .createQueryBuilder('ans')
        .innerJoinAndSelect(
          'ans.assessment_question',
          'question',
          'question.id = ans.assessmentQuestionId'
        )
        .leftJoinAndSelect(
          'question.selectedSdg',
          'sdg',
          'question.selectedSdgId = sdg.id'
        )
        .leftJoinAndMapOne(
          'ans.answer',
          CMAnswer,
          'answer',
          'answer.id = ans.answerId'
        )
        .leftJoinAndMapOne(
          'question.question',
          CMQuestion,
          'cmquestion',
          'cmquestion.id = question.questionId'
        )
        .leftJoinAndMapOne(
          'question.characteristic',
          Characteristics,
          'characteristic',
          'characteristic.id = question.characteristicId'
        )
        .leftJoinAndMapOne(
          'characteristic.category',
          Category,
          'category',
          'category.id = characteristic.category_id'
        )
        .leftJoinAndMapOne(
          'cmquestion.criteria',
          Criteria,
          'criteria',
          'criteria.id = cmquestion.criteriaId'
        )
        .leftJoinAndMapOne(
          'criteria.section',
          Section,
          'section',
          'section.id = criteria.sectionId'
        )
        .where('question.id In (:id)', { id: qIds })
        .getMany()

      let answers2 = await this.assessmentAnswerRepo
        .createQueryBuilder('ans')
        .innerJoinAndSelect(
          'ans.assessment_question',
          'question',
          'question.id = ans.assessmentQuestionId'
        )
        .innerJoinAndSelect(
          'ans.answer',
          'answer',
          'answer.id = ans.answerId'
        )
        .innerJoinAndSelect(
          'question.question',
          'cmquestion',
          'cmquestion.id = question.questionId'
        )
        .innerJoinAndSelect(
          'cmquestion.criteria',
          'criteria',
          'criteria.id = cmquestion.criteriaId'
        )
        .innerJoinAndSelect(
          'criteria.section',
          'section',
          'section.id = criteria.sectionId'
        )
        .where('question.id In (:id)', { id: qIds })
        .getMany()
      let criteria = []
      let sdgs = []

      let added_chs: number[] = []
      let uniqueAnswers = []
      for (let answ of answers) {
        if (!added_chs.includes(answ.assessment_question?.characteristic?.id) && answ.assessment_question.comment !== null && answ.assessment_question.comment !== undefined) {
          uniqueAnswers.push(answ);
          added_chs.push(answ.assessment_question?.characteristic?.id)
        }
      }

      for await (let ans of uniqueAnswers) {
        let obj = new OutcomeResult();
        obj.characteristic = ans.assessment_question?.characteristic?.name;
        obj.ch_code = ans.assessment_question?.characteristic?.code;
        obj.question = ans?.assessment_question?.question?.label;
        obj.score = ans?.answer?.label;
        obj.justification = ans?.assessment_question?.comment;
        obj.document = ans?.assessment_question?.uploadedDocumentPath;
        obj.category = ans?.assessment_question?.characteristic?.category;
        obj.SDG = 'SDG ' + ans?.assessment_question?.selectedSdg?.number + ' - ' + ans?.assessment_question?.selectedSdg?.name;
        obj.outcome_score = ans?.selectedScore;
        obj.weight = ans.assessment_question?.characteristic?.category.cm_weight;
        obj.starting_situation = ans?.assessment_question?.startingSituation;
        obj.expected_impact = ans?.assessment_question?.expectedImpact;
        obj.SDG_indicator = ans?.assessment_question?.sdgIndicator;
        obj.adaptation = ans?.assessment_question?.adaptationCoBenifit;
        if (ans?.assessment_question?.selectedSdg) sdgs.push(ans?.assessment_question?.selectedSdg);

        if (obj?.category?.code == 'SCALE_GHG' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.scale_GHGs.push(obj);
        } else if (obj?.category?.code == 'SUSTAINED_GHG' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.sustained_GHGs.push(obj);
        } else if (obj?.category?.code == 'SCALE_SD' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.scale_SDs.push(obj);
        } else if (obj?.category?.code == 'SUSTAINED_SD' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.sustained_SDs.push(obj);
        } else if (obj?.category?.code === 'SUSTAINED_ADAPTATION' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.sustained_adaptation.push(obj);
        } else if (obj?.category?.code === 'SCALE_ADAPTATION' && obj.justification !== undefined && obj.justification !== null) {
          outcomeData.scale_adaptation.push(obj);
        }
      }
      answers2 = [
        ...new Map(answers2.map((item) => [item.assessment_question.question.code, item])).values(),
      ];

      let criterias = this.checkPreConditions(answers2)

      answers2.forEach(ans => {
        let obj = {
          section: ans?.assessment_question?.question?.criteria?.section?.name,
          criteria: ans?.assessment_question?.question?.criteria?.name,
          question: ans.assessment_question?.question,
          answer: ans?.answer?.label,
          comment: ans.assessment_question.comment,
          document: ans?.assessment_question?.uploadedDocumentPath,
          satisfied: criterias[ans?.assessment_question?.question?.criteria.id],
          isPassing: ans?.answer?.isPassing,
          relatedQuestions: ans?.assessment_question?.question?.related_questions? JSON.parse(ans?.assessment_question?.question?.related_questions) : [],
          short_label: ans?.assessment_question?.question.short_label

        }
        criteria.push(ans?.assessment_question?.question?.criteria?.name)
        result.push(obj)
      })

      let result_final = []
      result.forEach(res => {
        let obj = {}
        let docs = []
        let isPassing = true
        if (res.short_label) {
          obj['section'] = res.section;
          obj['criteria'] = res.criteria;
          obj['satisfied'] = res.satisfied;
          obj['short_label'] = res.short_label;
          obj['code'] = res.question.code;
        }
        if (res.relatedQuestions.length > 0 && res.short_label) {
          res.relatedQuestions?.map(q => {
            let question = result.find(o => o.question.code === q);
            if (question){
              if (isPassing) isPassing = question.isPassing;
              if (question.document) docs.push(question.document);
            }
          })
          obj['isPassing'] = isPassing;
          obj['document'] = docs;
          obj['hasEvidence'] = docs.length > 0 ? 'Yes' : 'No';
        } else if (res.short_label){
          obj['isPassing'] = res.isPassing;
          if (res.document) docs.push(res.document);
          obj['document'] = docs;
          obj['hasEvidence'] = docs.length > 0 ? 'Yes' : 'No';
        }
        if (obj['section']) result_final.push(obj);
      })

    result_final.sort((a,b) => b.code - a.code);



      result_final = this.group(result_final, 'section');

      outcomeData.scale_GHGs.sort((a,b) => a.characteristic.localeCompare(b.characteristic))
      outcomeData.scale_SDs.sort((a,b) => a.characteristic.localeCompare(b.characteristic))
      outcomeData.scale_adaptation.sort((a,b) => a.characteristic.localeCompare(b.characteristic))
      outcomeData.sustained_GHGs.sort((a,b) => a.characteristic.localeCompare(b.characteristic))
      outcomeData.sustained_SDs.sort((a,b) => a.characteristic.localeCompare(b.characteristic))
      outcomeData.sustained_adaptation.sort((a,b) => a.characteristic.localeCompare(b.characteristic))

      return {
        questions:result,
        result: result_final,
        criteria: criteria,
        processData: await this.getProcessData(assessmentId),
        outComeData: outcomeData,
        sdgs: [...new Map(sdgs.map((item) => [item["id"], item])).values()]
      };
    }
  }

  checkPreConditions(assessmentAnswers: CMAssessmentAnswer[]) {
    let criterias = {}
    assessmentAnswers.forEach(ans => {
      if (criterias[ans.assessment_question.question.criteria.id] !== undefined) {
        if (criterias[ans.assessment_question.question.criteria.id]) {
          criterias[ans.assessment_question.question.criteria.id] = ans.answer.isPassing;
        }
      } else {
        criterias[ans.assessment_question.question.criteria.id] = ans.answer.isPassing;
      }
    })
    return criterias;
  }

  removeNullAssessmentQuestions(assessmentquestions: CMAssessmentQuestion[]) {
    let AssessQ: CMAssessmentQuestion[] = []
    assessmentquestions.map(q => {
      if (['SOCIAL_NORMS', 'BEHAVIOUR', 'AWARENESS', 'INSTITUTIONAL_AND_REGULATORY', 'DISINCENTIVES', 'ECONOMIC_NON_ECONOMIC', 'BENIFICIARIES', 'COALITION_OF_ADVOCATES', 'ENTREPRENEURS', 'SCALE_UP', 'ADOPTION', 'R_&_D'].includes(q.characteristic.code)) {
        if (q.assessmentAnswers[0]?.answer?.id !== undefined) {
          AssessQ.push(q)
        } else if ((q.assessmentAnswers[0]?.answer?.id === undefined && q.relevance === 0)) {
          AssessQ.push(q)
        }
      } else {
        AssessQ.push(q)
      }
    })
    return AssessQ;
  }

  async getProcessData(assessmentId: number) {
    let cmAssessmentQuestions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .leftJoinAndMapOne(
        'assessmentAnswers.answer',
        CMAnswer,
        'answer',
        'answer.id = assessmentAnswers.answerId'
      ).leftJoinAndMapOne(
        'answer.question',
        CMQuestion,
        'question',
        'question.id = answer.questionId'
      )
      .where('assessment.id = :id and category.type = "process"', { id: assessmentId })
      .getMany();

    let categories = cmAssessmentQuestions.map(q => q.characteristic.category);
    let uniqueCats = [
      ...new Map(categories.map((item) => [item["code"], item])).values(),
    ];
    let data = [];
    let maxLength = 0;

    for (let cat of uniqueCats) {
      let qs = cmAssessmentQuestions.filter(o => o.characteristic.category.code === cat.code);
      qs = this.removeNullAssessmentQuestions(qs);
      let chs = this.group(qs, 'characteristic', 'code');
      let ch_data = Object.keys(chs).map(ch => {
        if (chs[ch].length > maxLength) {
          maxLength = chs[ch].length;
        }
        let _obj = new CharacteristicProcessData();
        _obj.name = chs[ch][0].characteristic.name;
        _obj.code = chs[ch][0].characteristic.code;
        _obj.relevance = chs[ch][0].relevance;
        _obj.weight = chs[ch][0].characteristic.cm_weight;
        let questions = [];
        let raw_questions = [];
        let score = 0;
        for (let q of chs[ch]) {
          let o = new QuestionData();
          o.question = q.assessmentAnswers[0]?.answer?.question.label;
          o.justification = q?.comment;
          o.weight = q.assessmentAnswers[0]?.answer?.weight;
          o.score = q.assessmentAnswers[0]?.answer?.score_portion;
          o.label = q.assessmentAnswers[0]?.answer?.label;
          o.document = q.uploadedDocumentPath;
          if (+_obj.relevance === 0) {
            score = null
            // score = score + 0
          } else if (+_obj.relevance === 1 ) {
            if (+o.score && +o.weight) score = score + Math.round(+o.score * +o.weight / 2 / 100) 
          } else {
            if (+o.score && +o.weight) score = score + Math.round(+o.score * +o.weight / 100)
          }
          if (o.justification !== undefined && o.justification !== null) {
            questions.push(o);
            raw_questions.push(o);
          }
        }
        _obj.questions = questions;
        _obj.raw_questions = raw_questions;
        _obj.ch_score = score === null ? null : Math.round(score);
        return _obj;
      })
      
      let cat_score = 0;
      let isAllchNull = false
      if (ch_data.find(o => o.ch_score !== null)) { isAllchNull = false; } else { isAllchNull = true; }

      if (isAllchNull) {cat_score = null;}
      else {
        ch_data.map(ch => {
          if (ch.ch_score !== null) {
            cat_score += (ch.ch_score * ch.weight / 100);
          }
        })
      }

      cat_score = cat_score === null ? null : Math.round(cat_score)
      data.push({
        name: cat.name,
        characteristic: ch_data,
        cat_score: cat_score,
        weight: cat.cm_weight
      })
    }

    data = data.map(_data => {
      let chs = _data.characteristic.map(ch => {
        if (ch.questions.length < maxLength) {
          while (ch.questions.length < maxLength) {
            ch.questions.push(new QuestionData());
          }
        }
        return ch
      })
      return { name: _data.name, characteristic: chs, cat_score: _data.cat_score, weight: _data.weight };
    })

    let guiding_questions = [];

    for (let i = 0; i < maxLength; i++) {
      let obj = {}
      data.map(_data => {
        _data.characteristic.map(ch => {
          obj[ch.name + 'question'] = ch.questions[i].question;
          obj[ch.name + 'weight'] = ch.questions[i].weight;
          obj[ch.name + 'score'] = ch.questions[i].score;
        })
      })
      guiding_questions.push(obj);
    }

    let response = {
      data: data,
      guidingQuestions: guiding_questions
    }
    return response;

  }



  group(list: any[], prop: string | number, prop2?: string | number) {
    if (prop2) {
      return list.reduce((groups, item) => ({
        ...groups,
        [item[prop][prop2]]: [...(groups[item[prop][prop2]] || []), item]
      }), {});
    } else {
      return list.reduce((groups, item) => ({
        ...groups,
        [item[prop]]: [...(groups[item[prop]] || []), item]
      }), {});
    }
  }


  async saveTcValue(assessmentId: number, result: CMScoreDto) {
    let tc_score = 0
    let questions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .where('assessment.id = :id', { id: assessmentId })
      .getMany()
    if (questions.length > 0) {

      let qIds: number[] = questions.map((q) => q.id)
      let answers = await this.assessmentAnswerRepo
        .createQueryBuilder('ans')
        .innerJoin(
          'ans.assessment_question',
          'question',
          'question.id = ans.assessmentQuestionId'
        )
        .where('question.id In (:id)', { id: qIds })
        .getMany()
      let score = (result.process_score + result.outcome_score?.outcome_score) / 2;
      let update_score = {}
      if (result.process_score) {
        update_score = { tc_value: score, process_score: result.process_score, outcome_score: result.outcome_score?.outcome_score };
      }

      if (update_score['tc_value']) {
        await this.assessmentRepo
          .createQueryBuilder()
          .update(Assessment)
          .set({ tc_value: score, process_score: result.process_score, outcome_score: result.outcome_score?.outcome_score })
          .where("id = :id", { id: assessmentId })
          .execute();
      }

    }

  }

  async saveDataRequests(answers: CMAssessmentAnswer[]) {
    let requests = []
    answers.forEach(ans => {
      if (ans.institution !== undefined) {
        let request = new ParameterRequest()
        request.tool = Tool.CM_tool
        request.cmAssessmentAnswer = ans

        requests.push(request)
      }
    })

    await this.parameterRequestRepo.save(requests)
  }

  async getDashboardData(options: IPaginationOptions, intervention_ids?: number[]): Promise<any> {
    try {
      if (intervention_ids && !Array.isArray(intervention_ids)) {intervention_ids = [intervention_ids]}
      let user = this.userService.currentUser();
      const currentUser = await user;
      const isUserExternal = currentUser?.userType?.name === 'External';
      let tool = 'CARBON_MARKET';;
  
      let queryResults= await this.resultsRepo.createQueryBuilder('result')
      .leftJoinAndMapOne(
        'result.assessment',
        Assessment,
        'assessment',
        `assessment.id = result.assessment_id and assessment.tool='CARBON_MARKET' `,
      )
      .innerJoinAndMapOne(
        'assessment.climateAction',
        ClimateAction,
        'climateAction',
        `climateAction.id = assessment.climateAction_id and not climateAction.status =-20 `,
      )
    
      if (isUserExternal) {
        queryResults=queryResults 
        .innerJoinAndMapOne(
         'assessment.user',
         Country,
         'user',
         `user.id = assessment.user_id and user.id = :userid`,
       )

      } else {
        queryResults=queryResults 
         .innerJoinAndMapOne(
          'climateAction.country',
          Country,
          'country',
          `country.id = climateAction.countryId and country.id = :countryid`,
        )

      }

      if(intervention_ids?.length > 0){}else{

      }
      queryResults.where('', { userid: currentUser?.id,countryid: currentUser?.country?.id });


      const results=await queryResults.getMany();
 let filteredResults=results;
  
      let formattedResults = await Promise.all(filteredResults.map(async (result) => {
        return {
          assessment_id: result.assessment.id,
          assessment: result.id,
          process_score: result.averageProcess,
          outcome_score: result.averageOutcome,
          intervention: result.assessment.climateAction?.policyName,
          intervention_id: result.assessment.climateAction?.intervention_id,
          assessment_period: (result.assessment.from !== null ? moment(result.assessment.from).format('DD/MM/yyyy'): null) + ' - ' + (result.assessment.to !== null ? moment(result.assessment.to).format('DD/MM/yyyy') : null)
        };
      }));
  
      let interventions_to_filter = []
      formattedResults.map(r => {
        interventions_to_filter.push({
          intervention: r.intervention + '(' + r.assessment_period + ')',
          intervention_id: r.assessment
        })
      })

      if (intervention_ids?.length > 0) {
        let ids = intervention_ids.map(id => +id)
        formattedResults = formattedResults.filter(r => ids.includes(r.assessment))
      }
  
      interventions_to_filter = this.getDistinctObjects(interventions_to_filter, 'intervention_id')
      let paginated_data = await this.paginateArray(formattedResults, options)
      return {
        interventions: interventions_to_filter,
        assessments: paginated_data
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  getDistinctObjects(array, property) {
    const uniqueMap = new Map();

    return array.filter(obj => {
      const propertyValue = obj[property];
      return uniqueMap.has(propertyValue) ? false : uniqueMap.set(propertyValue, true);
    });
  };

  async paginateArray<T>(data: T[], options: IPaginationOptions): Promise<Pagination<T>> {
    const { page, limit } = options;
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);

    const paginatedData = data.slice(startIndex, endIndex);
    const totalItems = data.length;
    const itemsPerPage = Number(limit);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Number(page);

    const pagination: Pagination<T> = {
      items: paginatedData,
      meta: {
        totalItems,
        itemCount: paginatedData.length,
        itemsPerPage,
        totalPages,
        currentPage,
      },
    };

    return pagination;
  }

  async getSDGFrequency() {
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';

    let data = this.repo.createQueryBuilder('assessmentQuestion')
      .innerJoin('assessment', 'assessment', 'assessment.id = assessmentQuestion.assessmentId')
      .innerJoin('assessment.user', 'user')
      .innerJoin('user.country', 'cntry')
      .where('assessmentQuestion.selectedSdg IS NOT NULL')
      .select('assessmentQuestion.selectedSdg as sdg')
      .addSelect('COUNT(DISTINCT assessment.id) as count')
      .addGroupBy('assessmentQuestion.selectedSdg');

    if (isUserExternal) {
      data.andWhere('user.id = :userId', { userId: currentUser.id });
    } else {
      data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id });
    }

    let res = await data.execute();
    let sdgs = this.masterDataService.SDGs;

    res.map(o => {
      o.sdg = sdgs.find(s => s.code === o.sdg).name;
      return o;
    });

    return res;
  }

  async getSelectedSDGs(assessmnetId: number) {
    return await this.sdgAssessmentRepo.createQueryBuilder('sdg')
      .innerJoin(
        'sdg.assessment',
        'assessment',
        'sdg.assessmentId = assessment.id'
      )
      .innerJoinAndSelect(
        'sdg.sdg',
        'portfolioSdg',
        'portfolioSdg.id = sdg.sdgId'
      )
      .where('assessment.id = :id', { id: assessmnetId })
      .getMany()
  }

  async getAssessmentQuestionsByAssessmentId(assessmentId: number) {
    let data = this.repo.createQueryBuilder('assessmentQuestion')
    .leftJoinAndSelect(
      'assessmentQuestion.assessment',
      'assessment',
      'assessment.id = assessmentQuestion.assessmentId'
    )
    .leftJoinAndSelect(
      'assessmentQuestion.question',
      'question',
      'question.id = assessmentQuestion.questionId'
    )
    .leftJoinAndSelect(
      'assessmentQuestion.characteristic',
      'characteristic',
      'characteristic.id = assessmentQuestion.characteristicId'
    )
    .leftJoinAndSelect(
      'assessmentQuestion.selectedSdg',
      'selectedSdg',
      'selectedSdg.id = assessmentQuestion.selectedSdgId'
    )
    .leftJoinAndMapMany(
      'assessmentQuestion.assessmentAnswers',
      CMAssessmentAnswer,
      'assessmnetAnswer',
      'assessmnetAnswer.assessmentQuestionId = assessmentQuestion.id'
    )
    .leftJoinAndSelect(
      'assessmnetAnswer.answer',
      'answer',
      'answer.id = assessmnetAnswer.answerId'
    )
    .where('assessment.id = :id', {id: assessmentId})

    return await data.getMany();
  }
  async getDocumentListForReport(assessmentId:number):Promise<CMAssessmentQuestion[]>{
    let result =  await this.assessmentQuestionRepo
    .createQueryBuilder('aq')
    .innerJoin(
      'aq.assessment',
      'assessment',
      'assessment.id = aq.assessmentId'
    )
    .leftJoinAndSelect(
      'aq.characteristic',
      'characteristic',
      'characteristic.id = aq.characteristicId'
    )
    .leftJoinAndSelect(
      'characteristic.category',
      'category',
      'category.id = characteristic.category_id'
    )
    .leftJoinAndMapMany(
      'aq.assessmentAnswers',
      CMAssessmentAnswer,
      'assessmentAnswers',
      'assessmentAnswers.assessmentQuestionId = aq.id'
    )
    .where('assessment.id = :id and aq.uploadedDocumentPath is not null ', { id: assessmentId })
    .getMany()
    return result;
  }

  async getCMDefaultValues(characteristic_id: number) {
    try {
      return await this.cmDefaultValueRepo.createQueryBuilder('default_value')
        .innerJoin(
          'default_value.characteristic',
          'characteristic',
          'characteristic.id = default_value.characteristicId'
        )
        .where('characteristic.id = :id', { id: characteristic_id })
        .getMany()
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async deleteCMAssessment(assessementId: number) {
    try {
      await this.assessmentCMDetailService.deleteCmAssessmentDetail(assessementId);
      let assessmentQuestions = await this.repo.createQueryBuilder('cmAssessmentQuestion')
        .innerJoin(
          'cmAssessmentQuestion.assessment',
          'assessment',
          'assessment.id = cmAssessmentQuestion.assessmentId'
        )
        .select(['cmAssessmentQuestion.id'])
        .where('assessment.id = :assessmentId', {assessmentId: assessementId})
        .getMany()
      
      if (assessmentQuestions && assessmentQuestions.length > 0) {
        let assessmentQuestionIds = assessmentQuestions.map(q => q.id)
        await this.cMAssessmentAnswerService.deleteAssessmentAnswers(assessmentQuestionIds)

        for await (let id of assessmentQuestionIds) {
          await this.repo.delete({id: id})
        }
      } else {
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }

}
export class CharacteristicData {
  characteristic: string;
  relevance: string;
  ch_weight: number;
  score: number;
}

export class QuestionData {
  question: string = '-';
  weight: string = '-';
  score: string = '-';
  justification ='-';
  label:string='';
  document:string='';
}

export class CharacteristicProcessData {
  name: string;
  code: string;
  relevance: number;
  weight: number;
  score: number;
  ch_score: number;
  questions: QuestionData[];
  raw_questions: QuestionData[];
}

export class OutcomeResult {
  characteristic: string;
  ch_code: string;
  question: string;
  score: string;
  justification: string;
  document: string;
  category: Category;
  SDG: string;
  outcome_score: string;
  weight: number;
  starting_situation: string;
  expected_impact: string;
  SDG_indicator: string;
  adaptation: string;

}


