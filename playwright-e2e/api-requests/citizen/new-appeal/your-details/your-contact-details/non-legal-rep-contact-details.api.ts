import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class NonLegalRepContactDetailsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nlrEmail: string; nlrPhoneNumber: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'non-legal-rep-contact-details' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'non-legal-rep-contact-details',
      form: {
        _csrf: csrfToken,
        emailAddress: options.nlrEmail,
        phoneNumber: options.nlrPhoneNumber,
        saveAndContinue: '',
      },
    });
  }
}
