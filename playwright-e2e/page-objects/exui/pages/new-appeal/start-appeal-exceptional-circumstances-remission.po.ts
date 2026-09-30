import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealExceptionalCircumstancesRemissionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    exceptionalCircumstancesTextArea: this.page.locator('textarea[id="exceptionalCircumstances"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.locator('div[id="remissionEcEvidenceDocuments"] button', { hasText: 'Add new' }),
    supportingEvidenceDocumentUploadInput: this.page.locator('input[id="remissionEcEvidenceDocuments_value"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Exceptional Circumstances', exact: true }),
    exceptionalCircumstancesLabel: this.page.locator('label[for="exceptionalCircumstances"] span.form-label'),
    supportingEvidenceHeading: this.page.getByRole('heading', { level: 3, name: 'Provide supporting evidence', exact: true }),
    supportingEvidenceParagraph: this.page.locator('[id="exceptionalCircumstancesSupportEvidenceAdvice"] p'),
    supportingEvidenceUploadHeading: this.page.locator('div[id="remissionEcEvidenceDocuments"] h2'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealexceptionalCircumstancesRemission',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.exceptionalCircumstancesLabel).toBeVisible(),
      expect(this.$static.exceptionalCircumstancesLabel).toHaveText('Explain the exceptional circumstances which justify remission of the fee'),
      expect(this.$static.supportingEvidenceHeading).toBeVisible(),
      expect(this.$static.supportingEvidenceParagraph).toBeVisible(),
      expect(this.$static.supportingEvidenceParagraph).toHaveText(
        'You should provide evidence to support your explanation such as notices threatening legal action due to non-payment of bills or housing costs; details of income, savings or expenses; or any other relevant information.',
      ),
      expect(this.$static.supportingEvidenceUploadHeading).toBeVisible(),
      expect(this.$static.supportingEvidenceUploadHeading).toHaveText('Supporting evidence (Optional)'),
    ]);
  }

  public async completePageAndContinue(options: {
    exceptionalCircumstances: string;
    uploadFile: boolean;
    nameOfFileToUpload?: string;
  }): Promise<void> {
    await this.$inputs.exceptionalCircumstancesTextArea.fill(options.exceptionalCircumstances);
    await expect(this.$inputs.exceptionalCircumstancesTextArea).toHaveValue(options.exceptionalCircumstances);

    if (options.uploadFile) {
      const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Start_Appeal_Exceptional_Circumstances_Remission.txt';

      await this.$interactive.addNewButton.click();
      await expect(this.$interactive.supportingEvidenceDocumentUploadInput).toBeVisible();

      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$interactive.supportingEvidenceDocumentUploadInput,
        nameOfFileToUpload: fileToUpload,
      });
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
