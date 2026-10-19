import React, {useEffect, useState} from 'react';
import {Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';

const probe = async (file: string) => {
  const url = staticFile(file);
  try {
    const head = await fetch(url, {method: 'HEAD'});
    if (head.ok) return true;
  } catch {
    /* some static servers don't answer HEAD */
  }
  try {
    const r = await fetch(url, {method: 'GET', headers: {Range: 'bytes=0-0'}});
    return r.ok || r.status === 206;
  } catch {
    return false;
  }
};

/**
 * 配乐 / 音效文件不在 public/ 时跳过，不让 Studio 预览和渲染失败。
 * we-never.mp3 不随仓库分发：缺文件时画面仍按 HIT=524、HIT2=972 走。
 */
export const EpisodeAudio: React.FC<{bgm: string; room?: string; sfx: readonly (readonly [string, number, number])[]; roomVolume?: number}> = ({bgm, room, sfx, roomVolume = 1.4}) => {
  const files = [bgm, ...(room ? [room] : []), ...sfx.map(([f]) => f)];
  const unique = Array.from(new Set(files));
  const [ok, setOk] = useState<Record<string, boolean> | null>(null);
  const [handle] = useState(() => delayRender('ep52-audio'));
  useEffect(() => {
    let gone = false;
    Promise.all(unique.map(async (f) => [f, await probe(f)] as const)).then((rows) => {
      if (gone) return;
      setOk(Object.fromEntries(rows));
      continueRender(handle);
    });
    return () => {
      gone = true;
    };
  }, [handle, unique.join('|')]);
  if (!ok) return null;
  return (
    <>
      {ok[bgm] ? <Audio src={staticFile(bgm)} /> : null}
      {room && ok[room] ? <Audio src={staticFile(room)} volume={roomVolume} /> : null}
      {sfx.map(([file, at, vol], i) =>
        ok[file] ? (
          <Sequence key={`${file}-${at}-${i}`} from={at} durationInFrames={60}>
            <Audio src={staticFile(file)} volume={vol} />
          </Sequence>
        ) : null,
      )}
    </>
  );
};
