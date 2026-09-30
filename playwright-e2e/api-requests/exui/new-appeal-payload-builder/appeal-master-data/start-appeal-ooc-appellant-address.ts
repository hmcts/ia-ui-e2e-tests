interface noAddressData {
  hasCorrespondenceAddress: 'No';
}

interface yesAddressData {
  hasCorrespondenceAddress: 'Yes';
  appellantOutOfCountryAddress: string;
}

type StartAppealOocAppellantAddressData = noAddressData | yesAddressData;

export class StartAppealOocAppellantAddress {
  public async appellantAddress(options: {
    doesAppellantHaveAnAddress: 'Yes' | 'No';
    addressDetails?: string;
  }): Promise<StartAppealOocAppellantAddressData> {
    switch (options.doesAppellantHaveAnAddress) {
      case 'No':
        return {
          hasCorrespondenceAddress: 'No',
        };
      case 'Yes':
        if (!options.addressDetails) {
          throw new Error('Address details must be provided when appellant has an address.');
        }
        return {
          hasCorrespondenceAddress: 'Yes',
          appellantOutOfCountryAddress: options.addressDetails,
        };
    }
  }
}
