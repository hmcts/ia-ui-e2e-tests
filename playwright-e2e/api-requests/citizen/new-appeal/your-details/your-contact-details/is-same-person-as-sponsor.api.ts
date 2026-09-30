import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class IsSamePersonAsSponsorApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { isSponsorAndNonLegalRepresentativeTheSamePerson: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'is-same-person' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'is-same-person',
      form: {
        _csrf: csrfToken,
        isSponsorSameAsNlr: option.isSponsorAndNonLegalRepresentativeTheSamePerson,
        saveAndContinue: '',
      },
    });
  }
}
