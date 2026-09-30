import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealDeportationOrderData {
  deportationOrderOptions: YesOrNoType;
}

export class StartAppealDeportationOrder {
  public async deportationOrder(hasDeportationOrderBeenMade: YesOrNoType): Promise<StartAppealDeportationOrderData> {
    return {
      deportationOrderOptions: hasDeportationOrderBeenMade,
    };
  }
}
