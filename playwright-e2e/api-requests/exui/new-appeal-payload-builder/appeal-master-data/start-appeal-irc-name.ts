import { ImmigrationRemovalCentreNameType } from '../../../../exui-event-types.js';

const immigrationRemovalCentreApiMapping: Record<ImmigrationRemovalCentreNameType, string> = {
  'Brook House': 'Brookhouse',
  'Campsfield House': 'Campsfield House',
  Colnbrook: 'Colnbrook',
  Derwentside: 'Derwentside',
  Dungavel: 'Dungavel',
  Harmondsworth: 'Harmondsworth',
  Swinderby: 'Swinderby',
  'Tinsley House': 'Tinsley House',
  "Yarl's Wood": 'Yarlswood',
};

interface StartAppealIrcNameData {
  ircName: (typeof immigrationRemovalCentreApiMapping)[ImmigrationRemovalCentreNameType];
}

export class StartAppealIrcName {
  public async ircName(ircName: ImmigrationRemovalCentreNameType): Promise<StartAppealIrcNameData> {
    return {
      ircName: immigrationRemovalCentreApiMapping[ircName],
    };
  }
}
