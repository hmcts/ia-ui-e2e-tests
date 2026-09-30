import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { DataUtils } from '../../../../../utils';
import { YesOrNoType } from '../../../../../citizen-types';

export class LateAppealPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();

  public readonly $inputs = {
    appealLateTextArea: this.page.locator('textarea[id="appeal-late"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    chooseFileToUploadInput: this.page.locator('input[id="file-upload"]'),
    uploadFileButton: this.page.locator('button[name="uploadFile"]'),
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Your appeal is late',
    }),
    fileUploadedTableRow: this.page.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
    lateAppealInstructionParagrapgh: this.page
      .locator('legend[class*="govuk-fieldset"]', { has: this.page.getByRole('heading', { level: 1, name: 'Your appeal is late' }) })
      .locator('+ p'),
    whyIsAppealLateLabel: this.page.locator('label[for="appeal-late"]'),
    supportingEvidenceHeading: this.page.getByRole('heading', { level: 2, name: 'Supporting evidence' }),
    uploadOnePieceOfEvidenceBulletPoint: this.page.locator('li', { hasText: 'You can upload one piece of evidence' }),
    provideEvidenceNotInEnglishBulletPoint: this.page.locator('li', {
      hasText: 'If you provide evidence that is not in English',
    }),
    uploadFileLabel: this.page.locator('label[for="file-upload"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'late-appeal', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(options: { isAppellantInTheUk: YesOrNoType }): Promise<void> {
    let expectedText: string;

    if (options.isAppellantInTheUk === 'Yes') {
      expectedText = 'Appeals should be made within 14 days of the date the decision letter was sent.';
    } else {
      expectedText = 'Appeals should be made within 28 days of the date the decision letter was received.';
    }

    await Promise.all([
      expect(this.$static.lateAppealInstructionParagrapgh).toHaveText(
        `${expectedText} You may still be able to appeal. Please tell us why your appeal is late, and provide supporting evidence if you have it.`,
      ),
      expect(this.$static.lateAppealInstructionParagrapgh).toBeVisible(),

      expect(this.$static.whyIsAppealLateLabel).toHaveText('Why is your appeal late?'),
      expect(this.$static.whyIsAppealLateLabel).toBeVisible(),

      expect(this.$static.supportingEvidenceHeading).toHaveText('Supporting evidence for why your appeal is late'),
      expect(this.$static.supportingEvidenceHeading).toBeVisible(),

      expect(this.$static.uploadOnePieceOfEvidenceBulletPoint).toHaveText(
        'You can upload one piece of evidence to support your answer such as a letter, photo or document. If you are taking a picture of a letter, place it on a flat surface and take the picture from above',
      ),
      expect(this.$static.uploadOnePieceOfEvidenceBulletPoint).toBeVisible(),

      expect(this.$static.provideEvidenceNotInEnglishBulletPoint).toHaveText(
        'If you provide evidence that is not in English, you must also provide an English translation of that evidence',
      ),
      expect(this.$static.provideEvidenceNotInEnglishBulletPoint).toBeVisible(),

      expect(this.$static.uploadFileLabel).toHaveText('Select a file'),
      expect(this.$static.uploadFileLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { reasonForLateAppeal: string; nameOfFileToUpload?: string }): Promise<void> {
    await this.$inputs.appealLateTextArea.fill(options.reasonForLateAppeal);
    await expect(this.$inputs.appealLateTextArea).toHaveValue(options.reasonForLateAppeal);

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Late_Appeal.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
