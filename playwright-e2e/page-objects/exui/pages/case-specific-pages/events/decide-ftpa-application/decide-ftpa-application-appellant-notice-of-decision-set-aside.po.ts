import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    removeButton: this.page.getByRole('button', { name: 'Remove', exact: true }),
    chooseFileButton: this.page.locator('input[id*="ftpaAppellantNoticeDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    decisionObjectionsInput: this.page.locator('textarea[id="ftpaAppellantDecisionObjections"]'),
    describeDocumentInput: this.page.locator('textarea[id*="ftpaAppellantNoticeDocument"][id$="description"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    rule35ObjectionHeading: this.page.getByRole('heading', { level: 1, name: 'Rule 35 objection - Resident Judge only', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    noticeOfItentionLabel: this.page.locator('[id="isFtpaAppellantNoticeOfDecisionSetAside"] span[class*="form-label"]'),
    noticeOfIntentionHintText: this.page.locator('[id="isFtpaAppellantNoticeOfDecisionSetAside"] span[class*="form-hint"]'),
    yesLabel: this.page.locator('label[for$="Yes"]'),
    noLabel: this.page.locator('label[for$="No"]'),
    listAnyObjectionsLabel: this.page.locator('label[for="ftpaAppellantDecisionObjections"]'),
    attachACopyOfAnyCommunicationText: this.page.locator('markdown p strong'),
    noticeCommunicationOptionalHeading: this.page.getByRole('heading', { level: 2, name: 'Notice communication (Optional)', exact: true }),
    noticeComunicationHeading: this.page.getByRole('heading', { level: 3, name: 'Notice communication', exact: true }),
    documentLabel: this.page.locator('span[aria-label="Document (Optional)"]'),
    describeDocumentLabel: this.page.locator('span[class*="form-label"]', { hasText: 'Describe the document' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationisFtpaAppellantNoticeOfDecisionSetAside',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.rule35ObjectionHeading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.noticeOfItentionLabel).toBeVisible(),
      expect(this.$static.noticeOfItentionLabel).toHaveText('Notice of Intention to Set Aside sent?'),
      expect(this.$static.noticeOfIntentionHintText).toBeVisible(),
      expect(this.$static.noticeOfIntentionHintText).toHaveText(
        'Before this decision, did you send a Notice of Intention to Set Aside to both parties? (If you are not a Resident Judge, select No.)',
      ),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.noLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: {
    noticeOfIntentionToSetAside: YesOrNoType;
    anyObjections?: string;
    uploadFile?: boolean;
    optionallySpecifyNameOfFileToUpload?: string;
    optionallyProvideDescriptionOfDocumentToUpload?: string;
  }): Promise<void> {
    await this.verifyAllTextOnPage();

    const elementToSelect = this.page.getByRole('radio', { name: options.noticeOfIntentionToSetAside, exact: true });
    await elementToSelect.check();
    await expect(elementToSelect).toBeChecked();

    if (options.noticeOfIntentionToSetAside === 'Yes') {
      await Promise.all([
        expect(this.$static.listAnyObjectionsLabel).toBeVisible(),
        expect(this.$static.listAnyObjectionsLabel).toHaveText('List any objections to the draft Notice from either party (Optional)'),
        expect(this.$inputs.decisionObjectionsInput).toBeVisible(),
        expect(this.$static.attachACopyOfAnyCommunicationText).toBeVisible(),
        expect(this.$static.attachACopyOfAnyCommunicationText).toHaveText(
          'Attach a copy of any communication from the parties regarding the Notice Objections.',
        ),
        expect(this.$static.noticeCommunicationOptionalHeading).toBeVisible(),
        expect(this.$interactive.addNewButton).toBeVisible(),
      ]);

      if (options.anyObjections) {
        await this.$inputs.decisionObjectionsInput.fill(options.anyObjections);
        await expect(this.$inputs.decisionObjectionsInput).toHaveValue(options.anyObjections);
      }

      if (options.uploadFile) {
        await this.$interactive.addNewButton.click();

        await Promise.all([
          expect(this.$static.noticeComunicationHeading).toBeVisible(),
          expect(this.$static.documentLabel).toBeVisible(),
          expect(this.$static.documentLabel).toHaveText('Document (Optional)'),
          expect(this.$interactive.chooseFileButton).toBeVisible(),
          expect(this.$interactive.cancelUploadButton).toBeVisible(),
          expect(this.$static.describeDocumentLabel).toBeVisible(),
          expect(this.$static.describeDocumentLabel).toHaveText('Describe the document (Optional)'),
          expect(this.$inputs.describeDocumentInput).toBeVisible(),
        ]);

        const fileToUpload = options.optionallySpecifyNameOfFileToUpload
          ? options.optionallySpecifyNameOfFileToUpload
          : 'Ftpa_Notice_Of_Intention_To_Set_A_Side.txt';

        await this.uiDocumentUploadHelper.uploadExuiDocument({
          fileInputElement: this.$interactive.chooseFileButton,
          nameOfFileToUpload: fileToUpload,
        });

        if (options.optionallyProvideDescriptionOfDocumentToUpload) {
          await this.$inputs.describeDocumentInput.fill(options.optionallyProvideDescriptionOfDocumentToUpload);
          await expect(this.$inputs.describeDocumentInput).toHaveValue(options.optionallyProvideDescriptionOfDocumentToUpload);
        }
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
