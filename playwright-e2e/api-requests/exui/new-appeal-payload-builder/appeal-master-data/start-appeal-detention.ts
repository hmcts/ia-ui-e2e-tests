import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealDetentionData {
  appellantInDetention: YesOrNoType;
}

export class StartAppealDetention {
  public async isAppellantInDetention(isAppellantInDetention: YesOrNoType): Promise<StartAppealDetentionData> {
    return {
      appellantInDetention: isAppellantInDetention,
    };
  }
}
