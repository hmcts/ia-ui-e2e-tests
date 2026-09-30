type StartAppealAppellantBasicDetailsData = {
  appellantTitle: string;
  appellantFamilyName: string;
  appellantGivenNames: string;
  appellantDateOfBirth: string;
};

export class StartAppealAppellantBasicDetails {
  public async appellantBasicDetails(options: {
    title: string;
    familyName: string;
    givenNames: string;
    dateOfBirth: {
      day: number;
      month: number;
      year: number;
    };
  }): Promise<StartAppealAppellantBasicDetailsData> {
    return {
      appellantTitle: options.title,
      appellantFamilyName: options.familyName,
      appellantGivenNames: options.givenNames,
      appellantDateOfBirth: `${options.dateOfBirth.year}-${options.dateOfBirth.month.toString().padStart(2, '0')}-${options.dateOfBirth.day.toString().padStart(2, '0')}`,
    };
  }
}
