import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class HasSponsorOrNonLegalRepApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: {
    doesApplicantHaveASponsor: YesOrNoType;
    doesApplicantHaveANonLegalRepresentative: YesOrNoType;
  }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'has-sponsor-or-non-legal-rep' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'has-sponsor-or-non-legal-rep',
      form: {
        _csrf: csrfToken,
        hasSponsor: option.doesApplicantHaveASponsor,
        hasNonLegalRep: option.doesApplicantHaveANonLegalRepresentative,
        saveAndContinue: '',
      },
    });
  }
}
