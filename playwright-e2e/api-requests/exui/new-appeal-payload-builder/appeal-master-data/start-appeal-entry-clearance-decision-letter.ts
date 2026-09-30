interface StartAppealEntryClearanceDecisionLetterData {
  dateEntryClearanceDecision: string;
}

export class StartAppealEntryClearanceDecisionLetter {
  public async decisionLetterDate(options: { day: number; month: number; year: number }): Promise<StartAppealEntryClearanceDecisionLetterData> {
    return {
      dateEntryClearanceDecision: `${options.year}-${options.month.toString().padStart(2, '0')}-${options.day.toString().padStart(2, '0')}`,
    };
  }
}
