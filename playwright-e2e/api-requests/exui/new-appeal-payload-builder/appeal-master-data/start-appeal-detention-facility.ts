import { DetentionFacilityType } from '../../../../exui-event-types.js';

const detentionFacilityApiMapping: Record<DetentionFacilityType, string> = {
  'Immigration removal centre': 'immigrationRemovalCentre',
  Prison: 'prison',
  Other: 'other',
};

interface StartAppealDetentionFacilityData {
  detentionFacility: (typeof detentionFacilityApiMapping)[DetentionFacilityType];
  detentionBuilding: null;
  detentionAddressLines: null;
  detentionPostcode: null;
  prisonNOMSNumber?: {
    prison: string;
  };
  otherDetentionFacilityName?: {
    other: string;
  };
}

export class StartAppealDetentionFacility {
  public async detentionFacility(options: {
    facility: DetentionFacilityType;
    prisonNomsNumber?: string;
    otherFacilityName?: string;
  }): Promise<StartAppealDetentionFacilityData> {
    switch (options.facility) {
      case 'Immigration removal centre':
        return {
          detentionFacility: detentionFacilityApiMapping[options.facility],
          detentionBuilding: null,
          detentionAddressLines: null,
          detentionPostcode: null,
        };
      case 'Prison':
        return {
          detentionFacility: detentionFacilityApiMapping[options.facility],
          detentionBuilding: null,
          detentionAddressLines: null,
          detentionPostcode: null,
          prisonNOMSNumber: {
            prison: options.prisonNomsNumber ?? '',
          },
        };
      case 'Other':
        if (!options.otherFacilityName) {
          throw new Error('otherFacilityName is required when facility is "Other"');
        }
        return {
          detentionFacility: detentionFacilityApiMapping[options.facility],
          detentionBuilding: null,
          detentionAddressLines: null,
          detentionPostcode: null,
          otherDetentionFacilityName: {
            other: options.otherFacilityName,
          },
        };
    }
  }
}
