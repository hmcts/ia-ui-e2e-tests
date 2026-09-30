import { HearingWihtoutFeeDecisionType } from '../../../../exui-event-types.js';

const appealHearingOptionApiMapping: Record<HearingWihtoutFeeDecisionType, string> = {
  'Decision with a hearing': 'decisionWithHearing',
  'Decision without a hearing': 'decisionWithoutHearing',
};

interface StartAppealHearingOptionData {
  rpDcAppealHearingOption: (typeof appealHearingOptionApiMapping)[HearingWihtoutFeeDecisionType];
}

export class StartAppealRpdcAppealHearingOption {
  public async rpdcAppealHearingOption(hearingOption: HearingWihtoutFeeDecisionType): Promise<StartAppealHearingOptionData> {
    return {
      rpDcAppealHearingOption: appealHearingOptionApiMapping[hearingOption],
    };
  }
}
