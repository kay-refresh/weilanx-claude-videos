import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut} from '../../library/anim';
import {DotField, WanDial} from '../../library/gilded/charts';
import {RedStamp} from '../../library/gilded/props';
import {GQuote, Smash, Soft} from '../../library/gilded/stage';
import {G, GF, goldText, goldTextLight} from '../../library/gilded/theme';
import {
  BAR,
  COPY,
  DIAL_MAJOR,
  DIAL_MINOR,
  FPS,
  HIT,
  HIT2,
  LEAP_SECONDS,
  SHOTS,
  TAI_UTC_1972,
  TAI_UTC_2017,
  TERM,
  TERM2,
} from './timeline';

/** 段落可见度：a 到 b 之间可见，两头各 fin / fout 帧柔入柔出 */
export const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));

export const CornerNote: React.FC<{f: number; at: number; text: string; out?: number; y?: number; align?: 'left' | 'center' | 'right'}> = ({f, at, text, out, y = 790, align = 'center'}) => {
  const o = clamp01((f - at) / 12) * (out === undefined ? 1 : 1 - clamp01((f - out) / 12));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: y, textAlign: align, fontFamily: GF.cn, fontSize: 28, letterSpacing: 1, lineHeight: 1.4, color: G.ivoryFaint, opacity: o}}>
      {text}
    </div>
  );
};

/** 地球剪影：金线经纬，rot 为旋转角度 */
export const Globe: React.FC<{size: number; rot: number; p: number}> = ({size, rot, p}) => {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{overflow: 'visible', opacity: p}}>
      <circle r={r * 0.92} fill="rgba(8,10,16,0.55)" stroke={G.goldLine} strokeWidth={1.6} pathLength={1} strokeDasharray={`${p} 1`} />
      <g transform={`rotate(${rot})`}>
        {[-0.72, -0.4, 0, 0.4, 0.72].map((k) => (
          <ellipse key={k} rx={r * 0.92 * Math.sqrt(1 - k * k * 0.15)} ry={r * 0.92} fill="none" stroke={G.goldFaint} strokeWidth={1} />
        ))}
        {[-0.55, 0, 0.55].map((k) => (
          <ellipse key={`h${k}`} rx={r * 0.92} ry={r * 0.28 + Math.abs(k) * r * 0.12} cy={k * r * 0.55} fill="none" stroke={G.goldFaint} strokeWidth={1} />
        ))}
      </g>
    </svg>
  );
};

/** 一根「1 日」金条切成 100 分，再把其中 1 分放大切成 100 秒 */
export const Base100: React.FC<{t: number}> = ({t}) => {
  const cut = easeInOut(clamp01((t - 6) / 22));
  const zoom = easeInOut(clamp01((t - 28) / 22));
  const w = 1480;
  const h = 46;
  const secW = w * 0.22;
  return (
    <div style={{position: 'absolute', left: 220, top: 340, width: w}}>
      <div style={{fontFamily: GF.cn, fontSize: 26, color: G.ivoryDim, marginBottom: 18, opacity: clamp01(t / 10)}}>1 日</div>
      <svg width={w} height={h + 8} style={{overflow: 'visible'}}>
        {Array.from({length: 100}, (_, i) => {
          const bw = w / 100;
          const hot = i === 24;
          return <rect key={i} x={i * bw} y={0} width={bw - 1} height={h} fill={hot ? G.goldBright : 'rgba(214,180,106,0.18)'} stroke={G.goldLine} strokeWidth={0.6} opacity={clamp01((t - i * 0.12) / 8) * (1 - 0.35 * zoom)} />;
        })}
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: GF.cn, fontSize: 20, color: G.ivoryFaint, opacity: cut}}>
        <span>100 分</span>
        <span>其中 1 分</span>
      </div>
      <div style={{position: 'absolute', left: (24 / 100) * w - secW * 0.15, top: 110, opacity: zoom, transform: `scale(${0.7 + 0.3 * zoom})`, transformOrigin: '0 0'}}>
        <div style={{fontFamily: GF.cn, fontSize: 22, color: G.gold, marginBottom: 10}}>1 分 = 100 秒</div>
        <svg width={secW} height={28}>
          {Array.from({length: 100}, (_, i) => (
            <rect key={i} x={(i * secW) / 100} y={0} width={secW / 100 - 0.4} height={28} fill="rgba(243,220,160,0.55)" />
          ))}
        </svg>
      </div>
    </div>
  );
};

/** 算式逐项柔入，最后的 8.64 发光 */
export const Formula: React.FC<{t: number}> = ({t}) => {
  const parts = COPY.formulaParts;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 28}}>
        {parts.map((part, i) => {
          const v = clamp01((t - 4 - i * 5) / 8);
          const glow = part === '8.64' ? 1.1 : 0.35;
          return (
            <span key={part} style={{fontFamily: GF.num, fontSize: part === '8.64' ? 140 : 92, opacity: v, filter: `blur(${(1 - v) * 8}px)`, ...(part === '8.64' || part === '86,400' || part === '10,000' ? goldText(glow) : {color: G.ivoryDim})}}>
              {part}
            </span>
          );
        })}
      </div>
      <div style={{fontFamily: GF.cn, fontSize: 28, color: G.ivoryFaint, marginTop: 36, lineHeight: 1.4, opacity: clamp01((t - 28) / 10)}}>{COPY.formulaFoot}</div>
    </div>
  );
};

/** TAI−UTC 从 10 数到 37，下面 27 颗闰秒点逐个点亮 */
export const LeapCounter: React.FC<{t: number}> = ({t}) => {
  const p = clamp01((t - 8) / 70);
  const value = TAI_UTC_1972 + Math.round(LEAP_SECONDS * p);
  return (
    <div>
      <div style={{fontFamily: GF.latin, fontSize: 28, letterSpacing: 4, color: G.ivoryDim, marginBottom: 12}}>TAI−UTC</div>
      <div style={{fontFamily: GF.num, fontSize: 96, lineHeight: 1, ...goldText(0.7)}}>
        {TAI_UTC_1972} → {value} <span style={{fontFamily: GF.cn, fontSize: 36, color: G.ivoryDim}}>秒</span>
      </div>
      <div style={{marginTop: 28}}>
        <DotField cols={LEAP_SECONDS} rows={1} gap={34} r={6} p={p} color={() => G.goldBright} />
      </div>
      <div style={{fontFamily: GF.cn, fontSize: 28, color: G.ivoryFaint, marginTop: 14}}>
        {TAI_UTC_2017} − {TAI_UTC_1972} = {LEAP_SECONDS} 次正闰秒
      </div>
    </div>
  );
};

const Card: React.FC<{title: string; mark: string; delay: number; t: number}> = ({title, mark, delay, t}) => {
  const v = clamp01((t - delay) / 12);
  return (
    <div style={{width: 460, padding: '28px 32px 32px', border: '1px solid rgba(214,180,106,0.45)', background: 'linear-gradient(180deg, rgba(40,30,18,0.75), rgba(14,11,8,0.85))', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', opacity: v, filter: `blur(${(1 - v) * 8}px)`}}>
      <div style={{fontFamily: GF.cn, fontWeight: 700, fontSize: 36, ...goldTextLight(0.4)}}>{title}</div>
      <div style={{fontFamily: GF.cn, fontSize: 72, fontWeight: 900, marginTop: 18, color: mark === '？' ? G.ivoryDim : G.goldBright, textAlign: 'center', letterSpacing: mark === '？' ? 0 : 12, opacity: mark === '？' ? 0.55 + 0.45 * Math.abs(Math.sin(t / 7)) : 1}}>{mark}</div>
    </div>
  );
};

export const NameCards: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.names;
  const t = f - a;
  const smashed = f >= HIT2;
  return (
    <AbsoluteFill style={{opacity: vis(f, a, SHOTS.hit2[1], 12, 16)}}>
      <div style={{position: 'absolute', left: 280, top: 280}}>
        <Card title="卷五十二" mark="秒" delay={0} t={t} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <line x1={760} y1={430} x2={1160} y2={430} stroke={G.goldBright} strokeWidth={2} pathLength={1} strokeDasharray={`${smashed ? 0 : clamp01((t - 10) / 16)} 1`} opacity={smashed ? 0 : 1} style={{filter: `drop-shadow(0 0 6px ${G.gold})`}} />
        <text x={960} y={500} textAnchor="middle" fontFamily={GF.num} fontSize={28} fill={G.gold} opacity={smashed ? 0 : clamp01((t - 14) / 10)}>
          8.64 秒
        </text>
      </svg>
      <div style={{position: 'absolute', right: 280, top: 280, opacity: smashed ? 0.35 : 1}}>
        <Card title="卷五十四" mark={smashed && f > HIT2 + 20 ? '分' : '？'} delay={6} t={t} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, color: G.ivoryFaint, opacity: vis(f, a, b, 16, 8)}}>
        <span style={{marginRight: 180}}>卷五十二</span>
        <span>卷五十四</span>
      </div>
    </AbsoluteFill>
  );
};

/** 开场到重拍前：同一个表盘世界，表盘左移、右侧换内容、年份倒翻、收暗静止 */
export const OpeningWorld: React.FC<{f: number}> = ({f}) => {
  const beat = BAR / 4;
  const idx = Math.floor(f / (beat * FPS));
  const glowAt = (idx % 60) * 6;
  const breathe = 0.75 + 0.25 * Math.abs(Math.sin((f / (beat * FPS)) * Math.PI));
  const pull = easeInOut(clamp01((f - SHOTS.utc[0]) / 18));
  const parchment = easeInOut(clamp01((f - SHOTS.rewind[0]) / 16));
  const size = 640 - 80 * pull;
  const x = 960 - size / 2 - 460 * pull;
  const y = 430 - size / 2 + 20 * pull;
  const earthP = vis(f, SHOTS.earth[0] - 8, SHOTS.earth[1] + 6, 14, 10);
  const lineP = clamp01((f - SHOTS.earth[0]) / 28);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const ga = (glowAt * Math.PI) / 180 - Math.PI / 2;
  const dotX = cx + Math.cos(ga) * size * 0.48;
  const dotY = cy + Math.sin(ga) * size * 0.48;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: cx - 280, top: cy - 280, width: 560, height: 560, opacity: earthP * 0.9, transform: `translate(-80px, 10px)`}}>
        <Globe size={560} rot={f * 0.35} p={earthP} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: earthP}}>
        <path d={`M${dotX} ${dotY} Q${cx - 80} ${cy + 40} ${cx - 180} ${cy + 20}`} fill="none" stroke={G.goldBright} strokeWidth={1.8} pathLength={1} strokeDasharray={`${lineP} 1`} style={{filter: `drop-shadow(0 0 6px ${G.gold})`}} />
      </svg>
      <div style={{position: 'absolute', left: x, top: y, transform: `scale(${1 + 0.02 * clamp01(f / 90)})`, transformOrigin: `${size / 2}px ${size / 2}px`}}>
        <WanDial id="open" size={size} major={12} minor={5} p={1} parchment={parchment > 0.4} glowAt={glowAt} glow={breathe} label={parchment > 0.55 ? COPY.parchment : undefined} />
      </div>
      <Soft f={f} at={SHOTS.utc[0] + 4} out={SHOTS.leap[0] - 4} style={{left: 980, top: 280, width: 820}}>
        <div style={{fontFamily: GF.latinItalic, fontSize: 32, lineHeight: 1.55, color: G.ivoryDim}}>
          {COPY.utcLine.split('20 May 2027').map((seg, i, arr) => (
            <React.Fragment key={i}>
              {seg}
              {i < arr.length - 1 ? <span style={goldTextLight(0.55)}>20 May 2027</span> : null}
            </React.Fragment>
          ))}
        </div>
      </Soft>
      <Soft f={f} at={SHOTS.leap[0] + 6} out={SHOTS.earth[0] - 4} style={{left: 980, top: 250}}>
        <LeapCounter t={f - SHOTS.leap[0]} />
      </Soft>
    </AbsoluteFill>
  );
};

export const Dial54Shot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.dial54;
  const p = 0.12 + 0.88 * easeInOut(clamp01((f - a) / 48));
  return (
    <AbsoluteFill style={{opacity: vis(f, a - 10, b, 10, 12)}}>
      <div style={{position: 'absolute', left: 220, top: 170}}>
        <WanDial id="day10k" size={700} major={DIAL_MAJOR} minor={DIAL_MINOR} p={p} label={p > 0.55 ? COPY.dialLabel : undefined} />
      </div>
      <GQuote f={f} at={a + 10} text="日周，【一萬】。" source="《元史》卷五十四《授時曆經上》" x={1180} y={300} w={640} align="left" out={b - 4} sourceSize={28} />
    </AbsoluteFill>
  );
};

export const FenQuoteShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.fenQuote;
  const t = f - a;
  const draw = clamp01((t - 8) / 20);
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b, 12, 12)}}>
      <div style={{position: 'absolute', left: 80, top: 180, opacity: 0.7}}>
        <WanDial id="fen-dial" size={520} major={DIAL_MAJOR} minor={DIAL_MINOR} p={1} spin={t * 0.08} label={COPY.dialLabel} />
      </div>
      <GQuote f={f} at={a} original={undefined} text={COPY.quote54Year} source={COPY.quote54YearSource} x={1180} y={250} w={700} align="left" out={b - 4} sourceSize={28} />
      <div style={{position: 'absolute', left: 860, top: 620, fontFamily: GF.num, fontSize: 42, opacity: draw, ...goldText(0.45)}}>{COPY.suiShiFormula}</div>
    </AbsoluteFill>
  );
};

export const NowShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.now;
  const t = f - a;
  const line = clamp01((t - 8) / 28);
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b, 12, 12)}}>
      <div style={{position: 'absolute', left: 200, top: 200}}>
        <WanDial id="now" size={560} major={12} minor={5} p={1} glowAt={0} glow={0.8 + 0.2 * Math.sin(f / 9)} />
      </div>
      <div style={{position: 'absolute', left: 860, top: 280, opacity: clamp01(t / 12)}}>
        <div style={{fontFamily: GF.num, fontSize: 64, ...goldText(0.6)}}>{COPY.ut1Limit}</div>
        <svg width={780} height={110} style={{marginTop: 36, overflow: 'visible'}}>
          <line x1={24} y1={36} x2={736} y2={36} stroke={G.goldLine} strokeWidth={2.4} pathLength={1} strokeDasharray={`${line} 1`} />
          <polygon points="736,36 714,26 714,46" fill={G.gold} opacity={line} />
          <circle cx={24} cy={36} r={6} fill={G.gold} opacity={line} />
          <circle cx={700} cy={36} r={8} fill={G.goldBright} opacity={line} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
          <text x={24} y={82} textAnchor="middle" fontFamily={GF.cn} fontSize={28} fill={G.ivoryDim} opacity={line}>
            {COPY.nowLeft}
          </text>
          <text x={700} y={82} textAnchor="middle" fontFamily={GF.num} fontSize={28} fill={G.gold} opacity={line}>
            2027-05-20
          </text>
        </svg>
        <div style={{fontFamily: GF.cn, fontSize: 28, color: G.ivoryFaint, marginTop: 10, lineHeight: 1.4, maxWidth: 760, opacity: clamp01((t - 20) / 12)}}>{COPY.nowFoot}</div>
      </div>
    </AbsoluteFill>
  );
};

export const BridgeShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.bridge;
  const t = f - a;
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b, 12, 12)}}>
      <div style={{position: 'absolute', left: 180, top: 210}}>
        <WanDial id="old" size={520} major={DIAL_MAJOR} minor={DIAL_MINOR} p={1} spin={t * 0.12} label={COPY.dialLabel} />
      </div>
      <div style={{position: 'absolute', right: 180, top: 210}}>
        <WanDial id="new" size={520} major={12} minor={5} p={1} spin={-t * 0.16} glowAt={0} glow={0.7} cool={1} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path
          d={`M700 470 C 860 ${470 - 40 * Math.sin(t / 8)}, 1060 ${470 + 40 * Math.sin(t / 8)}, 1220 470`}
          fill="none"
          stroke={G.goldBright}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={`${clamp01(t / 16)} 1`}
          style={{filter: `drop-shadow(0 0 8px ${G.gold})`}}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const RedefineShot: React.FC<{f: number}> = ({f}) => {
  const [a, b] = SHOTS.redefine;
  const t = f - a;
  const shrink = easeInOut(clamp01(t / 36));
  const s = 1 - 0.92 * shrink;
  return (
    <AbsoluteFill style={{opacity: vis(f, a, b + 20, 10, 20)}}>
      <div style={{position: 'absolute', left: 960 - 260, top: 430 - 260, transform: `scale(${s})`, transformOrigin: '260px 260px', opacity: 1 - shrink}}>
        <WanDial id="merge-l" size={280} major={DIAL_MAJOR} minor={DIAL_MINOR} p={1} spin={-t * 0.4} />
      </div>
      <div style={{position: 'absolute', left: 960 - 20, top: 430 - 260, transform: `scale(${s})`, transformOrigin: '20px 260px', opacity: 1 - shrink}}>
        <WanDial id="merge-r" size={280} major={12} minor={5} p={1} spin={t * 0.4} cool={0.7} />
      </div>
      <div style={{position: 'absolute', left: 960 - 200, top: 430 - 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,220,160,0.32) 0%, rgba(243,220,160,0.06) 45%, rgba(0,0,0,0) 70%)', opacity: shrink * (0.85 + 0.15 * Math.sin(f / 9))}} />
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: shrink}}>
        <circle cx={960} cy={430} r={14} fill={G.goldBright} style={{filter: `drop-shadow(0 0 12px ${G.goldBright})`}} />
      </svg>
    </AbsoluteFill>
  );
};

export const CloseShot: React.FC<{f: number}> = ({f}) => {
  const [a] = SHOTS.close;
  const t = f - a;
  return (
    <AbsoluteFill style={{opacity: clamp01(t / 16)}}>
      <div style={{position: 'absolute', left: 960 - 200, top: 360 - 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,220,160,0.3) 0%, rgba(243,220,160,0.06) 45%, rgba(0,0,0,0) 70%)', opacity: 0.85 + 0.15 * Math.sin(f / 9)}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={960} cy={360} r={16} fill={G.goldBright} style={{filter: `drop-shadow(0 0 14px ${G.goldBright})`}} />
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 790, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, color: G.ivoryFaint, lineHeight: 1.4, opacity: clamp01((t - 20) / 14)}}>{COPY.closeSources}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, color: G.ivoryDim, opacity: clamp01((t - 36) / 12)}}>{COPY.closeNote}</div>
    </AbsoluteFill>
  );
};

export const HitLayer: React.FC<{f: number}> = ({f}) => {
  const [, hb] = SHOTS.hit;
  if (f < HIT || f >= hb) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - clamp01((f - (hb - 14)) / 14)}}>
      <Smash f={f} at={HIT} text="8.64" size={260} latin sub={TERM} y={450} />
      <CornerNote f={f} at={HIT + 8} text={COPY.hitFoot} out={hb - 8} y={790} />
    </AbsoluteFill>
  );
};

export const Hit2Layer: React.FC<{f: number}> = ({f}) => {
  if (f < HIT2 || f >= SHOTS.hit2[1] + 8) return null;
  return (
    <AbsoluteFill>
      <Smash f={f} at={HIT2} text="分" size={200} flash={0.6} ring={900} sub={TERM2} y={470} />
      <div style={{position: 'absolute', left: 905, top: 560}}>
        <RedStamp f={f} at={HIT2 + 18} text={COPY.stamp} size={110} rot={-8} />
      </div>
    </AbsoluteFill>
  );
};
