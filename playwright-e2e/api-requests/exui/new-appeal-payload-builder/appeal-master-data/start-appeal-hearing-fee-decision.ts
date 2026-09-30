import { HearingWihtoutFeeDecisionType } from '../../../../exui-event-types';
const hearingFeeDecisionApiMapping: Record<HearingWihtoutFeeDecisionType, string> = {
  'Decision with a hearing': 'decisionWithHearing',
  'Decision without a hearing': 'decisionWithoutHearing',
};

interface StartAppealHearingFeeDecisionData {
  decisionHearingFeeOption: (typeof hearingFeeDecisionApiMapping)[HearingWihtoutFeeDecisionType];
}

export class StartAppealHearingFeeDecision {
  public async hearingFeeDecision(hearingFeeDecision: HearingWihtoutFeeDecisionType): Promise<StartAppealHearingFeeDecisionData> {
    return {
      decisionHearingFeeOption: hearingFeeDecisionApiMapping[hearingFeeDecision],
    };
  }
}
