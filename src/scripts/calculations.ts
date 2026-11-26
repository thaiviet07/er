import { SCENARIOS, type ScenarioCode } from '../data/economics';

export type BatchMode = '3batch' | 'batch1';
export type UnitView = 'box' | 'pack' | 'card' | 'total';
export type ChannelId = 1 | 2 | 3;

export interface SimInputs {
  srpPre: number;
  ck: number;
  roy: number;
  dp: number;
  sell: number;
  c1: number;
  c2: number;
}

export interface SimParams extends SimInputs {
  c3: number;
  srpVat: number;
  matched: ScenarioCode | null;
  blendedDeductPct: number;
  netPerBox: number;
  boxes3: number;
  boxes1: number;
}

export interface ChannelBreakdownItem {
  id: ChannelId;
  label: string;
  pct: number;
  boxes: number;
  netPerBox: number;
  profitPerBox: number;
  totalProfit: number;
  color: string;
}

export const BATCH_CONSTANTS = {
  batch1: {
    totalProdBoxes: 445,
    fixedCogsTotal: 353638830,
    fixedMktTotal: 30000170,
    committedFixed: 383639000,
  },
  '3batch': {
    totalProdBoxes: 1320,
    fixedCogsTotal: 865749000,
    fixedMktTotal: 50000000,
    committedFixed: 915749000,
  },
} as const;

export function computeSimParams(inputs: SimInputs): SimParams {
  const c3 = 100 - inputs.c1 - inputs.c2;
  const isDefaultMix = inputs.c1 === 55 && inputs.c2 === 30 && c3 === 15;

  let matched: ScenarioCode | null = null;
  if (isDefaultMix) {
    for (const s of Object.values(SCENARIOS)) {
      if (
        s.srpPre === inputs.srpPre &&
        s.ck === inputs.ck &&
        s.roy === inputs.roy &&
        s.dp === inputs.dp &&
        s.sell === inputs.sell
      ) {
        matched = s.code;
        break;
      }
    }
  }

  const blendedDeductPct = (inputs.c1 / 100) * (inputs.ck / 100) + (inputs.c2 / 100) * 0.2 + (c3 / 100) * 0.1;
  const netPerBox = inputs.srpPre * (1 - blendedDeductPct);
  const boxes3 = Math.round(1320 * (inputs.sell / 100));
  const boxes1 = Math.round(445 * (inputs.sell / 100));

  return {
    ...inputs,
    c3,
    srpVat: Math.round(inputs.srpPre * 1.1),
    matched,
    blendedDeductPct,
    netPerBox,
    boxes3,
    boxes1,
  };
}

export function computeScenarioTotals(p: SimParams, presetCode?: ScenarioCode | null) {
  const matched = presetCode || p.matched;
  if (matched && SCENARIOS[matched]) {
    const sc = SCENARIOS[matched];
    return {
      matched,
      netRev: sc.netRev,
      dpTotal: sc.dpTotal,
      gamTotal: sc.gamTotal,
      fxSafe: sc.fxSafe,
      fxMax: sc.fxMax,
      netPct: sc.netPct,
      roi: sc.roi,
      b1Safe: sc.b1Safe,
    };
  }

  const netRev = p.netPerBox * p.boxes3;
  const royaltyTotal = netRev * (p.roy / 100);
  const dpTotal = netRev * (p.dp / 100);
  const surplus = netRev - BATCH_CONSTANTS['3batch'].committedFixed - royaltyTotal - dpTotal;
  const gamT2 = surplus > 0 ? surplus * 0.2 : 0;
  const fxSafe = surplus - gamT2;
  const fxMax = fxSafe + dpTotal * 0.8;
  const gamTotal = (p.c2 / 100) * p.boxes3 * 0.2 * p.srpPre + royaltyTotal + gamT2;
  const netPct = netRev > 0 ? (fxSafe / netRev) * 100 : 0;
  const roi = (fxSafe / 500000000) * 100;

  const b1NetRev = p.netPerBox * p.boxes1;
  const b1Surplus =
    b1NetRev - BATCH_CONSTANTS.batch1.committedFixed - b1NetRev * (p.roy / 100) - b1NetRev * (p.dp / 100);
  const b1Safe = b1Surplus > 0 ? b1Surplus * 0.8 : b1Surplus;

  return {
    matched: null,
    netRev,
    dpTotal,
    gamTotal,
    fxSafe,
    fxMax,
    netPct,
    roi,
    b1Safe,
  };
}

/**
 * Computes dynamic per-channel contribution consistent with current SimParams and BatchMode
 * so that the sum across the 3 channels matches the active scenario/What-If FX Safe Profit.
 */
export function computeChannelBreakdown(p: SimParams, batchMode: BatchMode): ChannelBreakdownItem[] {
  const cfg = BATCH_CONSTANTS[batchMode];
  const soldBoxes = batchMode === 'batch1' ? p.boxes1 : p.boxes3;
  const fixedPerBox = soldBoxes > 0 ? cfg.committedFixed / soldBoxes : 0;

  const specs: Array<{ id: ChannelId; label: string; pct: number; deduct: number; color: string }> = [
    { id: 1, label: 'Đại lý TCG', pct: p.c1, deduct: p.ck / 100, color: '#1e293b' },
    { id: 2, label: 'GAM Store', pct: p.c2, deduct: 0.2, color: '#1d4ed8' },
    { id: 3, label: 'FramigosX D2C', pct: p.c3, deduct: 0.1, color: '#047857' },
  ];

  return specs.map((s) => {
    const boxes = soldBoxes * (s.pct / 100);
    const chNetPerBox = p.srpPre * (1 - s.deduct);
    const chSurplusPerBox = chNetPerBox * (1 - (p.roy + p.dp) / 100) - fixedPerBox;
    const profitPerBox = chSurplusPerBox > 0 ? chSurplusPerBox * 0.8 : chSurplusPerBox;
    return {
      id: s.id,
      label: s.label,
      pct: s.pct,
      boxes,
      netPerBox: chNetPerBox,
      profitPerBox,
      totalProfit: profitPerBox * boxes,
      color: s.color,
    };
  });
}
