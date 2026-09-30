type StartAppealHomeOfficeReferenceNumberData = {
  homeOfficeReferenceNumber: string;
};

export class StartAppealHomeOfficeReferenceNumber {
  public async homeOfficeReferenceNumber(homeOfficeReferenceNumber: string): Promise<StartAppealHomeOfficeReferenceNumberData> {
    return {
      homeOfficeReferenceNumber,
    };
  }
}
