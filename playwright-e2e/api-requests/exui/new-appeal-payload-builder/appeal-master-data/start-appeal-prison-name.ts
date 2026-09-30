import { PrisonNameType } from '../../../../exui-event-types.js';

const prisonApiMapping: Record<PrisonNameType, string> = {
  'HM Prison Addiewell': 'Addiewell',
  'HM Prison Aylesbury': 'Aylesbury',
  'HM Prison Belmarsh': 'Belmarsh',
  'HM Prison Berwyn': 'Berwyn',
  'HM Prison Birmingham': 'Birmingham',
  'HM Prison Camp Hill': 'Camp Hill',
  'HM Prison Cardiff': 'Cardiff',
  'HM Prison Dartmoor': 'Dartmoor',
  'HM Prison Deerbolt': 'Deerbolt',
  'HM Prison East Sutton Park': 'East Sutton Park',
  'HM Prison Eastwood Park': 'Eastwood Park',
  'HM Prison Featherstone': 'Featherstone',
  'HM Prison Feltham': 'Feltham',
  'HM Prison Garth': 'Garth',
  'HM Prison Gartree': 'Gartree',
  'HMP/YOI Hatfield (Main site)': 'Hatfield (Main site)',
  'HMP/YOI Hatfield (Lakes site)': 'Hatfield (Lakes site)',
  'HM Prison Inverness': 'Inverness',
  'HM Prison Isle of Wight': 'Isle of Wight',
  'HM Prison Kennet': 'Kennet',
  'HM Prison Kilmarnock': 'Kilmarnock',
  'HM Prison Lancaster': 'Lancaster',
  'HM Prison Lancaster Farms': 'Lancaster Farms',
  'HM Prison Magilligan': 'Magilligan',
  'HM Prison Maghaberry': 'Maghaberry',
  'HM Prison New Hall': 'New Hall',
  'HM Prison North Sea Camp': 'North Sea Camp',
  'HM Prison Onley': 'Onley',
  'HM Prison Oakwood': 'Oakwood',
  'HM Prison Parc': 'Parc',
  'HM Prison Parkhurst': 'Parkhurst',
  'HM Prison Ranby': 'Ranby',
  'HM Prison Reading': 'Reading',
  'HM Prison Send': 'Send',
  'HM Prison Shepton Mallet': 'Shepton Mallet',
  'HM Prison Thameside': 'Thameside',
  'HM Prison The Mount': 'The Mount',
  'HM Prison Wakefield': 'Wakefield',
  'HM Prison Wandsworth': 'Wandsworth',
};

interface StartAppealPrisonNameData {
  prisonName: (typeof prisonApiMapping)[PrisonNameType];
}

export class StartAppealPrisonName {
  public async prisonName(prisonName: PrisonNameType): Promise<StartAppealPrisonNameData> {
    return {
      prisonName: prisonApiMapping[prisonName],
    };
  }
}
