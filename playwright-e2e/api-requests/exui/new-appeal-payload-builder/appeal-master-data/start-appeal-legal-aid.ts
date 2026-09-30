interface StartAppealLegalAidData {
  legalAidAccountNumber: string;
}

export class StartAppealLegalAid {
  public async legalAid(options: { legalAidAccountNumber: number }): Promise<StartAppealLegalAidData> {
    if (options.legalAidAccountNumber.toString().length < 6 || options.legalAidAccountNumber.toString().length > 20) {
      throw new Error('Legal aid account number must be between 6 and 20 digits long');
    }

    return {
      legalAidAccountNumber: options.legalAidAccountNumber.toString(),
    };
  }
}
