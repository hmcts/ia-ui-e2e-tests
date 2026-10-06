import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class CompleteDecisionAndReasonsUploadDecisionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    chooseFileButton: this.page.locator('input[id="finalDecisionAndReasonsDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
    confirmDocumentSignedTodayCheckbox: this.page.locator('input[name="isDocumentSignedToday_values"]'),
    feeAwardedIsConsistentWithDecisionCheckbox: this.page.locator('input[name="isFeeConsistentWithDecision_values"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Complete decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    uploadDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 2, name: 'Upload your decision and reasons as a PDF', exact: true }),
    decisionAndReasonsLabel: this.page.locator('label[for="finalDecisionAndReasonsDocument"]'),
    importantText: this.page.getByText('IMPORTANT:', { exact: true }),
    importantBulletPoint: this.page.locator('markdown', { hasText: 'IMPORTANT:' }).locator('li'),
    documentSignedTodayLabel: this.page.locator('label[for*="isDocumentSignedToday"]'),
    feeAwardedIsConsistentLabel: this.page.locator('label[for*="isFeeConsistentWithDecision"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/sendDecisionAndReasons/sendDecisionAndReasonsuploadDecisionAndReasons',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.uploadDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.decisionAndReasonsLabel).toBeVisible(),
      expect(this.$static.decisionAndReasonsLabel).toHaveText('Decision and reasons'),
      expect(this.$static.importantText).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(0)).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(0)).toHaveText("The date of signature must be today's date"),
      expect(this.$static.importantBulletPoint.nth(1)).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(1)).toHaveText('You can only apply a fee award when you have allowed the appeal'),
      expect(this.$static.documentSignedTodayLabel).toBeVisible(),
      expect(this.$static.documentSignedTodayLabel).toHaveText("I confirm this document is signed with today's date."),
      expect(this.$static.feeAwardedIsConsistentLabel).toBeVisible(),
      expect(this.$static.feeAwardedIsConsistentLabel).toHaveText('Ensure that the fee award is consistent with your decision.'),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'SendDecisionAndReasons.pdf';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.chooseFileButton,
      nameOfFileToUpload: fileToUpload,
    });

    await this.$interactive.confirmDocumentSignedTodayCheckbox.check();
    await expect(this.$interactive.confirmDocumentSignedTodayCheckbox).toBeChecked();

    await this.$interactive.feeAwardedIsConsistentWithDecisionCheckbox.check();
    await expect(this.$interactive.feeAwardedIsConsistentWithDecisionCheckbox).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
