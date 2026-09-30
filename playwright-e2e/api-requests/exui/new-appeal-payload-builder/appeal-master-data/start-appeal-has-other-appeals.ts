import { HasOtherAppealsType } from '../../../../exui-event-types';

const hasOtherAppealsApiMapping: Record<HasOtherAppealsType, string> = {
  Yes: 'Yes',
  'Yes, but an appeal number was not provided': 'YesWithoutAppealNumber',
  No: 'No',
  "I'm not sure": 'NotSure',
};

interface StartAppealHasOtherAppealsData {
  hasOtherAppeals: (typeof hasOtherAppealsApiMapping)[HasOtherAppealsType];
  hearingTypeResult: 'No';
}

export class StartAppealHasOtherAppeals {
  public async hasOtherAppeals(hasOtherAppeals: HasOtherAppealsType): Promise<StartAppealHasOtherAppealsData> {
    return {
      hasOtherAppeals: hasOtherAppealsApiMapping[hasOtherAppeals],
      hearingTypeResult: 'No',
    };
  }
}
