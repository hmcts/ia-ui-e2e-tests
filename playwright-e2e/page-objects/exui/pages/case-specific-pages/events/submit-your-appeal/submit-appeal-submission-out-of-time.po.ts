import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class SubmitAppealSubmissionOutOfTimePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    reasonsAppealLateTextArea: this.page.locator('textarea[id="applicationOutOfTimeExplanation"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    uploadOutOfTimeEvidenceInput: this.page.locator('input[id="applicationOutOfTimeDocument"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit your appeal' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'The appeal is out of time', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    outOfTimeGuidanceParagraph: this.page.locator('#applicationOutOfTimeText p'),
    reasonsAppealLateLabel: this.page.locator('label[for="applicationOutOfTimeExplanation"] .form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/submitAppeal/submitAppealsubmissionOutOfTimePage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Submit your appeal'),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.outOfTimeGuidanceParagraph.nth(0)).toBeVisible(),
      expect(this.$static.outOfTimeGuidanceParagraph.nth(0)).toHaveText('Enter the reasons for the late appeal if provided by the appellant.'),
      expect(this.$static.outOfTimeGuidanceParagraph.nth(1)).toBeVisible(),
      expect(this.$static.outOfTimeGuidanceParagraph.nth(1)).toHaveText('Upload any supporting evidence provided by the appellant.'),
      expect(this.$static.reasonsAppealLateLabel).toBeVisible(),
      expect(this.$static.reasonsAppealLateLabel).toHaveText('Reasons the appeal is late (Optional)'),
    ]);
  }

  public async completePageAndContinue(options: { uploadFile: boolean; reasonsAppealLate?: string; nameOfFileToUpload?: string }): Promise<void> {
    if (options.reasonsAppealLate) {
      await this.$inputs.reasonsAppealLateTextArea.fill(options.reasonsAppealLate);
      await expect(this.$inputs.reasonsAppealLateTextArea).toHaveValue(options.reasonsAppealLate);
    }

    if (options.uploadFile) {
      const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Late_Appeal.txt';

      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$interactive.uploadOutOfTimeEvidenceInput,
        nameOfFileToUpload: fileToUpload,
      });
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
