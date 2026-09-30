type StartAppealOocHomeOfficeReferenceNumberData = {
  gwfReferenceNumber: string;
};

export class StartAppealOocHomeOfficeReferenceNumber {
  public async homeOfficeReferenceNumber(homeOfficeReferenceNumber: string): Promise<StartAppealOocHomeOfficeReferenceNumberData> {
    return {
      gwfReferenceNumber: homeOfficeReferenceNumber,
    };
  }
}
