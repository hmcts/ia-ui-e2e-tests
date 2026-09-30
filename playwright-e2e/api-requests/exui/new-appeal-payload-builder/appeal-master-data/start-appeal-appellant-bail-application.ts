import { PendingBailApplicationType } from '../../../../exui-event-types.js';

const pendingBailApplicationApiMapping: Record<PendingBailApplicationType, string> = {
  Yes: 'Yes',
  'Yes, but the bail application number was not provided': 'YesWithoutBailApplicationNumber',
  No: 'No',
  "I'm not sure": 'NotSure',
};

interface StartAppealAppellantBailApplicationData {
  hasPendingBailApplications: (typeof pendingBailApplicationApiMapping)[PendingBailApplicationType];
  bailApplicationNumber?: string;
}

export class StartAppealAppellantBailApplication {
  public async appellantBailApplication(options: {
    hasPendingBailApplications: PendingBailApplicationType;
    bailApplicationNumber?: string;
  }): Promise<StartAppealAppellantBailApplicationData> {
    if (options.hasPendingBailApplications === 'Yes') {
      if (!options.bailApplicationNumber) {
        throw new Error('bailApplicationNumber is required when hasPendingBailApplications is "Yes"');
      }
      return {
        hasPendingBailApplications: pendingBailApplicationApiMapping[options.hasPendingBailApplications],
        bailApplicationNumber: options.bailApplicationNumber,
      };
    } else {
      return {
        hasPendingBailApplications: pendingBailApplicationApiMapping[options.hasPendingBailApplications],
      };
    }
  }
}
