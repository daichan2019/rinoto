'use client';
import { CustomAudioDurationSetter } from '@/components/custom-audio-duration-setter';
import { useState } from 'react';

export function CustomAudioCreator(): JSX.Element {
  const [duration, setDuration] = useState(60);

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    // ここで必要な処理を行う（例：APIリクエスト、状態の更新など）
  };

  return (
    <div className="mb-8 rounded-lg bg-gray-100 p-4">
      <h2 className="mb-4 font-semibold text-xl">カスタムオーディオの作成</h2>
      <CustomAudioDurationSetter duration={duration} onDurationChange={handleDurationChange} />
      {/* ここに追加のカスタムオーディオ作成UI要素を追加 */}
    </div>
  );
}
