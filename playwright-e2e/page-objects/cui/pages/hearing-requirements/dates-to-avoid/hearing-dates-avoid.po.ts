import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../citizen-types';
import { DataUtils } from '../../../../../utils';

export class HearingDatesAvoidPage extends CuiBase {
  private dataUtils: DataUtils = new DataUtils();

  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page
      .getByRole('heading', {
        name: /Are there any dates between .+ and .+ that you or any witnesses cannot go to the hearing\?/,
        level: 1,
        exact: true,
      })
      .or(
        this.page.getByRole('heading', {
          name: /Is there another date between .+ and .+ that you or any witnesses cannot go to the hearing\?/,
          level: 1,
          exact: true,
        }),
      ),
    datesToAvoidHintText: this.page.locator('div[id="answer-hint"]'),
    yesLabel: this.page.locator('input[type="radio"][value="yes"] + label'),
    noLabel: this.page.locator('input[type="radio"][value="no"] + label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(options: { urlPath: 'hearing-dates-avoid' | 'hearing-dates-avoid-new' }): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: options.urlPath, pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const startOfPageHeadingDateRange = (await this.dataUtils.getDateFromToday({ dayOffset: 5 })).formattedLongMonthDate;
    const endOfPageHeadingDateRange = (await this.dataUtils.getDateFromToday({ dayOffset: 47 })).formattedLongMonthDate;
    let pageHeadingText: string;

    if (this.page.url().includes('hearing-dates-avoid-new')) {
      pageHeadingText = `Is there another date between ${startOfPageHeadingDateRange} and ${endOfPageHeadingDateRange} that you or any witnesses cannot go to the hearing?`;
    } else {
      pageHeadingText = `Are there any dates between ${startOfPageHeadingDateRange} and ${endOfPageHeadingDateRange} that you or any witnesses cannot go to the hearing?`;
    }

    await Promise.all([
      expect(this.$static.pageHeading).toHaveText(pageHeadingText),
      expect(this.$static.pageHeading).toBeVisible(),

      expect(this.$static.datesToAvoidHintText).toHaveText(
        'You will need to tell us why you or any witnesses cannot go to the hearing on the dates you include.',
      ),
      expect(this.$static.datesToAvoidHintText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { anyDatesToAvoid: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${option.anyDatesToAvoid.toLowerCase()}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
