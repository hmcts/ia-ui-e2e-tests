import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsMultimediaEvidencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    multimediaEvidenceYesRadio: this.page.locator('input[id="multimediaEvidence_Yes"]'),
    multimediaEvidenceNoRadio: this.page.locator('input[id="multimediaEvidence_No"]'),
    multimediaEvidenceDescription: this.page.locator('textarea[id="multimediaEvidenceDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Multimedia evidence', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    multimediaEvidenceQuestion: this.page.getByText('Do you have multimedia evidence?', { exact: true }),
    multimediaEvidenceHint: this.page.getByText('For example, video or sound recordings.', { exact: true }),
    yesLabel: this.page.locator('label[for="multimediaEvidence_Yes"]'),
    noLabel: this.page.locator('label[for="multimediaEvidence_No"]'),
    multimediaEvidenceDescriptionLabel: this.page.locator('label[for="multimediaEvidenceDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsmultimediaEvidence',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.multimediaEvidenceQuestion).toBeVisible(),
      expect(this.$static.multimediaEvidenceHint).toHaveText('For example, video or sound recordings.'),
      expect(this.$static.multimediaEvidenceHint).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { multimediaEvidence: Extract<YesOrNoType, 'Yes'>; multimediaEvidenceDescription?: string }
      | { multimediaEvidence: Extract<YesOrNoType, 'No'>; multimediaEvidenceDescription?: never },
  ): Promise<void> {
    const radio = options.multimediaEvidence === 'Yes' ? this.$inputs.multimediaEvidenceYesRadio : this.$inputs.multimediaEvidenceNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.multimediaEvidence === 'Yes') {
      await expect(this.$static.multimediaEvidenceDescriptionLabel).toHaveText(
        "You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it. (Optional)",
      );
      await expect(this.$static.multimediaEvidenceDescriptionLabel).toBeVisible();

      if (options.multimediaEvidenceDescription) {
        await this.$inputs.multimediaEvidenceDescription.fill(options.multimediaEvidenceDescription);
        await expect(this.$inputs.multimediaEvidenceDescription).toHaveValue(options.multimediaEvidenceDescription);
      }
    } else {
      await expect(this.$inputs.multimediaEvidenceDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
