interface emailPreference {
  sponsorContactPreference: 'wantsEmail';
  sponsorEmail: string;
}

interface textMessagePreference {
  sponsorContactPreference: 'wantsSms';
  sponsorMobileNumber: string;
}

type SponsorContactPreferenceData = emailPreference | textMessagePreference;

export class StartAppealSponsorContactPreference {
  public async sponsorContactPreference(options: {
    contactPreference: 'Email' | 'Text message';
    email?: string;
    phoneNumber?: string;
  }): Promise<SponsorContactPreferenceData> {
    switch (options.contactPreference) {
      case 'Email':
        if (!options.email) {
          throw new Error('Email is required when contact preference is Email');
        }
        return {
          sponsorContactPreference: 'wantsEmail',
          sponsorEmail: options.email,
        };
      case 'Text message':
        if (!options.phoneNumber) {
          throw new Error('Phone number is required when contact preference is Text message');
        }
        return {
          sponsorContactPreference: 'wantsSms',
          sponsorMobileNumber: options.phoneNumber,
        };
    }
  }
}
