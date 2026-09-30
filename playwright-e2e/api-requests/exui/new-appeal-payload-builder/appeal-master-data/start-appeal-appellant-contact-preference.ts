interface EmailPreference {
  contactPreference: 'wantsEmail';
  email: string;
  emailRetype: string;
}

interface TextMessagePreference {
  contactPreference: 'wantsSms';
  mobileNumber: string;
  mobileNumberRetype: string;
}

type AppellantContactPreferenceData = EmailPreference | TextMessagePreference;

export class StartAppealAppellantContactPreference {
  public async appellantContactPreference(options: {
    contactPreference: 'Email' | 'Text message';
    email?: string;
    phoneNumber?: string;
  }): Promise<AppellantContactPreferenceData> {
    switch (options.contactPreference) {
      case 'Email':
        if (!options.email) {
          throw new Error('Email is required when contact preference is Email');
        }
        return {
          contactPreference: 'wantsEmail',
          email: options.email,
          emailRetype: options.email,
        };
      case 'Text message':
        if (!options.phoneNumber) {
          throw new Error('Phone number is required when contact preference is Text message');
        }
        return {
          contactPreference: 'wantsSms',
          mobileNumber: options.phoneNumber,
          mobileNumberRetype: options.phoneNumber,
        };
    }
  }
}
