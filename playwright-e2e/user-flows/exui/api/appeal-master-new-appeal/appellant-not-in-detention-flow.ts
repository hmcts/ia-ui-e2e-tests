import {
  StartAppealHomeOfficeReferenceNumber,
  StartAppealAppellantBasicDetails,
  StartAppealAppellantNationalities,
  StartAppealAppellantAddress,
  StartAppealAppellantContactPreference,
} from '../../../../api-requests/exui/new-appeal-payload-builder/appeal-master-data/index.js';
import { Nationality, YesOrNoType } from '../../../../citizen-types';

type AppellantNotInDetentionFlowOptions = {
  isAppellantStateless: YesOrNoType;
  nationality?: Nationality;
  homeOfficeReferenceNumber: string;
};

export class AppellantNotInDetentionFlow {
  private startAppealHomeOfficeReferenceNumber = new StartAppealHomeOfficeReferenceNumber();
  private startAppealAppellantBasicDetails = new StartAppealAppellantBasicDetails();
  private startAppealAppellantNationalities = new StartAppealAppellantNationalities();
  private startAppealAppellantAddress = new StartAppealAppellantAddress();
  private startAppealAppellantContactPreference = new StartAppealAppellantContactPreference();

  // This method builds the payload for appellant not in detention flow based on the provided options.
  // It handles appellant details, nationality, address, and contact preference in the payload.
  // This method builds a payload up until the point the user has to complete the appeal type flow
  // The method returns the final payload as a JSON object.
  public async buildPayload(options: AppellantNotInDetentionFlowOptions): Promise<JSON> {
    const payload: any = {};

    const addToPayload = (data: object): void => {
      Object.assign(payload, data);
    };

    addToPayload(await this.startAppealHomeOfficeReferenceNumber.homeOfficeReferenceNumber(options.homeOfficeReferenceNumber));

    addToPayload(
      await this.startAppealAppellantBasicDetails.appellantBasicDetails({
        title: 'Mr',
        givenNames: 'John',
        familyName: 'Doe',
        dateOfBirth: {
          day: 1,
          month: 1,
          year: 1990,
        },
      }),
    );

    addToPayload(
      await this.startAppealAppellantNationalities.appellantNationalities({
        isAppellantStateless: options.isAppellantStateless,
        nationality: options.nationality,
      }),
    );

    addToPayload(
      await this.startAppealAppellantAddress.appellantAddress({
        doesAppellantHaveAnAddress: 'Yes',
        addressDetails: { AddressLine1: '123 Main St', PostTown: 'London', PostCode: 'SW1A 1AA' },
      }),
    );

    addToPayload(
      await this.startAppealAppellantContactPreference.appellantContactPreference({
        contactPreference: 'Text message',
        phoneNumber: '07111111111',
      }),
    );

    return payload;
  }
}
