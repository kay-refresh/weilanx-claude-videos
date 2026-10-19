import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WanDial} from '../../library/gilded/charts';
import {Dust, Grain} from '../../library/gilded/stage';
import {G, GF, goldText, goldTextLight} from '../../library/gilded/theme';

/**
 * ep52 的 3:4 竖版封面（1080×1440）：万格表盘居中，主字是封面简称，副字写清卷五十二和算式。
 */
export const Ep52CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: G.bg}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 52% at 50% 44%, rgba(120,78,34,0.42) 0%, rgba(120,78,34,0.12) 45%, rgba(0,0,0,0) 78%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8) 100%)'}} />
    <Dust f={90} w={1080} h={1440} n={40} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, letterSpacing: 8, color: G.ivoryDim}}>
      授时历 · <span style={{fontFamily: GF.latinItalic, letterSpacing: 2}}>Shoushi li</span>
    </div>
    <div style={{position: 'absolute', left: 280, right: 280, top: 148, height: 1, background: `linear-gradient(90deg, rgba(214,180,106,0), ${G.gold}, rgba(214,180,106,0))`}} />

    <div style={{position: 'absolute', left: 180, top: 250}}>
      <WanDial id="cover" size={720} major={100} minor={100} p={1} label="日周 一萬" glowAt={0} glow={0.9} />
    </div>

    <div style={{position: 'absolute', left: 48, right: 48, top: 1000, textAlign: 'center', fontFamily: GF.cn, fontWeight: 900, fontSize: 62, lineHeight: 1.28, color: G.ivory, textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>
      元朝的<span style={goldTextLight(0.6)}>“1秒”</span> = <span style={{fontFamily: GF.num, fontSize: 72, ...goldText(1)}}>8.64</span>秒
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1188, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, letterSpacing: 2, color: G.ivoryDim}}>
      《元史》卷五十二 · 86400÷10000
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1348, textAlign: 'center', fontFamily: GF.cn, fontSize: 22, letterSpacing: 3, color: G.ivoryFaint}}>一手出处见置顶评论</div>
    <Grain opacity={0.12} />
  </AbsoluteFill>
);
