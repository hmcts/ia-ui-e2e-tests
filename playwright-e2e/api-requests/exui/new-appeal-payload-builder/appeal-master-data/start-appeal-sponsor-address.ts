interface StartAppealSponsorAddressData {
  sponsorAddress: {
    AddressLine1: string;
    AddressLine2?: string;
    AddressLine3?: string;
    PostTown: string;
    County?: string;
    PostCode: string;
    Country?: string;
  };
}

export class StartAppealSponsorAddress {
  public async sponsorAddress(options: {
    AddressLine1: string;
    AddressLine2?: string;
    AddressLine3?: string;
    PostTown: string;
    County?: string;
    PostCode: string;
    Country?: string;
  }): Promise<StartAppealSponsorAddressData> {
    return {
      sponsorAddress: {
        AddressLine1: options.AddressLine1,
        AddressLine2: options.AddressLine2 || '',
        AddressLine3: options.AddressLine3 || '',
        PostTown: options.PostTown,
        County: options.County || '',
        PostCode: options.PostCode,
        Country: options.Country || '',
      },
    };
  }
}
