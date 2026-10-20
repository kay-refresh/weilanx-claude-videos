import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BAR,
  barSec,
  CALENDAR_READY_YEAR,
  COPY,
  CUES,
  cueStart,
  DARK_FROM,
  DIAL_TICKS,
  DURATION,
  FPS,
  FORMULA_RESULT_HOLD_SEC,
  HIT,
  HIT2,
  HIT2_BAR,
  JUAN54_MIAO_IN_SI,
  LEAP_SECONDS,
  MIAO_IN_SI,
  MIN_HOLD_SEC,
  MODERN_DAY_SECONDS,
  SFX,
  SHOUSHI_MIAO_PER_DAY,
  SHOTS,
  SUI_SHI_FEN,
  TAI_UTC_1972,
  TAI_UTC_2017,
  TERM,
  TERM2,
  textHolds,
  TROPICAL_YEAR_DAYS,
  UTC_CONTINUOUS_DATE,
  YEAR_LEAP_FROM,
  YEAR_LEAP_TO,
  YEAR_OPEN,
  YEAR_REWIND_FROM,
  YEAR_REWIND_TO,
} from '../../src/episodes/ep52-leap-second/timeline';

/** 繁简不重叠的字：用来核对「引文繁体 / 其余简体」 */
const TRAD_ONLY = /[歲曆萬時實經餘氣]/;
const SIMP_ONLY = /[岁历万时实经余气]/;

describe('ep52 闰秒与授时历', () => {
  it('高潮踩在 we-never 第一个重拍（17.45 秒 / 第 524 帧）上，第二个爆点在第 21.5 小节', () => {
    expect(HIT).toBe(524);
    expect(HIT2).toBe(Math.round(barSec(HIT2_BAR) * FPS));
    expect(HIT2_BAR).toBe(21.5);
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(barSec(8) - 17.45)).toBeLessThan(2 / FPS);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM).toBe(501);
  });
  it('片长 60 秒 = 1800 帧', () => {
    expect(DURATION).toBe(1800);
    expect(DURATION / FPS).toBe(60);
  });
  it('字幕：按小节递增、都在片长内、中文不超过 18 字、都有英文', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, zh, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      expect(zh.replace(/[【】\s]/g, '').length).toBeLessThanOrEqual(18);
      expect(en.length).toBeGreaterThan(0);
    });
  });
  it('锚词：开头埋下、第 18 小节重新定义；重拍前话说一半；最后一句是问题', () => {
    expect(CUES[0][1]).toContain(ANCHOR);
    expect(CUES.some(([bar, zh]) => bar === 25.5 && zh.includes(ANCHOR))).toBe(true);
    const before = CUES.filter(([bar]) => bar < 8).pop()!;
    expect(before[1]).toMatch(/——$/);
    expect(CUES[CUES.length - 1][1]).toMatch(/？$/);
  });
  it('镜头段落首尾相接，爆点是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.hit[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
  });
  it('屏幕文案、原文、算式与分镜一字不差', () => {
    expect(CUES[0][1]).toBe('你以为，【一秒】就是一秒。');
    expect(CUES[0][2]).toBe('You think a second is just a second.');
    expect(CUES[1][1]).toBe('国际计量大会刚决定：不再加闰秒。');
    expect(CUES[4][1]).toBe('可元朝授时历里的“1秒”，等于——');
    expect(CUES[4][2]).toBe('But in the Yuan dynasty\'s calendar, one "second" was —');
    expect(CUES[5][1]).toBe('《元史》：一年365日【24分25秒】。');
    expect(CUES[7][1]).toBe('一天只有【一万】个“秒”。');
    expect(CUES[8][1]).toBe('历经写得更直白：日周，一万。');
    expect(CUES[10][1]).toBe('卷五十二叫它“秒”，卷五十四叫它——');
    expect(COPY.utcLine).toBe('continuous UTC will become effective on 20 May 2027');
    expect(COPY.quote52).toBe('得每歲三百六十五日二十四分二十五秒');
    expect(COPY.quote52Marked).toBe('「得每歲三百六十五日\n【二十四分二十五秒】」');
    expect(COPY.quote52Marked.replace(/[「」【】\n]/g, '')).toBe(COPY.quote52);
    expect(COPY.quote52Source).toBe('《元史》卷五十二《历一·岁余岁差》 · 本卷用的是“秒”');
    expect(COPY.formula).toBe('86,400 ÷ 10,000 = 8.64');
    expect(COPY.formulaParts.join(' ')).toBe('86,400 ÷ 10,000 = 8.64');
    expect(COPY.formulaFoot).toBe('86,400 = 现代 1 日的秒数；10,000 = 授时历 1 日的“秒”数（卷五十二）');
    expect(COPY.dialLabel).toBe('「日周 一萬」');
    expect(COPY.quote54Day).toBe('日周，一萬。');
    expect(COPY.quote54DayMarked).toBe('「日周，【一萬】。」');
    expect(COPY.quote54DayMarked.replace(/[「」【】]/g, '')).toBe(COPY.quote54Day);
    expect(COPY.quote54DaySource).toBe('《元史》卷五十四《授时历经上》');
    expect(COPY.quote54Year).toBe('歲實，三百六十五萬二千四百二十五分');
    expect(COPY.quote54YearMarked).toBe('「歲實，三百六十五萬二千四百二十五分」');
    expect(COPY.quote54YearMarked.replace(/[「」]/g, '')).toBe(COPY.quote54Year);
    expect(COPY.quote54YearSource).toBe('《元史》卷五十四 · 本卷用的是“分”');
    expect(COPY.quoteMark).toBe('《元史》原文');
    expect(COPY.suiShiFormula).toBe('3,652,425 ÷ 10,000 = 365.2425 日');
    expect(COPY.parchment).toBe('授时历');
    expect(COPY.stamp).toBe('同一');
    expect(COPY.stamp).toHaveLength(2);
    expect(COPY.ut1Limit).toBe('|UT1−UTC| ≤ 1 小时');
    expect(COPY.nowFoot).toBe('上限 1 小时，不等于“以后永远不调”');
    expect(COPY.nowLeft).toBe('现在');
    expect(COPY.book52Title).toBe('元史·卷五十二·历一');
    expect(COPY.book52Meta).toBe('明 宋濂等修');
    expect(COPY.book54Title).toBe('元史·卷五十四·历三');
    expect(COPY.book54Meta).toBe('授时历经上 · 步气朔第一');
    expect(COPY.closeNote).toBe('来源见置顶评论');
    expect(UTC_CONTINUOUS_DATE).toBe('2027-05-20');
    expect(CALENDAR_READY_YEAR).toBe(1280);
  });
  it('倒翻从 2026 翻到 1280，第 4 镜先回到 2026', () => {
    expect(YEAR_OPEN).toBe('2026');
    expect(YEAR_LEAP_FROM).toBe('1972');
    expect(YEAR_LEAP_TO).toBe('2017');
    expect(YEAR_REWIND_FROM).toBe('2026');
    expect(YEAR_REWIND_TO).toBe('1280');
    expect(SHOTS.earth[0]).toBeLessThan(SHOTS.rewind[0]);
    expect(COPY.book52Title.indexOf('卷五十二')).toBeLessThan(COPY.book52Title.indexOf('历一'));
    expect(COPY.book54Title.indexOf('卷五十四')).toBeLessThan(COPY.book54Title.indexOf('历三'));
  });
  it('引文繁体加「」；非引文没有繁体，引文没有简体', () => {
    const quotes = [COPY.quote52, COPY.quote52Marked, COPY.quote54Day, COPY.quote54DayMarked, COPY.quote54Year, COPY.quote54YearMarked, COPY.dialLabel];
    for (const q of quotes) {
      expect(q).toMatch(TRAD_ONLY);
      expect(q).not.toMatch(SIMP_ONLY);
    }
    for (const q of [COPY.quote52Marked, COPY.quote54DayMarked, COPY.quote54YearMarked, COPY.dialLabel]) {
      expect(q.startsWith('「')).toBe(true);
      expect(q.endsWith('」')).toBe(true);
    }
    const nonQuotes = [
      ...CUES.map(([, zh]) => zh),
      COPY.utcFoot,
      COPY.leapFoot,
      COPY.hitFoot,
      COPY.quote52Source,
      COPY.base100Foot,
      COPY.formulaFoot,
      COPY.quote54DaySource,
      COPY.quote54YearSource,
      COPY.quoteMark,
      COPY.suiShiFormula,
      COPY.namesFoot,
      COPY.card52,
      COPY.card54,
      COPY.stamp,
      COPY.ut1Limit,
      COPY.nowFoot,
      COPY.closeSources,
      COPY.closeNote,
      COPY.parchment,
      COPY.book52Title,
      COPY.book52Meta,
      COPY.book54Title,
      COPY.book54Meta,
      COPY.nowLeft,
      TERM,
      TERM2,
    ];
    for (const s of nonQuotes) {
      expect(s).not.toMatch(TRAD_ONLY);
    }
  });
  it('数字算对了：8.64、365.2425、27 个闰秒、日周一万', () => {
    expect(MODERN_DAY_SECONDS / SHOUSHI_MIAO_PER_DAY).toBe(8.64);
    expect(MIAO_IN_SI).toBe(8.64);
    expect(SUI_SHI_FEN / SHOUSHI_MIAO_PER_DAY).toBe(365.2425);
    expect(TROPICAL_YEAR_DAYS).toBe(365.2425);
    expect(TAI_UTC_2017 - TAI_UTC_1972).toBe(27);
    expect(LEAP_SECONDS).toBe(27);
    expect(DIAL_TICKS).toBe(10000);
    expect(JUAN54_MIAO_IN_SI).toBeCloseTo(0.0864);
  });
  it('音效卡在分镜帧上；本地已生成音频时文件存在', () => {
    expect(SFX[0][1]).toBe(HIT);
    expect(SFX[4][1]).toBe(HIT2);
    expect(SFX[7][1]).toBe(SHOTS.close[0] + 20);
    if (!existsSync('public/audio/ep52-leap-second/bgm.wav')) return;
    for (const [file, at] of SFX) {
      expect(existsSync(`public/${file}`)).toBe(true);
      expect(at).toBeLessThan(DURATION);
    }
  });
  it('字幕、引文、算式、卡片：入场结束后到退场至少停 1.5 秒，字多按每秒 5 字，公式结果后至少 2.5 秒', () => {
    expect(MIN_HOLD_SEC).toBe(1.5);
    expect(FORMULA_RESULT_HOLD_SEC).toBe(2.5);
    for (const hold of textHolds()) {
      const holdSec = (hold.exit - hold.enter) / FPS;
      expect(hold.exit, hold.id).toBeGreaterThan(hold.enter);
      expect(holdSec, `${hold.id} hold ${holdSec.toFixed(2)}s < ${hold.minSec}s`).toBeGreaterThanOrEqual(hold.minSec - 1 / FPS);
    }
    const result = textHolds().find((h) => h.id === 'formula-result')!;
    expect((result.exit - result.enter) / FPS).toBeGreaterThanOrEqual(FORMULA_RESULT_HOLD_SEC - 1 / FPS);
  });
});

describe('we-never 网格常量', () => {
  it('小节长仍是 2.136 秒', () => {
    expect(BAR).toBe(2.136);
  });
});
