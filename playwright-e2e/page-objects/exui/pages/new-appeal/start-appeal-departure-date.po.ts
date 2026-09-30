import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealDepartureDatePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    departureDateDayInput: this.page.locator('input[id="dateClientLeaveUk-day"]'),
    departureDateMonthInput: this.page.locator('input[id="dateClientLeaveUk-month"]'),
    departureDateYearInput: this.page.locator('input[id="dateClientLeaveUk-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Departure date', exact: true }),
    departureDateLabel: this.page.locator('[id="dateClientLeaveUk"] legend span'),
    departureDateDayLabel: this.page.locator('[id="day-label-dateClientLeaveUk-day"]'),
    departureDateMonthLabel: this.page.locator('[id="month-label-dateClientLeaveUk-month"]'),
    departureDateYearLabel: this.page.locator('[id="year-label-dateClientLeaveUk-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealdepartureDate',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.departureDateLabel).toBeVisible(),
      expect(this.$static.departureDateLabel).toHaveText('When did your client leave the UK?'),
      expect(this.$static.departureDateDayLabel).toBeVisible(),
      expect(this.$static.departureDateDayLabel).toHaveText('Day'),
      expect(this.$static.departureDateMonthLabel).toBeVisible(),
      expect(this.$static.departureDateMonthLabel).toHaveText('Month'),
      expect(this.$static.departureDateYearLabel).toBeVisible(),
      expect(this.$static.departureDateYearLabel).toHaveText('Year'),
    ]);
  }

  public async completePageAndContinue(options: { departureDate: { day: number; month: number; year: number } }): Promise<void> {
    const day = options.departureDate.day.toString();
    const month = options.departureDate.month.toString();
    const year = options.departureDate.year.toString();

    await this.$inputs.departureDateDayInput.fill(day);
    await expect(this.$inputs.departureDateDayInput).toHaveValue(day);

    await this.$inputs.departureDateMonthInput.fill(month);
    await expect(this.$inputs.departureDateMonthInput).toHaveValue(month);

    await this.$inputs.departureDateYearInput.fill(year);
    await expect(this.$inputs.departureDateYearInput).toHaveValue(year);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
