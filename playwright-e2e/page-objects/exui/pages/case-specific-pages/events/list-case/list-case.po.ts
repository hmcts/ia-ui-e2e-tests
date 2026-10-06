import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';
import { DataUtils } from '../../../../../../utils/data.utils';

type ListingLocationType = 'Newport Tribunal Centre - Columbus House';

export class ListCasePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    listingLocationDropdown: this.page.locator('select[id="listingLocation"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    listingReferenceInput: this.page.locator('input[id="ariaListingReference"]'),
    listingHoursInput: this.page.locator('input[id="listingLength_hours"]'),
    listingMinutesInput: this.page.locator('input[id="listingLength_minutes"]'),
    listingDayInput: this.page.locator('input[id*="day"]'),
    listingMonthInput: this.page.locator('input[id*="month"]'),
    listingYearInput: this.page.locator('input[id*="year"]'),
    listingHourInput: this.page.locator('input[id*="HearingDate-hour"]'),
    listingMinuteInput: this.page.locator('input[id*="HearingDate-minute"]'),
    listingSecondInput: this.page.locator('input[id*="HearingDate-second"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'List the case', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    addHearingDetailsBelowText: this.page.getByText('Add the hearing details below.', { exact: true }),
    listingReferenceLabel: this.page.locator('label[for="ariaListingReference"]'),
    listingReferenceHint: this.page.locator('label[for="ariaListingReference"] + span'),
    listingLocationLabel: this.page.locator('label[for="listingLocation"]'),
    remoteHearingText: this.page.locator('[id="isRemoteHearing"] span'),
    remoteHearingYesLabel: this.page.locator('label[for="isRemoteHearing_Yes"]'),
    remoteHearingNoLabel: this.page.locator('label[for="isRemoteHearing_No"]'),
    listinglengthHeading: this.page.getByRole('heading', { level: 2, name: 'Listing length', exact: true }),
    hoursLabel: this.page.locator('label[for="listingLength_hours"]'),
    minutesLabel: this.page.locator('label[for="listingLength_minutes"]'),
    dateAndTimeText: this.page.getByText('Date and time', { exact: true }),
    dayText: this.page.locator('span[id*="day"]'),
    monthText: this.page.locator('span[id*="month"]'),
    yearText: this.page.locator('span[id*="year"]'),
    hourText: this.page.locator('span[id*="hour"]'),
    minuteText: this.page.locator('span[id*="minute"]'),
    secondText: this.page.locator('span[id*="second"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/listCase/listCaselistCaseHearing',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.addHearingDetailsBelowText).toBeVisible(),
      expect(this.$static.listingReferenceLabel).toHaveText('Listing reference'),
      expect(this.$static.listingReferenceLabel).toBeVisible(),
      expect(this.$static.listingReferenceHint).toHaveText('Example: LP/12345/2019'),
      expect(this.$static.listingReferenceHint).toBeVisible(),
      expect(this.$static.listingLocationLabel).toHaveText('Listing location'),
      expect(this.$static.listingLocationLabel).toBeVisible(),
      expect(this.$static.remoteHearingText).toHaveText('Will the hearing be held remotely?'),
      expect(this.$static.remoteHearingText).toBeVisible(),
      expect(this.$static.remoteHearingYesLabel).toHaveText('Yes'),
      expect(this.$static.remoteHearingYesLabel).toBeVisible(),
      expect(this.$static.remoteHearingNoLabel).toHaveText('No'),
      expect(this.$static.remoteHearingNoLabel).toBeVisible(),
      expect(this.$static.listinglengthHeading).toBeVisible(),
      expect(this.$static.hoursLabel).toHaveText('Hours'),
      expect(this.$static.hoursLabel).toBeVisible(),
      expect(this.$static.minutesLabel).toHaveText('Minutes'),
      expect(this.$static.minutesLabel).toBeVisible(),
      expect(this.$static.dateAndTimeText).toBeVisible(),
      expect(this.$static.dayText).toHaveText('Day'),
      expect(this.$static.dayText).toBeVisible(),
      expect(this.$static.monthText).toHaveText('Month'),
      expect(this.$static.monthText).toBeVisible(),
      expect(this.$static.yearText).toHaveText('Year'),
      expect(this.$static.yearText).toBeVisible(),
      expect(this.$static.hourText).toHaveText('Hour'),
      expect(this.$static.hourText).toBeVisible(),
      expect(this.$static.minuteText).toHaveText('Minute'),
      expect(this.$static.minuteText).toBeVisible(),
      expect(this.$static.secondText).toHaveText('Second'),
      expect(this.$static.secondText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    listingLocation: ListingLocationType;
    remoteHearing: YesOrNoType;
    listingLengthHours?: number;
    listingLengthMinutes?: number;
    dateToSet: 'tomorrow';
    hourToSet: number;
  }): Promise<string> {
    const listingReference = `LP/${await this.dataUtils.generateRandomNumber({ digitLength: 5 })}/${new Date().getFullYear()}`;
    await this.$inputs.listingReferenceInput.fill(listingReference);
    await expect(this.$inputs.listingReferenceInput).toHaveValue(listingReference);

    await this.$interactive.listingLocationDropdown.selectOption({ label: options.listingLocation });
    const selectedOption = await this.$interactive.listingLocationDropdown.locator('option:checked').textContent();
    expect(selectedOption?.trim()).toBe(options.listingLocation);

    await this.page.getByRole('radio', { name: options.remoteHearing, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.remoteHearing, exact: true })).toBeChecked();

    if (options.listingLengthHours !== undefined) {
      await this.$inputs.listingHoursInput.fill(options.listingLengthHours.toString());
      await expect(this.$inputs.listingHoursInput).toHaveValue(options.listingLengthHours.toString());
    }

    if (options.listingLengthMinutes !== undefined) {
      await this.$inputs.listingMinutesInput.fill(options.listingLengthMinutes.toString());
      await expect(this.$inputs.listingMinutesInput).toHaveValue(options.listingLengthMinutes.toString());
    }

    switch (options.dateToSet) {
      case 'tomorrow': {
        const date = await this.dataUtils.getDateFromToday({ dayOffset: 1 });
        await this.$inputs.listingDayInput.fill(date.day.toString());
        await expect(this.$inputs.listingDayInput).toHaveValue(date.day.toString());

        await this.$inputs.listingMonthInput.fill(date.month.toString());
        await expect(this.$inputs.listingMonthInput).toHaveValue(date.month.toString());

        await this.$inputs.listingYearInput.fill(date.year.toString());
        await expect(this.$inputs.listingYearInput).toHaveValue(date.year.toString());
      }
    }

    await this.$inputs.listingHourInput.fill(options.hourToSet.toString());
    await expect(this.$inputs.listingHourInput).toHaveValue(options.hourToSet.toString());

    await this.navigationClick(this.$interactive.continueButton);
    return listingReference;
  }
}
