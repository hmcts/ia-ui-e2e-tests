import { Page, Locator } from '@playwright/test';
import { Base } from './base';

export class IdamSignInPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    emailInput: this.page.locator('input[id="email"]'),
    passwordInput: this.page.locator('input[id="password"]'),
    signInButton: this.page.getByText('Sign in', { exact: true }),
    continueButton: this.page.getByRole('button', { name: 'Continue' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    signInOrCreateAnAccountHeading: this.page.getByRole('heading', { name: 'Sign in or create an account', level: 1, exact: true }),
    enterYourEmailAddressHeading: this.page.getByRole('heading', { name: 'Enter your email address', level: 1, exact: true }),
    enterYourPasswordHeading: this.page.getByRole('heading', { name: 'Enter your password', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async citizenSignIn(email: string, password: string): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'sign-in-or-create', pageHeading: this.$static.signInOrCreateAnAccountHeading });
    await this.navigationClick(this.$interactive.signInButton);
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-email', pageHeading: this.$static.enterYourEmailAddressHeading });
    await this.$interactive.emailInput.fill(email);
    await this.navigationClick(this.$interactive.continueButton);
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-password', pageHeading: this.$static.enterYourPasswordHeading });
    await this.$interactive.passwordInput.fill(password);
    await this.navigationClick(this.$interactive.continueButton);
  }
  public async exuiSignIn(email: string, password: string): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-email', pageHeading: this.$static.enterYourEmailAddressHeading });
    await this.$interactive.emailInput.fill(email);
    await this.navigationClick(this.$interactive.continueButton);
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-password', pageHeading: this.$static.enterYourPasswordHeading });
    await this.$interactive.passwordInput.fill(password);
    await this.navigationClick(this.$interactive.continueButton);
  }
}
