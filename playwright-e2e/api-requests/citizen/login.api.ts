import { APIRequestContext, expect } from '@playwright/test';

export class CuiLoginApi {
  constructor(private readonly apiContext: APIRequestContext) {}

  public async login(username: string, password: string): Promise<void> {
    await expect(async () => {
      const startLoginResponse = await this.apiContext.get('login');
      await expect(startLoginResponse).toBeOK();

      const idamBaseUrl = new URL(startLoginResponse.url()).origin;
      const enterEmailUrl = new URL('/enter-email', idamBaseUrl).toString();
      const enterPasswordUrl = new URL('/enter-password', idamBaseUrl).toString();

      const enterEmailPage = await this.apiContext.get(enterEmailUrl);
      await expect(enterEmailPage).toBeOK();
      const emailCsrf = this.getCsrfToken(await enterEmailPage.text());

      const enterPasswordPage = await this.apiContext.post(enterEmailUrl, {
        form: {
          email: username,
          _csrf: emailCsrf,
        },
      });
      await expect(enterPasswordPage).toBeOK();

      const passwordPage = enterPasswordPage.url().includes('/enter-password') ? enterPasswordPage : await this.apiContext.get(enterPasswordUrl);
      await expect(passwordPage).toBeOK();
      const passwordCsrf = this.getCsrfToken(await passwordPage.text());

      const submitCredentialsResponse = await this.apiContext.post(enterPasswordUrl, {
        form: {
          action: '_submit',
          email: username,
          password,
          _csrf: passwordCsrf,
        },
      });
      await expect(submitCredentialsResponse).toBeOK();

      const state = await this.apiContext.storageState();
      const hasAuthToken = state.cookies.some((cookie) => cookie.name === '__auth-token');
      if (!hasAuthToken) {
        throw new Error('Login failed: __auth-token cookie not found after IDAM redirect chain');
      }
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }

  private getCsrfToken(html: string): string {
    const token = html.match(/name="_csrf" value="([^"]+)"/)?.[1];
    if (!token) {
      throw new Error('Could not extract CSRF token from IDAM page');
    }
    return token;
  }
}
