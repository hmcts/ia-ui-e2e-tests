import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealOutOfCountryData {
  appellantInUk: YesOrNoType;
}

export class StartAppealOutOfCountry {
  public async isAppellantLivingInUk(isAppellantLivingInUk: YesOrNoType): Promise<StartAppealOutOfCountryData> {
    return {
      appellantInUk: isAppellantLivingInUk,
    };
  }
}
