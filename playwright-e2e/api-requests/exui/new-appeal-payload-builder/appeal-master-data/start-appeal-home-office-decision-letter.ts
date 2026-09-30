interface StartAppealHomeOfficeDecisionLetterData {
  decisionLetterReceivedDate: string;
  homeOfficeDecisionDate: string;
}

export class StartAppealHomeOfficeDecisionLetter {
  public async homeOfficeDecisionDate(options: { day: number; month: number; year: number }): Promise<StartAppealHomeOfficeDecisionLetterData> {
    return {
      decisionLetterReceivedDate: `${options.year}-${options.month.toString().padStart(2, '0')}-${options.day.toString().padStart(2, '0')}`,
      homeOfficeDecisionDate: `${options.year}-${options.month.toString().padStart(2, '0')}-${options.day.toString().padStart(2, '0')}`,
    };
  }
}
