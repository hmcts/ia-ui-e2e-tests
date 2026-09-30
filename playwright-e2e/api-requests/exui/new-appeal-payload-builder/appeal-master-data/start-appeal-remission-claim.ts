import { ExuiRemissionClaimType } from '../../../../exui-event-types.js';

const remissionClaimTypeApiMapping: Record<ExuiRemissionClaimType, string> = {
  'The appellant receives Asylum Support': 'asylumSupport',
  'The appellant receives Legal Aid': 'legalAid',
  'The appellant receives (or has parental responsibility for a person who receives) benefit services or accommodation provided by a local authority under section 17 of the Children Act 1989, section 22 of the Children (Scotland) Act 1995, article 18 of the Children (Northern Ireland) Order 1995 or section 37 of the Social Services and Well-being (Wales) Act 2014':
    'section17',
  "The appellant's accommodation is being provided by a local authority under section 20 of the Children Act 1989, section 25 of the Children (Scotland) Act 1995, article 21 of the Children (Northern Ireland) Order 1995 or section 76 of the Social Services and Well-being (Wales) Act 2014":
    'section20',
  'The Home Office waived the fee for the application this appeal relates to': 'homeOfficeWaiver',
};

interface StartAppealRemissionClaimData {
  remissionClaim: (typeof remissionClaimTypeApiMapping)[ExuiRemissionClaimType];
}

export class StartAppealRemissionClaim {
  public async remissionClaim(remissionClaim: ExuiRemissionClaimType): Promise<StartAppealRemissionClaimData> {
    return {
      remissionClaim: remissionClaimTypeApiMapping[remissionClaim],
    };
  }
}
