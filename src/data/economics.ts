export type SegmentId = 'seg1' | 'seg2' | 'seg3' | 'target';

export interface BenchmarkSku {
  id: number;
  seg: SegmentId;
  segLabel: string;
  shortName: string;
  name: string;
  packSpec: string;
  origPrice: string;
  vndBox: number;
  vndPack: number;
  vndCard: number;
  hasAuto: boolean;
  isBox: boolean;
  isBundle?: boolean;
  isTarget?: boolean;
  note: string;
}

export interface SegmentWhisker {
  title: string;
  min: number;
  med: number;
  mean: number;
  max: number;
  scaleMax: number;
  target: number | null;
  highlight: boolean;
}

export interface SkuTierCard {
  badge: string;
  deltaLabel: string;
  deltaTone: 'accent' | 'money';
  title: string;
  spec: string;
  priceVat: string;
  pricePreVat: string;
  pricePerCard: string;
  note: string;
  isAnchor?: boolean;
}

export interface WholesaleTierRow {
  tierName: string;
  moqNote: string;
  weightPct: string;
  discountPct: string;
  wholesalePrice: string;
  dealerProfit: string;
  isSummary?: boolean;
}

export interface ChannelBaseRow {
  id: 1 | 2 | 3 | 0;
  shortName: string;
  name: string;
  tableName: string;
  net: number;
  cogs: number;
  roy: number;
  dp: number;
  gamT2: number;
  fx: number;
  b1Text: string;
  marginText: string;
  isSum?: boolean;
}

export type UnitEconLineType = 'major' | 'sub' | 'highlight' | 'group' | 'cogs' | 'profit';
export type CogsGroup = 'shenzou' | 'pack' | 'logistics';

export interface UnitEconLine {
  code: string;
  short?: string;
  grp?: CogsGroup;
  title: string;
  b1Box: number;
  b3Box: number;
  b3Pack: number;
  b3Card: number;
  b3Total: number;
  pct: number;
  type: UnitEconLineType;
}

export type ScenarioCode = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export interface ScenarioData {
  code: ScenarioCode;
  short: string;
  name: string;
  cardHeaderLeft: string;
  cardHeaderRight: string;
  cardTitle: string;
  cardFooter: string;
  srpVat: number;
  srpPre: number;
  ck: number;
  roy: number;
  dp: number;
  sell: number;
  boxes: number;
  netRev: number;
  gpPct: number;
  dpTotal: number;
  gamTotal: number;
  fxSafe: number;
  fxMax: number;
  netPct: number;
  roi: number;
  b1Safe: number;
}

export interface ContingencyFund {
  id: 'd1' | 'd2' | 'd3';
  title: string;
  pctLabel: string;
  headlineValue: string;
  headlineUnit: string;
  badgeText: string;
  badgeTone: 'green' | 'gold';
  footerLeft: string;
  footerRight: string;
  ticksTotal: number;
  ticksFilled: number;
  tickColorClass: string;
}

export interface GovernanceRule {
  badge: string;
  badgeTone: 'gold' | 'green';
  textPrefix: string;
  emphasis: string;
  textSuffix: string;
}

export interface ReferenceSpec {
  label: string;
  value: string;
  tone?: 'default' | 'mono' | 'money';
}

export const REFERENCE_SPECS: ReferenceSpec[] = [
  { label: 'Nhà máy in', value: 'Shenzou Printing', tone: 'default' },
  { label: 'Tỷ giá USD/EUR', value: '25.500 / 27.500', tone: 'mono' },
  { label: 'Thuế VAT', value: '10,0%', tone: 'mono' },
  { label: 'Cấu hình Box', value: '10 Pack (80 thẻ)', tone: 'mono' },
  { label: 'Sản lượng 3 đợt', value: '1.320 Box (105,6k)', tone: 'mono' },
  { label: 'Thiết kế & Kho', value: '0 VNĐ', tone: 'money' },
];

export const BENCHMARK_SKUS: BenchmarkSku[] = [
  { id: 1, seg: 'seg1', segLabel: '1. Phổ thông (VN)', shortName: 'VBA Pack 5', name: 'VBA Fantasy Card 2026 - Pack 5', packSpec: '1 Pack (5 thẻ)', origPrice: '99.000 VNĐ', vndBox: 99000, vndPack: 99000, vndCard: 19800, hasAuto: false, isBox: false, note: '3 cấp Common/Rare/Ultra Rare foil; 0 chữ ký, 0 áo đấu' },
  { id: 2, seg: 'seg1', segLabel: '1. Phổ thông (VN)', shortName: 'VBA Pack 10', name: 'VBA Fantasy Card 2026 - Pack 10', packSpec: '1 Pack (10 thẻ)', origPrice: '180.000 VNĐ', vndBox: 180000, vndPack: 180000, vndCard: 18000, hasAuto: false, isBox: false, note: 'Phủ hiệu ứng lấp lánh; không có seri hay chữ ký/Relic' },
  { id: 3, seg: 'seg1', segLabel: '1. Phổ thông (VN)', shortName: 'Match Attax Pack', name: 'Topps Match Attax UCL 2026/27 - Pack', packSpec: '1 Pack (8 thẻ)', origPrice: '109.000 VNĐ', vndBox: 109000, vndPack: 109000, vndCard: 13625, hasAuto: false, isBox: false, note: 'Thẻ giấy TCG đại chúng; không cam kết Hit chữ ký' },
  { id: 4, seg: 'seg1', segLabel: '1. Phổ thông (VN)', shortName: 'Topps Display', name: 'Topps Match Attax UCL 2026/27 - Display Box', packSpec: '36 Pack (288 thẻ)', origPrice: '3.509.000 VNĐ', vndBox: 3509000, vndPack: 97472, vndCard: 12184, hasAuto: false, isBox: true, note: 'Hộp trưng bày quầy bán lẻ; thiên về số lượng thẻ phổ thông' },
  { id: 5, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Kolex Starter', name: 'Kolex x Esports World Cup 2025 Starter Box', packSpec: '5 Pack (25 thẻ)', origPrice: '29,99 USD', vndBox: 764745, vndPack: 152949, vndCard: 30590, hasAuto: true, isBox: true, note: 'Có thẻ đánh số (/75 đến /10); tỷ lệ ký/áo đấu 1:418 pack' },
  { id: 6, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Chrome UEFA Value', name: 'Topps Chrome UEFA 2025-26 - Value Box', packSpec: '7 Pack (28 thẻ)', origPrice: '30,00 EUR', vndBox: 825000, vndPack: 117857, vndCard: 29464, hasAuto: false, isBox: true, note: 'Phôi Chrome cao cấp, độc quyền Raywave; không cam kết Auto' },
  { id: 7, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'LoL Crystal Rose', name: 'ShiningSoul LoL Crystal Rose Limited Box', packSpec: '10 Pack (30 thẻ)', origPrice: '39,90 USD', vndBox: 1017450, vndPack: 101745, vndCard: 33915, hasAuto: false, isBox: true, note: 'Thẻ sưu tầm nhân vật LMHT bản giới hạn, không chữ ký tuyển thủ' },
  { id: 8, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Topps NBA Flagship', name: 'Topps Flagship Basketball 2026-27 Value Box', packSpec: '6 Pack (72 thẻ)', origPrice: '1.229.000 VNĐ', vndBox: 1229000, vndPack: 204833, vndCard: 17069, hasAuto: false, isBox: true, note: 'Hộp bán lẻ phổ thông NBA; không cam kết chữ ký mỗi hộp' },
  { id: 9, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Riftbound Slim', name: 'ShiningSoul Riftbound LoL Unleashed Slim Box', packSpec: '24 Pack (120 thẻ)', origPrice: '49,00 USD', vndBox: 1249500, vndPack: 52063, vndCard: 10413, hasAuto: false, isBox: true, note: 'Dòng TCG chơi bài kết hợp sưu tầm nhân vật LMHT' },
  { id: 10, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'NBA Hoops Value', name: 'Topps NBA Hoops 2025-26 Value Box', packSpec: '7 Pack (56 thẻ)', origPrice: '1.399.000 VNĐ', vndBox: 1399000, vndPack: 199857, vndCard: 24982, hasAuto: false, isBox: true, note: 'Hộp bán lẻ 7 pack tại thị trường VN; không cam kết Auto' },
  { id: 11, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Riftbound Jumbo', name: 'ShiningSoul Riftbound LoL Unleashed Jumbo Box', packSpec: '12 Pack (168 thẻ)', origPrice: '69,90 USD', vndBox: 1782450, vndPack: 148538, vndCard: 10610, hasAuto: false, isBox: true, note: 'Bản hộp lớn 14 thẻ/pack của dòng TCG nhân vật LMHT' },
  { id: 12, seg: 'seg2', segLabel: '2. Trung cấp & Esports', shortName: 'Kolex EWC Hobby', name: 'Kolex x Esports World Cup 2025 Hobby Box', packSpec: '24 Pack (120 thẻ)', origPrice: '99,99 USD', vndBox: 2549745, vndPack: 106239, vndCard: 21248, hasAuto: true, isBox: true, note: 'Thẻ tuyển thủ Esports đa bộ môn, đánh số 1/1; Auto/Jersey 1:418 pack' },
  { id: 13, seg: 'seg3', segLabel: '3. Cao cấp & Hobby Hit', shortName: 'Riot T1 Bundle*', name: 'Riot Riftbound x T1 2025 Worlds Player Bundle*', packSpec: 'Bộ 5 thẻ + Phụ kiện', origPrice: '70,00 USD', vndBox: 1785000, vndPack: 1785000, vndCard: 357000, isBundle: true, hasAuto: true, isBox: true, note: 'Giá gốc Riot mở bán T11/2026: 5 thẻ vinh danh T1 + Binder + Deckbox' },
  { id: 14, seg: 'seg3', segLabel: '3. Cao cấp & Hobby Hit', shortName: 'Riot Worlds Bundle*', name: 'Riot Riftbound x Worlds 2026 Edition Bundle*', packSpec: 'Bộ 4 thẻ + Phụ kiện', origPrice: '80,00 USD', vndBox: 2040000, vndPack: 2040000, vndCard: 510000, isBundle: true, hasAuto: true, isBox: true, note: 'Giá gốc Riot mở bán T11/2026: 4 thẻ Promo CKTG + Deckbox + Capsule' },
  { id: 15, seg: 'seg3', segLabel: '3. Cao cấp & Hobby Hit', shortName: 'Riot Gift Retail', name: 'Riot Riftbound: Gift of the Rift Retail Box', packSpec: '16 Pack + 37 thẻ lẻ', origPrice: '109,00 USD', vndBox: 2779500, vndPack: 173719, vndCard: 10649, hasAuto: false, isBox: true, note: 'Hộp phân phối qua Local Game Stores (04/12/2026) kèm hộp lưu trữ' },
  { id: 16, seg: 'seg3', segLabel: '3. Cao cấp & Hobby Hit', shortName: 'Topps Chrome Hobby', name: 'Topps Chrome UEFA 2025-26 - Hobby Box', packSpec: '20 Pack (80 thẻ)', origPrice: '260,00 EUR', vndBox: 7150000, vndPack: 357500, vndCard: 89375, hasAuto: true, isBox: true, note: 'Cùng quy mô 80 thẻ/Box; CAM KẾT 1 Autograph + thẻ đánh số/Box' },
  { id: 99, seg: 'target', segLabel: 'FramigosX × GAM', shortName: 'FramigosX × GAM', name: 'FramigosX × GAM 10-Year Standard Hobby Box (Mốc chuẩn)', packSpec: '10 Pack (80 thẻ)', origPrice: '1.980.000 VNĐ', vndBox: 1980000, vndPack: 198000, vndCard: 24750, hasAuto: true, isBox: true, isTarget: true, note: 'Cam kết 1–2 Hit lớn (Auto/Jersey Relic 130pt) + 7–8 Gold /50 mỗi hộp' },
];

export const SEGMENT_WHISKERS: SegmentWhisker[] = [
  { title: '1. Nhóm Phổ thông VN (/thẻ)', min: 12184, med: 15813, mean: 15902, max: 19800, scaleMax: 90000, target: null, highlight: false },
  { title: '2. Trung cấp & Esports (/thẻ)', min: 10413, med: 23115, mean: 22286, max: 33915, scaleMax: 90000, target: null, highlight: false },
  { title: 'Toàn bộ 13 SKU thuần thẻ (/thẻ)', min: 10413, med: 19800, mean: 25483, max: 89375, scaleMax: 90000, target: 24750, highlight: true },
  { title: 'Giá / Hộp — 13 SKU Hộp/Bundle', min: 764745, med: 1782450, mean: 2160030, max: 7150000, scaleMax: 7200000, target: 1980000, highlight: false },
];

export const SKU_TIERS: SkuTierCard[] = [
  {
    badge: 'SKU 1 · Retail',
    deltaLabel: '+5,6% / thẻ',
    deltaTone: 'accent',
    title: 'Single Booster Pack',
    spec: '1 Pack (8 thẻ) · Quầy kệ & Sự kiện',
    priceVat: '209.000đ',
    pricePreVat: '190.000đ trước VAT',
    pricePerCard: '26.125đ/thẻ',
    note: 'Hạ rào cản mua thử xuống ~200k; kích thích nâng cấp lên Box để tiết kiệm 110k.',
  },
  {
    badge: 'SKU 2 · Pre-order',
    deltaLabel: '−10,0%',
    deltaTone: 'money',
    title: 'Early-Bird Pre-order Box',
    spec: '10 Pack (80 thẻ) · Web/GAM mở sớm',
    priceVat: '1.782.000đ',
    pricePreVat: '1.620.000đ trước VAT',
    pricePerCard: '22.275đ/thẻ',
    note: 'Đo sức mua thực & thu tiền mặt sớm trước ra mắt, khóa sàn MAP tối thiểu.',
  },
  {
    badge: 'SKU 3 · Mốc chuẩn',
    deltaLabel: '0,0%',
    deltaTone: 'accent',
    title: 'Standard Hobby Box',
    spec: '10 Pack (80 thẻ) · Đơn vị hạch toán',
    priceVat: '1.980.000đ',
    pricePreVat: '1.800.000đ trước VAT',
    pricePerCard: '24.750đ/thẻ',
    note: '60 Base + 10 Silver + 7–8 Gold /50 + 1–2 Hit lớn (Auto/Relic).',
    isAnchor: true,
  },
  {
    badge: 'SKU 4 · VIP/Breaker',
    deltaLabel: '−5,0%',
    deltaTone: 'money',
    title: 'Sealed Master Case',
    spec: '10 Box (800 thẻ) · Thùng seal 5 lớp',
    priceVat: '18.810.000đ',
    pricePreVat: '17.100.000đ trước VAT',
    pricePerCard: '23.513đ/thẻ',
    note: 'Đẩy sản lượng lớn; cam kết TB 3 thẻ Grail tranh ghép / Case.',
  },
];

export const WHOLESALE_TIERS: WholesaleTierRow[] = [
  { tierName: 'Tier 3 — Silver', moqNote: '(10–29 Box · TT 100%)', weightPct: '25%', discountPct: '26,0%', wholesalePrice: '1.332.000đ', dealerProfit: '+468.000đ' },
  { tierName: 'Tier 2 — Gold', moqNote: '(30–79 Box · Cọc 50%)', weightPct: '50%', discountPct: '30,0%', wholesalePrice: '1.260.000đ', dealerProfit: '+540.000đ' },
  { tierName: 'Tier 1 — Platinum', moqNote: '(≥80 Box · Cọc 50%)', weightPct: '25%', discountPct: '34,0%', wholesalePrice: '1.188.000đ', dealerProfit: '+612.000đ' },
  { tierName: 'Bình quân gia quyền kênh sỉ', moqNote: '', weightPct: '100%', discountPct: '30,0%', wholesalePrice: '1.260.000đ', dealerProfit: '+540.000đ', isSummary: true },
];

export const CHANNEL_BASE_ROWS: ChannelBaseRow[] = [
  { id: 1, shortName: 'Đại lý TCG', name: '1. Đại lý TCG (CK 30%)', tableName: '1. Đại lý Shop TCG (CK 30% · 55%)', net: 1260000, cogs: 693749, roy: 126000, dp: 63000, gamT2: 75450, fx: 301801, b1Text: '167.112 (13,3%)', marginText: '24,0%' },
  { id: 2, shortName: 'GAM Store', name: '2. GAM Store (Comm 20%)', tableName: '2. GAM Store & Sự kiện (Comm 20% · 30%)', net: 1440000, cogs: 693749, roy: 144000, dp: 72000, gamT2: 106050, fx: 424201, b1Text: '289.512 (20,1%)', marginText: '29,5%' },
  { id: 3, shortName: 'FramigosX D2C', name: '3. FramigosX D2C (Phí 10%)', tableName: '3. FramigosX D2C (Phí 10% · 15%)', net: 1620000, cogs: 693749, roy: 162000, dp: 81000, gamT2: 136650, fx: 546601, b1Text: '411.912 (25,4%)', marginText: '33,7%' },
  { id: 0, shortName: 'Bình quân', name: 'Bình quân hệ thống (55/30/15)', tableName: 'Bình quân gia quyền (55 / 30 / 15)', net: 1368000, cogs: 693749, roy: 136800, dp: 68400, gamT2: 93810, fx: 375241, b1Text: '240.552 (17,6%)', marginText: '27,4%', isSum: true },
];

export const UNIT_ECON_LINES: UnitEconLine[] = [
  { code: '1', title: '1. GIÁ BÁN LẺ NIÊM YẾT TRƯỚC VAT (GROSS SRP)', b1Box: 1800000, b3Box: 1800000, b3Pack: 180000, b3Card: 22500, b3Total: 2376000000, pct: 131.58, type: 'major' },
  { code: '1a', title: '(-) Chiết khấu Đại lý TCG (55% SL × 30,0% CK)', b1Box: -297000, b3Box: -297000, b3Pack: -29700, b3Card: -3713, b3Total: -392040000, pct: -21.71, type: 'sub' },
  { code: '1b', title: '(-) Hoa hồng bán trực tiếp GAM Store (30% SL × 20,0%)', b1Box: -108000, b3Box: -108000, b3Pack: -10800, b3Card: -1350, b3Total: -142560000, pct: -7.89, type: 'sub' },
  { code: '1c', title: '(-) Ưu đãi Early-Bird, phí sàn & cổng TT D2C (15% SL × 10,0%)', b1Box: -27000, b3Box: -27000, b3Pack: -2700, b3Card: -338, b3Total: -35640000, pct: -1.97, type: 'sub' },
  { code: '2', title: '2. DOANH THU THỰC THU VỀ DỰ ÁN (NET REALIZED REV)', b1Box: 1368000, b3Box: 1368000, b3Pack: 136800, b3Card: 17100, b3Total: 1805760000, pct: 100.00, type: 'highlight' },
  { code: 'A', title: 'A. CHI PHÍ XƯỞNG & CHUỖI CUNG ỨNG NHẬP KHO (LANDED COGS)', b1Box: -794694, b3Box: -655870, b3Pack: -65587, b3Card: -8198, b3Total: -865749000, pct: -47.94, type: 'group' },
  { code: 'A1', short: 'A1. R&D Sample', grp: 'shenzou', title: 'A1. Phân bổ làm mẫu R&D (Digital Sample $450 + Relic/DHL $550)', b1Box: -57303, b3Box: -19318, b3Pack: -1932, b3Card: -241, b3Total: -25500000, pct: -1.41, type: 'cogs' },
  { code: 'A2', short: 'A2. Base 18pt', grp: 'shenzou', title: 'A2. Xưởng Shenzou: In thẻ Base 18pt (25.000 thẻ/đợt = $2.000)', b1Box: -114607, b3Box: -115909, b3Pack: -11591, b3Card: -1449, b3Total: -153000000, pct: -8.47, type: 'cogs' },
  { code: 'A3', short: 'A3. PRISM 0,6mm', grp: 'shenzou', title: 'A3. Xưởng Shenzou: In thẻ PRISM 0,6mm (10.000 thẻ/đợt = $3.000)', b1Box: -171910, b3Box: -173864, b3Pack: -17386, b3Card: -2173, b3Total: -229500000, pct: -12.71, type: 'cogs' },
  { code: 'A4', short: 'A4. Màng Holo', grp: 'shenzou', title: 'A4. Xưởng Shenzou: 2 hiệu ứng màng Hologram phụ ($300/đợt)', b1Box: -17191, b3Box: -17386, b3Pack: -1739, b3Card: -217, b3Total: -22950000, pct: -1.27, type: 'cogs' },
  { code: 'A5', short: 'A5. Khuôn Ép kim', grp: 'shenzou', title: 'A5. Xưởng Shenzou: Khuôn Ép kim & Dập nổi ($1.000/đợt, trần 500 tờ)', b1Box: -57303, b3Box: -57955, b3Pack: -5795, b3Card: -724, b3Total: -76500000, pct: -4.24, type: 'cogs' },
  { code: 'A6', short: 'A6. Jersey Relic', grp: 'shenzou', title: 'A6. Xưởng Shenzou: Phôi thẻ Jersey Relic (600 thẻ in gộp Đợt 1 = $2.000)', b1Box: -114607, b3Box: -38636, b3Pack: -3864, b3Card: -483, b3Total: -51000000, pct: -2.82, type: 'cogs' },
  { code: 'A7', short: 'A7. Seri', grp: 'shenzou', title: 'A7. Xưởng Shenzou: Đánh số Seri ($0,03/thẻ; tổng 6.600 thẻ có seri)', b1Box: -4470, b3Box: -3825, b3Pack: -382, b3Card: -48, b3Total: -5049000, pct: -0.28, type: 'cogs' },
  { code: 'A8', short: 'A8. Màng Pack', grp: 'shenzou', title: 'A8. Xưởng Shenzou: Cuộn màng nhôm hàn Pack ($1.000 Đ1 + $500 Đ2)', b1Box: -57303, b3Box: -28977, b3Pack: -2898, b3Card: -362, b3Total: -38250000, pct: -2.12, type: 'cogs' },
  { code: 'A9', short: 'A9. Vỏ hộp Box', grp: 'pack', title: 'A9. Bao bì: Vỏ hộp cứng Hobby Box, khay định hình 10 pack & màng co', b1Box: -85000, b3Box: -85000, b3Pack: -8500, b3Card: -1062, b3Total: -112200000, pct: -6.21, type: 'cogs' },
  { code: 'A10', short: 'A10. Vật tư phụ', grp: 'pack', title: 'A10. Vật tư phụ: Thùng Carton 5 lớp, tem Sticker ký & tem COA chống giả', b1Box: -35000, b3Box: -35000, b3Pack: -3500, b3Card: -438, b3Total: -46200000, pct: -2.56, type: 'cogs' },
  { code: 'A11', short: 'A11. Logistics', grp: 'logistics', title: 'A11. Logistics: Vận tải chính ngạch Trung–Việt, Hải quan & Thuế NK', b1Box: -80000, b3Box: -80000, b3Pack: -8000, b3Card: -1000, b3Total: -105600000, pct: -5.85, type: 'cogs' },
  { code: '3', title: '3. LỢI NHUẬN GỘP CHUẨN (GROSS PROFIT)', b1Box: 573306, b3Box: 712130, b3Pack: 71213, b3Card: 8902, b3Total: 940011000, pct: 52.06, type: 'major' },
  { code: 'B', title: 'B. CHI PHÍ MARKETING & KÍCH HOẠT THƯƠNG MẠI', b1Box: -67416, b3Box: -37879, b3Pack: -3788, b3Card: -473, b3Total: -50000000, pct: -2.77, type: 'group' },
  { code: 'B1', title: 'B1. Tổ chức buổi ký thẻ tuyển thủ & Sản xuất Media / Video Unbox', b1Box: -24719, b3Box: -11364, b3Pack: -1136, b3Card: -142, b3Total: -15000000, pct: -0.83, type: 'sub' },
  { code: 'B2', title: 'B2. Tài trợ Sample Box cho KOLs / Streamers / Box Breakers LMHT', b1Box: -20225, b3Box: -11364, b3Pack: -1136, b3Card: -142, b3Total: -15000000, pct: -0.83, type: 'sub' },
  { code: 'B3', title: 'B3. Vận hành hệ thống Landing Page tra cứu COA, Đua Top Grail & Ads', b1Box: -13483, b3Box: -9091, b3Pack: -909, b3Card: -114, b3Total: -12000000, pct: -0.66, type: 'sub' },
  { code: 'B4', title: 'B4. Vật phẩm trưng bày quầy kệ POSM tại Đại lý TCG & GAM Store', b1Box: -8989, b3Box: -6061, b3Pack: -606, b3Card: -76, b3Total: -8000000, pct: -0.44, type: 'sub' },
  { code: 'C', title: 'C. TẦNG 1 — ROYALTY IP TRẢ GAM (10,0% DOANH THU THỰC)', b1Box: -136800, b3Box: -136800, b3Pack: -13680, b3Card: -1710, b3Total: -180576000, pct: -10.00, type: 'group' },
  { code: 'D', title: 'D. QUỸ DỰ PHÒNG PHÁT SINH & BẢO HÀNH (5,0% DOANH THU THỰC)', b1Box: -68400, b3Box: -68400, b3Pack: -6840, b3Card: -855, b3Total: -90288000, pct: -5.00, type: 'group' },
  { code: 'D1', title: 'D1. Dự phòng đổi trả thẻ lỗi QC, lệch cắt bế & móp hộp vận chuyển (2,0%)', b1Box: -27360, b3Box: -27360, b3Pack: -2736, b3Card: -342, b3Total: -36115200, pct: -2.00, type: 'sub' },
  { code: 'D2', title: 'D2. Dự phòng trượt tỷ giá USD/VNĐ & phụ phí kiểm hóa Hải quan (1,5%)', b1Box: -20520, b3Box: -20520, b3Pack: -2052, b3Card: -256, b3Total: -27086400, pct: -1.50, type: 'sub' },
  { code: 'D3', title: 'D3. Dự phòng kích cầu thương mại / xử lý hàng chậm luân chuyển (1,5%)', b1Box: -20520, b3Box: -20520, b3Pack: -2052, b3Card: -256, b3Total: -27086400, pct: -1.50, type: 'sub' },
  { code: '4', title: '4. THẶNG DƯ DỰ ÁN SAU THU HỒI VỐN & TRÍCH LẬP DỰ PHÒNG', b1Box: 300690, b3Box: 469051, b3Pack: 46905, b3Card: 5863, b3Total: 619147000, pct: 34.29, type: 'major' },
  { code: 'E', title: 'E. TẦNG 2 — CHIA LỢI NHUẬN TRẢ GAM (20,0% THẶNG DƯ)', b1Box: -60138, b3Box: -93810, b3Pack: -9381, b3Card: -1173, b3Total: -123829400, pct: -6.86, type: 'group' },
  { code: '5', title: '5. LỢI NHUẬN RÒNG AN TOÀN CỦA FRAMIGOSX (ĐÃ TRỪ ĐỦ 5% DỰ PHÒNG)', b1Box: 240552, b3Box: 375241, b3Pack: 37524, b3Card: 4691, b3Total: 495317600, pct: 27.43, type: 'profit' },
  { code: '6', title: '6. Lợi nhuận ròng tối đa của FramigosX (Nếu hoàn nhập 100% Quỹ dự phòng)', b1Box: 295272, b3Box: 429961, b3Pack: 42996, b3Card: 5375, b3Total: 567548000, pct: 31.43, type: 'sub' },
];

export const SCENARIOS: Record<ScenarioCode, ScenarioData> = {
  S1: {
    code: 'S1',
    short: 'S1 (−20%)',
    name: 'S1. Thâm nhập Giá thấp (−20% Giá)',
    cardHeaderLeft: 'S1 · −20% Giá',
    cardHeaderRight: '100% SL',
    cardTitle: 'Thâm nhập Giá thấp',
    cardFooter: 'SRP 1.584k · ROI +49,9%',
    srpVat: 1584000,
    srpPre: 1440000,
    ck: 30,
    roy: 10,
    dp: 5,
    sell: 100,
    boxes: 1320,
    netRev: 1444608000,
    gpPct: 40.1,
    dpTotal: 72230400,
    gamTotal: 320942360,
    fxSafe: 249734240,
    fxMax: 307518560,
    netPct: 17.3,
    roi: 49.9,
    b1Safe: 24254240,
  },
  S2: {
    code: 'S2',
    short: 'S2 (Áp lực)',
    name: 'S2. Áp lực Kép (−10% Giá, ép CK & đội DP)',
    cardHeaderLeft: 'S2 · Ép CK & DP',
    cardHeaderRight: '100% SL',
    cardTitle: 'Áp lực Kép',
    cardFooter: 'CK 34% · Roy 12% · DP 8%',
    srpVat: 1782000,
    srpPre: 1620000,
    ck: 34,
    roy: 12,
    dp: 8,
    sell: 100,
    boxes: 1320,
    netRev: 1578139200,
    gpPct: 45.1,
    dpTotal: 126251136,
    gamTotal: 387033176,
    fxSafe: 277409888,
    fxMax: 378410797,
    netPct: 17.6,
    roi: 55.5,
    b1Safe: 33584288,
  },
  S3: {
    code: 'S3',
    short: 'S3 (Chuẩn)',
    name: 'S3. Kịch bản Cơ sở Chuẩn (Khuyến nghị)',
    cardHeaderLeft: 'S3 · Chuẩn',
    cardHeaderRight: '100% SL',
    cardTitle: 'Cơ sở Chuẩn',
    cardFooter: 'SRP 1.980k · ROI +99,1%',
    srpVat: 1980000,
    srpPre: 1800000,
    ck: 30,
    roy: 10,
    dp: 5,
    sell: 100,
    boxes: 1320,
    netRev: 1805760000,
    gpPct: 52.1,
    dpTotal: 90288000,
    gamTotal: 446965400,
    fxSafe: 495317600,
    fxMax: 567548000,
    netPct: 27.4,
    roi: 99.1,
    b1Safe: 107045600,
  },
  S4: {
    code: 'S4',
    short: 'S4 (+5%)',
    name: 'S4. Tối ưu Kênh & Vận hành (+5% Giá)',
    cardHeaderLeft: 'S4 · +5% Giá',
    cardHeaderRight: '100% SL',
    cardTitle: 'Tối ưu Vận hành',
    cardFooter: 'CK 28% · DP 3% · +121%',
    srpVat: 2079000,
    srpPre: 1890000,
    ck: 28,
    roy: 10,
    dp: 3,
    sell: 100,
    boxes: 1320,
    netRev: 1923490800,
    gpPct: 55.0,
    dpTotal: 57704724,
    gamTotal: 493574679,
    fxSafe: 606150397,
    fxMax: 652314176,
    netPct: 31.5,
    roi: 121.2,
    b1Safe: 144409687,
  },
  S5: {
    code: 'S5',
    short: 'S5 (+20%)',
    name: 'S5. Định vị Cao cấp 10 năm (+20% Giá)',
    cardHeaderLeft: 'S5 · +20% Giá',
    cardHeaderRight: '100% SL',
    cardTitle: 'Định vị Cao cấp',
    cardFooter: 'SRP 2.376k · ROI +152%',
    srpVat: 2376000,
    srpPre: 2160000,
    ck: 28,
    roy: 10,
    dp: 5,
    sell: 100,
    boxes: 1320,
    netRev: 2198275200,
    gpPct: 60.6,
    dpTotal: 109913760,
    gamTotal: 581456504,
    fxSafe: 762227936,
    fxMax: 850158944,
    netPct: 34.7,
    roi: 152.4,
    b1Safe: 197026736,
  },
  S6: {
    code: 'S6',
    short: 'S6 (Tồn 25%)',
    name: 'S6. Stress Tồn kho 25% (Bán 75% SL)',
    cardHeaderLeft: 'S6 · Tồn 25%',
    cardHeaderRight: '75% SL',
    cardTitle: 'Stress Tồn kho',
    cardFooter: 'Bán 990 Box · Đ1: +3,56tr',
    srpVat: 1980000,
    srpPre: 1800000,
    ck: 30,
    roy: 10,
    dp: 5,
    sell: 75,
    boxes: 990,
    netRev: 1354320000,
    gpPct: 36.1,
    dpTotal: 67716000,
    gamTotal: 289436600,
    fxSafe: 188338400,
    fxMax: 242511200,
    netPct: 13.9,
    roi: 37.7,
    b1Safe: 3556400,
  },
};

export const SCENARIO_ORDER: ScenarioCode[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export const CONTINGENCY_FUNDS: ContingencyFund[] = [
  {
    id: 'd1',
    title: 'Tiểu quỹ D1 · Lỗi QC & móp hộp',
    pctLabel: '2,0% Net',
    headlineValue: '55,1 Box',
    headlineUnit: '/ 1.320 Box',
    badgeText: '4,17% sản lượng',
    badgeTone: 'green',
    footerLeft: 'Ngân sách: 36.115.200đ',
    footerRight: 'COGS: 655.870đ',
    ticksTotal: 40,
    ticksFilled: 33,
    tickColorClass: 'bg-[var(--color-money)]',
  },
  {
    id: 'd2',
    title: 'Tiểu quỹ D2 · Trượt tỷ giá USD',
    pctLabel: '1,5% Net',
    headlineValue: '26.648đ',
    headlineUnit: '/ USD trần',
    badgeText: '+1.148đ / USD',
    badgeTone: 'gold',
    footerLeft: 'Ngân sách: 27.086.400đ',
    footerRight: 'Hóa đơn: $23.598',
    ticksTotal: 40,
    ticksFilled: 30,
    tickColorClass: 'bg-[var(--color-accent)]',
  },
  {
    id: 'd3',
    title: 'Tiểu quỹ D3 & Hoàn nhập 80/20',
    pctLabel: '1,5% Net',
    headlineValue: '+72,23 tr',
    headlineUnit: 'hoàn về FX',
    badgeText: '+4,0% biên',
    badgeTone: 'green',
    footerLeft: 'Tổng Quỹ DP: 90,29 tr',
    footerRight: 'FX Max: 567,55 tr',
    ticksTotal: 40,
    ticksFilled: 32,
    tickColorClass: 'bg-[var(--color-money)]',
  },
];

export const GOVERNANCE_RULES: GovernanceRule[] = [
  {
    badge: 'Quy tắc 01 · 80% Sell-through Gate',
    badgeTone: 'gold',
    textPrefix: 'Chỉ mở lệnh in Đợt 2 (174,93 tr EXW) khi Đợt 1 bán vượt ',
    emphasis: '356 / 445 Box (80%)',
    textSuffix: ' → rủi ro lỗ = 0%.',
  },
  {
    badge: 'Quy tắc 02 · MAP Policy 60 ngày',
    badgeTone: 'gold',
    textPrefix: 'Khóa sàn Pre-order tối đa ',
    emphasis: '−10% (1.782.000đ)',
    textSuffix: '; cấm đại lý quảng cáo dưới 1.980.000đ trong 60 ngày đầu.',
  },
  {
    badge: 'Quy tắc 03 · Phụ lục Hợp đồng GAM',
    badgeTone: 'green',
    textPrefix: 'Đính kèm Bảng 3.1 làm công thức đối soát Quý để bảo vệ Quỹ dự phòng 5% & tránh thất thoát ',
    emphasis: '45,6 tr',
    textSuffix: ' Royalty.',
  },
];
