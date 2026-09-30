import {
  StartAppealHomeOfficeReferenceNumber,
  StartAppealAppellantBasicDetails,
  StartAppealAppellantNationalities,
  StartAppealAppellantContactPreference,
  StartAppealOutOfCountryDecisionType,
  StartAppealDepartureDate,
  StartAppealOocHomeOfficeReferenceNumber,
  StartAppealOocAppellantAddress,
} from '../../../../api-requests/exui/new-appeal-payload-builder/appeal-master-data/index.js';
import { Nationality, YesOrNoType } from '../../../../citizen-types.js';
import { OutOfCountryDecisionType } from '../../../../exui-event-types.js';

type OutOfCountryDecisionTypeFlowOptions = {
  homeOfficeReferenceNumber: string;
  oocDecisionType: OutOfCountryDecisionType;
  isAppellantStateless: YesOrNoType;
  nationality?: Nationality;
};

export class OutOfCountryDecisionTypeFlow {
  private startAppealHomeOfficeReferenceNumber = new StartAppealHomeOfficeReferenceNumber();
  private startAppealAppellantBasicDetails = new StartAppealAppellantBasicDetails();
  private startAppealAppellantNationalities = new StartAppealAppellantNationalities();
  private startAppealAppellantContactPreference = new StartAppealAppellantContactPreference();
  private startAppealOutOfCountryDecisionType = new StartAppealOutOfCountryDecisionType();
  private startAppealDepartureDate = new StartAppealDepartureDate();
  private startAppealOocHomeOfficeReferenceNumber = new StartAppealOocHomeOfficeReferenceNumber();
  private startAppealOocAppellantAddress = new StartAppealOocAppellantAddress();

  // This method builds the payload for the out-of-country decision type flow based on the provided options.
  // It handles different decision types and populates the payload accordingly.
  // It also includes appellant details, nationality, address, and contact preference in the payload.
  // This method builds a payload up until the point the user has to complete the appeal type flow
  // The method returns the final payload as a JSON object.
  public async buildPayload(options: OutOfCountryDecisionTypeFlowOptions): Promise<JSON> {
    const payload: any = {};

    const addToPayload = (data: object): void => {
      Object.assign(payload, data);
    };

    addToPayload(await this.startAppealOutOfCountryDecisionType.outOfCountryDecisionType(options.oocDecisionType));

    switch (options.oocDecisionType) {
      case 'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016':
        addToPayload(await this.startAppealOocHomeOfficeReferenceNumber.homeOfficeReferenceNumber(options.homeOfficeReferenceNumber));
        break;
      case 'A decision to refuse a protection or human rights claim where your client may only apply after leaving the UK':
        addToPayload(await this.startAppealDepartureDate.departureDate({ day: 1, month: 1, year: 2023 }));
        addToPayload(await this.startAppealHomeOfficeReferenceNumber.homeOfficeReferenceNumber(options.homeOfficeReferenceNumber));

        break;
      case 'A decision either 1) to remove your client from the UK under the Immigration (European Economic Area) Regulations 2016, where they are currently outside the UK or 2) to deprive your client of British citizenship, where they are currently outside the UK':
        addToPayload(await this.startAppealHomeOfficeReferenceNumber.homeOfficeReferenceNumber(options.homeOfficeReferenceNumber));
        break;
      case 'A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.':
        addToPayload(await this.startAppealOocHomeOfficeReferenceNumber.homeOfficeReferenceNumber(options.homeOfficeReferenceNumber));
        break;
    }

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

    if (options.isAppellantStateless === 'Yes') {
      addToPayload(await this.startAppealAppellantNationalities.appellantNationalities({ isAppellantStateless: 'Yes' }));
    } else {
      if (!options.nationality) {
        throw new Error('Nationality is required when isAppellantStateless is "No"');
      }
      addToPayload(
        await this.startAppealAppellantNationalities.appellantNationalities({
          isAppellantStateless: 'No',
          nationality: options.nationality,
        }),
      );
    }

    addToPayload(
      await this.startAppealOocAppellantAddress.appellantAddress({
        doesAppellantHaveAnAddress: 'Yes',
        addressDetails: '123 Main St, London, SW1A 1AA',
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
