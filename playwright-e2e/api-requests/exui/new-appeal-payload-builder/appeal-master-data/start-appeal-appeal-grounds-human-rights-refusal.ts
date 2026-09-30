interface StartAppealAppealGroundsHumanRightsRefusalData {
  appealGroundsDecisionHumanRightsRefusal: {
    values: ['humanRightsRefusal'];
  };
}

export class StartAppealAppealGroundsHumanRightsRefusal {
  public async appealGroundsDecisionHumanRightsRefusal(): Promise<StartAppealAppealGroundsHumanRightsRefusalData> {
    return {
      appealGroundsDecisionHumanRightsRefusal: {
        values: ['humanRightsRefusal'],
      },
    };
  }
}
