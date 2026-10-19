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
  HIT,
  HIT2,
  JUAN54_MIAO_IN_SI,
  LEAP_SECONDS,
  MIAO_IN_SI,
  MODERN_DAY_SECONDS,
  SFX,
  SHOUSHI_MIAO_PER_DAY,
  SHOTS,
  SUI_SHI_FEN,
  TAI_UTC_1972,
  TAI_UTC_2017,
  TROPICAL_YEAR_DAYS,
  UTC_CONTINUOUS_DATE,
} from '../../src/episodes/ep52-leap-second/timeline';

describe('ep52 闰秒与授时历', () => {
  it('高潮踩在 we-never 第一个重拍（17.45 秒 / 第 524 帧）上，第二个爆点在第 972 帧', () => {
    expect(HIT).toBe(524);
    expect(HIT2).toBe(972);
    expect(Math.abs(HIT - 17.45 * FPS)).toBeLessThanOrEqual(2);
    expect(Math.abs(barSec(8) - 17.45)).toBeLessThan(2 / FPS);
    expect(HIT2).toBe(Math.round(barSec(15) * FPS));
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM).toBe(501);
  });
  it('片长 45 秒 = 1350 帧', () => {
    expect(DURATION).toBe(1350);
    expect(DURATION / FPS).toBe(45);
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
    expect(CUES.some(([bar, zh]) => bar === 18 && zh.includes(ANCHOR))).toBe(true);
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
    expect(COPY.quote52Marked).toContain('【二十四分二十五秒】');
    expect(COPY.quote52Source).toBe('《元史》卷五十二《曆一·歲餘歲差》 · 本卷用的是“秒”');
    expect(COPY.formula).toBe('86,400 ÷ 10,000 = 8.64');
    expect(COPY.formulaParts.join(' ')).toBe('86,400 ÷ 10,000 = 8.64');
    expect(COPY.formulaFoot).toBe('86,400 = 现代 1 日的秒数；10,000 = 授时历 1 日的“秒”数（卷五十二）');
    expect(COPY.dialLabel).toBe('日周 一萬');
    expect(COPY.quote54Day).toBe('日周，一萬。');
    expect(COPY.quote54Year).toBe('歲實，三百六十五萬二千四百二十五分');
    expect(COPY.quote54YearSource).toBe('《元史》卷五十四 · 本卷用的是“分”');
    expect(COPY.suiShiFormula).toBe('3,652,425 ÷ 10,000 = 365.2425 日');
    expect(COPY.parchment).toBe('授時曆');
    expect(COPY.stamp).toBe('同一刻度');
    expect(COPY.ut1Limit).toBe('|UT1−UTC| ≤ 1 小时');
    expect(COPY.closeNote).toBe('来源见置顶评论');
    expect(UTC_CONTINUOUS_DATE).toBe('2027-05-20');
    expect(CALENDAR_READY_YEAR).toBe(1280);
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
    expect(SFX[7][1]).toBe(frBar19Plus20());
    if (!existsSync('public/audio/ep52-leap-second/bgm.wav')) return;
    for (const [file, at] of SFX) {
      expect(existsSync(`public/${file}`)).toBe(true);
      expect(at).toBeLessThan(DURATION);
    }
  });
});

const frBar19Plus20 = () => Math.round((0.36 + 2.136 * 19) * 30) + 20;

describe('we-never 网格常量', () => {
  it('小节长仍是 2.136 秒', () => {
    expect(BAR).toBe(2.136);
  });
});
