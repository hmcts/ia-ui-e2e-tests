import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class NonLegalRepNameApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'non-legal-rep-name' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'non-legal-rep-name',
      form: {
        _csrf: csrfToken,
        nlrGivenNames: Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames,
        nlrFamilyName: option.familyName,
        saveAndContinue: '',
      },
    });
  }
}
