'use client';
import { AudioCard } from '@/components/audio-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { CustomAudioDurationSetter } from './custom-audio-duration-setter';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleSelect = (name: string) => {
    setSelectedPresets((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // ここでカスタムオーディオ作成のロジックを実装
      // 例: const result = await createCustomAudio({ selectedPresets, duration });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 模擬的な遅延
      setSuccess('カスタムオーディオが正常に作成されました。');
    } catch (err) {
      setError('カスタムオーディオの作成中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
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
      </div>
      {selectedPresets.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-lg">選択されたプリセット:</h3>
          <ul className="list-inside list-disc">
            {selectedPresets.map((preset) => (
              <li key={preset}>{preset}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="mb-4 font-semibold text-xl">オーディオの長さを設定</h3>
        <CustomAudioDurationSetter duration={duration} onDurationChange={handleDurationChange} />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default">
          <AlertTitle>成功</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={selectedPresets.length === 0 || isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            処理中...
          </>
        ) : (
          'カスタムオーディオを作成'
        )}
      </Button>
    </form>
  );
}
