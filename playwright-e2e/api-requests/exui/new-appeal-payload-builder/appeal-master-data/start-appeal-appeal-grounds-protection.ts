import { ExuiAppealGroundsProtectionHumanRightsType, ExuiAppealGroundsProtectionType } from '../../../../exui-event-types';

const appealGroundsProtectionApiMapping: Record<ExuiAppealGroundsProtectionType, string> = {
  "Removing the appellant from the UK would breach the UK's obligation in relation to persons eligible for a grant of humanitarian protection":
    'protectionHumanitarianProtection',
  "Removing the appellant from the UK would breach the UK's obligation under the Refugee Convention": 'protectionRefugeeConvention',
};

const appealGroundsProtectionHumanRightsApiMapping: Record<ExuiAppealGroundsProtectionHumanRightsType, string> = {
  'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998': 'protectionHumanRights',
};

interface StartAppealAppealGroundsProtectionData {
  appealGroundsProtection: {
    values: (typeof appealGroundsProtectionApiMapping)[keyof typeof appealGroundsProtectionApiMapping][];
  };
  appealGroundsHumanRights?: {
    values: (typeof appealGroundsProtectionHumanRightsApiMapping)[keyof typeof appealGroundsProtectionHumanRightsApiMapping][];
  };
}

export class StartAppealAppealGroundsProtection {
  public async appealGroundsProtection(options: {
    appealGroundsProtection: ExuiAppealGroundsProtectionType[];
    appealGroundsHumanRights?: ExuiAppealGroundsProtectionHumanRightsType;
  }): Promise<StartAppealAppealGroundsProtectionData> {
    const mappedAppealGroundsProtection = options.appealGroundsProtection.map((ground) => appealGroundsProtectionApiMapping[ground]);

    if (!options.appealGroundsHumanRights) {
      return {
        appealGroundsProtection: {
          values: mappedAppealGroundsProtection,
        },
      };
    } else {
      return {
        appealGroundsProtection: {
          values: mappedAppealGroundsProtection,
        },
        appealGroundsHumanRights: {
          values: [appealGroundsProtectionHumanRightsApiMapping[options.appealGroundsHumanRights]],
        },
      };
    }
  }
}
