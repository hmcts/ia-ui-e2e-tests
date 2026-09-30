import { Page, Locator, expect } from '@playwright/test';
import { Base } from './base';

export class IdamSignInPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    citizenEmailInput: this.page.locator('input[id="username"]'),
    exuiEmailInput: this.page.locator('input[id="email"]'),
    passwordInput: this.page.locator('input[id="password"]'),
    signInButton: this.page.locator('input[class="button"][value="Sign in"]'),
    exuiContinueButton: this.page.getByRole('button', { name: 'Continue' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    signInOrCreateAnAccountHeading: this.page.locator('h1[class="heading-large"]', {
      hasText: 'Sign in or create an account',
    }).or(this.page.locator('h1 label[for="email"]', { hasText: 'Enter your email address' })),
    enterYourEmailAddressHeading: this.page.getByRole('heading', { name: 'Enter your email address', level: 1, exact: true }),
    enterYourPasswordHeading: this.page.getByRole('heading', { name: 'Enter your password', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async citizenSignIn(email: string, password: string): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'login', pageHeading: this.$static.signInOrCreateAnAccountHeading });
    await this.$interactive.citizenEmailInput.fill(email);
    await this.$interactive.passwordInput.fill(password);
    await this.navigationClick(this.$interactive.signInButton);
  }
  public async exuiSignIn(email: string, password: string): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-email', pageHeading: this.$static.enterYourEmailAddressHeading });
    await this.$interactive.exuiEmailInput.fill(email);
    await this.navigationClick(this.$interactive.exuiContinueButton);
    await this.verifyUserIsOnExpectedPage({ urlPath: 'enter-password', pageHeading: this.$static.enterYourPasswordHeading });
    await this.$interactive.passwordInput.fill(password);
    await this.navigationClick(this.$interactive.exuiContinueButton);
  }
}
