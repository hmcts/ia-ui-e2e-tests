import { YesOrNoType } from '../../../../citizen-types';
interface noNewMattersData {
  hasNewMatters: 'No';
}

interface yesNewMattersData {
  hasNewMatters: 'Yes';
  newMatters: string;
}

type StartAppealNewMattersData = noNewMattersData | yesNewMattersData;

export class StartAppealNewMatters {
  public async newMatters(options: { hasNewMatters: YesOrNoType; newMattersDescription?: string }): Promise<StartAppealNewMattersData> {
    switch (options.hasNewMatters) {
      case 'No':
        return {
          hasNewMatters: 'No',
        };
      case 'Yes':
        if (!options.newMattersDescription) {
          throw new Error('newMattersDescription is required when hasNewMatters is "Yes"');
        }
        return {
          hasNewMatters: 'Yes',
          newMatters: options.newMattersDescription,
        };
    }
  }
}
