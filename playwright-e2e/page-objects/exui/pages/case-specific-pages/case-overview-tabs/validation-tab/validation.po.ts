import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

type listOfAppellantDetails = 'Given name' | 'Family name' | 'Full name' | 'Gender' | 'Date of birth' | 'HO role' | 'HO sub-role' | 'Nationality';
type listOfApplicationDetails = 'HO reference' | 'HO decision' | 'HO decision date' | 'HO decision sent' | 'HO decision communication';
export class ValidationPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public $appellantDetailsLocator = (question: listOfAppellantDetails | listOfApplicationDetails): Locator => {
    return this.page.getByText(question, { exact: true });
  };

  public $appellantDetailsValueLocator(question: listOfAppellantDetails | listOfApplicationDetails): Locator {
    return this.page.getByText(question, { exact: true }).locator('~ td').nth(0);
  }

  public $appellantDetailsResultLocator(question: listOfAppellantDetails | 'Listing length'): Locator {
    return this.page.getByText(question, { exact: true }).locator('~ td').nth(1);
  }

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    serviceHasBeenUnableToRetrieveDataText: this.page.getByText('Note: The service has been unable to retrieve the Home Office information'),
    doThisNextHeading: this.page.getByRole('heading', { level: 2, name: 'Do this next', exact: true }),
    doThisNextBuletPoints: this.page.getByRole('heading', { level: 2, name: 'Do this next', exact: true }).locator('+ ul li'),
    appealValidationHeading: this.page.getByRole('heading', { level: 2, name: 'Appeal validation', exact: true }),
    thereAreNoMatchingDetailsForAppellantText: this.page.getByText('There are no matching details for this appellant.'),
    appellantDetailsHeading: this.page.getByRole('heading', { level: 2, name: 'Appellant details', exact: true }),
    applicationDetailsHeading: this.page.getByRole('heading', { level: 2, name: 'Application details', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'Validation',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.getByRole('tab', { name: 'Validation', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
  }
}
