import { YesOrNoType } from '../../../../citizen-types.js';
interface AppellantHasNoAddress {
  appellantHasFixedAddress: 'No';
}

interface AppellantHasAddress {
  appellantHasFixedAddress: 'Yes';
  appellantAddress: {
    AddressLine1: string;
    AddressLine2?: string;
    AddressLine3?: string;
    PostTown: string;
    County?: string;
    PostCode: string;
    Country?: string;
  };
}

type StartAppealAppellantAddressData = AppellantHasNoAddress | AppellantHasAddress;

export class StartAppealAppellantAddress {
  public async appellantAddress(options: {
    doesAppellantHaveAnAddress: YesOrNoType;
    addressDetails?: {
      AddressLine1: string;
      AddressLine2?: string;
      AddressLine3?: string;
      PostTown: string;
      County?: string;
      PostCode: string;
      Country?: string;
    };
  }): Promise<StartAppealAppellantAddressData> {
    if (options.doesAppellantHaveAnAddress === 'No') {
      return {
        appellantHasFixedAddress: 'No',
      };
    } else {
      if (!options.addressDetails) {
        throw new Error('Address details must be provided when appellant has an address.');
      }

      return {
        appellantHasFixedAddress: 'Yes',
        appellantAddress: {
          AddressLine1: options.addressDetails.AddressLine1,
          AddressLine2: options.addressDetails.AddressLine2 || '',
          AddressLine3: options.addressDetails.AddressLine3 || '',
          PostTown: options.addressDetails.PostTown,
          County: options.addressDetails.County || '',
          PostCode: options.addressDetails.PostCode,
          Country: options.addressDetails.Country || '',
        },
      };
    }
  }
}
