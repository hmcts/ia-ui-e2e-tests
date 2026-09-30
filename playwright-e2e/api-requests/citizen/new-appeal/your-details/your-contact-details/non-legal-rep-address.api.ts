import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';
import { YesOrNoType } from '../../../../../citizen-types';

export class NonLegalRepAddressApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: {
    isSponsorAndNonLegalRepTheSamePerson: YesOrNoType;
    addressLine1: string;
    addressLine2?: string;
    townOrCity: string;
    county?: string;
    postCode: string;
  }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'non-legal-rep-address' });

    const form = new FormData();

    form.append('_csrf', csrfToken);
    form.append('saveAndContinue', '');

    if (options.isSponsorAndNonLegalRepTheSamePerson === 'Yes') {
      form.append('address-line-1', options.addressLine1);

      form.append('address-line-2', options.addressLine2 ? options.addressLine2 : '');

      form.append('address-town', options.townOrCity);

      form.append('address-county', options.county ? options.county : '');

      form.append('address-postcode', options.postCode);
    } else {
      form.append(
        'nlr-address',
        `${options.addressLine1}, ${options.addressLine2 ? `, ${options.addressLine2}` : ''}, ${options.townOrCity}${options.county ? `, ${options.county}` : ''}, ${options.postCode}`,
      );
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'non-legal-rep-address',
      form,
    });
  }
}
