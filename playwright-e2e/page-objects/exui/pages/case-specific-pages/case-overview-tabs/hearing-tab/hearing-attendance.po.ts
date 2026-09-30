import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

const methodsOfAttendance = ['In Person', 'Telephone', 'Video'] as const;
type MethodsOfAttendanceType = (typeof methodsOfAttendance)[number];

export class HearingAttendancePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    numberOfPeopleAttendingInPerson: this.page.locator('input[id="attendance-number"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Participant attendance', level: 1, exact: true }),
    contactDetailsText: this.page.getByText('Where known, contact details for remote attendees will be included in the request.', { exact: true }),
    paperHearingHeading: this.page.getByRole('heading', { name: 'Will this be a paper hearing?', level: 3, exact: true }),
    paperHearingYesLabel: this.page.locator('label[for="paperHearingYes"]'),
    paperHearingNoLabel: this.page.locator('label[for="paperHearingNo"]'),
    methodsOfAttendanceHeading: this.page.getByRole('heading', {
      name: 'What will be the methods of attendance for this hearing?',
      level: 3,
      exact: true,
    }),
    howWillEachPersonAttendHeading: this.page.getByRole('heading', {
      name: 'How will each participant attend the hearing?',
      level: 3,
      exact: true,
    }),
    howManyAttendHearingInPersonHeading: this.page.getByRole('heading', {
      name: 'How many people will attend the hearing in person?',
      level: 3,
      exact: true,
    }),
    howManyAttendHearingInPersonHintText: this.page.locator('[id="attendance-number-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-attendance',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(options: { applicantName: string; witnessNames?: string[] }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.contactDetailsText).toBeVisible(),
      expect(this.$static.paperHearingHeading).toBeVisible(),
      expect(this.$static.paperHearingYesLabel).toHaveText('Yes'),
      expect(this.$static.paperHearingYesLabel).toBeVisible(),
      expect(this.$static.paperHearingNoLabel).toHaveText('No'),
      expect(this.$static.paperHearingNoLabel).toBeVisible(),
      expect(this.$static.methodsOfAttendanceHeading).toBeVisible(),
      ...methodsOfAttendance.map((method) => expect(this.page.getByRole('checkbox', { name: method, exact: true })).toBeVisible()),
      expect(this.page.getByText(options.applicantName, { exact: true })).toBeVisible(),
      ...(options.witnessNames ?? []).map((witnessName) => expect(this.page.getByText(witnessName, { exact: true })).toBeVisible()),
      expect(this.$static.howWillEachPersonAttendHeading).toBeVisible(),
      expect(this.$static.howManyAttendHearingInPersonHeading).toBeVisible(),
      expect(this.$static.howManyAttendHearingInPersonHintText).toHaveText(
        'Estimate how many people will attend in person, excluding judicial members. This number will determine the room size.',
      ),
      expect(this.$static.howManyAttendHearingInPersonHintText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    applicantName: string;
    witnessNames?: string[];
    paperHearing?: YesOrNoType;
    methodOfAttendingHearing?: MethodsOfAttendanceType[];
    howWillEachParticipantAttend: MethodsOfAttendanceType | 'Not in Attendance';
    numberOfPeopleAttendingInPerson: number;
  }): Promise<void> {
    if (options.paperHearing) {
      await this.page.getByLabel(options.paperHearing, { exact: true }).click();
    }

    if (options.methodOfAttendingHearing) {
      for (const method of options.methodOfAttendingHearing) {
        await this.page.getByLabel(method, { exact: true }).click();
      }
    }

    const applicantSelectLocator = this.page.locator('label', { hasText: options.applicantName }).locator('+ select');
    await applicantSelectLocator.selectOption({ label: options.howWillEachParticipantAttend });
    await expect(applicantSelectLocator.locator('option:checked')).toHaveText(options.howWillEachParticipantAttend);

    options.witnessNames?.forEach(async (witnessName) => {
      const witnessSelectLocator = this.page.locator('label', { hasText: witnessName }).locator('+ select');
      await witnessSelectLocator.selectOption({ label: options.howWillEachParticipantAttend });
      await expect(witnessSelectLocator.locator('option:checked')).toHaveText(options.howWillEachParticipantAttend);
    });

    await this.$inputs.numberOfPeopleAttendingInPerson.fill(options.numberOfPeopleAttendingInPerson.toString());

    await this.navigationClick(this.$interactive.continueButton);
  }
}
