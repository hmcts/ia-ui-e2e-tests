import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class HearingVenuePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    addLocationButton: this.page.locator('[data-module="govuk-button"]', { hasText: 'Add location' }),
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    searchLocationInput: this.page.locator('input[id="searchVenueLocation"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'What are the hearing venue details?', level: 1, exact: true }),
    locationHintText: this.page.locator('[id="location-hint"]'),
    searchForLocationLabel: this.page.locator('label[for="searchVenueLocation"]'),
    youCanCheckTheVenueText: this.page.locator('[class="govuk-inset-text"]', { hasText: 'You can check the venue' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-venue',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.locationHintText).toHaveText(
        'If this is a fully remote hearing you must still select the court or tribunal which will be managing the case.',
      ),
      expect(this.$static.locationHintText).toBeVisible(),
      expect(this.$static.searchForLocationLabel).toHaveText('Search for a location by name'),
      expect(this.$static.searchForLocationLabel).toBeVisible(),
      expect(this.$static.youCanCheckTheVenueText).toHaveText(
        'You can check the venue has the required facilities or reasonable adjustments using Court Finder (opens in new tab)',
      ),
      expect(this.$static.youCanCheckTheVenueText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { location: string }): Promise<void> {
    const locatorToSelect = this.page.locator('[role="listbox"] span', {
      hasText: new RegExp(`^\\s*${options.location}`),
    });

    await expect(async () => {
      const currentValue = await this.$inputs.searchLocationInput.inputValue();
      if (currentValue.length > 0) {
        await this.$inputs.searchLocationInput.clear();
      }

      await this.$inputs.searchLocationInput.pressSequentially(options.location, {
        delay: 500,
      });

      await expect(locatorToSelect).toBeVisible({ timeout: 10_000 });
    }).toPass({
      intervals: [100],
      timeout: 25_000,
    });

    await locatorToSelect.click();
    await expect(this.$inputs.searchLocationInput).toHaveValue(new RegExp(`^\\s*${options.location}`));
    await this.$interactive.addLocationButton.click();
    await expect(this.page.locator('ul[class*="selection-container"] li', { hasText: options.location })).toBeVisible();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
