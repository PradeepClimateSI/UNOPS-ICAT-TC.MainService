import { Injectable } from '@nestjs/common';
import {
  ComparisonReportReportContentFour,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentThree,
  ComparisonReportReportContentTwo,
  ComparisonReportReportTableOfContent,
  ReportContentOne,
  ReportContentTwo,
  ReportCoverPage,
  ReportTableOfContent,
} from 'src/report/dto/report.dto';

@Injectable()
export class ReportPagesService {
  constructor() {}

  coverPage(coverPage: ReportCoverPage): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
   <div class="row ">
       <div class="col h2 d-flex justify-content-center">
         ${coverPage.generateReportName}
       </div>
   </div>
   <div class="row ">
   <div class="col h4 d-flex justify-content-center">
      
   </div>
</div>
<div class="row ">
<div class="col h4 d-flex justify-content-center">
  
</div>
</div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Report Date:${coverPage.reportDate}
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="height: 100px;margin-top: 200px;margin-bottom: 0px;" >
       <img  style="padding: 0px;" src="${coverPage.companyLogoLink}" > 
 </div>
    </div>`;

    return cover;
  }

  tableOfContent(
    header: string,
    footer: string,
    tableOfContent: ReportTableOfContent,
  ): string {
    let pageNumber = 1;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information ....................................................................................................................................................................</div><div ><bdi>.............2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the policy or action .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2	Understanding the transformational vision of the intervention and its context ..................................................................................................................</div><div ><bdi>.............3</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3	Assessment information ........................................................................................................................................................................</div><div ><bdi>.............4</bdi></div> </div>
  

    <div class="table-of-content-header-item"><div >2. Impact Assessment .................................................................................................................................................................</div><div ><bdi>.....5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Process characteristics assessment  ................................................................................................................................</div><div ><bdi>.................5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes characteristics assessment ....................................................................................................................................................</div><div ><bdi>.....6</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.3	Process categories assessment ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.4	Outcomes categories assessment  ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
  </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }

  contentOne(
    header: string,
    footer: string,
    contentOne: ReportContentOne,
  ): string {
    let pageNumber = 2;
    const policyOrActionsDetails = contentOne.policyOrActionsDetails;

    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1 Single Intervention Information</div>
 
 <div  class="main_header_sub text-start">1.1 Describe the policy or action </div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${policyOrActionsDetails
            .map(
              (a: { information: string; description: string }) =>
                '<tr><td>' +
                a.information +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const understanPolicyOrActions = contentOne.understanPolicyOrActions;
    const barriers = contentOne.barriers;
    const page_2 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   <div  class="main_header_sub text-start">1.2	Understanding the transformational vision of the intervention and its context  </div> 
      
      <div class="report-table-sm">
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Time periods</th>
              <th scope="col">Description of the vision for desired societal, environmental and technical changes</th>
              
            </tr>
          </thead>
          <tbody class="table-active">
          ${understanPolicyOrActions
            .map(
              (a: { Time_periods: string; description: string }) =>
                '<tr><td>' +
                a.Time_periods +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>
        <div class="report-table-sm">
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Barriers</th>
              <th scope="col">Explanation</th>
              <th scope="col">Characteristics affected</th>
              <th scope="col">Barrier directly targeted by the policy or action</th>
            </tr>
          </thead>
          <tbody class="table-active">
          ${barriers
            .map(
              (a: {
                barrier: string;
                explanation: string;
                characteristics_affected: string;
                barrier_directly_targeted: string;
              }) =>
                '<tr><td>' +
                a.barrier +
                '</td><td>' +
                a.explanation +
                '</td><td>' +
                a.characteristics_affected +
                '</td><td>' +
                a.barrier_directly_targeted +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

  
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_3 = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">

  <div  class="main_header_sub text-start">1.3	Assessment information</div> 

  <div class="report-table-sm">
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Information</th>
        <th scope="col">Description </th>
      
      </tr>
    </thead>
    <tbody class="table-active">
    <tr><td>
    Assesment type
    </td><td> 
    ${contentOne.assessmetType ? contentOne.assessmetType : 'N/A'}
    </td></tr>
    <tr><td>
    Geographical area covered
    </td><td> 
    ${contentOne.geograpycalCover ? contentOne.geograpycalCover : 'N/A'}
    </td></tr>
    <tr><td>
    Sectors covered 
    </td><td> 
    ${contentOne.sectorCoverd ? contentOne.sectorCoverd : 'N/A'}
    </td></tr>
    <tr><td>
    Opportunities for stakeholders to participate in the assessment
    </td><td> 
    ${contentOne.opportunities ? contentOne.opportunities : 'N/A'}
    </td></tr>
    <tr><td>
    Principles on which the assessment is based
    </td><td> 
    ${contentOne.principles ? contentOne.principles : 'N/A'}
    </td></tr>
    
    </tbody>
  </table>
</div>




  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    const catagory_out = contentOne.outcomecharacteristics;

    const page_4 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
  
   <div  class="main_header_sub text-start">1.4	Choosing transformational change characteristics to assess </div> 
   <blockquote class=" paragraph blockquote text-start ">
             <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
               took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
               </p>
           </blockquote>

           <div class="report-table-sm">
<figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
<table class="table  table-bordered border-dark">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Outcome Characteristic</th>
      <th scope="col">Description - specific to a policy or action </th>
      <th scope="col">Relevant/ Possibly relevant/ Not relevant</th>
    </tr>
  </thead>
  <tbody class="table-active">
  ${catagory_out
    .map((a: { rows: number; name: string; characteristics: any[] }) =>
      a.characteristics
        .map((b, index) => {
          if (!index) {
            return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.comment ? b.comment : '-'}</td>
      <td>${b.relevance ? b.relevance : '-'}</td>
     </tr>`;
          } else {
            return `<tr>
            <td>${b.name ? b.name : '-'}</td>
            <td>${b.comment ? b.comment : '-'}</td>
            <td>${b.relevance ? b.relevance : '-'}</td>
            </tr>`;
          }
        })
        .join(''),
    )
    .join('')}
  

  </tbody>
</table>
</div>
    </div>
    
    ${footer.replace('#pageNumber#', pageNumber.toString())}
    
     </div>`;

    const catagory_process = contentOne.prossescharacteristics;
    const page_5 = `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
   
   
    <blockquote class=" paragraph blockquote text-start ">
              <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
               Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                </p>
            </blockquote>
 
            <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Process Characteristic</th>
       <th scope="col">Description - specific to a policy or action </th>
       <th scope="col">Relevant/ Possibly relevant/ Not relevant</th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${catagory_process
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.comment ? b.comment : '-'}</td>
       <td>${b.relevance ? b.relevance : '-'}</td>
      </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.comment ? b.comment : '-'}</td>
             <td>${b.relevance ? b.relevance : '-'}</td>
             </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
   
 
   </tbody>
 </table>
 </div>
     </div>
     
     ${footer.replace('#pageNumber#', pageNumber.toString())}
     
      </div>`;
    return page_1 + page_2 + page_3;
  }

  contentTwo(
    header: string,
    footer: string,
    contentTwo: ReportContentTwo,
  ): string {
    let pageNumber = 5;
    const prossesAssesmentStartingSituation =
      contentTwo.prossesAssesmentStartingSituation;

    const page_1 = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">2.	IMPACT ASSESSMENT</div>
  <div  class="main_header_sub text-start">2.1	Process characteristics assessment   </div> 



<div class="report-table-sm">
<figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
<table class="table  table-bordered border-dark">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Process Characteristic</th>
      <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
      <th scope="col">Likelihood score  </th>
      <th scope="col">Rationale justifying the score  </th>
      <th scope="col">Supporting Documents Supplied </th>
    </tr>
  </thead>
  <tbody class="table-active">
  ${prossesAssesmentStartingSituation
    .map((a: { rows: number; name: string; characteristics: any[] }) =>
      a.characteristics
        .map((b, index) => {
          if (!index) {
            return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.likelihoodscore ? b.likelihoodscore : '-'}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${
        b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
      }</td>
    
     </tr>`;
          } else {
            return `<tr>
            <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.likelihoodscore ? b.likelihoodscore : '-'}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${
        b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
      }</td>
            </tr>`;
          }
        })
        .join(''),
    )
    .join('')}
  

  </tbody>


  </tbody>
</table>
</div>



  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    const scale_ghg = contentTwo.scale_ghg;
    const sustained_ghg = contentTwo.sustained_ghg;
    const page_2 = `  <div id="page_5" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header_sub text-start">2.2	Outcomes characteristics assessment  </div> 
    

 
 
 <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome Characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${scale_ghg
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
      
    
     </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
             <td>${b.score ? b.score : '-'}</td>
             <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
 
 
   </tbody>
 </table>
 </div>
 <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome Characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${sustained_ghg
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
      
    
     </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
             <td>${b.score ? b.score : '-'}</td>
             <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
 
 
   </tbody>
 </table>
 </div>
 
 
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const scale_adaptation = contentTwo.scale_adaptation;
    const sustained_adaptation = contentTwo.sustained_adaptation;

    const page_3 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
 
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="table-active">
    ${scale_adaptation
      .map((a: { rows: number; name: string; characteristics: any[] }) =>
        a.characteristics
          .map((b, index) => {
            if (!index) {
              return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
       <td>${b.score ? b.score : '-'}</td>
       <td>${b.ustifying ? b.ustifying : '-'}</td>
       
     
      </tr>`;
            } else {
              return `<tr>
              <td>${b.name ? b.name : '-'}</td>
              <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
              <td>${b.score ? b.score : '-'}</td>
              <td>${b.ustifying ? b.ustifying : '-'}</td>
             </tr>`;
            }
          })
          .join(''),
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="table-active">
    ${sustained_adaptation
      .map((a: { rows: number; name: string; characteristics: any[] }) =>
        a.characteristics
          .map((b, index) => {
            if (!index) {
              return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
       <td>${b.score ? b.score : '-'}</td>
       <td>${b.ustifying ? b.ustifying : '-'}</td>
       
     
      </tr>`;
            } else {
              return `<tr>
              <td>${b.name ? b.name : '-'}</td>
              <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
              <td>${b.score ? b.score : '-'}</td>
              <td>${b.ustifying ? b.ustifying : '-'}</td>
             </tr>`;
            }
          })
          .join(''),
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    const scale_sd = contentTwo.scale_sd;

    const page_4 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
   
  
  
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Sustainable Development Goal</th>
      <th scope="col">Could the intervention have an impact on this particular SDG?</th>
      <th scope="col">Outcome Characteristic</th>
      <th scope="col">Is the characteristic within the assessment boundaries?</th>
      <th scope="col">Score  </th>
      <th scope="col">Rationale justifying the score</th>
      </tr>
    </thead>
    <tbody class="table-active">
    
    ${scale_sd.sdg
      .map(
        (
          a: {
            rows: number;
            name: string;
            impact: string;
            characteristics: any[];
          },
          index,
        ) => {
          if (!index) {
            return a.characteristics
              .map((b, index) => {
                if (!index) {
                  return `<tr>
      <td rowspan="${scale_sd.rows}" >${scale_sd.name}</td>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td rowspan="${a.rows}" >${a.impact}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
    
     </tr>`;
                } else {
                  return `<tr>
            <td>${b.name ? b.name : '-'}</td>
    <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
    <td>${b.score ? b.score : '-'}</td>
    <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
                }
              })
              .join('');
          } else {
            return a.characteristics
              .map((b, index) => {
                if (!index) {
                  return `<tr>
<td rowspan="${a.rows}" >${a.name}</td>
<td rowspan="${a.rows}" >${a.impact}</td>
<td>${b.name ? b.name : '-'}</td>
<td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
<td>${b.score ? b.score : '-'}</td>
<td>${b.ustifying ? b.ustifying : '-'}</td>

</tr>`;
                } else {
                  return `<tr>
   <td>${b.name ? b.name : '-'}</td>
<td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
<td>${b.score ? b.score : '-'}</td>
<td>${b.ustifying ? b.ustifying : '-'}</td>
   </tr>`;
                }
              })
              .join('');
          }
        },
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    const sustained_sd = contentTwo.sustained_sd;

    const page_5 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
   
  
   
  
  
    <div class="report-table-sm">
    <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
        <th scope="col">Category</th>
        <th scope="col">Sustainable Development Goal</th>
        <th scope="col">Could the intervention have an impact on this particular SDG?</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?</th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score</th>
        </tr>
      </thead>
      <tbody class="table-active">
      
      ${sustained_sd.sdg
        .map(
          (
            a: {
              rows: number;
              name: string;
              impact: string;
              characteristics: any[];
            },
            index,
          ) => {
            if (!index) {
              return a.characteristics
                .map((b, index) => {
                  if (!index) {
                    return `<tr>
        <td rowspan="${sustained_sd.rows}" >${sustained_sd.name}</td>
        <td rowspan="${a.rows}" >${a.name}</td>
        <td rowspan="${a.rows}" >${a.impact}</td>
        <td>${b.name ? b.name : '-'}</td>
        <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
        <td>${b.score ? b.score : '-'}</td>
        <td>${b.ustifying ? b.ustifying : '-'}</td>
      
       </tr>`;
                  } else {
                    return `<tr>
              <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
              </tr>`;
                  }
                })
                .join('');
            } else {
              return a.characteristics
                .map((b, index) => {
                  if (!index) {
                    return `<tr>
  <td rowspan="${a.rows}" >${a.name}</td>
  <td rowspan="${a.rows}" >${a.impact}</td>
  <td>${b.name ? b.name : '-'}</td>
  <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
  <td>${b.score ? b.score : '-'}</td>
  <td>${b.ustifying ? b.ustifying : '-'}</td>
  
  </tr>`;
                  } else {
                    return `<tr>
     <td>${b.name ? b.name : '-'}</td>
  <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
  <td>${b.score ? b.score : '-'}</td>
  <td>${b.ustifying ? b.ustifying : '-'}</td>
     </tr>`;
                  }
                })
                .join('');
            }
          },
        )
        .join('')}
    
    
      </tbody>
    </table>
    </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    let process_categories_assessment =
      contentTwo.process_categories_assessment;
    let outcomes_categories_assessment =
      contentTwo.outcomes_categories_assessment;

    const page_6 = `  <div id="page_5" class="page text-center" >
     ${header}
     <div class="content">
     <div  class="main_header_sub text-start">2.3	 Process categories assessment   </div> 
   
   
   <div class="report-table-sm">
   <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Category	Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${process_categories_assessment
       .map((a: { category: any; category_score: any }) => {
         return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${
             a.category_score.value != null &&
             a.category_score.value != undefined
               ? a.category_score.value
               : '-'
           }</td>
             
              </tr>`;
       })
       .join('')}
    
   
     </tbody>
   </table>
   </div>
  
   <div  class="main_header_sub text-start">2.4	Outcomes categories assessment </div> 

   <div class="report-table-sm">
   <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Category	Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${outcomes_categories_assessment
       .map((a: { category: any; category_score: any }) => {
         return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${
             a.category_score.value != null &&
             a.category_score.value != undefined
               ? a.category_score.value
               : '-'
           }</td>
             
              </tr>`;
       })
       .join('')}
    
   
     </tbody>
   </table>
   </div>
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;

    const outcomeDescribeResult = contentTwo.outcomeDescribeResult;
    const page_7 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
    
      <blockquote class=" paragraph blockquote text-start ">
      <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
       Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
        </p>
    </blockquote>
    
    
    <div class="report-table-sm">
    <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Score</th>
      <th scope="col">Rationale for scoring </th>
      
      
    </tr>
  </thead>
  <tbody class="table-active">
  ${outcomeDescribeResult
    .map(
      (a: {
        relative_importance: any;
        score: any;
        justifying_score: any;
        name: string;
      }) => {
        return `<tr>
            <td>${a.name ? a.name : '-'}</td>
            <td>${a.score ? a.score : '-'}</td>
           <td>${a.justifying_score ? a.justifying_score : '-'}</td>
          
            </tr>`;
      },
    )
    .join('')}
 
    
      </tbody>
    </table>
    </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

    const page_8 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">2.3	Ex-post assessment </div> 
       <blockquote class=" paragraph blockquote text-start ">
       <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
         took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
         </p>
     </blockquote>
     
     
     <div class="report-table-sm">
     <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Process Characteristic</th>
           <th scope="col">Score</th>
           <th scope="col">Rationale justifying the score </th>
           <th scope="col">Indicator value at starting situation</th>
           <th scope="col">Indicator value observed </th>
         </tr>
       </thead>
       <tbody class="table-active">
        <tr>
         <td rowspan="3" >Technology</td>
         <td>Research and development</td>
         <td>test value</td>
         <td>test value</td>
         <td>test value</td>
         <td>test value</td>
         
        
         
       </tr>
       <tr>
       <td>Adoption</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
        <tr>
       <td>Scale up</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
     
     
       <tr>
     
       <td rowspan="3" >Agents  </td>
       <td>Entrepreneurs</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
      </tr>
     <tr>
     <td>Coalition of advocates </td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
      <tr>
     <td>Beneficiaries</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Incentives </td>
     <td>Economic and non-economic incentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Disincentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Institutions and regulations</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Norms </td>
     <td>Awareness</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Behavior</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Social norms</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     
     
       </tbody>
     </table>
     </div>
    
     
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    const page_9 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
      
     
       <blockquote class=" paragraph blockquote text-start ">
       <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
         took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
         </p>
     </blockquote>
     
     
     <div class="report-table-sm">
     <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Outcome Characteristic</th>
           <th scope="col">Score</th>
           <th scope="col">Rationale justifying the score </th>
           <th scope="col">Indicator value at starting situation </th>
           <th scope="col">Indicator value observed </th>
         </tr>
       </thead>
       <tbody class="table-active">
        <tr>
         <td rowspan="3" >Scale of outcome - GHGs </td>
         <td>Macro level</td>
         <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
        
         
       </tr>
       <tr>
       <td>Adoption</td>
       <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
       </tr>
        <tr>
       <td>Scale up</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
     
     
       <tr>
     
       <td rowspan="3" >Agents  </td>
       <td>Entrepreneurs</td>
       <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
      </tr>
     <tr>
     <td>Coalition of advocates </td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
      <tr>
     <td>Beneficiaries</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Incentives </td>
     <td>Economic and non-economic incentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Disincentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Institutions and regulations</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Norms </td>
     <td>Awareness</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Behavior</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Social norms</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     
     
       </tbody>
     </table>
     </div>
    
     
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    const page_10 = `  <div id="page_5" class="page text-center" >
        ${header}
        <div class="content">
       
      
        <blockquote class=" paragraph blockquote text-start ">
        <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
          took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
          </p>
      </blockquote>
      
      
      <div class="report-table-sm">
      <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Score</th>
            <th scope="col">Rationale for scoring </th>
            <th scope="col">Relative importance of category including rationale</th>
            
          </tr>
        </thead>
        <tbody class="table-active">
         <tr>
          <td   >Technology</td>
      <td>test value</td>
      <td>test value</td>
      <td>test value</td> 
        </tr>
        <tr>
        <td   >Agents</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td> 
      </tr>
      <tr>
      <td   >Incentives</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td> 
    </tr>
    <tr>
    <td   >Norms </td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td> 
   </tr>
       
      
        </tbody>
      </table>
      </div>
     
      
      
        </div>
        
        ${footer.replace('#pageNumber#', (pageNumber++).toString())}
        
         </div>`;

    const page_11 = `  <div id="page_5" class="page text-center" >
         ${header}
         <div class="content">
        
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>
       
       
       <div class="report-table-sm">
       <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
         <tr>
         <th scope="col">Category</th>
         <th scope="col">Score</th>
         <th scope="col">Rationale for scoring </th>
         
         
       </tr>
     </thead>
     <tbody class="table-active">
      <tr>
       <td   >Scale of outcome-GHGs</td>
   <td>test value</td>
   <td>test value</td>
    
     </tr>
     <tr>
     <td   >Scale of outcome – sustainable development</td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
   <tr>
   <td   >Outcome sustained over time – GHGs</td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
   <tr>
   <td   >Outcome sustainable over time – sustainable development </td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
    
       
         </tbody>
       </table>
       </div>
      
       
       
         </div>
         
         ${footer.replace('#pageNumber#', (pageNumber++).toString())}
         
          </div>`;

    const page_12 = `  <div id="page_5" class="page text-center" >
         ${header}
         <div class="content">
         <div  class="main_header_sub text-start">2.4	Monitoring (Part IV)</div> 
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>
       
       
       <div class="report-table-sm">
       <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
         <tr>
         <th scope="col">Indicator</th>
         <th scope="col">Type of data (quantitative/ qualitative)</th>
         <th scope="col">Monitoring frequency and date of collection</th>
         <th scope="col">Data source/ collection method </th>
         <th scope="col">Responsible entity </th>
         <th scope="col">Observed data (unit)</th>
         
         
       </tr>
     </thead>
     <tbody class="table-active">
      <tr>
      <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
    
     </tr>
     <tr>
     <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
   
    </tr>
    <tr>
    <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
  
   </tr>
   <tr>
   <td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
 
  </tr>
    
    
       
         </tbody>
       </table>
       </div>
      
       <div  class="main_header_sub text-start">2.5	Decision making and using results (Part V) </div> 
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>  
       
         </div>
         
         ${footer.replace('#pageNumber#', (pageNumber++).toString())}
         
          </div>`;

    return (
      page_1 + page_2 + page_3 + page_4 + page_5 + page_6
      // page_7 +
      // page_8 +
      // page_9 +
      // page_10 +
      // page_11
    );
  }

  comparisonCoverPage(coverPage: ReportCoverPage): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
   <div class="row ">
       <div class="col h2 d-flex justify-content-center">
         ${coverPage.generateReportName}
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Logo
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Document Prepared By ${coverPage.document_prepared_by}
       </div>
   </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Contact Information 
     </div>
 </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Report Date:${coverPage.reportDate}
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="height: 100px;margin-top: 200px;margin-bottom: 0px;" >
       <img  style="padding: 0px;" src="${coverPage.companyLogoLink}" > 
 </div>
    </div>`;

    return cover;
  }

  comparisonTableOfContent(
    header: string,
    footer: string,
    tableOfContent: ComparisonReportReportTableOfContent,
  ): string {
    let pageNumber = 5;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Portfolio of Interventions Information ....................................................................................................................................................................</div><div ><bdi>.............10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the portfolio ................................................................................................................................</div><div ><bdi>.................11</bdi></div> </div>
  
    <div class="table-of-content-header-item"><div >2. Impact Assessment .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Processes impacts comparison  ................................................................................................................................</div><div ><bdi>.................13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes impacts comparison ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-header-item"><div >3. Aggregation .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-header-item"><div >4. SDG Alignment .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>

   
    </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }

  comparisonContentOne(
    header: string,
    footer: string,
    contentOne: ComparisonReportReportContentOne,
  ): string {
    let pageNumber = 2;
    const portfolio_details = contentOne.portfolio_details;
    const intervation_details = contentOne.intervation_details;

    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1.	PORTFOLIO OF INTERVENTIONS INFORMATION </div>
 
 <div  class="main_header_sub text-start">1.1	Describe the portfolio </div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${portfolio_details
            .map(
              (a: { information: string; description: string }) =>
                '<tr><td>' +
                a.information +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Intervention ID</th>
              <th scope="col">Intervention name</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${intervation_details
            .map(
              (a: { id: string; name: string }) =>
                '<tr><td>' + a.id + '</td><td>' + a.name + '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    return page_1;
  }
  comparisonContentTwo(
    header: string,
    footer: string,
    content: ComparisonReportReportContentTwo,
  ): string {
    let pageNumber = 2;
    const prosses_tech = content.prosses_tech;
    const prosses_agent = content.prosses_agent;
    const prosses_incentive = content.prosses_incentive;
    const prosses_norms = content.prosses_norms;
    const process_score = content.process_score;
    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">2.	IMPACTS COMPARISON </div>
 
 <div  class="main_header_sub text-start">2.1	Processes impacts comparison</div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
          <th colspan="4" scope="col">TECHNOLOGY</th>
          
        </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              <th scope="col">research and development</th>
              <th scope="col">adoption</th>
              <th scope="col">scale up</th>
              <th scope="col">category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${prosses_tech
            .map(
              (a: { id:number,name:string,type:string,status:string,randd:string,adoptation:string,scaleup:string,score:string}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                '</td><td>' +
                a.randd +
                '</td><td>' +
                a.adoptation +
                '</td><td>' +
                a.scaleup +
                '</td><td>' +
                a.score +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm">
       
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">AGENTS</th>
        
      </tr>
          <tr>
            <th scope="col">id</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            <th scope="col">entrepreneurs</th>
            <th scope="col">coalition of advocates</th>
            <th scope="col">beneficiaries</th>
            <th scope="col">category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${prosses_agent
          .map(
            (a: { id:number,name:string,type:string,status:string,entrepreneurs:string,coalition :string,beneficiaries:string,score:string}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              '</td><td>' +
              a.entrepreneurs +
              '</td><td>' +
              a.coalition +
              '</td><td>' +
              a.beneficiaries +
              '</td><td>' +
              a.score +
              '</td></tr>',
          )
          .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const page_2 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    
         <div class="report-table-sm">
        
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
           <tr>
           <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
           <th colspan="4" scope="col">INCENTIVES</th>
           
         </tr>
             <tr>
               <th scope="col">id	</th>
               <th scope="col">intervention name	</th>
               <th scope="col">intervention type	</th>
               <th scope="col">status</th>
               <th scope="col">economic and non-economic</th>
               <th scope="col">disincentives</th>
               <th scope="col">institutional and regulatory	</th>
               <th scope="col">category score</th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${prosses_incentive
             .map(
               (a: { id:number,name:string,type:string,status:string,economic :string,disincentives:string,institutional :string,score:string}) =>
                 '<tr><td>' +
                 a.id +
                 '</td><td>' +
                 a.name +
                 '</td><td>' +
                 a.type +
                 '</td><td>' +
                 a.status +
                 '</td><td>' +
                 a.economic +
                 '</td><td>' +
                 a.disincentives +
                 '</td><td>' +
                 a.institutional +
                 '</td><td>' +
                 a.score +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
 
       <div class="report-table-sm">
        
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
         <tr>
         <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
         <th colspan="4" scope="col">CATEGORY - NORMS AND BEHAVIORAL CHANGE</th>
         
       </tr>
           <tr>
             <th scope="col">id	</th>
             <th scope="col">intervention name	</th>
             <th scope="col">intervention type	</th>
             <th scope="col">status</th>
             <th scope="col">awareness</th>
             <th scope="col">behavior</th>
             <th scope="col">social norms</th>
             <th scope="col">category score</th>
             
           </tr>
         </thead>
         <tbody class="table-active ">
         ${prosses_norms
           .map(
             (a: { id:number,name:string,type:string,status:string,awareness:string,behavior:string,norms:string,score:string}) =>
               '<tr><td>' +
               a.id +
               '</td><td>' +
               a.name +
               '</td><td>' +
               a.type +
               '</td><td>' +
               a.status +
               '</td><td>' +
               a.awareness +
               '</td><td>' +
               a.behavior +
               '</td><td>' +
               a.norms +
               '</td><td>' +
               a.score +
               '</td></tr>',
           )
           .join('')}
         </tbody>
       </table>
     </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;


     const page_3 = `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
     
          <div class="report-table-sm">
         
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
            <tr>
            <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
            <th colspan="4" scope="col">AGGREGATED CATERGORY SCORE</th>
            <th  scope="col">PROCESSES SCORE</th>
            
          </tr>
              <tr>
                <th scope="col">id	</th>
                <th scope="col">intervention name	</th>
                <th scope="col">intervention type	</th>
                <th scope="col">status</th>
                <th  scope="col">technology score</th>
                <th  scope="col">agents </th>
                <th  scope="col">incentives</th>
                <th  scope="col">norms and behavioral change</th>
                <th scope="col">all</th>
                
              </tr>
            </thead>
            <tbody class="table-active ">
            ${process_score
              .map(
                (a: { id:number,name:string,type:string,status:string,tech:string,agent:string,incentive:string,norms:string,prosess:string}) =>
                  '<tr><td>' +
                  a.id +
                  '</td><td>' +
                  a.name +
                  '</td><td>' +
                  a.type +
                  '</td><td>' +
                  a.status +
                  '</td><td>' +
                  a.tech +
                  '</td><td>' +
                  a.agent +
                  '</td><td>' +
                  a.incentive +
                  '</td><td>' +
                  a.norms +
                  '</td><td>' +
                  a.prosess +
                  '</td></tr>',
              )
              .join('')}
            </tbody>
          </table>
        </div>
  
   
     
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;



      const ghg_scale = content.ghg_scale;
      const ghg_sustaind = content.ghg_sustaind;
      const ghg_scale_sustaind_comparison = content.ghg_scale_sustaind_comparison;
      
      const allsdg = content.allsdg;
      const sdg_scale = content.sdg_scale;
      const sdg_sustaind = content.sdg_sustaind;
      const sdg_scale_sustaind_comparison = content.sdg_scale_sustaind_comparison;

      const adaptation_scale = content.adaptation_scale;
      const adaptation_sustaind = content.adaptation_sustaind;
      const adaptation_scale_sustaind_comparison = content.adaptation_scale_sustaind_comparison;

      const sacle_comparison = content.sacle_comparison;
      const sustaind_comparison = content.sustaind_comparison;
      const outcome_level = content.outcome_level;



      const page_4 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
 
 <div  class="main_header_sub text-start">2.2	Outcomes impacts comparison</div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">SCALE COMPARISON	</th>
          <th colspan="4" scope="col">OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              <th scope="col">international</th>
              <th scope="col">national/ sectorial	</th>
              <th scope="col">subnational/ subsectorial	 up</th>
              <th scope="col">category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${ghg_scale
            .map(
              (a: { id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                '</td><td>' +
                a.international +
                '</td><td>' +
                a.national +
                '</td><td>' +
                a.subnational +
                '</td><td>' +
                a.score +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm">
       
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">

        <tr>
        <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
        <tr>
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
          <tr>
            <th scope="col">id</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            <th scope="col">long term</th>
            <th scope="col">medium term</th>
            <th scope="col">short term</th>
            <th scope="col">category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${ghg_sustaind
          .map(
            (a: { id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              '</td><td>' +
              a.long +
              '</td><td>' +
              a.medium +
              '</td><td>' +
              a.short +
              '</td><td>' +
              a.score +
              '</td></tr>',
          )
          .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    
    const page_5 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
 
 
    

      <div class="report-table-sm">
       
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">SCALE COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">ADAPTATION</th>
      
    </tr>
          <tr>
            <th scope="col">id	</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            <th scope="col">international</th>
            <th scope="col">national/ sectorial	</th>
            <th scope="col">subnational/ subsectorial	 up</th>
            <th scope="col">category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${adaptation_scale
          .map(
            (a: { id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              '</td><td>' +
              a.international +
              '</td><td>' +
              a.national +
              '</td><td>' +
              a.subnational +
              '</td><td>' +
              a.score +
              '</td></tr>',
          )
          .join('')}
        </tbody>
      </table>
    </div>
    <div class="report-table-sm">
       
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">

      <tr>
      <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
      <th colspan="4" scope="col">OUTCOMES</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">ADAPTATION</th>
      
    </tr>
        <tr>
          <th scope="col">id</th>
          <th scope="col">intervention name	</th>
          <th scope="col">intervention type	</th>
          <th scope="col">status</th>
          <th scope="col">long term</th>
          <th scope="col">medium term</th>
          <th scope="col">short term</th>
          <th scope="col">category score</th>
          
        </tr>
      </thead>
      <tbody class="table-active ">
      ${adaptation_sustaind
        .map(
          (a: { id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}) =>
            '<tr><td>' +
            a.id +
            '</td><td>' +
            a.name +
            '</td><td>' +
            a.type +
            '</td><td>' +
            a.status +
            '</td><td>' +
            a.long +
            '</td><td>' +
            a.medium +
            '</td><td>' +
            a.short +
            '</td><td>' +
            a.score +
            '</td></tr>',
        )
        .join('')}
      </tbody>
    </table>
  </div>
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;


    const sdg_pages=allsdg.map(
      (a:{sdg_name:string,sdg_scale:object[],sdg_sustaind:object[],sdg_scale_sustaind_comparison:object[]})=>`  <div id="page_9" class="page text-center" >
      ${header}
      <div class="content">
      <div class="report-table-sm">
         
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">SCALE COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">SDG- ${a.sdg_name} </th>
      
    </tr>
          <tr>
            <th scope="col">id	</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            <th scope="col">international</th>
            <th scope="col">national/ sectorial	</th>
            <th scope="col">subnational/ subsectorial	 up</th>
            <th scope="col">category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${a.sdg_scale
          .map(
            (a: { id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              '</td><td>' +
              a.international +
              '</td><td>' +
              a.national +
              '</td><td>' +
              a.subnational +
              '</td><td>' +
              a.score +
              '</td></tr>',
          )
          .join('')}
        </tbody>
      </table>
    </div>
    
  
    <div class="report-table-sm">
         
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
  
      <tr>
      <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
      <th colspan="4" scope="col">OUTCOMES</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">SDG- ${a.sdg_name} </th>
      
    </tr>
        <tr>
          <th scope="col">id</th>
          <th scope="col">intervention name	</th>
          <th scope="col">intervention type	</th>
          <th scope="col">status</th>
          <th scope="col">long term</th>
          <th scope="col">medium term</th>
          <th scope="col">short term</th>
          <th scope="col">category score</th>
          
        </tr>
      </thead>
      <tbody class="table-active ">
      ${a.sdg_sustaind
        .map(
          (a: { id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}) =>
            '<tr><td>' +
            a.id +
            '</td><td>' +
            a.name +
            '</td><td>' +
            a.type +
            '</td><td>' +
            a.status +
            '</td><td>' +
            a.long +
            '</td><td>' +
            a.medium +
            '</td><td>' +
            a.short +
            '</td><td>' +
            a.score +
            '</td></tr>',
        )
        .join('')}
      </tbody>
    </table>
  </div>
   
  
    
      
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`
    ).join('');
 



    const page_7 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   <div class="report-table-sm">
       
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
     <tr>
     <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
     <th colspan="3" scope="col">GHG OUTCOMES</th>
     
   </tr>
   <tr>
   <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
   
   
 </tr>
       <tr>
         <th scope="col">id	</th>
         <th scope="col">intervention name	</th>
         <th scope="col">intervention type	</th>
         <th scope="col">status</th>
         <th scope="col">scale category score</th>
         <th scope="col">sustained category score		</th>
         <th scope="col">category score</th>
         
       </tr>
     </thead>
     <tbody class="table-active ">
     ${ghg_scale_sustaind_comparison
       .map(
         (a: { id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}) =>
           '<tr><td>' +
           a.id +
           '</td><td>' +
           a.name +
           '</td><td>' +
           a.type +
           '</td><td>' +
           a.status +
           '</td><td>' +
           a.scale +
           '</td><td>' +
           a.sustained +
           '</td><td>' +
           a.score +
           '</td></tr>',
       )
       .join('')}
     </tbody>
   </table>
 </div>

 <div class="report-table-sm">
       
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
   <tr>
   <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
   <th colspan="3" scope="col">ADAPTATION OUTCOMES</th>
   
 </tr>
 <tr>
 <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
 
 
</tr>
     <tr>
       <th scope="col">id	</th>
       <th scope="col">intervention name	</th>
       <th scope="col">intervention type	</th>
       <th scope="col">status</th>
       <th scope="col">scale category score</th>
       <th scope="col">sustained category score		</th>
       <th scope="col">category score</th>
       
     </tr>
   </thead>
   <tbody class="table-active ">
   ${adaptation_scale_sustaind_comparison
     .map(
       (a: { id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}) =>
         '<tr><td>' +
         a.id +
         '</td><td>' +
         a.name +
         '</td><td>' +
         a.type +
         '</td><td>' +
         a.status +
         '</td><td>' +
         a.scale +
         '</td><td>' +
         a.sustained +
         '</td><td>' +
         a.score +
         '</td></tr>',
     )
     .join('')}
   </tbody>
 </table>
</div>    

    
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_8 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    
  
 
  <div class="report-table-sm">
       
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
    <tr>
    <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
    <th colspan="3" scope="col">SDG OUTCOMES</th>
    
  </tr>
  <tr>
  <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
  
  
  </tr>
      <tr>
        <th scope="col">id	</th>
        <th scope="col">intervention name	</th>
        <th scope="col">intervention type	</th>
        <th scope="col">status</th>
        <th scope="col">scale category score</th>
        <th scope="col">sustained category score		</th>
        <th scope="col">category score</th>
        
      </tr>
    </thead>
    <tbody class="table-active ">
    ${sdg_scale_sustaind_comparison
      .map(
        (a: { id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}) =>
          '<tr><td>' +
          a.id +
          '</td><td>' +
          a.name +
          '</td><td>' +
          a.type +
          '</td><td>' +
          a.status +
          '</td><td>' +
          a.scale +
          '</td><td>' +
          a.sustained +
          '</td><td>' +
          a.score +
          '</td></tr>',
      )
      .join('')}
    </tbody>
  </table>
  </div>
 
    
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;




    const page_9 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
 

        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">SCALE COMPARISON	</th>
          <th colspan="4" scope="col"> OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              <th scope="col">ghg</th>
              <th scope="col">sdg </th>
              <th scope="col">adaptation </th>
              <th scope="col">category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${sacle_comparison
            .map(
              (a: { id:number,name:string,type:string,status:string,ghg:string,sdg :string,adaptation :string,score:string}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                '</td><td>' +
                a.ghg +
                '</td><td>' +
                a.sdg +
                '</td><td>' +
                a.adaptation +
                '</td><td>' +
                a.score +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm">
       
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">SUSTAINED  COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
      
      
    </tr>
          <tr>
            <th scope="col">id	</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            <th scope="col">ghg</th>
            <th scope="col">sdg </th>
            <th scope="col">adaptation </th>
            <th scope="col">category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${sustaind_comparison
          .map(
            (a: { id:number,name:string,type:string,status:string,ghg:string,sdg :string,adaptation :string,score:string}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              '</td><td>' +
              a.ghg +
              '</td><td>' +
              a.sdg +
              '</td><td>' +
              a.adaptation +
              '</td><td>' +
              a.score +
              '</td></tr>',
          )
          .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_10 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
 

        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">OUTCOME LEVEL COMPARISON	</th>
          <th colspan="4" scope="col"> OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              <th scope="col">scale </th>
              <th scope="col">sustained  </th>
             
              <th scope="col">category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${outcome_level
            .map(
              (a: { id:number,name:string,type:string,status:string,scale:string,sustained :string,score:string}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                '</td><td>' +
                a.scale +
                '</td><td>' +
                a.sustained +
                '</td><td>' +
                a.score +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>

     
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;


    return page_1 +page_2+page_3+page_4+page_5+sdg_pages+page_7+page_8+page_9+page_10;

    
  }
  comparisonContentThree(
    header: string,
    footer: string,
    content: ComparisonReportReportContentThree,
  ): string {
   const aggregation= content.aggregation
    let pageNumber = 2;


    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">3.	AGGREGATION </div>
 
 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="5" scope="col">AGGREGATION</th>
          
          
        </tr>
        <tr>
        <th colspan="5" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              
              <th scope="col">ghg mitigation (MT CO2-EG)</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${aggregation.data
            .map(
              (a: { id:number,name:string,type:string,status:string,mitigation :string}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                '</td><td>' +
                a.mitigation +
                '</td></tr>',
            )
            .join('')}
            <tr><td colspan="4" > Total
            </td><td> ${aggregation.total}
                </td></tr>
          </tbody>
        </table>
      </div>

      
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;


    return page_1;
  }
  comparisonContentFour(
    header: string,
    footer: string,
    content: ComparisonReportReportContentFour,
  ): string {


    const alignment_table= content.alignment_table
    const alignment_heat_map= content.alignment_heat_map
    let pageNumber = 2;


    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">3.	AGGREGATION </div>
 
 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">ALIGNMENT</th>
          
          
        </tr>
        <tr>
        <th colspan="5" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">id	</th>
              <th scope="col">intervention name	</th>
              <th scope="col">intervention type	</th>
              <th scope="col">status</th>
              
              ${alignment_table.sdg_names
                .map(
                  (a) =>
                    '<th scope="col">'+a+'</th>'
                )
                .join('')}
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${alignment_table.data
            .map(
              (a: { id:number,name:string,type:string,status:string,data :string[]}) =>
                '<tr><td>' +
                a.id +
                '</td><td>' +
                a.name +
                '</td><td>' +
                a.type +
                '</td><td>' +
                a.status +
                `</td> ${a.data
                  .map(
                    (a) =>
                      '<th scope="col">'+a+'</th>'
                  )
                  .join('')}</tr>`,
            )
            .join('')}
          
          </tbody>
        </table>
      </div>
      <div class="report-table-sm">
        
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">ALIGNMENT</th>
        
        
      </tr>
      <tr>
      <th colspan="5" scope="col">INTERVENTION INFORMATION</th>
      
      
    </tr>
          <tr>
            <th scope="col">id	</th>
            <th scope="col">intervention name	</th>
            <th scope="col">intervention type	</th>
            <th scope="col">status</th>
            
            ${alignment_heat_map.sdg_names
              .map(
                (a) =>
                  '<th scope="col">'+a+'</th>'
              )
              .join('')}
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${alignment_heat_map.data
          .map(
            (a: { id:number,name:string,type:string,status:string,data :string[]}) =>
              '<tr><td>' +
              a.id +
              '</td><td>' +
              a.name +
              '</td><td>' +
              a.type +
              '</td><td>' +
              a.status +
              `</td> ${a.data
                .map(
                  (a) =>
                    '<th scope="col">'+a+'</th>'
                )
                .join('')}</tr>`,
          )
          .join('')}
        
        </tbody>
      </table>
    </div>
      
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
   
    return page_1;
  }
}
