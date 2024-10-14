'use client';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type CustomAudioDurationSetterProps = {
  duration: number;
  onDurationChange: (duration: number) => void;
};

export function CustomAudioDurationSetter({ duration, onDurationChange }: CustomAudioDurationSetterProps): JSX.Element {
  const handleSliderChange = (value: number[]) => {
    const newDuration = value[0];
    onDurationChange(newDuration);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="duration-slider">オーディオの長さ: {formatDuration(duration)}</Label>
      <Slider
        id="duration-slider"
        min={60}
        max={3600}
        step={60}
        value={[duration]}
        onValueChange={handleSliderChange}
        className="mt-2"
      />
    </div>
  );
}
