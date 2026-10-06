import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export const NOTES_APPLICABLE_TO_PICK_FROM = [
  'There is a point of special difficulty or importance',
  'There are special reasons, such as the need to request the First-tier Tribunal to provide observations on the grounds of appeal',
  "It's clear at this stage that the issue is likely to be used for giving country guidance",
] as const;

type NotesApplicableToPickFrom = (typeof NOTES_APPLICABLE_TO_PICK_FROM)[number];

export class DecideFtpaApplicationAppellantDecisionReasonNotesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    proviceAnyInformationTextarea: this.page.locator('textarea[id="ftpaAppellantRjDecisionNotesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    notesForUpperTribunalLevel1Heading: this.page.getByRole('heading', { level: 1, name: 'Notes for the Upper Tribunal', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    notesForUpperTribunalLevel4Heading: this.page.getByRole('heading', { level: 4, name: 'Notes for the Upper Tribunal', exact: true }),
    notesForUpperTribunalParagraph: this.page.locator('h4', { hasText: 'Notes for the Upper Tribunal' }).locator('+ p'),
    tickAnyApplicablePointsHeading: this.page.getByRole('heading', { level: 2, name: 'Tick any applicable points (Optional)', exact: true }),
    provideAnyInformationLabel: this.page.locator('label[for="ftpaAppellantRjDecisionNotesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationftpaAppellantDecisionReasonsNotes',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.notesForUpperTribunalLevel1Heading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.notesForUpperTribunalLevel4Heading).toBeVisible(),
      expect(this.$static.notesForUpperTribunalParagraph).toBeVisible(),
      expect(this.$static.notesForUpperTribunalParagraph)
        .toHaveText(`Do not issue any case specific directions to the parties regarding the onward conduct of the appeal in
the Upper Tribunal. The Upper Tribunal will prepare and issue standard directions in every case. You 
 should refer the file to the Principal Resident Judge of UTIAC if you believe further directions should 
 be issued in advance of the initial Upper Tribunal Hearing.`),
      expect(this.$static.tickAnyApplicablePointsHeading).toBeVisible(),
      ...NOTES_APPLICABLE_TO_PICK_FROM.map((note) => expect(this.page.getByRole('checkbox', { name: note, exact: true })).toBeVisible()),
      expect(this.$static.provideAnyInformationLabel).toBeVisible(),
      expect(this.$static.provideAnyInformationLabel).toHaveText(
        'Provide any information that may be helpful to the Upper Tribunal judge (Optional)',
      ),
    ]);
  }

  public async completePageAndContinue(options?: {
    optionalPointsApplicable?: NotesApplicableToPickFrom[];
    optionalInformationForUpperTribunal?: string;
  }): Promise<void> {
    await this.verifyAllTextOnPage();

    if (options?.optionalPointsApplicable) {
      for (const note of options.optionalPointsApplicable) {
        const checkbox = this.page.getByRole('checkbox', { name: note, exact: true });
        await checkbox.check();
        await expect(checkbox).toBeChecked();
      }
    }

    if (options?.optionalInformationForUpperTribunal) {
      await this.$inputs.proviceAnyInformationTextarea.fill(options.optionalInformationForUpperTribunal);
      await expect(this.$inputs.proviceAnyInformationTextarea).toHaveValue(options.optionalInformationForUpperTribunal);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
