import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

type DateToAvoid = {
  day: string;
  month: string;
  year: string;
  reason: string;
};

export class HearingRequirementsDatesToAvoidPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    datesToAvoidYesRadio: this.page.locator('input[id="datesToAvoidYesNo_Yes"]'),
    datesToAvoidNoRadio: this.page.locator('input[id="datesToAvoidYesNo_No"]'),
    dayInputs: this.page.locator('input[name="dateToAvoid-day"]'),
    monthInputs: this.page.locator('input[name="dateToAvoid-month"]'),
    yearInputs: this.page.locator('input[name="dateToAvoid-year"]'),
    reasonInputs: this.page.locator('textarea[id^="datesToAvoid_"][id$="_dateToAvoidReason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.locator('#datesToAvoid').getByRole('button', { name: 'Add new', exact: true }).first(),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Hearing dates to avoid', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    datesToAvoidQuestion: this.page.getByText('Are there any dates that the appellant or their on-day representation cannot attend?', {
      exact: true,
    }),
    yesLabel: this.page.locator('label[for="datesToAvoidYesNo_Yes"]'),
    noLabel: this.page.locator('label[for="datesToAvoidYesNo_No"]'),
    datesToAvoidDescription: this.page.locator('#datesToAvoidDescription p'),
    hearingDateRangeDescription: this.page.locator('[field_id="hearingDateRangeDescription"] .case-field__value'),
    datesToAvoidCollectionHeading: this.page.locator('#datesToAvoid').getByRole('heading', { level: 2, name: 'Dates to avoid', exact: true }),
    dateLabel: this.page.locator('#dateToAvoid legend span').first(),
    dayLabel: this.page.locator('#day-label-dateToAvoid-day').first(),
    monthLabel: this.page.locator('#month-label-dateToAvoid-month').first(),
    yearLabel: this.page.locator('#year-label-dateToAvoid-year').first(),
    reasonLabel: this.page.locator('label[for^="datesToAvoid_"][for$="_dateToAvoidReason"]').first(),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsdatesToAvoid',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.datesToAvoidQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { datesToAvoid: Extract<YesOrNoType, 'Yes'>; dates: [DateToAvoid, ...DateToAvoid[]] }
      | { datesToAvoid: Extract<YesOrNoType, 'No'>; dates?: never },
  ): Promise<void> {
    const radio = options.datesToAvoid === 'Yes' ? this.$inputs.datesToAvoidYesRadio : this.$inputs.datesToAvoidNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.datesToAvoid === 'Yes') {
      await Promise.all([
        expect(this.$static.datesToAvoidDescription).toHaveText('Tell us which dates and explain why the case cannot be heard on these dates.'),
        expect(this.$static.datesToAvoidDescription).toBeVisible(),
        expect(this.$static.hearingDateRangeDescription).toBeVisible(),
        expect(this.$static.datesToAvoidCollectionHeading).toBeVisible(),
      ]);

      for (const [index, date] of options.dates.entries()) {
        await this.$interactive.addNewButton.click();

        if (index === 0) {
          await Promise.all([
            expect(this.$static.dateLabel).toHaveText('Date'),
            expect(this.$static.dateLabel).toBeVisible(),
            expect(this.$static.dayLabel).toHaveText('Day'),
            expect(this.$static.dayLabel).toBeVisible(),
            expect(this.$static.monthLabel).toHaveText('Month'),
            expect(this.$static.monthLabel).toBeVisible(),
            expect(this.$static.yearLabel).toHaveText('Year'),
            expect(this.$static.yearLabel).toBeVisible(),
            expect(this.$static.reasonLabel).toHaveText('Reason'),
            expect(this.$static.reasonLabel).toBeVisible(),
          ]);
        }

        await this.$inputs.dayInputs.nth(index).fill(date.day);
        await this.$inputs.monthInputs.nth(index).fill(date.month);
        await this.$inputs.yearInputs.nth(index).fill(date.year);
        await this.$inputs.reasonInputs.nth(index).fill(date.reason);

        await Promise.all([
          expect(this.$inputs.dayInputs.nth(index)).toHaveValue(date.day),
          expect(this.$inputs.monthInputs.nth(index)).toHaveValue(date.month),
          expect(this.$inputs.yearInputs.nth(index)).toHaveValue(date.year),
          expect(this.$inputs.reasonInputs.nth(index)).toHaveValue(date.reason),
        ]);
      }
    } else {
      await expect(this.$static.datesToAvoidDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
