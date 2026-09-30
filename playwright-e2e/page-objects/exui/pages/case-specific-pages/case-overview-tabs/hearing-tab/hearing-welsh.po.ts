import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingWelshPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    hearingWelshYesRadio: this.page.locator('input[id="welsh_hearing_yes"]'),
    hearingWelshNoRadio: this.page.locator('input[id="welsh_hearing_no"]'),
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Does this hearing need to be in Welsh?', level: 1, exact: true }),
    welshHearingHintText: this.page.locator('[id="welsh-hint"]'),
    hearingWelshYesLabel: this.page.locator('label[for="welsh_hearing_yes"]'),
    hearingWelshNoLabel: this.page.locator('label[for="welsh_hearing_no"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-welsh',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.welshHearingHintText).toHaveText('This means the entire hearing will be carried out in Welsh.'),
      expect(this.$static.welshHearingHintText).toBeVisible(),
      expect(this.$static.hearingWelshYesLabel).toHaveText('Yes'),
      expect(this.$static.hearingWelshYesLabel).toBeVisible(),
      expect(this.$static.hearingWelshNoLabel).toHaveText('No'),
      expect(this.$static.hearingWelshNoLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { isWelshHearingRequired: YesOrNoType }): Promise<void> {
    if (options.isWelshHearingRequired === 'Yes') {
      await this.$interactive.hearingWelshYesRadio.click();
      await expect(this.$interactive.hearingWelshYesRadio).toBeChecked();
    } else {
      await expect(this.$interactive.hearingWelshNoRadio).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
