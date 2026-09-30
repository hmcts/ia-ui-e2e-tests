import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealRemovalDirectionsData {
  removalOrderOptions: YesOrNoType;
  removalOrderDate?: string | null;
}

export class StartAppealRemovalDirections {
  public async removalDirections(options: {
    removalOrderOptions: YesOrNoType;
    removalOrderDate?: { day: number; month: number; year: number; hour: number; minute: number };
  }): Promise<StartAppealRemovalDirectionsData> {
    switch (options.removalOrderOptions) {
      case 'Yes':
        return {
          removalOrderOptions: options.removalOrderOptions,
          removalOrderDate: options.removalOrderDate
            ? `${options.removalOrderDate.year}-${options.removalOrderDate.month.toString().padStart(2, '0')}-${options.removalOrderDate.day.toString().padStart(2, '0')}T${options.removalOrderDate.hour.toString().padStart(2, '0')}:${options.removalOrderDate.minute.toString().padStart(2, '0')}:00`
            : null,
        };
      case 'No':
        return {
          removalOrderOptions: options.removalOrderOptions,
        };
    }
  }
}
