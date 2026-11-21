/** Tutte le mappe/legende/regole speciali delle Missioni, indicizzate per id missione. */
import { MISSION_EXTRAS as MODERN_EXTRAS, type MissionExtra } from './moderno/missionMaps';
import { BP_MISSION_EXTRAS } from './fantasy/bpMissionMaps';
import { Z2_MISSION_EXTRAS } from './moderno/z2MissionMaps';
import { WU_MISSION_EXTRAS } from './fantasy/wuMissionMaps';
import { GH_MISSION_EXTRAS } from './fantasy/ghMissionMaps';
import { MZ_MISSION_EXTRAS } from './marvel/marvelZombies';
import { XM_MISSION_EXTRAS } from './marvel/xmenResistance';
import { HR_MISSION_EXTRAS } from './marvel/heroesResistance';
import { UO_MISSION_EXTRAS } from './western/undeadOrAlive';
import { WD_MISSION_EXTRAS } from './fantasy/whiteDeath';
import { FH_MISSION_EXTRAS } from './moderno/fortHendrix';
import { EE_MISSION_EXTRAS } from './fantasy/eternalEmpire';
import { WEB_MAPS } from './moderno/webMissionMaps';
import { AND_MISSIONS, WEB_MISSIONS } from './moderno/webMissions';

const WEB_EXTRAS: Record<string, MissionExtra> = Object.fromEntries(
  [...WEB_MISSIONS, ...AND_MISSIONS].filter((m) => WEB_MAPS[m.id]).map((m) => [m.id, { ...WEB_MAPS[m.id], specialRules: m.rules }]),
);

export const ALL_MISSION_EXTRAS: Record<string, MissionExtra> = {
  ...MODERN_EXTRAS, ...BP_MISSION_EXTRAS, ...Z2_MISSION_EXTRAS, ...WU_MISSION_EXTRAS, ...GH_MISSION_EXTRAS,
  ...MZ_MISSION_EXTRAS, ...XM_MISSION_EXTRAS, ...HR_MISSION_EXTRAS, ...UO_MISSION_EXTRAS, ...WD_MISSION_EXTRAS, ...FH_MISSION_EXTRAS, ...EE_MISSION_EXTRAS, ...WEB_EXTRAS,
};
