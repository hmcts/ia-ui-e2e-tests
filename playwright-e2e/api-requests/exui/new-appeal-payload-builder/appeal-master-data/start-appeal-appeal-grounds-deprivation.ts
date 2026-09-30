import { ExuiAppealGroundsDeprivationHumanRightsType, ExuiAppealGroundsDeprivationType } from '../../../../exui-event-types';

const appealGroundsDeprivationApiMapping: Record<ExuiAppealGroundsDeprivationType, string> = {
  'Deprivation would have a disproportionate effect': 'disproportionateDeprivation',
  'The decision is unlawful because discretion should have been exercised differently': 'unlawfulDeprivation',
};

const appealGroundsDeprivationHumanRightsApiMapping: Record<ExuiAppealGroundsDeprivationHumanRightsType, string> = {
  'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998': 'protectionHumanRights',
};

interface StartAppealAppealGroundsDeprivationData {
  appealGroundsDeprivation: {
    values: (typeof appealGroundsDeprivationApiMapping)[keyof typeof appealGroundsDeprivationApiMapping][];
  };
  appealGroundsDeprivationHumanRights?: {
    values: (typeof appealGroundsDeprivationHumanRightsApiMapping)[keyof typeof appealGroundsDeprivationHumanRightsApiMapping][];
  };
}

export class StartAppealAppealGroundsDeprivation {
  public async appealGroundsDeprivation(options: {
    appealGroundsDeprivation: ExuiAppealGroundsDeprivationType[];
    appealGroundsDeprivationHumanRights?: ExuiAppealGroundsDeprivationHumanRightsType;
  }): Promise<StartAppealAppealGroundsDeprivationData> {
    const mappedAppealGroundsDeprivation = options.appealGroundsDeprivation.map((ground) => appealGroundsDeprivationApiMapping[ground]);

    if (!options.appealGroundsDeprivationHumanRights) {
      return {
        appealGroundsDeprivation: {
          values: mappedAppealGroundsDeprivation,
        },
      };
    } else {
      return {
        appealGroundsDeprivation: {
          values: mappedAppealGroundsDeprivation,
        },
        appealGroundsDeprivationHumanRights: {
          values: [appealGroundsDeprivationHumanRightsApiMapping[options.appealGroundsDeprivationHumanRights]],
        },
      };
    }
  }
}
