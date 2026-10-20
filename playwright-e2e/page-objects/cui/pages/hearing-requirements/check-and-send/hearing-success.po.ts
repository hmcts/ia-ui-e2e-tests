import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { DataUtils } from '../../../../../utils';

export class HearingSuccessPage extends CuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    seeYourAppealProgressButton: this.page.getByRole('button', { name: 'See your appeal progress', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly whatHappensNextLocator = this.page.getByRole('heading', { level: 2, name: 'What happens next', exact: true });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'You have told us what you will need at the hearing', exact: true }),
    whatHappensNextHeading: this.whatHappensNextLocator,
    whatHappensNextBulletPoint1: this.whatHappensNextLocator.locator('+ div li').nth(0),
    whatHappensNextBulletPoint2: this.whatHappensNextLocator.locator('+ div li').nth(1),
    whatHappensNextBulletPoint3: this.whatHappensNextLocator.locator('+ div li').nth(2),
    helpfullInformationHeading: this.page.getByText('Helpful Information', { exact: true }),
    helpfullInformationBulletPoint1: this.page.locator('div', { hasText: 'Helpful Information' }).last().locator('li').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-success', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = (
      await this.dataUtils.getDateFromToday({ dayOffset: 14, formattingOptions: { day: '2-digit', month: 'long', year: 'numeric' } })
    ).formattedDate;

    await Promise.all([
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint1).toHaveText(
        'A Tribunal Caseworker will look at your appointment needs. If you have asked for an interpreter, step-free access or a hearing loop, these will be provided. If you have asked for anything else, it will be considered but may not be provided',
      ),
      expect(this.$static.whatHappensNextBulletPoint1).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint2).toHaveText(
        'A Tribunal Caseworker will then contact you to tell you where and when the appointment will take place and what will be provided',
      ),
      expect(this.$static.whatHappensNextBulletPoint2).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint3).toHaveText(`This should be by ${expectedDate} but may take longer than that`),
      expect(this.$static.whatHappensNextBulletPoint3).toBeVisible(),

      expect(this.$static.helpfullInformationHeading).toBeVisible(),
      expect(this.$static.helpfullInformationBulletPoint1).toHaveText('What to expect at a case management appointment'),
      expect(this.$static.helpfullInformationBulletPoint1).toBeVisible(),
    ]);
  }
}
