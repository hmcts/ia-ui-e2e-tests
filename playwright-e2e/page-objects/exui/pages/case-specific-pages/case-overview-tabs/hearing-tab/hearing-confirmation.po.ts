import { ExuiBase } from '../../../../exui-base';
import { expect, Locator, Page } from '@playwright/test';

export class HearingConfirmationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    viewStatusOfHearingInHearingsTabLink: this.page.locator('a[class="govuk-link"][href*="/hearings"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Hearing request submitted', level: 1, exact: true }),
    hearingRequestWillBeProcessedText: this.page.getByText('Your hearing request will now be processed', { exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { name: 'What happens next', level: 2, exact: true }),
    whatHappensNextText: this.page.locator('h2', { hasText: 'What happens next' }).locator('~ div'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-confirmation',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.hearingRequestWillBeProcessedText).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextText.nth(0)).toBeVisible(),
      expect(this.$static.whatHappensNextText.nth(0)).toHaveText('You can view the status of this hearing in the hearings tab .'),
      expect(this.$static.whatHappensNextText.nth(1)).toBeVisible(),
      expect(this.$static.whatHappensNextText.nth(1)).toHaveText(
        'If the hearing cannot be listed automatically, it will be sent to a member of staff to be processed. A notice of hearing will be issued once the hearing is listed, you will not be notified of the listing.',
      ),
    ]);
  }

  public async clickViewStatusOfHearingInHearingsTabLink(): Promise<void> {
    await this.navigationClick(this.$interactive.viewStatusOfHearingInHearingsTabLink);
  }
}
