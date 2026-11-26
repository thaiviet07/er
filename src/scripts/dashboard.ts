import { SCENARIOS, UNIT_ECON_LINES, type ScenarioCode, type SegmentId } from '../data/economics';
import { PRESENTATION_SLIDES } from '../data/slides';
import {
  BATCH_CONSTANTS,
  computeScenarioTotals,
  computeSimParams,
  type BatchMode,
  type ChannelId,
  type SimParams,
  type UnitView,
} from './calculations';
import {
  renderBenchmarkChart,
  renderCOGSTreemapAndScale,
  renderCVPChart,
  renderChannelStackedChart,
  renderChannelVisuals,
  renderScatterPlot,
  renderScenarioChart,
  renderScenarioTable,
  renderSegmentWhiskers,
  renderSensitivityHeatmap,
  renderSkuLadderSVG,
  renderTable16SKUs,
  renderTable22Lines,
  renderTable32,
  renderTornadoChart,
  renderWaterfallSVG,
  type BenchmarkMetric,
  type ScatterZoom,
  type Sort16Key,
} from './charts';
import { fmtTr, fmtVND } from './format';

type PageId = 'page-exec' | 'page-benchmark' | 'page-pricing' | 'page-unitecon' | 'page-whatif' | 'page-slides' | 'page-all';
type SlideViewMode = 'deck' | 'scroll';

interface DashboardState {
  activePage: PageId;
  batchMode: BatchMode;
  unitView: UnitView;
  bmSegmentFilter: 'all' | SegmentId;
  bmMetric: BenchmarkMetric;
  scatterZoom: ScatterZoom;
  activeScenarioCode: ScenarioCode | null;
  selectedChannelFilter: ChannelId | null;
  sort16Key: Sort16Key;
  sort16Asc: boolean;
  rightDrawerOpen: boolean;
  activeSlideIdx: number;
  slideViewMode: SlideViewMode;
  slidePresentOpen: boolean;
}

const state: DashboardState = {
  activePage: 'page-exec',
  batchMode: '3batch',
  unitView: 'box',
  bmSegmentFilter: 'all',
  bmMetric: 'card',
  scatterZoom: 'target',
  activeScenarioCode: 'S3',
  selectedChannelFilter: null,
  sort16Key: null,
  sort16Asc: true,
  rightDrawerOpen: typeof window !== 'undefined' ? window.innerWidth >= 1280 : true,
  activeSlideIdx: 0,
  slideViewMode: 'deck',
  slidePresentOpen: false,
};

function getEl<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function getInputNum(id: string, fallback: number): number {
  const el = getEl<HTMLInputElement>(id);
  return el ? parseInt(el.value, 10) : fallback;
}

function readSimParams(): SimParams {
  return computeSimParams({
    srpPre: getInputNum('sim-srp', 1800000),
    ck: getInputNum('sim-ck', 30),
    roy: getInputNum('sim-roy', 10),
    dp: getInputNum('sim-dp', 5),
    sell: getInputNum('sim-sell', 100),
    c1: getInputNum('slider-ch1', 55),
    c2: getInputNum('slider-ch2', 30),
  });
}

// Tooltip helpers
const tipEl = getEl('global-tooltip');

function showTip(e: MouseEvent, title: string, sub: string) {
  if (!tipEl) return;
  tipEl.innerHTML = `<div class="font-medium text-white mb-0.5">${title}</div><div class="text-[#a1a1aa] text-[11px]">${sub}</div>`;
  tipEl.style.opacity = '1';
  moveTip(e);
}

function moveTip(e: MouseEvent) {
  if (!tipEl) return;
  tipEl.style.left = Math.min(window.innerWidth - 320, e.clientX + 12) + 'px';
  tipEl.style.top = Math.max(12, e.clientY - 58) + 'px';
}

function hideTip() {
  if (!tipEl) return;
  tipEl.style.opacity = '0';
}

// Page & Drawer controls
function switchPage(pageId: PageId) {
  state.activePage = pageId;
  const pages: PageId[] = ['page-exec', 'page-benchmark', 'page-pricing', 'page-unitecon', 'page-whatif', 'page-slides'];
  pages.forEach((id) => {
    const el = getEl(id);
    if (!el) return;
    el.classList.toggle('hidden-page', pageId !== 'page-all' && pageId !== id);
  });

  document.querySelectorAll('#left-page-nav .pbi-nav-item, #bottom-sheet-tabs .pbi-sheet-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });

  const canvas = getEl('pbi-canvas');
  if (canvas) canvas.scrollTop = 0;
}

// Slide deck controls
function syncSlidesUI() {
  const total = PRESENTATION_SLIDES.length;
  const idx = Math.max(0, Math.min(total - 1, state.activeSlideIdx));
  state.activeSlideIdx = idx;
  const activeSlide = PRESENTATION_SLIDES[idx];

  document.querySelectorAll<HTMLElement>('[data-slide-slot]').forEach((slot) => {
    const sIdx = Number(slot.getAttribute('data-slide-slot'));
    const shouldHide = state.slideViewMode === 'deck' && sIdx !== idx;
    slot.classList.toggle('hidden', shouldHide);
  });

  document.querySelectorAll<HTMLElement>('#slide-nav-pills [data-slide-index]').forEach((pill) => {
    const pIdx = Number(pill.getAttribute('data-slide-index'));
    const isActive = pIdx === idx;
    pill.className = isActive
      ? 'h-8 px-2.5 rounded-[6px] text-[12px] font-medium inline-flex items-center gap-1.5 shrink-0 transition-colors border cursor-pointer bg-[var(--color-accent-bg)] text-[var(--color-ink)] border-[var(--color-accent-ring)]'
      : 'h-8 px-2.5 rounded-[6px] text-[12px] font-medium inline-flex items-center gap-1.5 shrink-0 transition-colors border cursor-pointer bg-transparent text-[var(--color-ink-2)] border-transparent hover:bg-[var(--color-soft)]';
  });

  document.querySelectorAll<HTMLElement>('#slide-view-switch .seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === state.slideViewMode);
  });

  const counterText = `${activeSlide.num} / ${String(total).padStart(2, '0')}`;
  const badge = getEl('slide-counter-badge');
  if (badge) badge.textContent = counterText;

  const prevBtn = getEl<HTMLButtonElement>('slide-prev-btn');
  const nextBtn = getEl<HTMLButtonElement>('slide-next-btn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === total - 1;

  if (state.slidePresentOpen) {
    renderPresentStage();
  }
}

function setSlideIndex(idx: number) {
  const total = PRESENTATION_SLIDES.length;
  state.activeSlideIdx = Math.max(0, Math.min(total - 1, idx));
  syncSlidesUI();
  if (state.slideViewMode === 'scroll' && !state.slidePresentOpen) {
    const slot = document.querySelector<HTMLElement>(`[data-slide-slot="${state.activeSlideIdx}"]`);
    slot?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setSlideViewMode(view: SlideViewMode) {
  state.slideViewMode = view;
  syncSlidesUI();
}

function renderPresentStage() {
  const stage = getEl('slide-present-stage');
  const titleEl = getEl('slide-present-title');
  const counterEl = getEl('slide-present-counter');
  const total = PRESENTATION_SLIDES.length;
  const slide = PRESENTATION_SLIDES[state.activeSlideIdx];
  const srcSlot = document.querySelector<HTMLElement>(`[data-slide-slot="${state.activeSlideIdx}"] .slide-frame`);
  if (!stage || !srcSlot || !slide) return;

  const clone = srcSlot.cloneNode(true) as HTMLElement;
  clone.classList.add('w-full');
  stage.innerHTML = '';
  stage.appendChild(clone);

  if (titleEl) titleEl.textContent = `${slide.num}. ${slide.shortTitle}`;
  if (counterEl) counterEl.textContent = `${slide.num} / ${String(total).padStart(2, '0')}`;
}

function openSlidePresentModal() {
  const modal = getEl('slide-present-modal');
  if (!modal) return;
  state.slidePresentOpen = true;
  renderPresentStage();
  modal.classList.remove('hidden');
}

function closeSlidePresentModal() {
  const modal = getEl('slide-present-modal');
  const stage = getEl('slide-present-stage');
  state.slidePresentOpen = false;
  if (modal) modal.classList.add('hidden');
  if (stage) stage.innerHTML = '';
}

function syncDrawerVisibility() {
  const drawer = getEl('right-whatif-drawer');
  const backdrop = getEl('drawer-backdrop');
  if (!drawer) return;

  if (state.rightDrawerOpen) {
    drawer.classList.remove('hidden', 'xl:hidden');
    drawer.classList.add('flex');
    if (backdrop) backdrop.classList.toggle('hidden', window.innerWidth >= 1280);
  } else {
    drawer.classList.add('hidden');
    drawer.classList.remove('flex', 'xl:flex');
    if (backdrop) backdrop.classList.add('hidden');
  }
}

function toggleRightDrawer(force?: boolean) {
  state.rightDrawerOpen = typeof force === 'boolean' ? force : !state.rightDrawerOpen;
  syncDrawerVisibility();
}

function openFocusMode(elementId: string, title: string) {
  const src = getEl(elementId);
  const modal = getEl('focus-modal');
  const modalTitle = getEl('focus-modal-title');
  const modalBody = getEl('focus-modal-body');
  if (!src || !modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = title;
  const clone = src.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((node) => {
    node.setAttribute('data-cloned-id', node.id);
    node.removeAttribute('id');
  });
  modalBody.innerHTML = '';
  modalBody.appendChild(clone);
  modal.classList.remove('hidden');
}

function closeFocusMode() {
  const modal = getEl('focus-modal');
  const modalBody = getEl('focus-modal-body');
  if (modal) modal.classList.add('hidden');
  if (modalBody) modalBody.innerHTML = '';
}

function updateStatusBadges(p: SimParams) {
  const chNames: Record<ChannelId, string> = {
    1: 'Kênh: Đại lý TCG',
    2: 'Kênh: GAM Store',
    3: 'Kênh: D2C',
  };
  const chTag = state.selectedChannelFilter ? ` · ${chNames[state.selectedChannelFilter]}` : ` · ${p.c1}/${p.c2}/${p.c3}`;
  const scenTag = p.matched ? p.matched : 'Tùy chỉnh';

  const badge = getEl('active-filter-badge');
  if (badge) badge.textContent = `${scenTag}${chTag}`;

  const unitLbl =
    state.unitView === 'box'
      ? '1 Box (80 thẻ)'
      : state.unitView === 'pack'
        ? '1 Pack (8 thẻ)'
        : state.unitView === 'card'
          ? '1 Thẻ'
          : state.batchMode === 'batch1'
            ? '445 Box'
            : '1.320 Box';

  const statusText = getEl('bottom-status-text');
  if (statusText) {
    statusText.textContent = `${scenTag} · ${state.batchMode === 'batch1' ? 'Đợt 1 (445 Box)' : '3 Đợt (1.320 Box)'} · Đơn vị: ${unitLbl}`;
  }
}

function updateAllVisuals(p?: SimParams) {
  const sim = p || readSimParams();
  const isB1 = state.batchMode === 'batch1';
  const cfg = BATCH_CONSTANTS[state.batchMode];
  const totalProdBoxes = cfg.totalProdBoxes;
  const soldBoxes = isB1 ? sim.boxes1 : sim.boxes3;

  const cogsPerSoldBox = soldBoxes > 0 ? cfg.fixedCogsTotal / soldBoxes : 0;
  const mktPerSoldBox = soldBoxes > 0 ? cfg.fixedMktTotal / soldBoxes : 0;

  const u = state.unitView;
  const mult = u === 'box' ? 1 : u === 'pack' ? 0.1 : u === 'card' ? 0.0125 : soldBoxes;
  const unitSuffix =
    u === 'box' ? '1 Hobby Box (80 thẻ)' : u === 'pack' ? '1 Pack (8 thẻ)' : u === 'card' ? '1 Thẻ' : `Tổng ${fmtVND(soldBoxes)} Box`;

  const srpVat = sim.srpVat * mult;
  const srpPre = sim.srpPre * mult;
  const netRev = sim.netPerBox * mult;
  const cogsVal = cogsPerSoldBox * mult;
  const gpVal = (sim.netPerBox - cogsPerSoldBox) * mult;
  const royVal = sim.netPerBox * (sim.roy / 100) * mult;
  const dpVal = sim.netPerBox * (sim.dp / 100) * mult;
  const mktVal = mktPerSoldBox * mult;
  const surplusVal = gpVal - mktVal - royVal - dpVal;
  const gamT2Val = surplusVal > 0 ? surplusVal * 0.2 : 0;
  const fxSafeVal = surplusVal - gamT2Val;

  const totalNetRev = sim.netPerBox * soldBoxes;
  const totalSurplus = totalNetRev - cfg.committedFixed - totalNetRev * (sim.roy / 100) - totalNetRev * (sim.dp / 100);
  const totalFxSafe = totalSurplus > 0 ? totalSurplus * 0.8 : totalSurplus;
  const totalFxMax = totalFxSafe + totalNetRev * (sim.dp / 100) * 0.8;
  const totalGP = totalNetRev - cfg.fixedCogsTotal;
  const gpPct = totalNetRev > 0 ? (totalGP / totalNetRev) * 100 : 0;
  const netPct = totalNetRev > 0 ? (totalFxSafe / totalNetRev) * 100 : 0;

  const unitContrib = sim.netPerBox * (1 - (sim.roy + sim.dp) / 100);
  const beBoxes = unitContrib > 0 ? cfg.committedFixed / unitContrib : 0;
  const bePct = (beBoxes / totalProdBoxes) * 100;

  const setTxt = (id: string, txt: string) => {
    const el = getEl(id);
    if (el) el.textContent = txt;
  };

  setTxt('kpi-badge-scen', sim.matched || 'Custom');
  setTxt('kpi-srp-vat', u === 'total' ? fmtTr(srpVat) : fmtVND(srpVat));
  setTxt('kpi-srp-sub', `${u === 'total' ? fmtTr(srpPre) : fmtVND(srpPre) + 'đ'} trước VAT · ${fmtVND(sim.srpVat / 80)}đ/thẻ`);

  setTxt('kpi-net-srp-pct', `${(100 - sim.blendedDeductPct * 100).toFixed(1)}% SRP`);
  setTxt('kpi-net-rev', u === 'total' ? fmtTr(netRev) : fmtVND(netRev));
  setTxt('kpi-net-rev-sub', `Tổng ${isB1 ? 'Đ1' : '3Đ'}: ${fmtTr(totalNetRev)} (${fmtVND(soldBoxes)}b)`);

  setTxt('kpi-cogs', u === 'total' ? fmtTr(cogsVal) : fmtVND(cogsVal));
  setTxt('kpi-cogs-pct', `${totalNetRev > 0 ? ((cfg.fixedCogsTotal / totalNetRev) * 100).toFixed(1) : 0}% Net`);
  setTxt('kpi-cogs-sub', isB1 ? 'Chi phí gộp Đợt 1 độc lập' : '▼ 17,5% vs Đợt 1 (794,7k)');

  setTxt('kpi-gp', u === 'total' ? fmtTr(gpVal) : fmtVND(gpVal));
  setTxt('kpi-gp-pct', `${gpPct.toFixed(1)}%`);
  setTxt('kpi-gp-sub', `Tổng ${isB1 ? 'Đ1' : '3Đ'}: ${fmtTr(totalGP)}`);

  const kpiNetProfit = getEl('kpi-net-profit');
  if (kpiNetProfit) {
    kpiNetProfit.textContent = u === 'total' ? fmtTr(fxSafeVal) : fmtVND(fxSafeVal);
    kpiNetProfit.className = `text-[24px] font-medium font-mono-num tracking-[-0.02em] mt-1.5 ${
      totalFxSafe < 0 ? 'text-[var(--color-down)]' : 'text-[var(--color-money)]'
    }`;
  }
  setTxt('kpi-net-pct', `${netPct.toFixed(1)}%`);
  setTxt('kpi-net-profit-sub', `Tổng ${isB1 ? 'Đ1' : '3Đ'}: ${fmtTr(totalFxSafe)} (Max ${fmtTr(totalFxMax)})`);

  setTxt('kpi-be-pct', `${bePct.toFixed(1)}%`);
  setTxt('kpi-be-boxes', `${beBoxes.toFixed(1).replace('.', ',')} Box`);
  setTxt('kpi-be-sub', `Trên ${fmtVND(totalProdBoxes)} Box (${isB1 ? 'Đợt 1' : 'Đ1: 329,9b'})`);

  setTxt('ue-active-unit-badge', `${unitSuffix} · ${isB1 ? 'Đợt 1 (445 Box)' : 'Bình quân 3 Đợt (1.320 Box)'}`);
  setTxt('exec-ch-net', `${fmtVND(sim.netPerBox)}đ/Box`);
  setTxt('exec-ch-profit', `Lãi FX: ${fmtTr(totalFxSafe)}`);

  renderWaterfallSVG(sim, isB1, u, srpPre, netRev, cogsVal, gpVal, mktVal, royVal, dpVal, surplusVal, gamT2Val, fxSafeVal);
  renderChannelVisuals(sim, state.batchMode, state.selectedChannelFilter);
  renderCOGSTreemapAndScale(state.batchMode, state.unitView);
  renderCVPChart(sim, state.batchMode, { show: showTip, hide: hideTip });
  updateStatusBadges(sim);
}

function runCustomSim(presetCode?: ScenarioCode) {
  const p = readSimParams();
  const res = computeScenarioTotals(p, presetCode);
  const matched = res.matched;
  state.activeScenarioCode = matched;

  ['ribbon-scenario-select', 'mobile-scenario-select'].forEach((selId) => {
    const sel = getEl<HTMLSelectElement>(selId);
    if (sel) sel.value = matched || 'Custom';
  });

  Object.keys(SCENARIOS).forEach((k) => {
    const card = getEl(`sc-card-${k}`);
    if (!card) return;
    card.className =
      k === matched
        ? 'pbi-card p-3 text-left ring-1 ring-inset ring-[var(--color-accent-ring)] bg-[var(--color-accent-bg)]'
        : 'pbi-card p-3 text-left hover:bg-[var(--color-soft)]';
  });

  const setTxt = (id: string, txt: string) => {
    const el = getEl(id);
    if (el) el.textContent = txt;
  };

  setTxt('sim-lbl-srp', `${fmtVND(p.srpVat)}đ (${fmtVND(p.srpPre)}đ)`);
  setTxt('sim-lbl-ck', `${p.ck},0%`);
  setTxt('sim-lbl-roy', `${p.roy},0%`);
  setTxt('sim-lbl-dp', `${p.dp},0%`);
  setTxt('sim-lbl-sell', `${p.sell}% (${fmtVND(p.boxes3)} Box)`);
  setTxt('sim-mode-label', matched ? `Đang khớp: ${SCENARIOS[matched].name}` : 'Đang chạy: ★ Tùy chỉnh (What-If)');

  setTxt('sim-out-netrev', fmtVND(res.netRev) + 'đ');
  setTxt('sim-out-gam', fmtVND(res.gamTotal) + 'đ');
  const fxOut = getEl('sim-out-fxprofit');
  if (fxOut) {
    fxOut.textContent = fmtVND(res.fxSafe) + 'đ';
    fxOut.className = `text-[17px] font-medium font-mono-num ${
      res.fxSafe < 0 ? 'text-[var(--color-down)]' : 'text-[var(--color-money)]'
    }`;
  }
  setTxt('sim-out-fxmax', fmtTr(res.fxMax));
  setTxt('sim-out-roi', `${res.netPct.toFixed(1)}% / ${res.roi >= 0 ? '+' : ''}${res.roi.toFixed(1)}%`);
  setTxt('sim-out-b1', `${res.b1Safe >= 0 ? '+' : ''}${fmtTr(res.b1Safe)}`);

  renderScenarioChart(matched, {
    code: 'Custom',
    short: 'Tùy chỉnh',
    name: 'Kịch bản Tùy chỉnh (Live)',
    fxSafe: res.fxSafe,
    fxMax: res.fxMax,
    gamTotal: res.gamTotal,
    b1Safe: res.b1Safe,
    netPct: res.netPct,
    roi: res.roi,
  });
  renderTornadoChart();
  renderSensitivityHeatmap(p.srpPre, p.ck, p.roy, p.dp, p.sell, p.blendedDeductPct);
  renderScenarioTable(matched);
  updateAllVisuals(p);
}

function selectScenario(code: ScenarioCode) {
  const sc = SCENARIOS[code];
  if (!sc) return;
  const setVal = (id: string, val: number | string) => {
    const el = getEl<HTMLInputElement | HTMLSelectElement>(id);
    if (el) el.value = String(val);
  };
  setVal('sim-srp', sc.srpPre);
  setVal('sim-ck', sc.ck);
  setVal('sim-roy', sc.roy);
  setVal('sim-dp', sc.dp);
  setVal('sim-sell', sc.sell);
  setVal('ribbon-scenario-select', code);
  setVal('mobile-scenario-select', code);
  runCustomSim(code);
}

function updateChannelMix(changedIdx: 1 | 2) {
  const s1 = getEl<HTMLInputElement>('slider-ch1');
  const s2 = getEl<HTMLInputElement>('slider-ch2');
  if (!s1 || !s2) return;

  let c1 = parseInt(s1.value, 10);
  let c2 = parseInt(s2.value, 10);
  if (c1 + c2 > 95) {
    if (changedIdx === 1) {
      c2 = 95 - c1;
      s2.value = String(c2);
    } else {
      c1 = 95 - c2;
      s1.value = String(c1);
    }
  }
  const c3 = 100 - c1 - c2;

  const v1 = getEl('val-ch1');
  const v2 = getEl('val-ch2');
  const v3 = getEl('val-ch3');
  if (v1) v1.textContent = `${c1}%`;
  if (v2) v2.textContent = `${c2}%`;
  if (v3) v3.textContent = `${c3}%`;

  runCustomSim();
}

function setBatchMode(mode: BatchMode) {
  state.batchMode = mode;
  document.querySelectorAll('[data-action="set-batch"]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-batch') === mode);
  });
  updateAllVisuals();
}

function setUnitView(unit: UnitView) {
  state.unitView = unit;
  document.querySelectorAll('[data-action="set-unit"]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-unit') === unit);
  });
  updateAllVisuals();
}

function filterBenchmark(seg: 'all' | SegmentId) {
  state.bmSegmentFilter = seg;
  document.querySelectorAll('#bm-seg-filter .seg-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-seg') === seg);
  });
  renderBenchmarkChart(state.bmSegmentFilter, state.bmMetric);
}

function setBenchmarkMetric(metric: BenchmarkMetric) {
  state.bmMetric = metric;
  document.querySelectorAll('#bm-metric-switch .seg-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-metric') === metric);
  });
  renderBenchmarkChart(state.bmSegmentFilter, state.bmMetric);
}

function setScatterZoom(mode: ScatterZoom) {
  state.scatterZoom = mode;
  document.querySelectorAll('#scatter-zoom-group .seg-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-zoom') === mode);
  });
  renderScatterPlot(state.scatterZoom);
}

function toggleChannelFilter(chIdx: ChannelId) {
  state.selectedChannelFilter = state.selectedChannelFilter === chIdx ? null : chIdx;
  const p = readSimParams();
  renderChannelVisuals(p, state.batchMode, state.selectedChannelFilter);
  renderChannelStackedChart(state.selectedChannelFilter);
  renderTable32(state.selectedChannelFilter);
  updateStatusBadges(p);
}

function resetAllFilters() {
  state.selectedChannelFilter = null;
  state.sort16Key = null;
  state.sort16Asc = true;

  const s1 = getEl<HTMLInputElement>('slider-ch1');
  const s2 = getEl<HTMLInputElement>('slider-ch2');
  const q16 = getEl<HTMLInputElement>('search-16-skus');
  const q22 = getEl<HTMLInputElement>('search-22-lines');
  if (s1) s1.value = '55';
  if (s2) s2.value = '30';
  if (q16) q16.value = '';
  if (q22) q22.value = '';

  const v1 = getEl('val-ch1');
  const v2 = getEl('val-ch2');
  const v3 = getEl('val-ch3');
  if (v1) v1.textContent = '55%';
  if (v2) v2.textContent = '30%';
  if (v3) v3.textContent = '15%';

  setBatchMode('3batch');
  setUnitView('box');
  filterBenchmark('all');
  setBenchmarkMetric('card');
  setScatterZoom('target');
  renderTable16SKUs(state.sort16Key, state.sort16Asc);
  renderTable22Lines();
  renderChannelStackedChart(null);
  renderTable32(null);
  selectScenario('S3');
}

function exportUnitEconCSV() {
  const headers = [
    'Hạng mục',
    'Đợt 1 (445 Box) / Box',
    'TB 3 Đợt / Box',
    'TB 3 Đợt / Pack',
    'TB 3 Đợt / Thẻ',
    'Tổng 3 Đợt (1.320 Box)',
    'Tỷ trọng / Net Rev (%)',
  ];
  const rows = UNIT_ECON_LINES.map((r) => [
    `"${r.title.replace(/"/g, '""')}"`,
    r.b1Box,
    r.b3Box,
    r.b3Pack,
    r.b3Card,
    r.b3Total,
    r.pct.toFixed(2),
  ]);
  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FramigosX_GAM_Unit_Economics_22_Lines.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function bindEvents() {
  // Click delegation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Close focus modal or presentation modal if clicking backdrop
    if (target.id === 'focus-modal') {
      closeFocusMode();
      return;
    }
    if (target.id === 'slide-present-modal') {
      closeSlidePresentModal();
      return;
    }

    const actionEl = target.closest<HTMLElement>('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    switch (action) {
      case 'switch-page': {
        const page = actionEl.getAttribute('data-page') as PageId | null;
        if (page) switchPage(page);
        break;
      }
      case 'set-batch': {
        const batch = actionEl.getAttribute('data-batch') as BatchMode | null;
        if (batch) setBatchMode(batch);
        break;
      }
      case 'set-unit': {
        const unit = actionEl.getAttribute('data-unit') as UnitView | null;
        if (unit) setUnitView(unit);
        break;
      }
      case 'select-scenario': {
        const sc = actionEl.getAttribute('data-scenario') as ScenarioCode | null;
        if (sc) selectScenario(sc);
        break;
      }
      case 'reset-all':
        resetAllFilters();
        break;
      case 'export-csv':
        exportUnitEconCSV();
        break;
      case 'toggle-drawer':
        toggleRightDrawer();
        break;
      case 'close-drawer':
        toggleRightDrawer(false);
        break;
      case 'open-focus': {
        const elId = actionEl.getAttribute('data-focus-target');
        const title = actionEl.getAttribute('data-focus-title') || '';
        if (elId) openFocusMode(elId, title);
        break;
      }
      case 'close-focus':
        closeFocusMode();
        break;
      case 'toggle-channel': {
        const ch = Number(actionEl.getAttribute('data-channel')) as ChannelId;
        if (ch === 1 || ch === 2 || ch === 3) toggleChannelFilter(ch);
        break;
      }
      case 'filter-bm-seg': {
        const seg = actionEl.getAttribute('data-seg') as 'all' | SegmentId | null;
        if (seg) filterBenchmark(seg);
        break;
      }
      case 'set-bm-metric': {
        const m = actionEl.getAttribute('data-metric') as BenchmarkMetric | null;
        if (m) setBenchmarkMetric(m);
        break;
      }
      case 'set-scatter-zoom': {
        const z = actionEl.getAttribute('data-zoom') as ScatterZoom | null;
        if (z) setScatterZoom(z);
        break;
      }
      case 'sort-table16': {
        const key = actionEl.getAttribute('data-sort-key') as Sort16Key;
        if (key) {
          if (state.sort16Key === key) state.sort16Asc = !state.sort16Asc;
          else {
            state.sort16Key = key;
            state.sort16Asc = false;
          }
          renderTable16SKUs(state.sort16Key, state.sort16Asc);
        }
        break;
      }
      case 'apply-heatmap': {
        const srp = actionEl.getAttribute('data-srp');
        const sell = actionEl.getAttribute('data-sell');
        const srpEl = getEl<HTMLInputElement>('sim-srp');
        const sellEl = getEl<HTMLInputElement>('sim-sell');
        if (srpEl && sellEl && srp && sell) {
          srpEl.value = srp;
          sellEl.value = sell;
          runCustomSim();
        }
        break;
      }
      case 'reset-channel-mix': {
        const s1 = getEl<HTMLInputElement>('slider-ch1');
        const s2 = getEl<HTMLInputElement>('slider-ch2');
        if (s1) s1.value = '55';
        if (s2) s2.value = '30';
        state.selectedChannelFilter = null;
        updateChannelMix(1);
        renderChannelStackedChart(null);
        renderTable32(null);
        break;
      }
      case 'select-slide': {
        const sIdx = Number(actionEl.getAttribute('data-slide-index'));
        if (!Number.isNaN(sIdx)) setSlideIndex(sIdx);
        break;
      }
      case 'prev-slide':
        setSlideIndex(state.activeSlideIdx - 1);
        break;
      case 'next-slide':
        setSlideIndex(state.activeSlideIdx + 1);
        break;
      case 'set-slide-view': {
        const view = actionEl.getAttribute('data-view') as SlideViewMode | null;
        if (view) setSlideViewMode(view);
        break;
      }
      case 'open-slide-present':
        openSlidePresentModal();
        break;
      case 'close-slide-present':
        closeSlidePresentModal();
        break;
    }
  });

  // Input & Select delegation
  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    if (target.id === 'search-16-skus') {
      renderTable16SKUs(state.sort16Key, state.sort16Asc);
    } else if (target.id === 'search-22-lines') {
      renderTable22Lines();
    } else if (target.id === 'slider-ch1') {
      updateChannelMix(1);
    } else if (target.id === 'slider-ch2') {
      updateChannelMix(2);
    } else if (target.matches('[data-sim-input]')) {
      runCustomSim();
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement | null;
    if (!target) return;
    if (target.id === 'ribbon-scenario-select' || target.id === 'mobile-scenario-select') {
      if (target.value !== 'Custom') {
        selectScenario(target.value as ScenarioCode);
      }
    }
  });

  // Tooltip delegation
  let currentTipEl: HTMLElement | null = null;
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement | null;
    const tipHost = target?.closest<HTMLElement>('[data-tip-title]');
    if (tipHost) {
      currentTipEl = tipHost;
      showTip(e, tipHost.getAttribute('data-tip-title') || '', tipHost.getAttribute('data-tip-sub') || '');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (!currentTipEl) return;
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !currentTipEl.contains(related)) {
      currentTipEl = null;
      hideTip();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (tipEl && tipEl.style.opacity === '1') moveTip(e);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFocusMode();
      closeSlidePresentModal();
      if (window.innerWidth < 1280 && state.rightDrawerOpen) {
        toggleRightDrawer(false);
      }
      return;
    }

    const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') return;

    if (state.slidePresentOpen || state.activePage === 'page-slides') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSlideIndex(state.activeSlideIdx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlideIndex(state.activeSlideIdx - 1);
      }
    }
  });

  window.addEventListener('resize', () => {
    const backdrop = getEl('drawer-backdrop');
    if (backdrop) {
      backdrop.classList.toggle('hidden', !state.rightDrawerOpen || window.innerWidth >= 1280);
    }
  });
}

function initDashboard() {
  bindEvents();
  syncDrawerVisibility();
  renderScatterPlot(state.scatterZoom);
  renderSegmentWhiskers();
  renderBenchmarkChart(state.bmSegmentFilter, state.bmMetric);
  renderTable16SKUs(state.sort16Key, state.sort16Asc);
  renderSkuLadderSVG();
  renderChannelStackedChart(state.selectedChannelFilter);
  renderTable32(state.selectedChannelFilter);
  renderTable22Lines();
  syncSlidesUI();
  selectScenario('S3');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
