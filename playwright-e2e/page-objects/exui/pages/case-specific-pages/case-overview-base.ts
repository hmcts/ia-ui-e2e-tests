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
}
