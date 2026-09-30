interface StartAppealHelpWithFeesData {
  helpWithFeesReferenceNumber: string;
}

export class StartAppealHelpWithFees {
  public async helpWithFeesReferenceNumber(referenceNumber: string): Promise<StartAppealHelpWithFeesData> {
    return {
      helpWithFeesReferenceNumber: referenceNumber,
    };
  }
}
