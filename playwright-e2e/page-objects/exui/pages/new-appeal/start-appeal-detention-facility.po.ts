import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { DetentionFacilityType } from '../../../../exui-event-types';

export class StartAppealDetentionFacilityPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    prisonNomsNumberInput: this.page.locator('input[id="prisonNOMSNumber_prison"]'),
    otherDetentionFacilityNameInput: this.page.locator('input[id="otherDetentionFacilityName_other"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Where is the appellant detained?', exact: true }),
    detentionFacilityLabel: this.page.locator('label[for="detentionFacility"] span'),
    immigrationRemovalCentreLabel: this.page.locator('label[for="detentionFacility-immigrationRemovalCentre"]'),
    prisonLabel: this.page.locator('label[for="detentionFacility-prison"]'),
    otherLabel: this.page.locator('label[for="detentionFacility-other"]'),
    prisonHeading: this.page.getByRole('heading', { level: 2, name: 'Prison', exact: true }),
    prisonNomsNumberLabel: this.page.locator('label[for="prisonNOMSNumber_prison"]'),
    otherHeading: this.page.getByRole('heading', { level: 2, name: 'Other', exact: true }),
    otherDetentionFacilityNameLabel: this.page.locator('label[for="otherDetentionFacilityName_other"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealdetentionFacility',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.detentionFacilityLabel).toBeVisible(),
      expect(this.$static.detentionFacilityLabel).toHaveText('Detention facility'),
      expect(this.$static.immigrationRemovalCentreLabel).toBeVisible(),
      expect(this.$static.immigrationRemovalCentreLabel).toHaveText('Immigration removal centre'),
      expect(this.$static.prisonLabel).toBeVisible(),
      expect(this.$static.prisonLabel).toHaveText('Prison'),
      expect(this.$static.otherLabel).toBeVisible(),
      expect(this.$static.otherLabel).toHaveText('Other'),
    ]);
  }

  public async completePageAndContinue(options: {
    detentionFacility: DetentionFacilityType;
    prisonNomsNumber?: string;
    otherDetentionFacilityName?: string;
  }): Promise<void> {
    await this.page.getByRole('radio', { name: options.detentionFacility, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.detentionFacility, exact: true })).toBeChecked();

    if (options.detentionFacility === 'Prison') {
      await expect(this.$static.prisonHeading).toBeVisible();
      await expect(this.$static.prisonNomsNumberLabel).toBeVisible();
      await expect(this.$static.prisonNomsNumberLabel).toHaveText("What is the appellant's NOMS number? (Optional)");

      if (options.prisonNomsNumber) {
        await this.$inputs.prisonNomsNumberInput.fill(options.prisonNomsNumber);
        await expect(this.$inputs.prisonNomsNumberInput).toHaveValue(options.prisonNomsNumber);
      }
    }

    if (options.detentionFacility === 'Other') {
      if (!options.otherDetentionFacilityName) {
        throw new Error('If detentionFacility is "Other", otherDetentionFacilityName must be provided.');
      }
      await expect(this.$static.otherHeading).toBeVisible();
      await expect(this.$static.otherDetentionFacilityNameLabel).toBeVisible();
      await expect(this.$static.otherDetentionFacilityNameLabel).toHaveText('Enter the name of the detention facility');

      await this.$inputs.otherDetentionFacilityNameInput.fill(options.otherDetentionFacilityName);
      await expect(this.$inputs.otherDetentionFacilityNameInput).toHaveValue(options.otherDetentionFacilityName);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
