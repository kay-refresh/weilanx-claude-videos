import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {BookCite, Dust, GCaption, GildedBg, Grain, GQuote, YearHeader} from '../../library/gilded/stage';
import {G} from '../../library/gilded/theme';
import {EpisodeAudio} from './audio';
import {
  Base100,
  BridgeShot,
  CloseShot,
  CornerNote,
  Dial54Shot,
  FenQuoteShot,
  Formula,
  Hit2Layer,
  HitLayer,
  NameCards,
  NowShot,
  OpeningWorld,
  RedefineShot,
  vis,
} from './scenes';
import {COPY, CUES, cueEnd, cueStart, DARK_FROM, DURATION, FREEZE, HIT, HIT2, SFX, SHOTS} from './timeline';

/**
 * ep52 闰秒与授时历（无口播）：锚词「一秒」。
 * 0–17.4 秒一个连续长镜头：发光秒点 → 决议原文 → 27 个闰秒 → 地球自转 → 年份倒翻回 1280；
 * 17.45 秒随重拍砸出 8.64；之后原文、百进制、算式、日周一万、两种叫法、2027 新规则、两盘合成一秒，抛问题。
 */
export const Ep52Second: React.FC = () => {
  const f = useCurrentFrame();
  const fc = Math.min(f, HIT - FREEZE);
  const dark = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const cool = clamp01((f - SHOTS.bridge[0]) / 20);
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <EpisodeAudio bgm="audio/ep52-leap-second/bgm.wav" room="audio/ep52-leap-second/room.wav" sfx={SFX} />

      <GildedBg f={f} tone={cool > 0.5 ? 'cool' : 'warm'} glow={[50, 44]} />
      <Dust f={f} />

      {f < HIT ? <OpeningWorld f={fc} /> : null}
      <HitLayer f={f} />

      {f >= SHOTS.quote52[0] - 12 && f < SHOTS.quote52[1] + 8 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.quote52[0] - 12, SHOTS.quote52[1], 12, 10)}}>
          <GQuote f={f} at={SHOTS.quote52[0] - 18} text={COPY.quote52Marked} source={COPY.quote52Source} y={300} />
        </AbsoluteFill>
      ) : null}

      {f >= SHOTS.base100[0] - 10 && f < SHOTS.base100[1] + 8 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.base100[0] - 10, SHOTS.base100[1], 10, 10)}}>
          <Base100 t={f - SHOTS.base100[0]} />
        </AbsoluteFill>
      ) : null}

      {f >= SHOTS.formula[0] - 10 && f < SHOTS.formula[1] + 10 ? (
        <AbsoluteFill style={{opacity: vis(f, SHOTS.formula[0] - 10, SHOTS.formula[1] + 10, 10, 10)}}>
          <Formula t={f - SHOTS.formula[0]} />
        </AbsoluteFill>
      ) : null}

      {f >= SHOTS.dial54[0] - 8 && f < SHOTS.dial54[1] + 10 ? <Dial54Shot f={f} /> : null}
      {f >= SHOTS.fenQuote[0] - 8 && f < SHOTS.fenQuote[1] + 8 ? <FenQuoteShot f={f} /> : null}
      {f >= SHOTS.names[0] - 8 && f < SHOTS.hit2[1] + 8 ? <NameCards f={f} /> : null}
      <Hit2Layer f={f} />
      {f >= SHOTS.now[0] - 8 && f < SHOTS.now[1] + 8 ? <NowShot f={f} /> : null}
      {f >= SHOTS.bridge[0] - 8 && f < SHOTS.bridge[1] + 8 ? <BridgeShot f={f} /> : null}
      {f >= SHOTS.redefine[0] - 8 && f < SHOTS.redefine[1] + 16 ? <RedefineShot f={f} /> : null}
      {f >= SHOTS.close[0] - 8 ? <CloseShot f={f} /> : null}

      <YearHeader f={f} at={11} year="2026" caption="凡尔赛 · 国际计量大会" out={SHOTS.leap[0] - 4} />
      <YearHeader f={f} at={SHOTS.leap[0]} year="2017" prev="1972" rollAt={SHOTS.leap[0] + 8} caption="IERS · 闰秒表" out={SHOTS.rewind[0] - 4} />
      <YearHeader f={f} at={SHOTS.rewind[0]} year="1280" prev="2026" rollAt={SHOTS.rewind[0] + 3} caption="大都 · 至元十七年" out={HIT} />

      <BookCite f={f} at={11} original="Resolution 5 (2026), CGPM" title="国际计量大会第5号决议" meta="BIPM · 2026-10-15 通过" seal="决议" out={260} />
      <BookCite f={f} at={SHOTS.leap[0]} original="IERS Bulletin C · Leap_Second.dat" title="闰秒表" meta="IERS · 更新至第 72 期公报（2026-07）" seal="公报" out={455} />
      <BookCite f={f} at={SHOTS.rewind[0]} original="Yuan Shi, juan 52" title="元史·曆一" meta="卷五十二 · 明 宋濂等修" seal="正史" out={776} />
      <BookCite f={f} at={SHOTS.dial54[0]} original="Yuan Shi, juan 54" title="元史·曆三·授時曆經上" meta="卷五十四 · 步氣朔第一" seal="历经" out={968} />
      <BookCite f={f} at={SHOTS.now[0]} original="Resolution 5 (2026)" title="国际计量大会第5号决议" meta="BIPM · 上限 1 小时" seal="决议" out={SHOTS.now[1] - 4} />

      <CornerNote f={f} at={SHOTS.utc[0] + 10} text={COPY.utcFoot} out={SHOTS.leap[0] - 6} />
      <CornerNote f={f} at={SHOTS.earth[0] + 6} text={COPY.leapFoot} out={SHOTS.rewind[0] - 4} />
      <CornerNote f={f} at={SHOTS.base100[0] + 8} text={COPY.base100Foot} out={SHOTS.formula[0] - 4} />
      <CornerNote f={f} at={SHOTS.names[0] + 8} text={COPY.namesFoot} out={HIT2 - 12} />
      <CornerNote f={f} at={SHOTS.now[0] + 18} text={COPY.nowFoot} out={SHOTS.now[1] - 4} />

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />

      {CUES.map(([, zh, en], i) => {
        const at = cueStart(i);
        const bar = CUES[i][0];
        const out = bar === 7 ? DARK_FROM : bar === 14 ? HIT2 - 12 : cueEnd(i) - 12;
        if (f < at - 2 || f > out + 14) return null;
        return <GCaption key={i} f={f} at={at} out={out} text={zh} en={en} y={950} size={40} perChar={1} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 45)) / 45), pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};
