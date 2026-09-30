import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { PendingBailApplicationType } from '../../../../exui-event-types';

export class StartAppealAppellantBailApplicationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    bailApplicationNumberInput: this.page.locator('input[id="bailApplicationNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Bail application', exact: true }),
    pendingBailApplicationLabel: this.page.locator('label[for="hasPendingBailApplications"] span'),
    yesLabel: this.page.locator('label[for="hasPendingBailApplications-Yes"]'),
    yesWithoutBailNumberLabel: this.page.locator('label[for="hasPendingBailApplications-YesWithoutBailApplicationNumber"]'),
    noLabel: this.page.locator('label[for="hasPendingBailApplications-No"]'),
    notSureLabel: this.page.locator('label[for="hasPendingBailApplications-NotSure"]'),
    bailApplicationNumberLabel: this.page.locator('label[for="bailApplicationNumber"]'),
    bailApplicationNumberHint: this.page.locator('label[for="bailApplicationNumber"] ~ span[class="form-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappellantBailApplication',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.pendingBailApplicationLabel).toBeVisible(),
      expect(this.$static.pendingBailApplicationLabel).toHaveText('Does the appellant have a pending bail application?'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesWithoutBailNumberLabel).toBeVisible(),
      expect(this.$static.yesWithoutBailNumberLabel).toHaveText('Yes, but the bail application number was not provided'),
      expect(this.$static.noLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.notSureLabel).toBeVisible(),
      expect(this.$static.notSureLabel).toHaveText("I'm not sure"),
    ]);
  }

  public async completePageAndContinue(options: {
    pendingBailApplication: PendingBailApplicationType;
    bailApplicationNumber?: string;
  }): Promise<void> {
    await this.page.getByRole('radio', { name: options.pendingBailApplication, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.pendingBailApplication, exact: true })).toBeChecked();

    if (options.pendingBailApplication === 'Yes') {
      if (!options.bailApplicationNumber) {
        throw new Error('If pendingBailApplication is "Yes", bailApplicationNumber must be provided.');
      }

      await expect(this.$static.bailApplicationNumberLabel).toBeVisible();
      await expect(this.$static.bailApplicationNumberLabel).toHaveText("What is the appellant's bail application number?");
      await expect(this.$static.bailApplicationNumberHint).toBeVisible();
      await expect(this.$static.bailApplicationNumberHint).toHaveText('For Example: AB/01234 or 1234-1234-1234-1234');
      await expect(this.$inputs.bailApplicationNumberInput).toBeVisible();

      await this.$inputs.bailApplicationNumberInput.fill(options.bailApplicationNumber);
      await expect(this.$inputs.bailApplicationNumberInput).toHaveValue(options.bailApplicationNumber);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
