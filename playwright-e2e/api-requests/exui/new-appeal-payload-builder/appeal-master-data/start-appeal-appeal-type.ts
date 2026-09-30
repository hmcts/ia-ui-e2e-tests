import { ExuiAppealType } from '../../../../exui-event-types';

const appealTypeApiMapping: Record<ExuiAppealType, string> = {
  'Refusal of a human rights claim': 'refusalOfHumanRights',
  'Refusal of application under the EEA regulations': 'refusalOfEu',
  'Deprivation of citizenship': 'deprivation',
  'Refusal of protection claim': 'protection',
  'Revocation of a protection status': 'revocationOfProtection',
  'Refusal of application under the EU Settlement Scheme': 'euSettlementScheme',
};
interface StartAppealAppealTypeData {
  appealType: (typeof appealTypeApiMapping)[ExuiAppealType];
}

export class StartAppealAppealType {
  public async appealType(appealType: ExuiAppealType): Promise<StartAppealAppealTypeData> {
    return {
      appealType: appealTypeApiMapping[appealType],
    };
  }
}
