/**
 * Campagne con Scheda Campagna (PEC, Abilità della Campagna, Azioni Bonus, Traguardi).
 * Le regole comuni sono in rioZJaneiro.ts; qui ogni campagna dichiara missioni,
 * abilità selezionabili, traguardi noti e illustrazioni.
 */
import { CAMPAIGN_ABILITIES, KNOWN_MILESTONES, RIO_MISSIONS, RIO_TEMPLATE_ID, type CampaignAbility, type RioMission } from './rioZJaneiro';
import { WZC_ABILITIES, WZC_KNOWN_MILESTONES, WZC_MISSIONS, WZC_TEMPLATE_ID } from './washingtonZC';
import { FH_KNOWN_MILESTONES, FH_MISSIONS, FH_TEMPLATE_ID } from './fortHendrix';

export interface SheetCampaign {
  templateId: string;
  productId: string;
  gameName: string;
  campaignName: string;
  rulebook: string;
  sheetPages: string;
  abilities: CampaignAbility[];
  missions: (RioMission & { startTime?: string })[];
  knownMilestones: { name: string; missions: string[] }[];
  image: string;
  scenarioImage: string;
  survivorsAdvice: string;
}

export const SHEET_CAMPAIGNS: SheetCampaign[] = [
  {
    templateId: RIO_TEMPLATE_ID, productId: 'rio-z-janeiro', gameName: 'Rio Z Janeiro', campaignName: 'Carnevale dei Morti',
    rulebook: 'Zombicide: Rio Z Janeiro – Regole e Missioni (ITA)', sheetPages: '10–12',
    abilities: CAMPAIGN_ABILITIES, missions: RIO_MISSIONS, knownMilestones: KNOWN_MILESTONES,
    image: '/ui/campagna-rio.webp', scenarioImage: '/ui/scenario-rio.webp', survivorsAdvice: 'Il Carnevale dei Morti è pensato per 6 Sopravvissuti (pag. 15).',
  },
  {
    templateId: WZC_TEMPLATE_ID, productId: 'washington-zc', gameName: 'Washington Z.C.', campaignName: 'Stato Infetto',
    rulebook: 'Zombicide: Washington Z.C. – Regole e Missioni (ITA)', sheetPages: '13–15',
    abilities: WZC_ABILITIES, missions: WZC_MISSIONS, knownMilestones: WZC_KNOWN_MILESTONES,
    image: '/ui/campagna-wzc.webp', scenarioImage: '/ui/campagna-wzc.webp', survivorsAdvice: 'Stato Infetto è una campagna per 6 Sopravvissuti (pag. 18).',
  },
  {
    templateId: FH_TEMPLATE_ID, productId: 'fort-hendrix', gameName: 'Fort Hendrix', campaignName: 'Bandiera a Stelle e Strisce',
    rulebook: 'Zombicide: Fort Hendrix – Regolamento (ITA)', sheetPages: '14–18',
    abilities: WZC_ABILITIES, missions: FH_MISSIONS, knownMilestones: FH_KNOWN_MILESTONES,
    image: '/scatole/fort-hendrix.webp', scenarioImage: '/scatole/fort-hendrix.webp', survivorsAdvice: 'Bandiera a Stelle e Strisce è una campagna per 6 Sopravvissuti, con Penny come Compagno della campagna (pag. 19).',
  },
];

export const sheetCampaignFor = (templateId?: string) => SHEET_CAMPAIGNS.find((c) => c.templateId === templateId);
export const allCampaignAbilities = () => [...new Map(SHEET_CAMPAIGNS.flatMap((c) => c.abilities).map((a) => [a.id, a])).values()];
