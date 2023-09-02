import {RecentActivityDto} from '../shared/dtos/recent-activity-dto';

export class RecentActivityDtoMockProvider {

  getRecentActivityDTOs(): RecentActivityDto[] {
    return [
      new RecentActivityDto("activity1", "date1", "startTime1", "endTime1", "user1"),
      new RecentActivityDto("activity2", "date2", "startTime2", "endTime2", "user2"),
      new RecentActivityDto("activity3", "date3", "startTime3", "endTime3", "user3"),
      new RecentActivityDto("activity4", "date4", "startTime4", "endTime4", "user4"),
    ]
  }

}


