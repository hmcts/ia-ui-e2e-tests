import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export const FTPA_DECISION_OUTCOMES = [
  'Permission granted',
  'Permission partially granted',
  'Permission refused',
  'Application not admitted',
  'Review decision under rule 35 - Resident Judge only',
  'Dispose of application under rule 31',
  'Dispose of application under rule 32',
] as const;

type FtpaDecisionOutcome = (typeof FTPA_DECISION_OUTCOMES)[number];

export class DecideFtpaApplicationAppellantOutcomeDecisionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    decisionHeading: this.page.getByRole('heading', { level: 1, name: 'Decision', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    outcomeLabel: this.page.locator('label[for="ftpaAppellantRjDecisionOutcomeType"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationftpaAppellantDecisionOutcome',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionHeading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.outcomeLabel).toBeVisible(),
      expect(this.$static.outcomeLabel).toHaveText('The outcome of the application'),
      ...FTPA_DECISION_OUTCOMES.map((outcome) => expect(this.page.getByRole('radio', { name: outcome, exact: true })).toBeVisible()),
    ]);
  }

  public async completePageAndContinue(options: { ftpaDecisionOutcome: FtpaDecisionOutcome }): Promise<void> {
    await this.verifyAllTextOnPage();

    const elementToSelect = this.page.getByRole('radio', { name: options.ftpaDecisionOutcome, exact: true });
    await elementToSelect.check();
    await expect(elementToSelect).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
