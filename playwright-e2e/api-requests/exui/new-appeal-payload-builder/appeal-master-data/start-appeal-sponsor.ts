import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealSponsorData {
  hasSponsor: YesOrNoType;
}

export class StartAppealSponsor {
  public async hasSponsor(hasSponsor: YesOrNoType): Promise<StartAppealSponsorData> {
    return {
      hasSponsor,
    };
  }
}
