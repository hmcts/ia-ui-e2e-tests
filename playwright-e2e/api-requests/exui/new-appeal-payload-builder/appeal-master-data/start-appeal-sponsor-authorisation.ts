import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealSponsorAuthorisationData {
  sponsorAuthorisation: YesOrNoType;
}

export class StartAppealSponsorAuthorisation {
  public async sponsorAuthorisation(sponsorAuthorisation: YesOrNoType): Promise<StartAppealSponsorAuthorisationData> {
    return {
      sponsorAuthorisation: sponsorAuthorisation,
    };
  }
}
