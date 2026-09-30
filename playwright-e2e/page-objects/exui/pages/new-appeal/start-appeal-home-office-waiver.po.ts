import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealHomeOfficeWaiverPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    homeOfficeWaiverDocumentUploadInput: this.page.locator('input[id="homeOfficeWaiverDocument"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Home Office waiver', exact: true }),
    homeOfficeWaiverAdviceParagraph: this.page.locator('[id="homeOfficeWaiverAdvice"] p'),
    homeOfficeWaiverLetterLabel: this.page.locator('label[for="homeOfficeWaiverDocument"] span.form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhomeOfficeWaiver',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.homeOfficeWaiverAdviceParagraph).toBeVisible(),
      expect(this.$static.homeOfficeWaiverAdviceParagraph).toHaveText(
        'You need to provide a copy of the Home Office fee waiver letter to validate this fee remission.',
      ),
      expect(this.$static.homeOfficeWaiverLetterLabel).toBeVisible(),
      expect(this.$static.homeOfficeWaiverLetterLabel).toHaveText('Home Office fee waiver letter (Optional)'),
    ]);
  }

  public async completePageAndContinue(options: { uploadFile: boolean; nameOfFileToUpload?: string }): Promise<void> {
    if (options.uploadFile) {
      const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Start_Appeal_Home_Office_Waiver.txt';
      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$interactive.homeOfficeWaiverDocumentUploadInput,
        nameOfFileToUpload: fileToUpload,
      });
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
