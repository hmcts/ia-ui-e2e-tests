import { ExuiAppealGroundsRevocationType } from '../../../../exui-event-types';

const appealGroundsRevocationApiMapping: Record<ExuiAppealGroundsRevocationType, string> = {
  "Revocation of the appellant's protection status breaches the United Kingdom's obligations in relation to persons eligible for humanitarian protection":
    'revocationHumanitarianProtection',
  "Revocation of the appellant's protection status breaches the United Kingdom's obligations under the Refugee Convention":
    'revocationRefugeeConvention',
};

interface StartAppealAppealGroundsRevocationData {
  appealGroundsRevocation: {
    values: (typeof appealGroundsRevocationApiMapping)[keyof typeof appealGroundsRevocationApiMapping][];
  };
}

export class StartAppealAppealGroundsRevocation {
  public async appealGroundsRevocation(options: {
    groundsForAppeal: ExuiAppealGroundsRevocationType[];
  }): Promise<StartAppealAppealGroundsRevocationData> {
    const mappedAppealGroundsRevocation = options.groundsForAppeal.map((ground) => appealGroundsRevocationApiMapping[ground]);

    return {
      appealGroundsRevocation: {
        values: mappedAppealGroundsRevocation,
      },
    };
  }
}
