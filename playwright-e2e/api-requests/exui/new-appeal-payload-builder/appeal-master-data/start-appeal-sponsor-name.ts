interface StartAppealSponsorNameData {
  sponsorGivenNames: string;
  sponsorFamilyName: string;
}

export class StartAppealSponsorName {
  public async sponsorName(options: { sponsorGivenNames: string; sponsorFamilyName: string }): Promise<StartAppealSponsorNameData> {
    return {
      sponsorGivenNames: options.sponsorGivenNames,
      sponsorFamilyName: options.sponsorFamilyName,
    };
  }
}
