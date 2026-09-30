import { v4 as uuidv4 } from 'uuid';
import { Nationality, YesOrNoType } from '../../../../citizen-types.js';
interface AppellantStatelessData {
  appellantStateless: 'isStateless';
}

interface AppellantHasNationalityData {
  appellantStateless: 'hasNationality';
  appellantNationalities: [
    {
      value: {
        code: string;
      };
      id: string;
    },
  ];
}

type AppellantNationalityData = AppellantStatelessData | AppellantHasNationalityData;

export class StartAppealAppellantNationalities {
  private readonly nationalityToCountryCode = {
    Afghan: 'AF',
    Albanian: 'AL',
    Barbadian: 'BB',
    Belarusian: 'BY',
    Belgian: 'BE',
    Belizean: 'BZ',
    Beninese: 'BJ',
    Bermudian: 'BM',
    Bhutanese: 'BT',
    Bolivian: 'BO',
    'Citizen of Bosnia and Herzegovina': 'BA',
    English: 'GB',
    'Equatorial Guinean': 'GQ',
    Singaporean: 'SG',
    Slovak: 'SK',
    Slovenian: 'SI',
    'Solomon Islander': 'SB',
    Somali: 'SO',
    'South African': 'ZA',
    'South Korean': 'KR',
    'South Sudanese': 'SS',
    Spanish: 'ES',
    'Sri Lankan': 'LK',
    'St Helenian': 'SH',
    'St Lucian': 'LC',
    Sudanese: 'SD',
    Surinamese: 'SR',
    Swazi: 'SZ',
    Swedish: 'SE',
    Swiss: 'CH',
    Syrian: 'SY',
    Taiwanese: 'TW',
    Tajik: 'TJ',
    Tanzanian: 'TZ',
    Thai: 'TH',
  } as const satisfies Record<Nationality, string>;

  public async appellantNationalities(options: { isAppellantStateless: YesOrNoType; nationality?: Nationality }): Promise<AppellantNationalityData> {
    if (options.isAppellantStateless === 'Yes') {
      return {
        appellantStateless: 'isStateless',
      };
    } else {
      if (!options.nationality) {
        throw new Error('Nationality must be provided when isAppellantStateless is false.');
      }
      return {
        appellantStateless: 'hasNationality',
        appellantNationalities: [
          {
            value: {
              code: this.nationalityToCountryCode[options.nationality],
            },
            id: uuidv4(),
          },
        ],
      };
    }
  }
}
