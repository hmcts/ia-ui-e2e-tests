type StartAppealDepartureDateData = {
  dateClientLeaveUk: string;
};

export class StartAppealDepartureDate {
  public async departureDate(options: { day: number; month: number; year: number }): Promise<StartAppealDepartureDateData> {
    return {
      dateClientLeaveUk: `${options.year}-${options.month.toString().padStart(2, '0')}-${options.day.toString().padStart(2, '0')}`,
    };
  }
}
