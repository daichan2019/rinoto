'use client';
import { AudioCard } from '@/components/audio-card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CustomAudioDurationSetter } from './custom-audio-duration-setter';
import CustomAudioPreview from './ui/custom-audio-preview';

type PresetAudio = {
  name: string;
  url: string;
};

export type CreateCustomAudioFormProps = {
  presetAudios: PresetAudio[];
};

export function CreateCustomAudioForm({ presetAudios }: CreateCustomAudioFormProps): JSX.Element {
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);

  const handleToggleSelect = (name: string) => {
    setSelectedPresets((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleSubmit = async (_e: React.FormEvent) => {};
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShowPreview(selectedPresets.length > 0);
  }, [selectedPresets]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="mb-4 font-semibold text-xl">プリセットオーディオを選択</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {presetAudios.map((audio) => (
          <AudioCard
            key={audio.name}
            {...audio}
            isSelected={selectedPresets.includes(audio.name)}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-xl">オーディオの長さを設定</h3>
        <CustomAudioDurationSetter duration={duration} onDurationChange={handleDurationChange} />
      </div>
      <CustomAudioPreview selectedPresets={selectedPresets} isVisible={showPreview} />
      <Button type="submit">カスタムオーディオを作成</Button>
    </form>
  );
}
