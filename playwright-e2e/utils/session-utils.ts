import fs from 'fs';

type SessionValueSource = 'cookie' | 'localStorage';

export class SessionUtils {
  private static readonly SAFE_EXPIRY_WINDOW_MS = 1.5 * 60 * 60 * 1000;

  /**
   * Gets the value associated with a named item from a Playwright
   * storageState file.
   *
   * @param path Path to the Playwright storageState file
   * @param name Name of the cookie or localStorage item
   * @param source Optional location to search
   */
  public static getSessionValue(path: string, name: string, source?: SessionValueSource): unknown | undefined {
    if (!fs.existsSync(path)) {
      return undefined;
    }

    try {
      const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

      if (!source || source === 'cookie') {
        const cookie = data?.cookies?.find((cookie: { name?: string }) => cookie.name === name);

        if (cookie) {
          return cookie.value;
        }
      }

      if (!source || source === 'localStorage') {
        const origins = Array.isArray(data?.origins) ? data.origins : [];

        for (const origin of origins) {
          const localStorage = Array.isArray(origin?.localStorage) ? origin.localStorage : [];

          const item = localStorage.find((item: { name?: string }) => item.name === name);

          if (item) {
            return item.value;
          }
        }
      }

      return undefined;
    } catch (error) {
      throw new Error(`Could not read session data from ${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Determines whether a localStorage/cookie value represents
   * an expiry timestamp with the configured safety window remaining.
   *
   * Expiry values are expected to be Unix timestamps in milliseconds.
   */
  public static isSessionValid(path: string, name: string, source?: SessionValueSource): boolean {
    const value = this.getSessionValue(path, name, source);

    if (value === undefined || value === null) {
      return false;
    }

    const expiryMs = Number(value);

    if (!Number.isFinite(expiryMs)) {
      return false;
    }

    /*     console.log('expiryMs:', expiryMs);
    console.log('expiry date:', new Date(expiryMs).toString());
    console.log('now:', Date.now());
    console.log('now date:', new Date(Date.now()).toString());
    console.log('remaining ms:', expiryMs - Date.now());
    console.log('remaining minutes:', (expiryMs - Date.now()) / 1000 / 60);
    console.log('safe window ms:', SessionUtils.SAFE_EXPIRY_WINDOW_MS);
    console.log('safe window minutes:', SessionUtils.SAFE_EXPIRY_WINDOW_MS / 1000 / 60); */

    return expiryMs - Date.now() > SessionUtils.SAFE_EXPIRY_WINDOW_MS;
  }
}
