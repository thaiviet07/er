export type SlideVisualKey =
  | 'exec-split'
  | 'benchmark-corridor'
  | 'sku-staircase'
  | 'channel-margin'
  | 'cogs-scale'
  | 'waterfall-compact'
  | 'stress-scenarios'
  | 'stage-gate';

export interface SlideArgument {
  lead: string;
  body: string;
  metricTag?: string;
}

export interface SlideItem {
  id: number;
  num: string;
  shortTitle: string;
  pillar: string;
  headline: string;
  subheadline: string;
  keyMetric: {
    label: string;
    value: string;
    tone: 'gold' | 'green' | 'ink';
  };
  arguments: SlideArgument[];
  takeaway: string;
  visualKey: SlideVisualKey;
}

export const PRESENTATION_SLIDES: SlideItem[] = [
  {
    id: 1,
    num: '01',
    shortTitle: 'Tóm tắt điều hành',
    pillar: '01 · Luận điểm điều hành (Executive Thesis)',
    headline: 'Mốc 1.980.000đ/Box đạt ROI +99,1% và bảo toàn vốn ngay từ Đợt 1',
    subheadline: 'Hạch toán trọn 3 đợt (1.320 Box · 105,6k thẻ) trên cấu hình Shenzou Printing, đã trích đủ 5% dự phòng rủi ro.',
    keyMetric: {
      label: 'Lãi ròng An toàn FX',
      value: '495,32 tr · ROI +99,1%',
      tone: 'green',
    },
    arguments: [
      {
        lead: 'Biên an toàn thực chất 27,4% trên Doanh thu thực',
        body: 'Từ 1.805,76 tr Net Revenue (76,0% SRP), dự án thu về 495,32 tr lãi ròng an toàn (375.241đ/Box) và lên tới 567,55 tr nếu hoàn nhập 80% quỹ dự phòng.',
        metricTag: '375.241đ / Box',
      },
      {
        lead: 'Cấu trúc hợp tác Win-Win với GAM Esports',
        body: 'Tổng thu của GAM qua 3 dòng (Hoa hồng GAM Store + Royalty 10% + Chia lãi Tầng 2 20%) đạt 446,97 tr mà không cần gánh rủi ro tồn kho sản xuất.',
        metricTag: '446,97 tr GAM',
      },
      {
        lead: 'Đợt 1 tự đứng vững trên 445 Box độc lập',
        body: 'Ngay cả khi chưa tính hiệu quả gộp 3 đợt, Đợt 1 vẫn sinh lãi ròng +107,05 tr (biên 17,6%), tạo đệm tiền mặt an toàn trước khi mở lệnh in tiếp.',
        metricTag: '+107,05 tr Đợt 1',
      },
    ],
    takeaway: 'Khuyến nghị phê duyệt kịch bản cơ sở S3 (1.980.000đ gồm VAT) làm mốc niêm yết chuẩn cho toàn bộ 3 đợt phát hành.',
    visualKey: 'exec-split',
  },
  {
    id: 2,
    num: '02',
    shortTitle: 'Đối chuẩn 16 SKU',
    pillar: '02 · Định vị thị trường (Market Benchmarking)',
    headline: 'Điểm rơi 1.980.000đ (24.750đ/thẻ) khóa trọn hành lang tối ưu 1,50–2,04 tr',
    subheadline: 'Đối chuẩn 16 SKU phát hành gốc (MSRP 2025–2026) tách riêng bundle phụ kiện để giữ đúng mặt bằng giá thuần thẻ.',
    keyMetric: {
      label: 'Đơn giá / Thẻ (VAT)',
      value: '24.750đ (−2,9% TB)',
      tone: 'gold',
    },
    arguments: [
      {
        lead: 'Khớp mặt bằng 13 SKU thuần thẻ quốc tế & nội địa',
        body: 'Mức 24.750đ/thẻ thấp hơn nhẹ trung bình 13 SKU thuần thẻ (25.483đ/thẻ), giúp người sưu tầm dễ chấp nhận mà không phải phá giá.',
        metricTag: '25.483đ TB',
      },
      {
        lead: 'Rẻ hơn 22,3% so với Kolex EWC Hobby nhưng vượt trội Hit',
        body: 'Kolex EWC Hobby ở mức 2,55 tr (Auto/Jersey 1:418 pack), trong khi FramigosX × GAM cam kết 1–2 Hit lớn (Auto/Relic 130pt) + 7–8 Gold /50 mỗi hộp.',
        metricTag: '−22,3% vs Kolex',
      },
      {
        lead: 'Tách biệt rõ khỏi nhóm phổ thông dưới 1,50 tr',
        body: 'VBA (18–19,8k/thẻ) và Match Attax không có chữ ký hay phôi dày; phôi PRISM 0,6mm và Relic 130pt bảo vệ giá trị sưu tầm trên sàn 1,50 tr.',
        metricTag: 'PRISM 0,6mm + 130pt',
      },
    ],
    takeaway: 'Dưới ngưỡng trần tâm lý 2,00 tr giúp đại lý quay vòng vốn nhanh hơn ngưỡng Riot Bundle (70–80 USD) mà vẫn giữ định vị Hobby cao cấp.',
    visualKey: 'benchmark-corridor',
  },
  {
    id: 3,
    num: '03',
    shortTitle: 'Bậc thang 4 SKU',
    pillar: '03 · Kiến trúc Giá đa tầng (Multi-Tier SKU)',
    headline: '4 bậc SKU dẫn phễu từ mua thử 209k đến Case 18,81 tr không tự ăn mòn giá',
    subheadline: 'Mọi SKU đều neo quanh đơn giá gốc 24.750đ/thẻ của Standard Hobby Box với biên độ chênh lệch kiểm soát từ −10% đến +5,6%.',
    keyMetric: {
      label: 'Mốc neo Hobby Box',
      value: '1.980.000đ (80 thẻ)',
      tone: 'gold',
    },
    arguments: [
      {
        lead: 'Single Booster Pack (209.000đ) hạ rào cản mua thử',
        body: 'Mức 26.125đ/thẻ (+5,6% vs Box) đặt ngưỡng chi tiêu đầu tiên quanh 200k tại quầy kệ/sự kiện, tạo động lực nâng cấp lên Box để tiết kiệm 110k.',
        metricTag: '+5,6% / thẻ',
      },
      {
        lead: 'Early-Bird Pre-order (1.782.000đ) khóa sàn MAP −10%',
        body: 'Mở bán sớm trên Web/GAM ở 22.275đ/thẻ giúp đo sức mua thực và thu tiền mặt trước khi phát hành mà không tạo tiền lệ phá giá bán lẻ.',
        metricTag: '−10,0% MAP Floor',
      },
      {
        lead: 'Sealed Master Case (18.810.000đ) kéo thanh khoản Breaker',
        body: 'Giảm −5,0% xuống 23.513đ/thẻ cho thùng seal 10 Box kèm cam kết TB 3 thẻ Grail tranh ghép / Case để hút dòng tiền lớn từ nhóm VIP/Breaker.',
        metricTag: '−5,0% · 3 Grail/Case',
      },
    ],
    takeaway: 'Khoảng cách giá giữa 4 SKU đủ rõ để phân tầng khách hàng từ fan đại chúng tới Box Breaker nhưng vẫn giữ 1.980k làm neo tham chiếu.',
    visualKey: 'sku-staircase',
  },
  {
    id: 4,
    num: '04',
    shortTitle: 'Kênh phân phối',
    pillar: '04 · Kênh Sỉ đứt đoạn & Phối kênh (55 / 30 / 15)',
    headline: 'Phối kênh 55/30/15 giữ Net Realized 1.368.000đ/Box và loại bỏ rủi ro ký gửi',
    subheadline: 'Kết hợp độ phủ đại lý TCG (55%), lưu lượng cộng đồng GAM Store (30%) và biên lợi nhuận cao từ FramigosX D2C (15%).',
    keyMetric: {
      label: 'Doanh thu thực BQ',
      value: '1.368.000đ (76,0%)',
      tone: 'ink',
    },
    arguments: [
      {
        lead: 'Bán sỉ đứt đoạn 100% — Không ký gửi trả hàng',
        body: '3 hạng đại lý Silver (26%), Gold (30%), Platinum (34%) cho chiết khấu bình quân 30,0%, giúp đại lý lãi +540.000đ/Box mà FX không ôm rủi ro hoàn hàng.',
        metricTag: 'Lãi ĐL +540k/Box',
      },
      {
        lead: 'GAM Store & D2C kéo biên ròng hệ thống lên 27,4%',
        body: 'Kênh sỉ TCG mang lại 301.801đ/Box (24,0%), GAM Store đạt 424.201đ/Box (29,5%), còn D2C đạt 546.601đ/Box (33,7%) nhờ tiết kiệm chiết khấu.',
        metricTag: '24% → 33,7% Margin',
      },
      {
        lead: 'Chuyển 5% sản lượng sang D2C tăng trực tiếp lãi ròng',
        body: 'Mỗi Box dịch chuyển từ kênh sỉ (CK 30%) sang D2C (phí 10%) tạo thêm +244.800đ lãi ròng FX sau khi đã chia Royalty và Tầng 2.',
        metricTag: '+244,8k / Box chuyển',
      },
    ],
    takeaway: 'Cấu trúc 55/30/15 cân bằng giữa tốc độ đẩy hàng qua shop TCG với tối ưu biên lợi nhuận trên các kênh sở hữu trực tiếp.',
    visualKey: 'channel-margin',
  },
  {
    id: 5,
    num: '05',
    shortTitle: 'Quy mô Shenzou',
    pillar: '05 · Hiệu quả Quy mô Chuỗi cung ứng (Landed COGS)',
    headline: 'Gộp sản lượng 3 đợt hạ Giá vốn −17,5% từ 794.694đ xuống 655.870đ/Box',
    subheadline: 'Phân bổ chi phí cố định khuôn mẫu, phôi Jersey Relic và màng hàn Pack từ 445 Box (Đợt 1) ra toàn bộ 1.320 Box.',
    keyMetric: {
      label: 'Tiết kiệm Giá vốn',
      value: '−138.824đ / Box (−17,5%)',
      tone: 'green',
    },
    arguments: [
      {
        lead: 'Xưởng Shenzou chiếm 63,4% COGS với độ khấu hao cố định cao',
        body: 'Phôi Jersey Relic (A6, 600 thẻ in gộp Đợt 1 = $2.000) và mẫu R&D (A1, $1.000) giảm ngay −66,3% trên mỗi Box khi dàn đều cho 3 đợt.',
        metricTag: 'A6 & A1: −66,3%',
      },
      {
        lead: 'Cuộn màng nhôm hàn Pack giảm gần một nửa chi phí đơn vị',
        body: 'Đặt cuộn màng $1.000 Đợt 1 + $500 Đợt 2 giúp hạng mục A8 giảm từ 57.303đ/Box xuống còn 28.977đ/Box (−49,4%).',
        metricTag: 'A8: −49,4%',
      },
      {
        lead: 'Bao bì & Logistics giữ ổn định ở mức 200.000đ/Box',
        body: 'Vỏ hộp cứng + khay (85k), vật tư phụ & tem COA (35k) và vận tải chính ngạch + thuế NK (80k) tạo thành chi phí biến đổi minh bạch.',
        metricTag: '200k / Box cố định',
      },
    ],
    takeaway: 'Tổng cộng 183,25 tr chi phí sản xuất được giải phóng thành lợi nhuận gộp nhờ đặt hàng theo lộ trình 3 đợt có điều kiện.',
    visualKey: 'cogs-scale',
  },
  {
    id: 6,
    num: '06',
    shortTitle: 'Chia sẻ 2 tầng & DP',
    pillar: '06 · Cơ chế Chia sẻ 2 Tầng & Lá chắn Dự phòng 5%',
    headline: 'Royalty tính trên Net Revenue & Quỹ DP 5% bảo vệ dòng tiền trước khi chia lãi',
    subheadline: 'Hạch toán đầy đủ 22 dòng chuẩn kế toán trước VAT để phân tách rõ nghĩa vụ đối tác và bộ đệm rủi ro vận hành.',
    keyMetric: {
      label: 'Quỹ Dự phòng 5%',
      value: '90,29 tr (Hoàn 80/20)',
      tone: 'gold',
    },
    arguments: [
      {
        lead: 'Royalty Tầng 1 tính trên Net Revenue tránh thất thoát 45,6 tr',
        body: 'Áp dụng 10% trên 1.805,76 tr Net (180,58 tr) thay vì trên Gross SRP giúp công thức phản ánh đúng thực thu sau chiết khấu đại lý.',
        metricTag: 'Tránh hụt 45,6 tr',
      },
      {
        lead: '3 Tiểu quỹ DP 5% (90,29 tr) phủ kín các rủi ro thực tế',
        body: 'Gồm D1 lỗi QC/móp hộp 2,0% (đủ đổi 55,1 Box), D2 trượt tỷ giá USD 1,5% (chịu tới 26.648đ/USD) và D3 kích cầu xử lý hàng chậm 1,5%.',
        metricTag: 'D1 55b · D2 26,6k',
      },
      {
        lead: 'Chia lãi Tầng 2 (20% thặng dư) chỉ kích hoạt sau hòa vốn',
        body: 'Sau khi thu hồi đủ COGS + Marketing (915,75 tr), Royalty và Quỹ DP, thặng dư 619,15 tr được chia 20% cho GAM (123,83 tr) và 80% về FX.',
        metricTag: '80% FX / 20% GAM',
      },
    ],
    takeaway: 'Nếu Quỹ DP không phát sinh sự cố, cơ chế hoàn nhập 80/20 bổ sung thêm +72,23 tr (+4,0% biên) trực tiếp vào lãi ròng FramigosX.',
    visualKey: 'waterfall-compact',
  },
  {
    id: 7,
    num: '07',
    shortTitle: 'Stress Test S1–S6',
    pillar: '07 · Kiểm định Rủi ro & Độ nhạy (S1–S6)',
    headline: 'Ngay cả khi tồn kho 25% (S6), dự án vẫn có lãi +188,34 tr và vượt mốc hòa vốn',
    subheadline: 'Kiểm định qua 6 kịch bản mô phỏng và phân tích Tornado cho thấy Sell-through và SRP quyết định 85% biến thiên lợi nhuận.',
    keyMetric: {
      label: 'Hòa vốn toàn dự án',
      value: '787,5 Box (59,7%)',
      tone: 'green',
    },
    arguments: [
      {
        lead: 'Độ phủ an toàn cao ở cả cấp độ Đợt 1 và trọn 3 Đợt',
        body: 'Điểm hòa vốn Đợt 1 là 329,9 / 445 Box (74,1%) và toàn dự án là 787,5 / 1.320 Box (59,7%), tạo vùng đệm lớn trước biến động thị trường.',
        metricTag: 'Đ1 74,1% · 3Đ 59,7%',
      },
      {
        lead: 'Sống sót tốt dưới kịch bản Stress Tồn kho 25% (S6)',
        body: 'Khi chỉ tiêu thụ được 75% sản lượng (990 Box), dự án vẫn ghi nhận lãi ròng +188,34 tr (ROI +37,7%) và Đợt 1 dương nhẹ +3,56 tr.',
        metricTag: 'S6: +188,34 tr',
      },
      {
        lead: 'Biên độ mở rộng hấp dẫn ở kịch bản Tối ưu S4 & Cao cấp S5',
        body: 'Tăng nhẹ giá +5% và tối ưu CK 28% (S4) đẩy lãi lên 606,15 tr (+121,2% ROI); định vị S5 (+20% giá) đạt 762,23 tr (+152,4% ROI).',
        metricTag: 'S4 606tr · S5 762tr',
      },
    ],
    takeaway: 'Sell-through là đòn bẩy nhạy nhất trên biểu đồ Tornado (−307,0 tr nếu rớt về 75%), nên ưu tiên kỷ luật bán hàng hơn ép giá xưởng.',
    visualKey: 'stress-scenarios',
  },
  {
    id: 8,
    num: '08',
    shortTitle: 'Van Quản trị & Lộ trình',
    pillar: '08 · Quy tắc Thực thi & Kiểm soát Rủi ro',
    headline: '3 Van quản trị bắt buộc khóa rủi ro lỗ về 0% trước khi mở lệnh in Đợt 2',
    subheadline: 'Chốt kỷ luật dòng tiền, chính sách giá tối thiểu và điều khoản hợp đồng để hiện thực hóa trọn vẹn kịch bản cơ sở S3.',
    keyMetric: {
      label: 'Van mở lệnh Đợt 2',
      value: '356 / 445 Box (80%)',
      tone: 'gold',
    },
    arguments: [
      {
        lead: 'Quy tắc 01 — Van Sell-through 80% tại Đợt 1',
        body: 'Chỉ giải ngân lệnh in Đợt 2 (174,93 tr EXW) khi Đợt 1 bán vượt 356 / 445 Box (80%), cao hơn mốc hòa vốn 329,9 Box để khóa rủi ro lỗ = 0%.',
        metricTag: 'Gate: 80% Đợt 1',
      },
      {
        lead: 'Quy tắc 02 — Chính sách MAP 60 ngày đầu',
        body: 'Khóa sàn Pre-order tối đa −10% (1.782.000đ) và cấm đại lý niêm yết quảng cáo dưới 1.980.000đ trong 60 ngày đầu để bảo vệ uy tín bộ sưu tập.',
        metricTag: 'MAP 1.980k / 60d',
      },
      {
        lead: 'Quy tắc 03 — Đính kèm Bảng 3.1 vào Phụ lục Hợp đồng GAM',
        body: 'Chuẩn hóa công thức 22 dòng làm cơ sở đối soát Quý, bảo vệ tính hợp lệ của Quỹ Dự phòng 5% và tránh chênh lệch 45,6 tr Royalty.',
        metricTag: 'Đối soát Quý 22 dòng',
      },
    ],
    takeaway: 'Bước tiếp theo: Ký phụ lục Bảng 3.1 với GAM, chốt lịch mở Pre-order −10% và theo dõi mốc 356 Box Đợt 1 làm điều kiện kích hoạt Đợt 2.',
    visualKey: 'stage-gate',
  },
];
