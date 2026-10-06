import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class ReviewHearingRequirementsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    willTheAppellantAttendTheHearing: 'Will the appellant attend the hearing?',
    willAppellantGiveOralEvidence: 'Will the appellant give oral evidence at the hearing?',
    willAnyWitnessesAttendTheHearing: 'Will any witnesses attend the hearing?',
    witnessDetails: 'Witness details',
    willApellantOrAnyOneElseGiveOralEvidenceOutsideUk: 'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
    doYouNeedAnyInterpreterServices: 'Do you need interpreter services on the day?',
    willAnyWitnessesRequireInterpreterServices: 'Will any of the witnesses require a spoken or sign language interpreter at the hearing?',
    doYouNeedRoomWithStepFreeAccess: 'Do you need a hearing room with step-free access?',
    doYouNeedHearingLoop: 'Do you need a hearing loop?',
  } as const satisfies Record<string, string | RegExp>;

  public readonly $inputs = {
    listingLengthHoursInput: this.page.locator('input[id="listingLength_hours"]'),
    listingLengthMinutesInput: this.page.locator('input[id="listingLength_minutes"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    hearingrequirementsDescription: this.page.locator('[id="reviewHearingRequirementsTitle"] p'),
    listingLengthHeading: this.page.getByRole('heading', { level: 2, name: 'Listing length' }),
    listingLengthHoursLabel: this.page.locator('label[for="listingLength_hours"]'),
    listingLengthMinutesLabel: this.page.locator('label[for="listingLength_minutes"]'),
    continueToSeeAddtionalAdjustmentsText: this.page.locator('[id="continueToSeeAdditionalAdjustments"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsreviewHearingRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public $questionLocator = (questionKey: keyof typeof this.listOfQuestions): Locator => {
    const question = this.listOfQuestions[questionKey];
    return this.page
      .getByText(question, { exact: !((question as string | RegExp) instanceof RegExp) })
      .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') });
  };

  public $questionValueLocator(questionKey: keyof typeof this.listOfQuestions): Locator {
    const question = this.listOfQuestions[questionKey];
    return this.page
      .locator('dt[class="case-field__label"]', { hasText: question })
      .locator('+ dd[class="case-field__value"] span')
      .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') });
  }

  public async verifyAppellantAndOrWitnessesInterpreterRequirements(options: {
    appellantSpokenLanguage?: string;
    appellantSignLanguage?: string;
    witnessNames?: string[] | string;
    witnessSpokenlanguage?: string[] | string;
    witnessSignLanguage?: string[] | string;
  }): Promise<void> {
    if (!options.appellantSpokenLanguage && !options.appellantSignLanguage && !options.witnessNames) {
      throw new Error('At least one of appellantSpokenLanguage, appellantSignLanguage or witnessNames must be provided');
    } else if (options.witnessNames && !options.witnessSpokenlanguage && !options.witnessSignLanguage) {
      throw new Error('If witnessNames is provided, witnessSpokenLanguage or witnessSignLanguage must also be provided');
    }

    const witnessNames = options.witnessNames ? (Array.isArray(options.witnessNames) ? options.witnessNames : [options.witnessNames]) : [];

    const witnessSpokenLanguages = options.witnessSpokenlanguage
      ? Array.isArray(options.witnessSpokenlanguage)
        ? options.witnessSpokenlanguage
        : [options.witnessSpokenlanguage]
      : [];

    const witnessSignLanguages = options.witnessSignLanguage
      ? Array.isArray(options.witnessSignLanguage)
        ? options.witnessSignLanguage
        : [options.witnessSignLanguage]
      : [];

    if (options.appellantSpokenLanguage) {
      const question = 'Tell us which spoken language is needed for the appellant';
      await expect(this.page.getByText(question, { exact: true })).toBeVisible();
      await expect(
        this.page
          .locator('dl[class="complex-panel-title"]', { hasText: question })
          .locator('+ table th span')
          .last()
          .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
      ).toHaveText('Spoken language');
      await expect(
        this.page
          .locator('dl[class="complex-panel-title"]', { hasText: question })
          .locator('+ table td span')
          .last()
          .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
      ).toHaveText(options.appellantSpokenLanguage);
    }

    if (options.appellantSignLanguage) {
      const question = 'Tell us which sign language is needed for the appellant';
      await expect(this.page.getByText(question, { exact: true })).toBeVisible();
      await expect(
        this.page
          .locator('dl[class="complex-panel-title"]', { hasText: question })
          .locator('+ table th span')
          .last()
          .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
      ).toHaveText('Sign language');
      await expect(
        this.page
          .locator('dl[class="complex-panel-title"]', { hasText: question })
          .locator('+ table td span')
          .last()
          .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
      ).toHaveText(options.appellantSignLanguage);
    }

    if (options.witnessNames) {
      for (let i = 0; i < witnessNames.length; i++) {
        const witnessName = witnessNames[i];
        const spokenLanguage = witnessSpokenLanguages[i];
        const signLanguage = witnessSignLanguages[i];

        if (spokenLanguage) {
          const question = `Which spoken language interpreter is needed for ${witnessName}?`;
          await expect(
            this.page.getByText(question, { exact: true }).filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
          ).toBeVisible();

          await expect(
            this.page
              .locator('dl[class="complex-panel-title"]', { hasText: question })
              .locator('+ table th span')
              .last()
              .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
          ).toHaveText('Spoken language');
          await expect(
            this.page
              .locator('dl[class="complex-panel-title"]', { hasText: question })
              .locator('+ table td span')
              .last()
              .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
          ).toHaveText(spokenLanguage);
        }

        if (signLanguage) {
          const question = `Which sign language is needed for ${witnessName}?`;
          await expect(this.page.getByText(question, { exact: true })).toBeVisible();

          await expect(
            this.page
              .locator('dl[class="complex-panel-title"]', { hasText: question })
              .locator('+ table th span')
              .last()
              .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
          ).toHaveText('Sign language');
          await expect(
            this.page
              .locator('dl[class="complex-panel-title"]', { hasText: question })
              .locator('+ table td span')
              .last()
              .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
          ).toHaveText(signLanguage);
        }
      }
    }
  }

  public async continueOntoNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
