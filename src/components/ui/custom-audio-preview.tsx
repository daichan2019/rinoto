import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export type CustomAudioPreviewProps = {
  selectedPresets: string[];
  isVisible: boolean;
};

export function CustomAudioPreview({ selectedPresets, isVisible }: CustomAudioPreviewProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // プレビュー時間を30秒に制限
  const PREVIEW_DURATION = 30;

  if (!isVisible || selectedPresets.length === 0) {
    return null;
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // ここで実際のオーディオ再生/停止の処理を実装
  };

  const handleTimeChange = (newValue: number[]) => {
    setCurrentTime(newValue[0]);
    // ここで実際のオーディオシーク処理を実装
  };

  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
    // ここで実際のボリューム変更処理を実装
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(0.7); // ミュート解除時に前回のボリュームに戻す
    } else {
      setVolume(0);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 rounded-lg bg-secondary/20 p-4">
      <h3 className="font-medium text-lg">プレビュー (30秒)</h3>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={handlePlayPause} className="h-10 w-10">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex-1 space-y-2">
          <Slider
            value={[currentTime]}
            max={PREVIEW_DURATION}
            step={1}
            onValueChange={handleTimeChange}
            className="w-full"
          />
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(PREVIEW_DURATION)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={cn('h-8 w-8', isMuted && 'text-muted-foreground')}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
        </div>
      </div>

      <div className="text-muted-foreground text-sm">選択中: {selectedPresets.join(', ')}</div>
    </div>
  );
}

export default CustomAudioPreview;
