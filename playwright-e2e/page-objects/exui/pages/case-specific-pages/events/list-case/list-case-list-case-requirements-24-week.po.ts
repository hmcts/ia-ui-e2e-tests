import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class ListCaseListCaseRequirements24WeekPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    vulnerabilitiesTextArea: this.page.locator('textarea[id="listCaseRequirementsVulnerabilities"]'),
    multimediaTextArea: this.page.locator('textarea[id="listCaseRequirementsMultimedia"]'),
    singleSexCourtTextArea: this.page.locator('textarea[id="listCaseRequirementsSingleSexCourt"]'),
    inCameraCourtTextArea: this.page.locator('textarea[id="listCaseRequirementsInCameraCourt"]'),
    otherAdjustmentsTextArea: this.page.locator('textarea[id="listCaseRequirementsOther"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'List the case', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    guidance: this.page.locator('#listCaseRequirementsTitle p'),
    requirementLabels: this.page.locator('textarea').locator('..').locator('label'),
    requirementHints: this.page.locator('textarea').locator('..').locator('.form-hint'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/listCase/listCaselistCaseRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.guidance).toHaveText(
        "Enter the agreed hearing requirements in the fields below. Don't enter the reason the appellant made the request. The respondent will be shown this information and they must not be told of the appellant's personal circumstances.",
      ),
      expect(this.$static.requirementLabels.nth(0)).toHaveText('Physical or mental health conditions (Optional)'),
      expect(this.$static.requirementLabels.nth(1)).toHaveText('Multimedia equipment (Optional)'),
      expect(this.$static.requirementLabels.nth(2)).toHaveText('Single-sex court (Optional)'),
      expect(this.$static.requirementLabels.nth(3)).toHaveText('In camera court (Optional)'),
      expect(this.$static.requirementLabels.nth(4)).toHaveText('Other adjustments (Optional)'),
      expect(this.$static.requirementHints.nth(0)).toHaveText(
        'If the appellant says they have any personal vulnerabilities, state what adjustments the Tribunal will offer.',
      ),
      expect(this.$static.requirementHints.nth(1)).toHaveText(
        'If the appellant needs multimedia equipment, state what the Tribunal will provide.',
      ),
      expect(this.$static.requirementHints.nth(2)).toHaveText(
        'If the appellant asked for a single-sex court, state which gender was requested and whether the Tribunal can accommodate this.',
      ),
      expect(this.$static.requirementHints.nth(3)).toHaveText(
        'If the appellant asked for an in camera court, state whether the Tribunal can accommodate this.',
      ),
      expect(this.$static.requirementHints.nth(4)).toHaveText(
        'If the appellant made any other requests, state what adjustments the Tribunal will offer.',
      ),
    ]);
  }

  public async completePageAndContinue(options: {
    vulnerabilities?: string;
    multimedia?: string;
    singleSexCourt?: string;
    inCameraCourt?: string;
    otherAdjustments?: string;
  } = {}): Promise<void> {
    const values = [
      [this.$inputs.vulnerabilitiesTextArea, options.vulnerabilities],
      [this.$inputs.multimediaTextArea, options.multimedia],
      [this.$inputs.singleSexCourtTextArea, options.singleSexCourt],
      [this.$inputs.inCameraCourtTextArea, options.inCameraCourt],
      [this.$inputs.otherAdjustmentsTextArea, options.otherAdjustments],
    ] as const;

    for (const [input, value] of values) {
      if (value !== undefined) {
        await input.fill(value);
        await expect(input).toHaveValue(value);
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
