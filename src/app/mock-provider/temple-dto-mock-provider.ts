import {TemplateDto} from '../shared/dtos/template-dto';

export class TempleDtoMockProvider {

  getTemplateDTOs(): TemplateDto[] {
    return [
      new TemplateDto("title1", "date1", "name1", "duration1"),
      new TemplateDto("title2", "date2", "name2", "duration2"),
      new TemplateDto("title3", "date3", "name3", "duration3"),
      new TemplateDto("title4", "date4", "name4", "duration4"),
      new TemplateDto("title5", "date5", "name5", "duration5"),
    ]


  }


}
