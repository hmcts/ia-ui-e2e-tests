import { YesOrNoType } from '../../../../citizen-types.js';
interface StartAppealLegalRepresentativeDetailsData {
  legalRepCompany: String;
  legalRepName: String;
  legalRepFamilyName: String;
  legalRepMobilePhoneNumber: String;
  legalRepReferenceNumber: String;
  isFeePaymentEnabled: 'Yes';
  isRemissionsEnabled: 'Yes';
}

export class StartAppealLegalRepresentativeDetails {
  public async legalRepresentativeDetails(options: {
    legalRepCompany: String;
    legalRepName: String;
    legalRepFamilyName: String;
    legalRepMobilePhoneNumber: String;
    legalRepReferenceNumber: String;
  }): Promise<StartAppealLegalRepresentativeDetailsData> {
    return {
      legalRepCompany: options.legalRepCompany,
      legalRepName: options.legalRepName,
      legalRepFamilyName: options.legalRepFamilyName,
      legalRepMobilePhoneNumber: options.legalRepMobilePhoneNumber,
      legalRepReferenceNumber: options.legalRepReferenceNumber,
      isFeePaymentEnabled: 'Yes',
      isRemissionsEnabled: 'Yes',
    };
  }
}
