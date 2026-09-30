interface StartAppealAppealGroundsEuRefusalData {
  appealGroundsEuRefusal: {
    values: ['appealGroundsEuRefusal'];
  };
}

export class StartAppealAppealGroundsEuRefusal {
  public async appealGroundsDecisionEuRefusal(): Promise<StartAppealAppealGroundsEuRefusalData> {
    return {
      appealGroundsEuRefusal: {
        values: ['appealGroundsEuRefusal'],
      },
    };
  }
}
