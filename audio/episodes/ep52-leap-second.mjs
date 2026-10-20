// ep52 闰秒与授时历：配乐来自音乐库 we-never，从第 0 秒开始（片长 60 秒，结尾 2 秒淡出），
// 没有人声，配乐就是主音轨，响度定在 −16 LUFS → public/audio/ep52-leap-second/bgm.wav
// we-never.mp3 不随仓库分发：曲子缺失时写成 60 秒静音占位，时间表 HIT=524，HIT2 在第 21.5 小节。
// 另外生成两个本期专用音效：impact.wav（重拍上的低沉冲击）、room.wav（很轻的纸页 / 室内底噪）
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';

const EP = 'ep52-leap-second';
const DURATION = 60;
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
mkdirSync(dir, {recursive: true});
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);

if (!cutMusic({track: 'we-never', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 2})) {
  ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', String(DURATION), '-c:a', 'pcm_s16le', join(dir, 'bgm.wav')]);
  console.log(`wrote ${EP}/bgm.wav ← silent placeholder (we-never.mp3 不在仓库里，可替换)`);
}

// 低沉冲击：下滑的低频正弦（70→35 Hz）+ 一点褐噪声的「轰」，指数衰减 1.6 秒。不依赖配乐文件。
ff([
  '-f', 'lavfi', '-i', "aevalsrc='0.55*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))|0.55*exp(-3.2*t)*sin(2*PI*(70*t-12*t*t))':s=48000:d=1.6",
  '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.5:d=1.6:r=48000',
  '-filter_complex', '[1]lowpass=f=180,afade=t=out:st=0:d=0.9,volume=0.6,pan=stereo|c0=c0|c1=c0[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.6,volume=0.5[o]',
  '-map', '[o]', join(dir, 'impact.wav'),
]);
ff(['-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.05:d=${DURATION}:r=48000`, '-af', `lowpass=f=900,highpass=f=80,afade=t=in:d=1,afade=t=out:st=${DURATION - 2}:d=2,pan=stereo|c0=c0|c1=c0`, join(dir, 'room.wav')]);
console.log(`wrote ${EP}/impact.wav, room.wav`);
