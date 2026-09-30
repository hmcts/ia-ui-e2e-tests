import { OutOfCountryDecisionType } from '../../../../exui-event-types';

const outOfCountryDecisionTypeApiMapping: Record<OutOfCountryDecisionType, string> = {
  'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016':
    'refusalOfHumanRights',
  'A decision to refuse a protection or human rights claim where your client may only apply after leaving the UK': 'refusalOfProtection',
  'A decision either 1) to remove your client from the UK under the Immigration (European Economic Area) Regulations 2016, where they are currently outside the UK or 2) to deprive your client of British citizenship, where they are currently outside the UK':
    'removalOfClient',
  'A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.': 'refusePermit',
};

type StartAppealOutOfCountryDecisionTypeData = {
  outOfCountryDecisionType: (typeof outOfCountryDecisionTypeApiMapping)[OutOfCountryDecisionType];
};

export class StartAppealOutOfCountryDecisionType {
  public async outOfCountryDecisionType(outOfCountryDecisionType: OutOfCountryDecisionType): Promise<StartAppealOutOfCountryDecisionTypeData> {
    return {
      outOfCountryDecisionType: outOfCountryDecisionTypeApiMapping[outOfCountryDecisionType],
    };
  }
}
