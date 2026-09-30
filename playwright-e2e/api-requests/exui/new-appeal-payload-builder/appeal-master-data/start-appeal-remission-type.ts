import { RemissionTypeOption } from '../../../../exui-event-types';

const remissionTypeApiMapping: Record<RemissionTypeOption, string> = {
  'The appellant is not eligible for a fee remission': 'noRemission',
  'The appellant has a remission, e.g. Asylum support, Legal Aid, Home Office waiver, Section 17/20': 'hoWaiverRemission',
  'The appellant has applied for help with fees': 'helpWithFees',
  'The appellant wants to apply for an Exceptional Circumstances Remission': 'exceptionalCircumstancesRemission',
};

interface StartAppealRemissionTypeData {
  remissionType: (typeof remissionTypeApiMapping)[RemissionTypeOption];
  feeWithHearing: null;
  feeWithoutHearing: null;
}

export class StartAppealRemissionType {
  public async remissionType(remissionType: RemissionTypeOption): Promise<StartAppealRemissionTypeData> {
    return {
      remissionType: remissionTypeApiMapping[remissionType],
      feeWithHearing: null,
      feeWithoutHearing: null,
    };
  }
}
