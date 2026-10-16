import { faker } from '@faker-js/faker';
import path from 'path';

export class DataUtils {
  /**
   * Generate a random number with specified digit length
   * @param options
   *  - digitLength: number of digits the generated number should have
   * @returns A promise that resolves to the generated random number
   */
  public async generateRandomNumber(options: { digitLength: number }): Promise<number> {
    return Number(faker.string.numeric({ length: options.digitLength, allowLeadingZeros: false }));
  }

  /**
   * Generate random first and last names
   * @param options
   * - countOfFirstNamesToGenerate: number of first names to generate
   * - countOfLastNamesToGenerate: number of last names to generate
   * - maxFirstNameLength: maximum length of each generated first name
   * - maxLastNameLength: maximum length of each generated last name
   * @returns A promise that resolves to an object containing arrays of generated first and last names
   */
  public async generateRandomFirstAndLastNames(options: {
    countOfFirstNamesToGenerate?: number;
    countOfLastNamesToGenerate?: number;
    maxFirstNameLength?: number;
    maxLastNameLength?: number;
  }): Promise<{
    firstNames: string[];
    lastNames: string[];
  }> {
    const result: {
      firstNames: string[];
      lastNames: string[];
    } = {
      firstNames: [],
      lastNames: [],
    };

    if (options.countOfFirstNamesToGenerate && options.countOfFirstNamesToGenerate > 0) {
      result.firstNames = Array.from({ length: options.countOfFirstNamesToGenerate }, () => {
        const name = faker.person.firstName();
        return options.maxFirstNameLength ? name.slice(0, options.maxFirstNameLength) : name;
      });
    }

    if (options.countOfLastNamesToGenerate && options.countOfLastNamesToGenerate > 0) {
      result.lastNames = Array.from({ length: options.countOfLastNamesToGenerate }, () => {
        const name = faker.person.lastName();
        return options.maxLastNameLength ? name.slice(0, options.maxLastNameLength) : name;
      });
    }

    return result;
  }

  /**
   *  Get a date offset from today
   *  If no offsets are provided, returns today's date
   * @param dayOffset
   * @param monthOffset
   * @param yearOffset
   * @returns An object containing day, month, and year of the calculated date
   */
  public async getDateFromToday(options: {
    dayOffset?: number;
    monthOffset?: number;
    yearOffset?: number;
  }): Promise<{ day: number; month: number; year: number; formattedLongMonthDate: string; formattedShortMonthDate: string }> {
    const date = new Date();

    if (options.yearOffset !== undefined) date.setFullYear(date.getFullYear() + options.yearOffset);
    if (options.monthOffset !== undefined) date.setMonth(date.getMonth() + options.monthOffset);
    if (options.dayOffset !== undefined) date.setDate(date.getDate() + options.dayOffset);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedLongMonthDate = date.toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedShortMonthDate = date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

    return {
      day: day,
      month: month,
      year: year,
      formattedLongMonthDate: formattedLongMonthDate,
      formattedShortMonthDate: formattedShortMonthDate,
    };
  }

  /**
   *
   * @param type 'Email' | 'Phone' | 'Email and Phone'
   * @returns A promise that resolves to an object containing generated contact details
   */
  public async generateContactDetails(type: 'Email' | 'Phone' | 'Email and Phone'): Promise<{ email?: string; phone?: string }> {
    switch (type) {
      case 'Email':
        return {
          email: faker.internet.email({ provider: 'hmcts.net' }),
        };

      case 'Phone':
        return {
          phone: `077${await this.generateRandomNumber({ digitLength: 8 })}`,
        };

      case 'Email and Phone':
        return {
          email: faker.internet.email({ provider: 'hmcts.net' }),
          phone: `077${await this.generateRandomNumber({ digitLength: 8 })}`,
        };

      default:
        throw new Error(`Unsupported contact type: ${type}`);
    }
  }

  /**
   * Generate payment details
   * @returns A promise that resolves to an object containing generated payment details
   */
  public async generatePaymentDetails(): Promise<{
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    nameOnCard: string;
    securityCode: string;
    addressLine1: string;
    townOrCity: string;
    postcode: string;
    email: string;
  }> {
    const currentYear = new Date().getFullYear();

    return {
      cardNumber: '4444333322221111',

      expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),

      expiryYear: (currentYear + faker.number.int({ min: 1, max: 5 })).toString(),

      nameOnCard: faker.person.fullName(),
      securityCode: faker.number.int({ min: 100, max: 999 }).toString(),

      addressLine1: faker.location.streetAddress(),
      townOrCity: faker.location.city(),
      postcode: 'SW1A 1AA',
      email: faker.internet.email().toLowerCase(),
    };
  }

  /**
   *
   * @param fileName - name of the file to fetch from the fixtures/documents folder
   * @returns         A promise that resolves to the file path of the requested document
   */
  public async fetchDocumentUploadPath(fileName: string): Promise<string> {
    const filePath = path.join(process.cwd(), 'playwright-e2e', 'fixtures', 'documents', fileName);
    return filePath;
  }
}
