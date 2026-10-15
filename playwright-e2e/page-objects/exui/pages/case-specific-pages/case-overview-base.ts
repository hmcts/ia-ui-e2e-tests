import { Locator } from 'playwright-core';
import { ExuiBase } from '../../exui-base';
import { expect } from 'playwright/test';

// A base page inherited by pages & components
// can contain any additional config needed + reusable methods accross CUI pages

type DropdownEventTypes =
  | 'Record remission decision'
  | 'Request respondent evidence'
  | 'Upload Home Office bundle'
  | 'AiP - Request Appeal Reasons'
  | 'Request respondent review'
  | 'Upload the appeal response'
  | 'Review Home Office response'
  | 'Request hearing requirements'
  | 'Review hearing requirements'
  | 'List the case'
  | 'Create case summary'
  | 'Generate hearing bundle'
  | 'Start decision and reasons'
  | 'Prepare Decision and Reasons'
  | 'Complete decision and reasons'
  | 'Decide FTPA application'
  | 'Generate Upper Tribunal bundle'
  | 'Request Home Office data'
  | 'Submit your appeal'
  | 'Create a service request'
  | 'Complete case review'
  | 'Add Statutory Timeframe'
  | 'Remove Statutory Timeframe'
  | 'Raise Query';

type CaseOverviewTabsType =
  | 'Tasks'
  | 'Roles and access'
  | 'Overview'
  | 'Appeal'
  | 'Appellant'
  | 'Documents'
  | 'Directions'
  | 'Case flags'
  | 'Hearing and appointment'
  | 'Case notes'
  | 'Applications'
  | 'Linked Cases'
  | 'Payment history'
  | 'Case history'
  | 'Hearings'
  | 'Validation'
  | 'Service Request'
  | 'Queries';

export abstract class CaseOverViewBase extends ExuiBase {
  protected readonly $commonCaseOverviewElements = {
    nextStepsDropdown: this.page.locator('select[id="next-step"]'),
    goButton: this.page.getByRole('button', { name: 'Go', exact: true }),
    alertMessage: this.page.locator('div[class="alert-message"]'),
    stfFlag: this.page.locator('font[color="#1C8242"]').getByText('24 Week STF'),
  } as const satisfies Record<string, Locator>;

  public async selectEventFromDropdown(options: { eventToSelect: DropdownEventTypes }): Promise<void> {
    await this.$commonCaseOverviewElements.nextStepsDropdown.selectOption({ label: options.eventToSelect });
    const selectedOption = await this.$commonCaseOverviewElements.nextStepsDropdown.locator('option:checked').textContent();
    expect(selectedOption?.trim()).toBe(options.eventToSelect);

    await this.navigationClick(this.$commonCaseOverviewElements.goButton);
  }

  public async navigateToTab(options: { tabToSelect: CaseOverviewTabsType }): Promise<void> {
    const tabLocator = this.page.getByRole('tab', { name: new RegExp(`^${options.tabToSelect}`) });
    await expect(tabLocator).toBeVisible();
    await tabLocator.scrollIntoViewIfNeeded();
    await tabLocator.click();
    await expect(tabLocator).toHaveAttribute('aria-selected', 'true');
  }

  public async verifyAlertMessageAfterSubmittingEvent(options: { eventSubmitted: DropdownEventTypes }): Promise<void> {
    await expect(this.$commonCaseOverviewElements.alertMessage).toHaveText(
      new RegExp(`^\\s*Case #.+ has been updated with event: ${options.eventSubmitted}\\s*$`),
    );
    await expect(this.$commonCaseOverviewElements.alertMessage).toBeVisible();
  }

  public async verifyUserIsOnExpectedTab(options: { urlPath: string; tabName: CaseOverviewTabsType; timeout?: number }): Promise<void> {
    const timeout = options.timeout ?? 15_000;
    await Promise.all([
      expect(async () => {
        const currentURL = this.page.url();
        expect(currentURL.includes(options.urlPath), { message: `Verify page URL (${currentURL}) contains (${options.urlPath})` }).toBeTruthy();
      }).toPass({ intervals: [100], timeout: timeout }),
    ]);
  }
}
