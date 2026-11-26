import {
  BENCHMARK_SKUS,
  CHANNEL_BASE_ROWS,
  SCENARIOS,
  SCENARIO_ORDER,
  SEGMENT_WHISKERS,
  UNIT_ECON_LINES,
  type ScenarioCode,
  type SegmentId,
} from '../data/economics';
import {
  computeChannelBreakdown,
  type BatchMode,
  type ChannelId,
  type SimParams,
  type UnitView,
} from './calculations';
import { escAttr, escHtml, fmtK, fmtTr, fmtVND } from './format';

export type BenchmarkMetric = 'card' | 'box' | 'pack';
export type ScatterZoom = 'target' | 'all';
export type Sort16Key = 'vndBox' | 'vndPack' | 'vndCard' | null;

export interface CustomScenarioSummary {
  code: 'Custom';
  short: string;
  name: string;
  fxSafe: number;
  fxMax: number;
  gamTotal: number;
  b1Safe: number;
  netPct: number;
  roi: number;
}

export interface TipCallbacks {
  show: (e: MouseEvent, title: string, sub: string) => void;
  hide: () => void;
}

function tipAttrs(title: string, sub: string): string {
  return `data-tip-title="${escAttr(title)}" data-tip-sub="${escAttr(sub)}"`;
}

export function renderWaterfallSVG(
  p: SimParams,
  isB1: boolean,
  u: UnitView,
  srp: number,
  net: number,
  cogs: number,
  gp: number,
  mkt: number,
  roy: number,
  dp: number,
  surplus: number,
  gamT2: number,
  fxSafe: number
) {
  const wfBatchLabel = document.getElementById('wf-batch-label');
  if (wfBatchLabel) {
    wfBatchLabel.textContent = `${isB1 ? 'Đợt 1' : 'TB 3 Đợt'} · ${
      u === 'box' ? '1 Box' : u === 'pack' ? '1 Pack' : u === 'card' ? '1 Thẻ' : 'Tổng'
    }`;
  }

  const chDeduct = srp - net;
  const dpRelease = dp * 0.8;
  const pctOfNet = (v: number) => (net > 0 ? (v / net) * 100 : 0);

  const cols = [
    { short: 'SRP', label: 'Giá niêm yết trước VAT', val: srp, start: 0, end: srp, type: 'ink', pctNet: pctOfNet(srp), releaseCap: 0 },
    { short: 'Kênh', label: `Khấu trừ 3 kênh (${(p.blendedDeductPct * 100).toFixed(1)}%)`, val: -chDeduct, start: srp, end: net, type: 'hatch-grey', pctNet: -pctOfNet(chDeduct), releaseCap: 0 },
    { short: 'Net', label: 'Doanh thu thực thu về', val: net, start: 0, end: net, type: 'accent', pctNet: 100.0, releaseCap: 0 },
    { short: 'COGS', label: 'Giá vốn Shenzou & Logistics', val: -cogs, start: net, end: gp, type: 'hatch-amber', pctNet: -pctOfNet(cogs), releaseCap: 0 },
    { short: 'GP', label: 'Lợi nhuận gộp chuẩn', val: gp, start: 0, end: gp, type: 'ink', pctNet: pctOfNet(gp), releaseCap: 0 },
    { short: 'Mkt', label: 'Marketing & Kích hoạt', val: -mkt, start: gp, end: gp - mkt, type: 'hatch-grey', pctNet: -pctOfNet(mkt), releaseCap: 0 },
    { short: `Roy ${p.roy}%`, label: `Tầng 1 — Royalty GAM (${p.roy}%)`, val: -roy, start: gp - mkt, end: gp - mkt - roy, type: 'hatch-amber', pctNet: -p.roy, releaseCap: 0 },
    { short: `DP ${p.dp}%`, label: `Quỹ Dự phòng (${p.dp}%)`, val: -dp, start: gp - mkt - roy, end: surplus, type: 'hatch-grey', pctNet: -p.dp, releaseCap: 0 },
    { short: 'Thặng dư', label: 'Thặng dư trước chia lãi', val: surplus, start: 0, end: surplus, type: 'ink', pctNet: pctOfNet(surplus), releaseCap: 0 },
    { short: 'GAM T2', label: 'Tầng 2 — Chia lãi GAM 20%', val: -gamT2, start: surplus, end: fxSafe, type: 'hatch-amber', pctNet: -pctOfNet(gamT2), releaseCap: 0 },
    { short: 'Lãi FX', label: 'Lãi ròng An toàn FramigosX', val: fxSafe, start: 0, end: fxSafe, type: fxSafe < 0 ? 'loss' : 'money', pctNet: pctOfNet(fxSafe), releaseCap: fxSafe >= 0 ? dpRelease : 0 },
  ];

  const wfWrap = document.getElementById('waterfall-svg-wrap');
  if (!wfWrap) return;

  const W = 680;
  const H = 268;
  const padL = 54;
  const padR = 14;
  const padT = 24;
  const padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const minVal = Math.min(0, fxSafe, surplus);
  const maxVal = Math.max(srp * 1.08, 1);
  const span = maxVal - minVal;
  const sy = (v: number) => padT + plotH - ((v - minVal) / span) * plotH;
  const colStep = plotW / cols.length;
  const barW = Math.min(34, colStep * 0.64);

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Thác chuyển hóa Unit Economics">`;
  svg += `
    <defs>
      <pattern id="wf-hatch-amber" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="rgba(29, 78, 216, 0.07)" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(29, 78, 216, 0.42)" stroke-width="2" />
      </pattern>
      <pattern id="wf-hatch-grey" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="rgba(15, 23, 42, 0.04)" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(15, 23, 42, 0.22)" stroke-width="2" />
      </pattern>
    </defs>
  `;

  [0, 0.25, 0.5, 0.75, 1.0].forEach((frac) => {
    const yv = srp * frac;
    const py = sy(yv);
    svg += `<line x1="${padL}" y1="${py}" x2="${W - padR}" y2="${py}" stroke="rgba(15,23,42,0.07)" stroke-width="1" />`;
    svg += `<text x="${padL - 8}" y="${py + 4}" text-anchor="end" font-size="10.5" fill="#64748b">${yv === 0 ? '0' : fmtK(yv)}</text>`;
  });

  cols.forEach((c, i) => {
    const cx = padL + i * colStep + colStep / 2;
    const x = cx - barW / 2;
    const yTop = sy(Math.max(c.start, c.end));
    const yBot = sy(Math.min(c.start, c.end));
    const bh = Math.max(2, yBot - yTop);

    let fill = '#0f172a';
    let stroke = 'none';
    let lblColor = '#0f172a';

    if (c.type === 'accent') {
      fill = '#1d4ed8';
      lblColor = '#1d4ed8';
    } else if (c.type === 'money') {
      fill = '#047857';
      lblColor = '#047857';
    } else if (c.type === 'loss') {
      fill = '#be123c';
      lblColor = '#be123c';
    } else if (c.type === 'hatch-amber') {
      fill = 'url(#wf-hatch-amber)';
      stroke = 'rgba(29,78,216,0.42)';
      lblColor = '#1e3a8a';
    } else if (c.type === 'hatch-grey') {
      fill = 'url(#wf-hatch-grey)';
      stroke = 'rgba(15,23,42,0.22)';
      lblColor = '#334155';
    }

    if (i > 0) {
      const prev = cols[i - 1];
      const prevCx = padL + (i - 1) * colStep + colStep / 2;
      const bridgeY = sy(prev.end);
      svg += `<line x1="${prevCx + barW / 2}" y1="${bridgeY}" x2="${x}" y2="${bridgeY}" stroke="rgba(15,23,42,0.24)" stroke-dasharray="2 2" stroke-width="1" />`;
    }

    const tipSub = `Giá trị: ${fmtVND(c.val)}đ (${c.pctNet >= 0 ? '' : '−'}${Math.abs(c.pctNet).toFixed(1)}% Net Rev)`;
    svg += `<g class="cursor-pointer" ${tipAttrs(c.label, tipSub)}>`;
    svg += `<rect x="${x}" y="${yTop}" width="${barW}" height="${bh}" rx="3" fill="${fill}" ${stroke !== 'none' ? `stroke="${stroke}" stroke-width="1"` : ''} />`;

    if (c.releaseCap > 0) {
      const capTop = sy(c.end + c.releaseCap);
      const capH = Math.max(2, yTop - capTop);
      svg += `<rect x="${x}" y="${capTop}" width="${barW}" height="${capH}" rx="2" fill="rgba(4, 120, 87, 0.18)" stroke="#047857" stroke-dasharray="2 2" stroke-width="1" />`;
      svg += `<text x="${cx}" y="${capTop - 5}" text-anchor="middle" font-size="10" font-weight="600" fill="#047857">${fmtK(c.val)}</text>`;
    } else {
      svg += `<text x="${cx}" y="${yTop - 5}" text-anchor="middle" font-size="10" font-weight="500" fill="${lblColor}">${fmtK(c.val)}</text>`;
    }

    svg += `<text x="${cx}" y="${padT + plotH + 15}" text-anchor="middle" font-size="10" font-weight="${c.type === 'money' || c.type === 'accent' ? '600' : '400'}" fill="#334155">${c.short}</text>`;
    svg += `<text x="${cx}" y="${padT + plotH + 27}" text-anchor="middle" font-size="9.5" fill="#64748b">${Math.abs(c.pctNet).toFixed(0)}%</text>`;
    svg += `</g>`;
  });

  svg += `</svg>`;
  wfWrap.innerHTML = svg;

  const wfMaxNote = document.getElementById('wf-max-note');
  if (wfMaxNote) {
    wfMaxNote.textContent = `Hoàn nhập 100% DP: ${fmtVND(fxSafe + dpRelease)}đ (${pctOfNet(fxSafe + dpRelease).toFixed(1)}% Net)`;
  }
}

export function renderScenarioChart(activeCode: ScenarioCode | null, customObj: CustomScenarioSummary) {
  const container = document.getElementById('scenario-bars-chart');
  if (!container) return;

  const items: Array<{
    code: ScenarioCode | 'Custom';
    short: string;
    name: string;
    fxSafe: number;
    fxMax: number;
    gamTotal: number;
    b1Safe: number;
    roi: number;
  }> = (['S6', 'S1', 'S2', 'S3', 'S4', 'S5'] as ScenarioCode[]).map((k) => SCENARIOS[k]);
  if (!activeCode && customObj) items.push(customObj);

  const W = 520;
  const H = 264;
  const padL = 44;
  const padR = 12;
  const padT = 22;
  const padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = 900000000;
  const sy = (v: number) => padT + plotH - (Math.max(0, v) / yMax) * plotH;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Biểu đồ 6 kịch bản">`;
  [0, 250e6, 500e6, 750e6].forEach((yv) => {
    const py = sy(yv);
    svg += `<line x1="${padL}" y1="${py}" x2="${W - padR}" y2="${py}" stroke="rgba(15,23,42,0.08)" stroke-width="1" />`;
    svg += `<text x="${padL - 6}" y="${py + 4}" text-anchor="end" font-size="10" fill="#64748b">${yv === 0 ? '0' : yv / 1e6 + 'tr'}</text>`;
  });
  svg += `<line x1="${padL}" y1="${sy(500e6)}" x2="${W - padR}" y2="${sy(500e6)}" stroke="#0f172a" stroke-dasharray="4 3" stroke-width="1.1" />`;

  const grpW = plotW / items.length;
  const bw = Math.min(16, grpW * 0.22);
  const gap = 2;

  items.forEach((sc, idx) => {
    const cx = padL + idx * grpW + grpW / 2;
    const isSel = sc.code === activeCode || sc.code === 'Custom';
    const isCust = sc.code === 'Custom';

    if (isSel) {
      svg += `<rect x="${cx - grpW * 0.45}" y="${padT}" width="${grpW * 0.9}" height="${plotH + 32}" rx="6" fill="${
        isCust ? 'rgba(4,120,87,0.07)' : 'rgba(29,78,216,0.065)'
      }" stroke="${isCust ? 'rgba(4,120,87,0.25)' : 'rgba(29,78,216,0.24)'}" stroke-width="1" />`;
    }

    const startX = cx - (bw * 3 + gap * 2) / 2;
    const ySafe = sy(sc.fxSafe);
    const hSafe = Math.max(2, sy(0) - ySafe);
    const yMaxPt = sy(sc.fxMax);
    const hCap = Math.max(0, ySafe - yMaxPt);
    const yGam = sy(sc.gamTotal);
    const hGam = Math.max(2, sy(0) - yGam);
    const yB1 = sy(sc.b1Safe);
    const hB1 = Math.max(2, sy(0) - yB1);

    const tipSub = `Lãi FX: ${fmtVND(sc.fxSafe)}đ (Max: ${fmtTr(sc.fxMax)})<br/>Trả GAM: ${fmtVND(sc.gamTotal)}đ · Lãi Đ1: ${fmtTr(sc.b1Safe)}`;
    const clickAttr = isCust ? '' : `data-action="select-scenario" data-scenario="${sc.code}"`;

    svg += `<g class="cursor-pointer" ${clickAttr} ${tipAttrs(sc.name, tipSub)}>
      <rect x="${startX}" y="${ySafe}" width="${bw}" height="${hSafe}" rx="2" fill="${sc.fxSafe < 0 ? '#be123c' : '#047857'}" />
      ${hCap > 1 && sc.fxSafe >= 0 ? `<rect x="${startX}" y="${yMaxPt}" width="${bw}" height="${hCap}" rx="2" fill="rgba(4,120,87,0.22)" />` : ''}
      <text x="${startX + bw / 2}" y="${Math.min(ySafe, yMaxPt) - 4}" text-anchor="middle" font-size="9.5" font-weight="600" fill="${
        sc.fxSafe < 0 ? '#be123c' : '#047857'
      }">${Math.round(sc.fxSafe / 1e6)}</text>
      <rect x="${startX + bw + gap}" y="${yGam}" width="${bw}" height="${hGam}" rx="2" fill="rgba(29,78,216,0.84)" />
      <rect x="${startX + (bw + gap) * 2}" y="${yB1}" width="${bw}" height="${hB1}" rx="2" fill="rgba(2,132,199,0.78)" />
      <text x="${cx}" y="${padT + plotH + 14}" text-anchor="middle" font-size="10" font-weight="${isSel ? '600' : '500'}" fill="#0f172a">${sc.short}</text>
      <text x="${cx}" y="${padT + plotH + 26}" text-anchor="middle" font-size="9.5" fill="#64748b">ROI ${sc.roi >= 0 ? '+' : ''}${sc.roi.toFixed(0)}%</text>
    </g>`;
  });

  svg += `</svg>`;
  container.innerHTML = svg;
}

export function renderChannelVisuals(
  p: SimParams,
  batchMode: BatchMode,
  selectedChannelFilter: ChannelId | null
) {
  const donutWrap = document.getElementById('channel-donut-wrap');
  const barsWrap = document.getElementById('channel-profit-bars-wrap');
  if (!donutWrap || !barsWrap) return;

  const srpPct = (p.netPerBox / p.srpPre) * 100;
  const rows = computeChannelBreakdown(p, batchMode);
  const totalBoxes = batchMode === 'batch1' ? p.boxes1 : p.boxes3;

  const size = 144;
  const cx = 72;
  const cy = 72;
  const r = 52;
  const strokeW = 16;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  let arcs = '';
  rows.forEach((s) => {
    const len = (s.pct / 100) * circ;
    const dim = selectedChannelFilter && selectedChannelFilter !== s.id ? 0.25 : 1;
    arcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" opacity="${dim}" stroke-width="${strokeW}" stroke-dasharray="${Math.max(
      0,
      len - 2
    )} ${circ}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" class="cursor-pointer" data-action="toggle-channel" data-channel="${
      s.id
    }" ${tipAttrs(s.label, `Tỷ trọng: ${s.pct}% (${Math.round(s.boxes)} Box) · Click để lọc`)} />`;
    offset += len;
  });

  donutWrap.innerHTML = `<svg viewBox="0 0 ${size} ${size}" class="w-[132px] h-[132px] svg-chart"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(15,23,42,0.06)" stroke-width="${strokeW}" />${arcs}<text x="${cx}" y="${
    cy - 4
  }" text-anchor="middle" font-size="14.5" font-weight="600" fill="#0f172a">${fmtK(p.netPerBox)}</text><text x="${cx}" y="${
    cy + 13
  }" text-anchor="middle" font-size="10.5" fill="#64748b">${srpPct.toFixed(1)}% SRP</text></svg>`;

  const maxP = Math.max(...rows.map((row) => Math.abs(row.totalProfit)), 1);
  let barSvg = `<svg viewBox="0 0 280 124" class="w-full h-auto svg-chart"><text x="0" y="12" font-size="11" font-weight="500" fill="#334155">Đóng góp Lãi ròng FX (${fmtVND(
    totalBoxes
  )} Box)</text>`;

  rows.forEach((row, i) => {
    const y = 24 + i * 33;
    const bw = Math.max(4, (Math.max(0, row.totalProfit) / maxP) * 132);
    const dim = selectedChannelFilter && selectedChannelFilter !== row.id ? 0.3 : 1;
    const barCol = row.totalProfit < 0 ? '#be123c' : row.color;
    barSvg += `<g class="cursor-pointer" opacity="${dim}" data-action="toggle-channel" data-channel="${
      row.id
    }" ${tipAttrs(`${row.label} (${row.pct}%)`, `Sản lượng: ${Math.round(row.boxes)} Box · Lãi ròng: ${fmtVND(row.totalProfit)}đ`)}>
      <text x="0" y="${y + 10}" font-size="11.5" fill="#0f172a" font-weight="500">${row.label} (${row.pct}%)</text>
      <rect x="0" y="${y + 16}" width="132" height="7" rx="3" fill="rgba(15,23,42,0.08)" />
      <rect x="0" y="${y + 16}" width="${bw}" height="7" rx="3" fill="${barCol}" />
      <text x="140" y="${y + 22}" font-size="11.5" font-weight="500" fill="${barCol}">${fmtTr(
      row.totalProfit
    )} <tspan fill="#64748b" font-weight="400">(${Math.round(row.boxes)}b)</tspan></text>
    </g>`;
  });
  barSvg += `</svg>`;
  barsWrap.innerHTML = barSvg;
}

export function renderCVPChart(p: SimParams, batchMode: BatchMode, tip: TipCallbacks) {
  const wrap = document.getElementById('cvp-chart-wrap');
  if (!wrap) return;

  const isB1 = batchMode === 'batch1';
  const badge = document.getElementById('cvp-scale-badge');
  if (badge) badge.textContent = isB1 ? 'Đợt 1 (445 Box)' : '3 Đợt (1.320 Box)';

  const maxQ = isB1 ? 445 : 1320;
  const fixedCost = isB1 ? 383639000 : 915749000;
  const unitContrib = p.netPerBox * (1 - (p.roy + p.dp) / 100);
  const beQ = unitContrib > 0 ? fixedCost / unitContrib : maxQ;
  const clampedBe = Math.min(maxQ, Math.max(0, beQ));
  const yMax = Math.max(fixedCost * 1.4, unitContrib * maxQ * 1.12);

  const W = 640;
  const H = 228;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const sx = (q: number) => padL + (q / maxQ) * plotW;
  const sy = (v: number) => padT + plotH - (v / yMax) * plotH;

  const xBe = sx(clampedBe);
  const yBe = sy(fixedCost);
  const xEnd = sx(maxQ);
  const yRevEnd = sy(unitContrib * maxQ);
  const yRev0 = sy(0);

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Đồ thị hòa vốn CVP">`;

  [0, 0.33, 0.66, 1].forEach((f) => {
    const yv = yMax * f;
    const py = sy(yv);
    svg += `<line x1="${padL}" y1="${py}" x2="${W - padR}" y2="${py}" stroke="rgba(15,23,42,0.08)" stroke-width="1" />`;
    svg += `<text x="${padL - 7}" y="${py + 4}" text-anchor="end" font-size="10" fill="#64748b">${yv === 0 ? '0' : Math.round(yv / 1e6) + 'tr'}</text>`;
  });

  const xSteps = isB1 ? [0, 111, 222, 330, 445] : [0, 330, 660, 990, 1320];
  xSteps.forEach((qv) => {
    svg += `<text x="${sx(qv)}" y="${padT + plotH + 15}" text-anchor="middle" font-size="10" fill="#64748b">${fmtVND(qv)} Box</text>`;
  });

  svg += `<polygon points="${sx(0)},${yBe} ${xBe},${yBe} ${sx(0)},${yRev0}" fill="rgba(190, 18, 60, 0.08)" />`;
  if (beQ < maxQ) svg += `<polygon points="${xBe},${yBe} ${xEnd},${yRevEnd} ${xEnd},${yBe}" fill="rgba(4, 120, 87, 0.10)" />`;

  svg += `<line x1="${padL}" y1="${yBe}" x2="${xEnd}" y2="${yBe}" stroke="#0f172a" stroke-dasharray="5 3" stroke-width="1.4" />`;
  svg += `<text x="${padL + 6}" y="${yBe - 6}" font-size="10" font-weight="500" fill="#0f172a">Định phí: ${fmtTr(fixedCost)}</text>`;

  svg += `<line x1="${sx(0)}" y1="${yRev0}" x2="${xEnd}" y2="${yRevEnd}" stroke="#047857" stroke-width="2" />`;
  svg += `<text x="${xEnd - 6}" y="${yRevEnd + 14}" text-anchor="end" font-size="10" font-weight="500" fill="#047857">Thu thuần: ${fmtTr(unitContrib * maxQ)}</text>`;

  if (isB1) {
    const xGate = sx(356);
    svg += `<line x1="${xGate}" y1="${padT}" x2="${xGate}" y2="${padT + plotH}" stroke="#1d4ed8" stroke-dasharray="3 3" stroke-width="1.2" />`;
    svg += `<text x="${xGate - 6}" y="${padT + 12}" text-anchor="end" font-size="10" font-weight="600" fill="#1d4ed8">Van Đ2: 356 Box (80%)</text>`;
  } else {
    const xS6 = sx(990);
    svg += `<line x1="${xS6}" y1="${padT}" x2="${xS6}" y2="${padT + plotH}" stroke="#b45309" stroke-dasharray="3 3" stroke-width="1.2" />`;
    svg += `<text x="${xS6 - 6}" y="${padT + 12}" text-anchor="end" font-size="10" font-weight="600" fill="#b45309">S6 Stress: 990 Box (75%)</text>`;
  }

  if (beQ <= maxQ) {
    svg += `<line x1="${xBe}" y1="${yBe}" x2="${xBe}" y2="${padT + plotH}" stroke="#0f172a" stroke-dasharray="2 2" stroke-width="1.1" />`;
    svg += `<circle cx="${xBe}" cy="${yBe}" r="4.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />`;
    svg += `<text x="${xBe - 6}" y="${padT + plotH - 7}" text-anchor="end" font-size="10" font-weight="600" fill="#0f172a">Hòa vốn: ${beQ.toFixed(1).replace('.', ',')} Box</text>`;
  }

  svg += `<line id="cvp-cross-line" x1="0" y1="${padT}" x2="0" y2="${padT + plotH}" stroke="#1d4ed8" stroke-width="1" opacity="0" />`;
  svg += `<circle id="cvp-cross-dot" cx="0" cy="0" r="4.5" fill="#047857" stroke="#ffffff" stroke-width="1.5" opacity="0" />`;
  svg += `<rect id="cvp-hover-rect" x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="transparent" class="cursor-crosshair" />`;
  svg += `</svg>`;
  wrap.innerHTML = svg;

  const hoverRect = document.getElementById('cvp-hover-rect');
  const crossLine = document.getElementById('cvp-cross-line');
  const crossDot = document.getElementById('cvp-cross-dot');

  if (hoverRect && crossLine && crossDot) {
    hoverRect.addEventListener('mousemove', (e) => {
      const rect = hoverRect.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const q = Math.round(ratio * maxQ);
      const rev = unitContrib * q;
      const surplus = rev - fixedCost;
      const fx = surplus > 0 ? surplus * 0.8 : surplus;

      crossLine.setAttribute('x1', String(sx(q)));
      crossLine.setAttribute('x2', String(sx(q)));
      crossLine.setAttribute('opacity', '1');
      crossDot.setAttribute('cx', String(sx(q)));
      crossDot.setAttribute('cy', String(sy(rev)));
      crossDot.setAttribute('opacity', '1');

      const st =
        fx >= 0
          ? `Lãi ròng FX: <strong style="color:#4cc38a">+${fmtVND(fx)}đ</strong>`
          : `Lỗ ròng: <strong style="color:#ff6b70">${fmtVND(fx)}đ</strong>`;
      tip.show(
        e,
        `Sản lượng: ${fmtVND(q)} / ${fmtVND(maxQ)} Box (${((q / maxQ) * 100).toFixed(1)}%)`,
        `Thu thuần: ${fmtVND(rev)}đ · Định phí: ${fmtVND(fixedCost)}đ<br/>${st}`
      );
    });

    hoverRect.addEventListener('mouseleave', () => {
      crossLine.setAttribute('opacity', '0');
      crossDot.setAttribute('opacity', '0');
      tip.hide();
    });
  }
}

export function renderScatterPlot(scatterZoom: ScatterZoom) {
  const wrap = document.getElementById('scatter-chart-wrap');
  if (!wrap) return;

  const W = 920;
  const H = 275;
  const padL = 66;
  const padR = 26;
  const padT = 24;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const isTargetZoom = scatterZoom === 'target';
  const xMax = isTargetZoom ? 3600000 : 7500000;
  const yMax = isTargetZoom ? 40000 : 95000;
  const sx = (x: number) => padL + (x / xMax) * plotW;
  const sy = (y: number) => padT + plotH - (y / yMax) * plotH;

  const xTicks = isTargetZoom ? [0, 900000, 1800000, 2700000, 3600000] : [0, 1500000, 3000000, 4500000, 6000000, 7500000];
  const yTicks = isTargetZoom ? [0, 10000, 20000, 30000, 40000] : [0, 20000, 40000, 60000, 80000];

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Bản đồ định vị thị trường 2D">`;
  yTicks.forEach((yv) => {
    const py = sy(yv);
    svg += `<line x1="${padL}" y1="${py}" x2="${W - padR}" y2="${py}" stroke="rgba(15,23,42,0.08)" stroke-width="1" />`;
    svg += `<text x="${padL - 10}" y="${py + 4}" text-anchor="end" font-size="11" fill="#64748b">${yv === 0 ? '0đ' : yv / 1000 + 'k'}</text>`;
  });
  xTicks.forEach((xv) => {
    const px = sx(xv);
    svg += `<line x1="${px}" y1="${padT}" x2="${px}" y2="${padT + plotH}" stroke="rgba(15,23,42,0.05)" stroke-width="1" />`;
    svg += `<text x="${px}" y="${padT + plotH + 17}" text-anchor="middle" font-size="11" fill="#64748b">${
      xv === 0 ? '0' : (xv / 1e6).toFixed(1).replace('.0', '').replace('.', ',') + ' tr'
    }</text>`;
  });
  svg += `<text x="${padL + plotW / 2}" y="${H - 5}" text-anchor="middle" font-size="11" fill="#64748b">Giá phát hành gốc / Hộp hoặc Pack (VNĐ)</text>`;
  svg += `<text x="15" y="${padT + plotH / 2}" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 15 ${
    padT + plotH / 2
  })">Đơn giá / Thẻ (VNĐ)</text>`;

  const cX1 = sx(1500000);
  const cX2 = sx(2040000);
  svg += `<rect x="${cX1}" y="${padT}" width="${cX2 - cX1}" height="${plotH}" fill="rgba(29, 78, 216, 0.065)" stroke="rgba(29, 78, 216, 0.28)" stroke-dasharray="4 3" stroke-width="1" />`;
  svg += `<text x="${(cX1 + cX2) / 2}" y="${padT + 14}" text-anchor="middle" font-size="11" font-weight="500" fill="#1d4ed8">Hành lang tối ưu: 1,50–2,04 tr</text>`;

  const avgY = sy(25483);
  svg += `<line x1="${padL}" y1="${avgY}" x2="${W - padR}" y2="${avgY}" stroke="#64748b" stroke-dasharray="5 3" stroke-width="1" />`;
  svg += `<text x="${W - padR - 4}" y="${avgY - 6}" text-anchor="end" font-size="11" fill="#334155">TB 13 SKU thuần thẻ: 25.483đ/thẻ</text>`;

  const pts = BENCHMARK_SKUS.filter((d) => !d.isBundle && (isTargetZoom ? d.vndBox <= 3600000 : true));
  const ordered = [
    ...pts.filter((d) => !d.hasAuto && !d.isTarget),
    ...pts.filter((d) => d.hasAuto && !d.isTarget),
    ...pts.filter((d) => d.isTarget),
  ];

  ordered.forEach((item) => {
    const px = sx(item.vndBox);
    const py = sy(item.vndCard);
    const tipSub = `${item.packSpec} · Giá gốc: ${item.origPrice}<br/>Box/Pack: ${fmtVND(item.vndBox)}đ · Đơn giá: ${fmtVND(
      item.vndCard
    )}đ/thẻ`;

    if (item.isTarget) {
      svg += `
        <g class="cursor-pointer" ${tipAttrs(item.name, tipSub)}>
          <circle cx="${px}" cy="${py}" r="13" fill="rgba(29, 78, 216, 0.16)" />
          <circle cx="${px}" cy="${py}" r="6.5" fill="#1e3a8a" stroke="#ffffff" stroke-width="2" />
          <rect x="${px + 12}" y="${py - 20}" width="152" height="22" rx="5" fill="#ffffff" stroke="rgba(29, 78, 216, 0.38)" stroke-width="1" />
          <text x="${px + 18}" y="${py - 5}" font-size="11" font-weight="600" fill="#1d4ed8">FramigosX · 1,98tr · 24.750đ</text>
        </g>`;
    } else {
      const fill = item.hasAuto ? '#0284c7' : 'rgba(15, 23, 42, 0.40)';
      const showLabelIds = isTargetZoom ? [1, 4, 5, 7, 10, 11, 12, 15] : [4, 7, 12, 15, 16];
      let lbl = '';
      if (showLabelIds.includes(item.id)) {
        const dx = item.id === 4 ? -8 : 8;
        const anchor = item.id === 4 ? 'end' : 'start';
        const dy = item.id === 5 ? -7 : item.id === 11 ? 13 : 4;
        lbl = `<text x="${px + dx}" y="${py + dy}" text-anchor="${anchor}" font-size="10.5" fill="#334155">${escHtml(item.shortName)}</text>`;
      }
      svg += `<g class="cursor-pointer" ${tipAttrs(item.name, tipSub)}><circle cx="${px}" cy="${py}" r="${
        item.hasAuto ? 5.5 : 4.8
      }" fill="${fill}" stroke="#ffffff" stroke-width="1.5" />${lbl}</g>`;
    }
  });

  svg += `</svg>`;
  wrap.innerHTML = svg;
}

export function renderSegmentWhiskers() {
  const wrap = document.getElementById('segment-whiskers-wrap');
  if (!wrap) return;

  wrap.innerHTML = SEGMENT_WHISKERS.map((r) => {
    const W = 310;
    const H = 20;
    const pad = 6;
    const span = W - pad * 2;
    const px = (v: number) => pad + (v / r.scaleMax) * span;
    const targetSvg = r.target
      ? `<polygon points="${px(r.target)},3 ${px(r.target) + 5},10 ${px(r.target)},17 ${
          px(r.target) - 5
        },10" fill="#1d4ed8" stroke="#ffffff" stroke-width="1" />`
      : '';

    return `
      <div class="p-2 rounded-[6px] ${
        r.highlight ? 'bg-[var(--color-accent-bg)] border border-[var(--color-accent-ring)]' : 'bg-[var(--color-soft)]'
      } space-y-0.5">
        <div class="flex justify-between text-[11.5px]">
          <span class="${r.highlight ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-2)]'} font-medium">${r.title}</span>
          <span class="font-mono-num font-medium">TB: ${fmtVND(r.mean)}đ</span>
        </div>
        <svg viewBox="0 0 ${W} ${H}" class="w-full h-4 svg-chart">
          <line x1="${pad}" y1="10" x2="${W - pad}" y2="10" stroke="rgba(15,23,42,0.1)" stroke-width="2" />
          <line x1="${px(r.min)}" y1="10" x2="${px(r.max)}" y2="10" stroke="#334155" stroke-width="2.5" />
          <line x1="${px(r.med)}" y1="3" x2="${px(r.med)}" y2="17" stroke="#0f172a" stroke-width="2" />
          <circle cx="${px(r.mean)}" cy="10" r="3.5" fill="#0284c7" stroke="#ffffff" stroke-width="1" />
          ${targetSvg}
        </svg>
        <div class="flex justify-between text-[10.5px] font-mono-num text-[var(--color-muted)]">
          <span>Min: ${fmtK(r.min)}</span><span>Med: ${fmtK(r.med)}</span>${
            r.target ? `<span class="text-[var(--color-accent)] font-medium">◆ FX: ${fmtK(r.target)}</span>` : ''
          }<span>Max: ${fmtK(r.max)}</span>
        </div>
      </div>`;
  }).join('');
}

export function renderBenchmarkChart(bmSegmentFilter: 'all' | SegmentId, bmMetric: BenchmarkMetric) {
  const container = document.getElementById('bm-bars-container');
  if (!container) return;

  const list = BENCHMARK_SKUS.filter((item) => {
    if (item.isTarget) return true;
    if (bmMetric === 'card' && item.isBundle) return false;
    if (bmMetric === 'box' && !item.isBox) return false;
    return bmSegmentFilter === 'all' || item.seg === bmSegmentFilter;
  });

  const prop = bmMetric === 'card' ? 'vndCard' : bmMetric === 'box' ? 'vndBox' : 'vndPack';
  list.sort((a, b) => b[prop] - a[prop]);
  const maxVal = Math.max(...list.map((d) => d[prop]), 1);

  const subEl = document.getElementById('bm-chart-subtitle');
  const headEl = document.getElementById('bm-chart-headline');
  const avgEl = document.getElementById('bm-chart-avg');
  if (subEl) {
    subEl.textContent =
      bmMetric === 'card'
        ? 'Đơn giá phát hành gốc trên mỗi thẻ (13 SKU thuần thẻ)'
        : bmMetric === 'box'
          ? 'Giá phát hành gốc trên mỗi Hộp / Bundle'
          : 'Giá phát hành gốc trên mỗi Pack';
  }
  if (headEl) {
    headEl.textContent =
      bmMetric === 'card'
        ? 'FramigosX: 24.750 VNĐ / thẻ'
        : bmMetric === 'box'
          ? 'FramigosX: 1.980.000 VNĐ / Box'
          : 'FramigosX: 198.000 VNĐ / Pack';
  }
  if (avgEl) {
    avgEl.textContent =
      bmMetric === 'card'
        ? 'TB 13 SKU thuần thẻ: 25.483 VNĐ'
        : bmMetric === 'box'
          ? 'TB 13 SKU Hộp: 2.160.030 VNĐ'
          : '8 thẻ / Pack';
  }

  container.innerHTML = list
    .map((item) => {
      const val = item[prop];
      const w = Math.max(4, (val / maxVal) * 100);
      const barCol = item.isTarget ? 'bg-[var(--color-accent)]' : item.hasAuto ? 'bg-[#0284c7]/75' : 'bg-[#0f172a]/22';
      return `
        <div class="${
          item.isTarget
            ? 'bg-[var(--color-accent-bg)] ring-1 ring-inset ring-[var(--color-accent-ring)] rounded-[6px] px-2.5 py-1.5'
            : 'px-2.5 py-1 hover:bg-[var(--color-soft)] rounded-[5px]'
        }" ${tipAttrs(item.name, `${item.packSpec} · ${item.origPrice}<br/>${item.note}`)}>
          <div class="flex justify-between text-[12px] gap-2 mb-1">
            <span class="truncate ${item.isTarget ? 'font-medium text-[var(--color-ink)]' : 'text-[var(--color-ink-2)]'}">${escHtml(
        item.name
      )} <span class="text-[11px] text-[var(--color-muted)]">(${escHtml(item.packSpec)})</span></span>
            <span class="font-mono-num shrink-0 ${item.isTarget ? 'font-medium text-[var(--color-accent)]' : 'text-[var(--color-ink)]'}">${fmtVND(
        val
      )}đ</span>
          </div>
          <div class="h-2 w-full rounded-[3px] bg-[var(--color-line)] overflow-hidden"><div class="h-full rounded-[3px] ${barCol}" style="width:${w.toFixed(
        1
      )}%"></div></div>
        </div>`;
    })
    .join('');
}

export function renderTable16SKUs(sort16Key: Sort16Key, sort16Asc: boolean) {
  const input = document.getElementById('search-16-skus') as HTMLInputElement | null;
  const tbody = document.getElementById('table-16-skus-body');
  if (!tbody) return;

  const q = (input?.value || '').toLowerCase().trim();
  let list = BENCHMARK_SKUS.filter(
    (i) => !q || i.name.toLowerCase().includes(q) || i.segLabel.toLowerCase().includes(q) || i.note.toLowerCase().includes(q)
  );
  if (sort16Key) {
    const k = sort16Key;
    list = list.slice().sort((a, b) => (sort16Asc ? a[k] - b[k] : b[k] - a[k]));
  }

  const maxCard = 89375;
  tbody.innerHTML = list
    .map((item) => {
      const w = item.isBundle ? 0 : Math.min(100, (item.vndCard / maxCard) * 100);
      const cardCell = item.isBundle
        ? `<span class="text-[var(--color-muted)]">${fmtVND(item.vndCard)} (PK)</span>`
        : `<div class="flex items-center justify-end gap-2"><div class="w-16 h-1.5 rounded bg-[var(--color-line)] overflow-hidden"><div class="h-full ${
            item.isTarget ? 'bg-[var(--color-accent)]' : 'bg-[#0284c7]/75'
          }" style="width:${w.toFixed(0)}%"></div></div><span class="font-medium">${fmtVND(item.vndCard)}</span></div>`;
      return `
        <tr class="${item.isTarget ? 'row-highlight' : ''}">
          <td class="whitespace-nowrap">${escHtml(item.segLabel)}</td>
          <td class="font-medium text-[var(--color-ink)]">${escHtml(item.name)}</td>
          <td class="whitespace-nowrap font-mono-num">${escHtml(item.packSpec)}</td>
          <td class="text-right font-mono-num whitespace-nowrap">${escHtml(item.origPrice)}</td>
          <td class="text-right font-mono-num">${fmtVND(item.vndBox)}</td>
          <td class="text-right font-mono-num">${fmtVND(item.vndPack)}</td>
          <td class="text-right font-mono-num">${cardCell}</td>
          <td class="text-[12px]">${escHtml(item.note)}</td>
        </tr>`;
    })
    .join('');
}

export function renderSkuLadderSVG() {
  const wrap = document.getElementById('sku-ladder-wrap');
  if (!wrap) return;

  const W = 920;
  const H = 128;
  const padL = 225;
  const padR = 165;
  const padT = 10;
  const rowH = 26;
  const gap = 4;
  const plotW = W - padL - padR;
  const sx = (v: number) => padL + (v / 28000) * plotW;

  const skus = [
    { label: 'SKU 1 · Single Booster Pack', cardVat: 26125, cardPre: 23750, delta: '+5,6% vs Box', color: '#334155', isAnchor: false },
    { label: 'SKU 3 · Standard Hobby Box (Mốc)', cardVat: 24750, cardPre: 22500, delta: '0,0% Mốc chuẩn', color: '#1d4ed8', isAnchor: true },
    { label: 'SKU 4 · Sealed Master Case', cardVat: 23513, cardPre: 21375, delta: '−5,0% thùng seal', color: '#047857', isAnchor: false },
    { label: 'SKU 2 · Early-Bird Pre-order', cardVat: 22275, cardPre: 20250, delta: '−10,0% ưu đãi', color: '#0284c7', isAnchor: false },
  ];

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Thang đơn giá 4 SKU">`;
  svg += `<line x1="${sx(24750)}" y1="${padT - 2}" x2="${sx(24750)}" y2="${
    padT + 4 * (rowH + gap)
  }" stroke="#0f172a" stroke-dasharray="3 3" stroke-width="1.2" />`;

  skus.forEach((s, i) => {
    const y = padT + i * (rowH + gap);
    const bw = sx(s.cardVat) - padL;
    svg += `<g class="cursor-pointer" ${tipAttrs(
      s.label,
      `Gồm VAT: ${fmtVND(s.cardVat)}đ/thẻ · Trước VAT: ${fmtVND(s.cardPre)}đ/thẻ`
    )}>
      <text x="${padL - 10}" y="${y + 16}" text-anchor="end" font-size="11.5" font-weight="${s.isAnchor ? '600' : '400'}" fill="${
      s.isAnchor ? '#1d4ed8' : '#334155'
    }">${s.label}</text>
      <rect x="${padL}" y="${y + 4}" width="${plotW}" height="15" rx="3" fill="#edf2f7" />
      <rect x="${padL}" y="${y + 4}" width="${bw}" height="15" rx="3" fill="${s.color}" opacity="${s.isAnchor ? '1' : '0.84'}" />
      <text x="${padL + bw + 8}" y="${y + 15}" font-size="11.5" font-weight="500" fill="#0f172a" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">${fmtVND(
      s.cardVat
    )}đ/thẻ <tspan fill="#64748b" font-weight="400">(${s.delta})</tspan></text>
    </g>`;
  });
  svg += `</svg>`;
  wrap.innerHTML = svg;
}

export function renderChannelStackedChart(selectedChannelFilter: ChannelId | null) {
  const wrap = document.getElementById('channel-stacked-chart-wrap');
  if (!wrap) return;

  const W = 540;
  const H = 170;
  const padL = 165;
  const padR = 56;
  const barW = W - padL - padR;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart">`;
  const leg = [
    { lbl: 'COGS+Mkt', col: '#1e293b' },
    { lbl: 'Roy 10%', col: '#1d4ed8' },
    { lbl: 'DP 5%', col: '#94a3b8' },
    { lbl: 'GAM T2', col: '#0284c7' },
    { lbl: 'Lãi FX', col: '#047857' },
  ];
  let lx = padL;
  leg.forEach((item) => {
    svg += `<rect x="${lx}" y="4" width="8" height="8" rx="2" fill="${item.col}" /><text x="${lx + 11}" y="12" font-size="10" fill="#334155">${
      item.lbl
    }</text>`;
    lx += item.lbl.length * 5.6 + 22;
  });

  CHANNEL_BASE_ROWS.forEach((ch, idx) => {
    const y = 28 + idx * 34;
    const dim = selectedChannelFilter && ch.id !== 0 && selectedChannelFilter !== ch.id ? 0.3 : 1;
    const parts = [
      { lbl: 'COGS + Mkt', val: ch.cogs, col: '#1e293b', textCol: '#ffffff' },
      { lbl: 'Royalty GAM', val: ch.roy, col: '#1d4ed8', textCol: '#ffffff' },
      { lbl: 'Quỹ dự phòng', val: ch.dp, col: '#94a3b8', textCol: '#0f172a' },
      { lbl: 'Chia lãi T2', val: ch.gamT2, col: '#0284c7', textCol: '#ffffff' },
      { lbl: 'Lãi ròng FX', val: ch.fx, col: '#047857', textCol: '#ffffff' },
    ];
    const clickAttrs = ch.id ? `data-action="toggle-channel" data-channel="${ch.id}"` : '';

    svg += `<g opacity="${dim}" class="${ch.id ? 'cursor-pointer' : ''}" ${clickAttrs}>`;
    svg += `<text x="${padL - 8}" y="${y + 15}" text-anchor="end" font-size="11" font-weight="${ch.isSum ? '600' : '400'}" fill="#0f172a">${
      ch.name
    }</text>`;
    let curX = padL;
    parts.forEach((part) => {
      const pct = (part.val / ch.net) * 100;
      const segW = (part.val / ch.net) * barW;
      svg += `<g ${tipAttrs(ch.name, `${part.lbl}: ${fmtVND(part.val)}đ/Box (${pct.toFixed(1)}%)`)}>
        <rect x="${curX}" y="${y + 2}" width="${Math.max(1, segW - 1)}" height="19" rx="2" fill="${part.col}" />
        ${
          segW > 30
            ? `<text x="${curX + segW / 2}" y="${y + 15}" text-anchor="middle" font-size="9.5" font-weight="500" fill="${
                part.textCol
              }">${pct.toFixed(0)}%</text>`
            : ''
        }
      </g>`;
      curX += segW;
    });
    svg += `<text x="${padL + barW + 6}" y="${y + 15}" font-size="11" font-weight="600" fill="#047857">${fmtK(ch.fx)}</text></g>`;
  });
  svg += `</svg>`;
  wrap.innerHTML = svg;
}

export function renderTable32(selectedChannelFilter: ChannelId | null) {
  const tbody = document.getElementById('table-32-channels-body');
  if (!tbody) return;

  tbody.innerHTML = CHANNEL_BASE_ROWS.map((r) => {
    const isSel = selectedChannelFilter && r.id === selectedChannelFilter;
    const cls = r.isSum ? 'row-profit' : isSel ? 'row-highlight cursor-pointer' : r.id ? 'cursor-pointer' : '';
    const op = selectedChannelFilter && !r.isSum && r.id !== selectedChannelFilter ? 'opacity-45' : '';
    const clickAttrs = r.id ? `data-action="toggle-channel" data-channel="${r.id}"` : '';

    return `<tr class="${cls} ${op}" ${clickAttrs}>
      <td class="font-medium text-[var(--color-ink)]">${r.tableName}</td>
      <td class="text-right font-mono-num">${fmtVND(r.net)}</td>
      <td class="text-right font-mono-num">${fmtVND(-(r.cogs))}</td>
      <td class="text-right font-mono-num">${fmtVND(-r.roy)}</td>
      <td class="text-right font-mono-num">${fmtVND(-r.dp)}</td>
      <td class="text-right font-mono-num">${fmtVND(-r.gamT2)}</td>
      <td class="text-right font-mono-num">${r.b1Text}</td>
      <td class="text-right font-mono-num font-medium text-[var(--color-money)]">${fmtVND(r.fx)}đ</td>
      <td class="text-right font-mono-num font-medium">${r.marginText}</td>
    </tr>`;
  }).join('');
}

export function renderCOGSTreemapAndScale(batchMode: BatchMode, unitView: UnitView) {
  const isB1 = batchMode === 'batch1';
  const mult = unitView === 'box' ? 1 : unitView === 'pack' ? 0.1 : unitView === 'card' ? 0.0125 : isB1 ? 445 : 1320;

  const cogsItems = UNIT_ECON_LINES.filter((l) => l.type === 'cogs')
    .map((l) => ({
      ...l,
      valBox: Math.abs(isB1 ? l.b1Box : l.b3Box),
      savedBox: Math.abs(l.b1Box) - Math.abs(l.b3Box),
    }))
    .sort((a, b) => b.valBox - a.valBox);

  const totalBox = cogsItems.reduce((s, d) => s + d.valBox, 0);
  const headerTotal = document.getElementById('cogs-header-total');
  if (headerTotal) headerTotal.textContent = `${fmtVND(totalBox * mult)}đ`;

  const wrap = document.getElementById('cogs-treemap-wrap');
  if (wrap) {
    const W = 620;
    const H = 248;
    const pad = 2;
    const shenzou = cogsItems.filter((d) => d.grp === 'shenzou');
    const pack = cogsItems.filter((d) => d.grp === 'pack');
    const log = cogsItems.filter((d) => d.grp === 'logistics');

    const wShen = (shenzou.reduce((s, d) => s + d.valBox, 0) / totalBox) * W;
    const wOther = W - wShen;
    const packSum = pack.reduce((s, d) => s + d.valBox, 0);
    const logSum = log.reduce((s, d) => s + d.valBox, 0);
    const hPack = (packSum / (packSum + logSum)) * H;

    interface RectItem {
      code: string;
      short?: string;
      title: string;
      valBox: number;
      savedBox: number;
      x: number;
      y: number;
      w: number;
      h: number;
      bg: string;
      fg: string;
    }

    const rects: RectItem[] = [];
    const shenCol1 = shenzou.slice(0, 3);
    const shenCol2 = shenzou.slice(3);
    const s1Sum = shenCol1.reduce((s, d) => s + d.valBox, 0);
    const s2Sum = shenCol2.reduce((s, d) => s + d.valBox, 0);
    const wC1 = (s1Sum / (s1Sum + s2Sum)) * wShen;
    const wC2 = wShen - wC1;

    let cy = 0;
    shenCol1.forEach((d) => {
      const rh = (d.valBox / s1Sum) * H;
      rects.push({ ...d, x: 0, y: cy, w: wC1, h: rh, bg: '#0f172a', fg: '#ffffff' });
      cy += rh;
    });
    cy = 0;
    shenCol2.forEach((d, idx) => {
      const rh = (d.valBox / s2Sum) * H;
      const shades = ['#1e293b', '#334155', '#475569', '#64748b', '#7c8ba1'];
      rects.push({ ...d, x: wC1, y: cy, w: wC2, h: rh, bg: shades[idx % shades.length], fg: '#ffffff' });
      cy += rh;
    });
    cy = 0;
    pack.forEach((d, idx) => {
      const rh = (d.valBox / packSum) * hPack;
      rects.push({ ...d, x: wShen, y: cy, w: wOther, h: rh, bg: idx === 0 ? '#1e3a8a' : '#1d4ed8', fg: '#ffffff' });
      cy += rh;
    });
    log.forEach((d) => {
      rects.push({ ...d, x: wShen, y: hPack, w: wOther, h: H - hPack, bg: '#0284c7', fg: '#ffffff' });
    });

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Treemap 11 cấu phần Giá vốn nhập kho">`;
    rects.forEach((r) => {
      const share = (r.valBox / totalBox) * 100;
      const rx = r.x + pad;
      const ry = r.y + pad;
      const rw = Math.max(1, r.w - pad * 2);
      const rh = Math.max(1, r.h - pad * 2);
      const saveNote = r.savedBox > 0 ? `<br/>Tiết kiệm khi gộp 3 đợt: −${fmtVND(r.savedBox)}đ/Box` : '';
      const tipSub = `Chi phí: ${fmtVND(r.valBox * mult)}đ (${share.toFixed(1)}% COGS)${saveNote}`;

      svg += `<g class="cursor-pointer" ${tipAttrs(r.title, tipSub)}>
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="4" fill="${r.bg}" />`;
      if (rw > 62 && rh > 34) {
        svg += `<text x="${rx + 8}" y="${ry + 17}" font-size="11" font-weight="600" fill="${r.fg}">${r.short || r.code}</text>
                <text x="${rx + 8}" y="${ry + 32}" font-size="10.5" fill="${r.fg}" opacity="0.88">${fmtK(
          r.valBox * mult
        )} · ${share.toFixed(1)}%</text>`;
      } else if (rw > 42 && rh > 18) {
        svg += `<text x="${rx + 6}" y="${ry + 14}" font-size="9.5" font-weight="500" fill="${r.fg}">${r.code} (${share.toFixed(0)}%)</text>`;
      }
      svg += `</g>`;
    });
    svg += `</svg>`;
    wrap.innerHTML = svg;
  }

  const scaleWrap = document.getElementById('cogs-scale-chart-wrap');
  if (scaleWrap) {
    const scaleItems = [
      { name: 'A6. Jersey Relic', b1: 114607 * mult, b3: 38636 * mult, save: '−66,3%' },
      { name: 'A1. R&D Sample', b1: 57303 * mult, b3: 19318 * mult, save: '−66,3%' },
      { name: 'A8. Màng nhôm', b1: 57303 * mult, b3: 28977 * mult, save: '−49,4%' },
    ];
    const maxS = 114607 * mult;
    let sSvg = `<svg viewBox="0 0 380 88" class="w-full h-auto svg-chart">`;
    scaleItems.forEach((si, idx) => {
      const y = 4 + idx * 28;
      const w1 = Math.max(4, (si.b1 / maxS) * 145);
      const w3 = Math.max(4, (si.b3 / maxS) * 145);
      sSvg += `<text x="0" y="${y + 11}" font-size="11" fill="#334155">${si.name}</text>
        <rect x="112" y="${y + 2}" width="${w1}" height="5.5" rx="2" fill="rgba(15,23,42,0.25)" />
        <rect x="112" y="${y + 10}" width="${w3}" height="5.5" rx="2" fill="#047857" />
        <text x="${112 + w1 + 6}" y="${y + 13}" font-size="10.5" font-weight="500" fill="#047857">${fmtK(si.b1)} → ${fmtK(
        si.b3
      )} (${si.save})</text>`;
    });
    sSvg += `</svg>`;
    scaleWrap.innerHTML = sSvg;
  }

  const breakdownList = document.getElementById('cogs-breakdown-list');
  if (breakdownList) {
    breakdownList.innerHTML = cogsItems
      .map((item) => {
        const val = item.valBox * mult;
        const share = (item.valBox / totalBox) * 100;
        return `<div class="p-1 rounded-[5px] hover:bg-[var(--color-soft)] space-y-0.5">
          <div class="flex justify-between text-[11.5px] gap-2"><span class="truncate text-[var(--color-ink-2)]">${escHtml(
            item.title
          )}</span><span class="font-mono-num shrink-0 font-medium">${fmtVND(val)}đ (${share.toFixed(1)}%)</span></div>
          <div class="h-1 w-full rounded bg-[var(--color-line)] overflow-hidden"><div class="h-full bg-[#0f172a]/65" style="width:${share.toFixed(
            1
          )}%"></div></div>
        </div>`;
      })
      .join('');
  }
}

export function renderTable22Lines() {
  const input = document.getElementById('search-22-lines') as HTMLInputElement | null;
  const tbody = document.getElementById('table-22-lines-body');
  if (!tbody) return;

  const q = (input?.value || '').toLowerCase().trim();
  const list = UNIT_ECON_LINES.filter((r) => !q || r.title.toLowerCase().includes(q));
  tbody.innerHTML = list
    .map((row) => {
      let trClass = '';
      let titleClass = 'text-[var(--color-ink-2)]';
      if (row.type === 'highlight') {
        trClass = 'row-highlight';
        titleClass = 'font-medium text-[var(--color-ink)]';
      } else if (row.type === 'profit') {
        trClass = 'row-profit';
        titleClass = 'font-medium text-[var(--color-money)]';
      } else if (row.type === 'major' || row.type === 'group') {
        titleClass = 'font-medium text-[var(--color-ink)]';
        trClass = 'bg-[var(--color-soft)]/45';
      } else if (row.type === 'cogs' || row.type === 'sub') {
        titleClass = 'pl-4 text-[var(--color-muted)]';
      }

      const w = Math.min(100, (Math.abs(row.pct) / 131.58) * 100);
      const barCol =
        row.pct < 0 ? 'bg-[#1d4ed8]/65' : row.type === 'profit' ? 'bg-[var(--color-money)]' : 'bg-[var(--color-ink)]/70';

      return `<tr class="${trClass}">
        <td class="${titleClass}">${escHtml(row.title)}</td>
        <td class="text-right font-mono-num">${fmtVND(row.b1Box)}</td>
        <td class="text-right font-mono-num font-medium text-[var(--color-ink)]">${fmtVND(row.b3Box)}</td>
        <td class="text-right font-mono-num">${fmtVND(row.b3Pack)}</td>
        <td class="text-right font-mono-num">${fmtVND(row.b3Card)}</td>
        <td class="text-right font-mono-num">${fmtVND(row.b3Total)}</td>
        <td class="text-right font-mono-num">
          <div class="flex items-center justify-end gap-2">
            <div class="w-16 h-1.5 rounded bg-[var(--color-line)] overflow-hidden"><div class="h-full ${barCol}" style="width:${w.toFixed(
        0
      )}%"></div></div>
            <span class="w-14 text-right">${row.pct > 0 ? '' : '−'}${Math.abs(row.pct).toFixed(1)}%</span>
          </div>
        </td>
      </tr>`;
    })
    .join('');
}

export function renderTornadoChart() {
  const wrap = document.getElementById('tornado-chart-wrap');
  if (!wrap) return;

  const base = 495317600;
  const calcFX = (srpPre: number, ck: number, roy: number, dp: number, sell: number) => {
    const deduct = 0.55 * (ck / 100) + 0.06 + 0.015;
    const net = srpPre * (1 - deduct) * ((1320 * sell) / 100);
    const surp = net - 915749000 - net * (roy / 100) - net * (dp / 100);
    return surp > 0 ? surp * 0.8 : surp;
  };

  const drivers = [
    { name: 'Sell-through (75% vs 100%)', low: calcFX(1800000, 30, 10, 5, 75) - base, high: 0, lowLbl: '75% SL', highLbl: '100% SL' },
    { name: 'Giá bán lẻ SRP (±20%)', low: calcFX(1440000, 30, 10, 5, 100) - base, high: calcFX(2160000, 30, 10, 5, 100) - base, lowLbl: '1.584k', highLbl: '2.376k' },
    { name: 'Chiết khấu sỉ (34% vs 26%)', low: calcFX(1800000, 34, 10, 5, 100) - base, high: calcFX(1800000, 26, 10, 5, 100) - base, lowLbl: 'CK 34%', highLbl: 'CK 26%' },
    { name: 'Quỹ Dự phòng (8% vs 3%)', low: calcFX(1800000, 30, 10, 8, 100) - base, high: calcFX(1800000, 30, 10, 3, 100) - base, lowLbl: 'DP 8%', highLbl: 'DP 3%' },
    { name: 'Royalty GAM (12% vs 8%)', low: calcFX(1800000, 30, 12, 5, 100) - base, high: calcFX(1800000, 30, 8, 5, 100) - base, lowLbl: 'Roy 12%', highLbl: 'Roy 8%' },
  ];

  const W = 540;
  const H = 225;
  const padL = 175;
  const padR = 24;
  const padT = 20;
  const rowH = 38;
  const plotW = W - padL - padR;
  const maxAbs = 355e6;
  const zeroX = padL + plotW * 0.58;
  const sx = (delta: number) => zeroX + (delta / maxAbs) * (plotW * 0.42);

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto svg-chart" role="img" aria-label="Biểu đồ Tornado độ nhạy lợi nhuận">`;
  svg += `<line x1="${zeroX}" y1="${padT - 6}" x2="${zeroX}" y2="${padT + drivers.length * rowH - 6}" stroke="#0f172a" stroke-width="1.2" />`;
  svg += `<text x="${zeroX}" y="12" text-anchor="middle" font-size="10.5" font-weight="600" fill="#0f172a">Mốc S3: 495,3 tr (0)</text>`;

  drivers.forEach((d, idx) => {
    const y = padT + idx * rowH + 6;
    const xLow = sx(d.low);
    const wLow = Math.max(0, zeroX - xLow);
    const xHigh = sx(d.high);
    const wHigh = Math.max(0, xHigh - zeroX);
    const tipSub = `${d.lowLbl}: ${fmtTr(d.low, 1)} · ${d.highLbl}: +${fmtTr(d.high, 1)} quanh mốc S3`;

    svg += `<g class="cursor-pointer" ${tipAttrs(d.name, tipSub)}>
      <text x="${padL - 10}" y="${y + 14}" text-anchor="end" font-size="11.5" fill="#334155">${d.name}</text>
      ${
        wLow > 1
          ? `<rect x="${xLow}" y="${y + 2}" width="${wLow}" height="18" rx="3" fill="#be123c" opacity="0.82" />
             <text x="${xLow - 5}" y="${y + 15}" text-anchor="end" font-size="10" font-weight="500" fill="#be123c">${fmtTr(d.low, 1)}</text>`
          : ''
      }
      ${
        wHigh > 1
          ? `<rect x="${zeroX}" y="${y + 2}" width="${wHigh}" height="18" rx="3" fill="#047857" opacity="0.85" />
             <text x="${xHigh + 5}" y="${y + 15}" text-anchor="start" font-size="10" font-weight="500" fill="#047857">+${fmtTr(d.high, 1)}</text>`
          : ''
      }
    </g>`;
  });
  svg += `</svg>`;
  wrap.innerHTML = svg;
}

export function renderSensitivityHeatmap(
  activeSrpPre: number,
  ck: number,
  roy: number,
  dp: number,
  activeSell: number,
  blendedDeductPct: number
) {
  const wrap = document.getElementById('sensitivity-heatmap-wrap');
  const subtitle = document.getElementById('heatmap-subtitle');
  if (!wrap) return;
  if (subtitle) {
    subtitle.textContent = `Theo CK Sỉ ${ck}% · Royalty ${roy}% · Dự phòng ${dp}% · Click ô để nạp thông số`;
  }

  const srpRows = [
    { label: '1.584k (−20% · S1)', vat: 1584000, pre: 1440000 },
    { label: '1.782k (−10% · S2)', vat: 1782000, pre: 1620000 },
    { label: '1.980k (Chuẩn · S3)', vat: 1980000, pre: 1800000 },
    { label: '2.079k (+5% · S4)', vat: 2079000, pre: 1890000 },
    { label: '2.376k (+20% · S5)', vat: 2376000, pre: 2160000 },
  ];
  const sellCols = [60, 70, 75, 80, 90, 100];

  let html = `<table class="w-full text-[11.5px] border-separate border-spacing-1"><thead><tr><th class="text-left font-medium text-[var(--color-muted)] px-1.5 py-1">SRP \\ Sell</th>`;
  sellCols.forEach((s) => {
    html += `<th class="text-center font-medium text-[var(--color-ink-2)] px-1.5 py-1 font-mono-num">${s}%</th>`;
  });
  html += `</tr></thead><tbody>`;

  srpRows.forEach((r) => {
    html += `<tr><td class="font-medium text-[var(--color-ink)] px-1.5 py-1 whitespace-nowrap">${r.label}</td>`;
    sellCols.forEach((s) => {
      const boxes = Math.round(1320 * (s / 100));
      const netRev = r.pre * (1 - blendedDeductPct) * boxes;
      const surplus = netRev - 915749000 - netRev * (roy / 100) - netRev * (dp / 100);
      const fxSafe = surplus > 0 ? surplus * 0.8 : surplus;
      const m = fxSafe / 1e6;

      let bg = 'bg-[#047857]/10 text-[#047857]';
      if (fxSafe < 0) bg = 'bg-[#be123c]/12 text-[#be123c] font-medium';
      else if (m < 200) bg = 'bg-[#b45309]/12 text-[#92400e]';
      else if (m < 450) bg = 'bg-[#047857]/10 text-[#047857]';
      else if (m < 650) bg = 'bg-[#047857]/20 text-[#065f46] font-medium';
      else bg = 'bg-[#047857]/32 text-[#064e3b] font-semibold';

      const isCurrent = r.pre === activeSrpPre && s === activeSell;
      const ring = isCurrent
        ? 'ring-2 ring-inset ring-[var(--color-ink)]'
        : r.pre === 1800000 && s === 100
          ? 'ring-1 ring-inset ring-[var(--color-accent)]'
          : '';
      const tipSub = `SRP ${fmtVND(r.vat)}đ · Bán ${s}% (${boxes} Box)<br/>Lãi/Lỗ ròng FX: ${fmtVND(fxSafe)}đ (ROI ${(
        (fxSafe / 500e6) *
        100
      ).toFixed(0)}%)`;

      html += `<td data-action="apply-heatmap" data-srp="${r.pre}" data-sell="${s}" ${tipAttrs(
        'Độ nhạy 2D',
        tipSub
      )} class="heatmap-cell rounded-[5px] px-1.5 py-2 text-center font-mono-num ${bg} ${ring}">${
        fxSafe < 0 ? '▼ ' : ''
      }${m.toFixed(0)}tr</td>`;
    });
    html += `</tr>`;
  });

  wrap.innerHTML = html + `</tbody></table>`;
}

export function renderScenarioTable(activeCode: ScenarioCode | null) {
  const tbody = document.getElementById('table-scenarios-body');
  if (!tbody) return;

  const maxFx = 762227936;
  tbody.innerHTML = SCENARIO_ORDER.map((k) => {
    const sc = SCENARIOS[k];
    const w = Math.max(4, (sc.fxSafe / maxFx) * 100);
    return `<tr class="${k === activeCode ? 'row-highlight cursor-pointer' : 'cursor-pointer'}" data-action="select-scenario" data-scenario="${k}">
      <td class="font-medium text-[var(--color-ink)]">${escHtml(sc.name)}</td>
      <td class="text-right font-mono-num">${fmtVND(sc.srpVat)} <span class="text-[11px] text-[var(--color-muted)]">(${fmtVND(
      sc.srpPre
    )})</span></td>
      <td class="text-center font-mono-num">${sc.ck}%/${sc.roy}%/${sc.dp}%</td>
      <td class="text-right font-mono-num">${sc.sell}% (${fmtVND(sc.boxes)}b)</td>
      <td class="text-right font-mono-num">${fmtVND(sc.netRev)}</td>
      <td class="text-right font-mono-num">${sc.gpPct.toFixed(1)}%</td>
      <td class="text-right font-mono-num">${fmtVND(sc.dpTotal)}</td>
      <td class="text-right font-mono-num">${fmtVND(sc.gamTotal)}</td>
      <td class="text-right font-mono-num font-medium text-[var(--color-money)]">
        <div class="flex items-center justify-end gap-2"><div class="w-14 h-1.5 rounded bg-[var(--color-line)] overflow-hidden"><div class="h-full bg-[var(--color-money)]" style="width:${w.toFixed(
      0
    )}%"></div></div><span>${fmtVND(sc.fxSafe)}</span></div>
      </td>
      <td class="text-right font-mono-num font-medium">${sc.netPct.toFixed(1)}% / +${sc.roi.toFixed(1)}%</td>
    </tr>`;
  }).join('');
}
