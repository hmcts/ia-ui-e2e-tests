import {
  StartAppealHomeOfficeReferenceNumber,
  StartAppealAppellantBasicDetails,
  StartAppealAppellantNationalities,
  StartAppealAppellantAddress,
  StartAppealIrcName,
  StartAppealAppellantBailApplication,
  StartAppealPrisonName,
  StartAppealCustodialSentence,
  StartAppealRemovalDirections,
} from '../../../../api-requests/exui/new-appeal-payload-builder/appeal-master-data/index.js';
import { Nationality, YesOrNoType } from '../../../../citizen-types';
import { DetentionFacilityType } from '../../../../exui-event-types';

type AppellantInDetentionFlowOptions = {
  detentionFacility: DetentionFacilityType;
  isAppellantStateless: YesOrNoType;
  nationality?: Nationality;
  homeOfficeReferenceNumber: string;
};

export class AppellantInDetentionFlow {
  private startAppealHomeOfficeReferenceNumber = new StartAppealHomeOfficeReferenceNumber();
  private startAppealAppellantBasicDetails = new StartAppealAppellantBasicDetails();
  private startAppealAppellantNationalities = new StartAppealAppellantNationalities();
  private startAppealAppellantAddress = new StartAppealAppellantAddress();
  private startAppealIrcName = new StartAppealIrcName();
  private startAppealAppellantBailApplication = new StartAppealAppellantBailApplication();
  private startAppealPrisonName = new StartAppealPrisonName();
  private startAppealCustodialSentence = new StartAppealCustodialSentence();
  private startAppealRemovalDirections = new StartAppealRemovalDirections();

  // This method builds the payload for appellant in detention flow based on the provided options.
  // It handles different detention facilities and populates the payload accordingly.
  // It also includes appellant details, nationality and address in the payload.
  // This method builds a payload up until the point the user has to complete the appeal type flow
  // The method returns the final payload as a JSON object.
  public async buildPayload(options: AppellantInDetentionFlowOptions): Promise<JSON> {
    const payload: any = {};

    const addToPayload = (data: object): void => {
      Object.assign(payload, data);
    };

    switch (options.detentionFacility) {
      case 'Immigration removal centre':
        addToPayload(
          await this.startAppealRemovalDirections.removalDirections({
            removalOrderOptions: 'Yes',
            removalOrderDate: { day: 1, month: 1, year: 2026, hour: 13, minute: 15 },
          }),
        );

        addToPayload(await this.startAppealIrcName.ircName('Derwentside'));
        break;
      case 'Prison':
        addToPayload(await this.startAppealPrisonName.prisonName('HM Prison Eastwood Park'));
        addToPayload(await this.startAppealCustodialSentence.custodialSentence({ releaseDateProvided: 'No' }));
        break;
      case 'Other':
        addToPayload(await this.startAppealCustodialSentence.custodialSentence({ releaseDateProvided: 'No' }));
        break;
    }

    addToPayload(
      await this.startAppealAppellantBailApplication.appellantBailApplication({
        hasPendingBailApplications: 'Yes',
        bailApplicationNumber: 'AB/01234',
      }),
    );

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

    if (options.detentionFacility === 'Other') {
      addToPayload(
        await this.startAppealAppellantAddress.appellantAddress({
          doesAppellantHaveAnAddress: 'Yes',
          addressDetails: {
            AddressLine1: '123 Main St',
            PostTown: 'London',
            PostCode: 'SW1A 1AA',
          },
        }),
      );
    }

    return payload;
  }
}
