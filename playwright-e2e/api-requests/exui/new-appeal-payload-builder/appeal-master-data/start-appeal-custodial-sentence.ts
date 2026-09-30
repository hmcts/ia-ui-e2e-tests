import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealCustodialSentenceData {
  releaseDateProvided: YesOrNoType;
  releaseDate?: string | null;
}

export class StartAppealCustodialSentence {
  public async custodialSentence(options: {
    releaseDateProvided: YesOrNoType;
    releaseDate?: { day: number; month: number; year: number };
  }): Promise<StartAppealCustodialSentenceData> {
    switch (options.releaseDateProvided) {
      case 'Yes':
        return {
          releaseDateProvided: options.releaseDateProvided,
          releaseDate: options.releaseDate
            ? `${options.releaseDate.year}-${options.releaseDate.month.toString().padStart(2, '0')}-${options.releaseDate.day.toString().padStart(2, '0')}`
            : null,
        };
      case 'No':
        return {
          releaseDateProvided: options.releaseDateProvided,
        };
    }
  }
}
