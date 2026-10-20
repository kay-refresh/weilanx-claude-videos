/**
 * ep52 闰秒与授时历：60 秒、无口播，画面 + 双语字幕 + 配乐（音乐库 we-never，从第 0 秒开始）。
 * 叙事按「锚词」方法组织：锚词「一秒」——开头是习以为常，第 17.45 秒随音乐重拍砸出换算 8.64，
 * 第 21.5 小节第二个小爆点砸出「分」，结尾把「一秒」重新定义成人和天商量出来的尺度。
 * 所有时间都挂在音乐的小节线上（可半小节）；场景组件和测试共用这一份。
 * 本文件不 import 别的 .ts / .tsx。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** we-never 实测：112 BPM，一小节 2.136 秒，第一条小节线在 0.36 秒（音乐起音），第 8 小节是第一个「换气 + 重拍」 */
export const BAR = 2.136;
export const BAR0 = 0.36;
export const barSec = (k: number) => BAR0 + BAR * k;
export const fr = (sec: number) => Math.round(sec * FPS);

/** 第一个重拍（8.64 砸出来）钉在 we-never 第 8 小节 / 17.45 秒；第二个小爆点「分」后移到第 21.5 小节 */
export const HIT = fr(17.45);
export const HIT2_BAR = 21.5;
export const HIT2 = fr(barSec(HIT2_BAR));
/** 重拍前收暗：16.70 秒起压暗，HIT 前 3 帧完全静止 */
export const DARK_FROM = fr(16.7);
export const FREEZE = 3;

/** 60 秒上限；镜头边界仍落在小节 / 半小节上 */
export const DURATION = fr(60);

/** 入场时长（帧）：场景组件和停留测试共用，避免各写各的 */
export const ANIM = {
  captionPerChar: 0.5,
  captionFade: 10,
  quoteAtOffset: -40,
  quoteBodyDelay: 14,
  quoteBodyDur: 26,
  formulaResult: 32,
  formulaFoot: 38,
  cornerIn: 12,
  smashSub: 32,
  cardsIn: 18,
  nowLine: 20,
  nowFoot: 16,
  closeSources: 12,
  closeNote: 16,
} as const;

export const MIN_HOLD_SEC = 1.5;
export const HAN_PER_SEC = 5;
export const FORMULA_RESULT_HOLD_SEC = 2.5;

export const ANCHOR = '一秒';
export const TERM = '现代秒 · 授时历里的 1“秒”';
export const TERM2 = '同一个 8.64 秒 · 两种叫法';

/**
 * 换算口径（卷五十二的百进制写法）：现代 1 日 = 86,400 SI 秒，授时历 1 日 = 10,000「秒」，
 * 所以那里的 1「秒」= 8.64 现代秒。卷五十四历经里同一份长度叫「分」；历经的「秒」是「分」的 1/100。
 */
export const MODERN_DAY_SECONDS = 86400;
export const SHOUSHI_MIAO_PER_DAY = 10000;
export const MIAO_IN_SI = MODERN_DAY_SECONDS / SHOUSHI_MIAO_PER_DAY;
export const SUI_SHI_FEN = 3652425;
export const TROPICAL_YEAR_DAYS = SUI_SHI_FEN / SHOUSHI_MIAO_PER_DAY;
export const TAI_UTC_1972 = 10;
export const TAI_UTC_2017 = 37;
export const LEAP_SECONDS = TAI_UTC_2017 - TAI_UTC_1972;
export const JUAN54_MIAO_IN_SI = MIAO_IN_SI / 100;
export const DIAL_MAJOR = 100;
export const DIAL_MINOR = 100;
export const DIAL_TICKS = DIAL_MAJOR * DIAL_MINOR;
export const CALENDAR_READY_YEAR = 1280;
export const UTC_CONTINUOUS_DATE = '2027-05-20';
export const CGPM_PASSED = '2026-10-15';

/** 屏幕上必须一字不差出现的原文 / 算式 / 角标（测试会核对） */
export const COPY = {
  utcLine: 'continuous UTC will become effective on 20 May 2027',
  utcFoot: '生效日 2027-05-20，不是马上生效',
  leapFoot: '负闰秒从未用过（BIPM 第 5 号决议原文）',
  hitFoot: '按 1 日 = 86,400 现代秒换算',
  quote52: '得每歲三百六十五日二十四分二十五秒',
  quote52Marked: '「得每歲三百六十五日\n【二十四分二十五秒】」',
  quote52Source: '《元史》卷五十二《历一·岁余岁差》 · 本卷用的是“秒”',
  base100Foot: '进位关系据卷五十二、五十四数值互证换算，原文未直接写“一日百分”',
  formula: '86,400 ÷ 10,000 = 8.64',
  formulaParts: ['86,400', '÷', '10,000', '=', '8.64'] as const,
  formulaFoot: '86,400 = 现代 1 日的秒数；10,000 = 授时历 1 日的“秒”数（卷五十二）',
  dialLabel: '「日周 一萬」',
  quote54Day: '日周，一萬。',
  quote54DayMarked: '「日周，【一萬】。」',
  quote54DaySource: '《元史》卷五十四《授时历经上》',
  quote54Year: '歲實，三百六十五萬二千四百二十五分',
  quote54YearMarked: '「歲實，三百六十五萬二千四百二十五分」',
  quote54YearSource: '《元史》卷五十四 · 本卷用的是“分”',
  quoteMark: '《元史》原文',
  suiShiFormula: '3,652,425 ÷ 10,000 = 365.2425 日',
  namesFoot: '卷五十四里的“秒”是“分”的 1/100（约 0.0864 现代秒），不是同一个单位',
  card52: '卷五十二 · 秒',
  card54: '卷五十四 · ？',
  stamp: '同一',
  ut1Limit: '|UT1−UTC| ≤ 1 小时',
  nowFoot: '上限 1 小时，不等于“以后永远不调”',
  closeSources: 'BIPM CGPM 2026 Res.5 · IERS Bulletin C · 《元史》卷五十二/五十四/一百六十四',
  closeNote: '来源见置顶评论',
  parchment: '授时历',
  book52Title: '元史·卷五十二·历一',
  book52Meta: '明 宋濂等修',
  book54Title: '元史·卷五十四·历三',
  book54Meta: '授时历经上 · 步气朔第一',
  nowLeft: '现在',
} as const;

/** 年份抬头：第 3 镜 1972→2017，第 4 镜先回到 2026，第 5 镜再从 2026 倒翻到 1280 */
export const YEAR_OPEN = '2026';
export const YEAR_LEAP_FROM = '1972';
export const YEAR_LEAP_TO = '2017';
export const YEAR_REWIND_FROM = '2026';
export const YEAR_REWIND_TO = '1280';

/** 字幕：[小节号, 中文, 英文]。【】里的词变金色；中文不超过 18 字。第 8、21.5 小节是爆点，不配字幕。 */
export const CUES: [number, string, string][] = [
  [0, '你以为，【一秒】就是一秒。', 'You think a second is just a second.'],
  [2, '国际计量大会刚决定：不再加闰秒。', 'The world just voted to stop adding leap seconds.'],
  [4, '1972年起，共插入27个闰秒。', 'Since 1972, clocks have gained 27 leap seconds.'],
  [6, '只为跟上地球的自转。', 'All to keep pace with a spinning Earth.'],
  [7, '可元朝授时历里的“1秒”，等于——', 'But in the Yuan dynasty\'s calendar, one "second" was —'],
  [9.5, '《元史》：一年365日【24分25秒】。', 'The Yuan History: a year is 365 days, 24 fen, 25 miao.'],
  [12, '百进制：1日100分，1分100秒。', 'Base one hundred: 100 fen a day, 100 miao a fen.'],
  [13.5, '一天只有【一万】个“秒”。', 'A day held only ten thousand "seconds".'],
  [16.5, '历经写得更直白：日周，一万。', 'The calendar canon says it plainly: one day, ten thousand.'],
  [18, '这里的“分”，同样是8.64秒。', 'Here the same slice is called a "fen".'],
  [20, '卷五十二叫它“秒”，卷五十四叫它——', 'Juan 52 calls it a "second"; juan 54 calls it —'],
  [23, '2027年5月20日起，钟不再跳秒。', 'From 20 May 2027, clocks stop leaping.'],
  [24.5, '古人追着天改历；今人先让钟走稳。', 'The ancients chased the sky; we chose a steady clock.'],
  [25.5, '【一秒】多长，是人跟天商量出来的。', "How long a second is — that's a deal between us and the sky."],
  [26.5, '要是让你重新定义一秒，你会怎么定？', 'If you could redefine a second, how would you?'],
];
export const cueStart = (i: number) => fr(barSec(CUES[i][0]));
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);

/** 场景（同一个金线表盘世界里的镜头段落），见 Ep52Second.tsx。区间左闭右开，边界落在小节 / 半小节。 */
export const SHOTS = {
  tick: [0, fr(barSec(2))],
  utc: [fr(barSec(2)), fr(barSec(4))],
  leap: [fr(barSec(4)), fr(barSec(6))],
  earth: [fr(barSec(6)), fr(barSec(7))],
  rewind: [fr(barSec(7)), HIT],
  hit: [HIT, fr(barSec(9.5))],
  quote52: [fr(barSec(9.5)), fr(barSec(12))],
  base100: [fr(barSec(12)), fr(barSec(13.5))],
  formula: [fr(barSec(13.5)), fr(barSec(16.5))],
  dial54: [fr(barSec(16.5)), fr(barSec(18))],
  fenQuote: [fr(barSec(18)), fr(barSec(20))],
  names: [fr(barSec(20)), HIT2],
  hit2: [HIT2, fr(barSec(23))],
  now: [fr(barSec(23)), fr(barSec(24.5))],
  bridge: [fr(barSec(24.5)), fr(barSec(25.5))],
  redefine: [fr(barSec(25.5)), fr(barSec(26.5))],
  close: [fr(barSec(26.5)), DURATION],
} as const;

/** 音效：[文件, 帧, 音量]。impact 是重拍上的低沉冲击（audio/episodes/ep52-*.mjs 生成），其余用共享音效 */
export const SFX: [string, number, number][] = [
  ['audio/ep52-leap-second/impact.wav', HIT, 0.9],
  ['audio/sfx/paper.wav', SHOTS.quote52[0], 0.25],
  ['audio/sfx/ding.wav', SHOTS.formula[0], 0.2],
  ['audio/sfx/whoosh.wav', SHOTS.dial54[0], 0.18],
  ['audio/ep52-leap-second/impact.wav', HIT2, 0.55],
  ['audio/sfx/paper.wav', SHOTS.now[0], 0.22],
  ['audio/sfx/magic.wav', SHOTS.redefine[0], 0.2],
  ['audio/sfx/ding.wav', SHOTS.close[0] + 20, 0.22],
];

/** 中文阅读字数：汉字 + 中文标点（不含拉丁字母和 ASCII 数字） */
export const readableChars = (s: string) => [...s].filter((c) => /[\u4e00-\u9fff\u3001-\u303f\uff00-\uffef]/.test(c)).length;

export const needHoldSec = (s: string) => Math.max(MIN_HOLD_SEC, readableChars(s) / HAN_PER_SEC);

/** 倒翻那句提前入场，才能在收暗前停够 1.5 秒 */
export const captionAt = (i: number) => {
  const at = cueStart(i);
  if (at >= SHOTS.rewind[0] && at < HIT) return at - 24;
  return at;
};

export const captionOut = (i: number) => {
  const at = cueStart(i);
  if (at >= SHOTS.rewind[0] && at < HIT) return DARK_FROM;
  if (at >= SHOTS.names[0] && at < HIT2) return HIT2 - 8;
  return cueEnd(i);
};

export type TextHold = {id: string; enter: number; exit: number; chars: number; minSec: number};

/**
 * 每个字幕 / 引文 / 算式 / 卡片的入场结束帧、退场开始帧。
 * 引文按正文（多行合算）计阅读时间；算式按脚注中文计；卡片两张合算；字幕保底 1.5 秒。
 */
export const textHolds = (): TextHold[] => {
  const holds: TextHold[] = [];
  const capEnter = (at: number, zh: string) => at + readableChars(zh) * ANIM.captionPerChar + ANIM.captionFade;
  CUES.forEach(([, zh], i) => {
    holds.push({id: `caption-${i}`, enter: capEnter(captionAt(i), zh), exit: captionOut(i), chars: readableChars(zh), minSec: MIN_HOLD_SEC});
  });
  const qIn = (shot0: number) => shot0 + ANIM.quoteAtOffset + ANIM.quoteBodyDelay + ANIM.quoteBodyDur;
  const qOut = (shot1: number) => shot1 - 12;
  holds.push({id: 'quote52', enter: qIn(SHOTS.quote52[0]), exit: qOut(SHOTS.quote52[1]), chars: readableChars(COPY.quote52), minSec: needHoldSec(COPY.quote52)});
  holds.push({id: 'quote54day', enter: qIn(SHOTS.dial54[0]), exit: qOut(SHOTS.dial54[1]), chars: readableChars(COPY.quote54Day), minSec: needHoldSec(COPY.quote54Day)});
  holds.push({id: 'quote54year', enter: qIn(SHOTS.fenQuote[0]), exit: qOut(SHOTS.fenQuote[1]), chars: readableChars(COPY.quote54Year), minSec: needHoldSec(COPY.quote54Year)});
  const formulaChars = COPY.formula + COPY.formulaFoot;
  holds.push({id: 'formula', enter: SHOTS.formula[0] + ANIM.formulaFoot, exit: SHOTS.formula[1] - 12, chars: readableChars(formulaChars), minSec: needHoldSec(COPY.formulaFoot)});
  holds.push({id: 'formula-result', enter: SHOTS.formula[0] + ANIM.formulaResult, exit: SHOTS.formula[1] - 12, chars: 0, minSec: FORMULA_RESULT_HOLD_SEC});
  const cards = COPY.card52 + COPY.card54;
  holds.push({id: 'cards', enter: SHOTS.names[0] + ANIM.cardsIn, exit: HIT2 - 8, chars: readableChars(cards), minSec: needHoldSec(cards)});
  holds.push({id: 'smash-term', enter: HIT + ANIM.smashSub, exit: SHOTS.hit[1] - 14, chars: readableChars(TERM), minSec: MIN_HOLD_SEC});
  holds.push({id: 'smash-term2', enter: HIT2 + ANIM.smashSub, exit: SHOTS.hit2[1] - 8, chars: readableChars(TERM2), minSec: MIN_HOLD_SEC});
  holds.push({id: 'utc-foot', enter: SHOTS.utc[0] + 10 + ANIM.cornerIn, exit: SHOTS.leap[0] - 6, chars: readableChars(COPY.utcFoot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'leap-foot', enter: SHOTS.earth[0] + 6 + ANIM.cornerIn, exit: SHOTS.rewind[0], chars: readableChars(COPY.leapFoot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'base100-foot', enter: SHOTS.base100[0] + 8 + ANIM.cornerIn, exit: SHOTS.formula[0] - 4, chars: readableChars(COPY.base100Foot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'names-foot', enter: SHOTS.names[0] + 8 + ANIM.cornerIn, exit: HIT2 - 12, chars: readableChars(COPY.namesFoot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'hit-foot', enter: HIT + 8 + ANIM.cornerIn, exit: SHOTS.hit[1] - 8, chars: readableChars(COPY.hitFoot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'now-limit', enter: SHOTS.now[0] + 12, exit: SHOTS.now[1] - 12, chars: readableChars(COPY.ut1Limit), minSec: MIN_HOLD_SEC});
  holds.push({id: 'now-foot', enter: SHOTS.now[0] + ANIM.nowFoot, exit: SHOTS.now[1] - 12, chars: readableChars(COPY.nowFoot), minSec: MIN_HOLD_SEC});
  holds.push({id: 'close-sources', enter: SHOTS.close[0] + ANIM.closeSources, exit: DURATION - 20, chars: readableChars(COPY.closeSources), minSec: MIN_HOLD_SEC});
  holds.push({id: 'close-note', enter: SHOTS.close[0] + ANIM.closeNote, exit: DURATION - 20, chars: readableChars(COPY.closeNote), minSec: MIN_HOLD_SEC});
  return holds;
};
