'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Music, Pause, Play } from 'lucide-react';
import { useState } from 'react';

type PresetAudio = {
  name: string;
  url: string;
};

type AudioCardProps = PresetAudio & {
  isSelected: boolean;
  onToggleSelect: (name: string) => void;
};

export function AudioCard({ name, url, isSelected, onToggleSelect }: AudioCardProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.getElementById(`audio-${name}`) as HTMLAudioElement;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCardClick = () => {
    onToggleSelect(name);
  };

  return (
    <Card
      className={cn(
        'relative w-full cursor-pointer transition-all duration-200',
        'hover:bg-secondary/20 hover:shadow-lg',
        isSelected && 'bg-secondary/10 ring-2 ring-primary',
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${name}を${isSelected ? '選択解除' : '選択'}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="truncate font-medium text-sm">{name}</CardTitle>
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          {isSelected && <div className="h-2 w-2 rounded-full bg-primary" aria-label="選択済み" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-20 items-center justify-center">
          <Button
            onClick={togglePlay}
            className={cn(
              'rounded-full bg-primary p-3 text-primary-foreground',
              'transition-colors duration-200 hover:bg-primary/90',
            )}
            aria-label={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
        <audio id={`audio-${name}`} src={url} onEnded={() => setIsPlaying(false)}>
          <source src={url} type="audio/mpeg" />
          <track kind="captions" src={url} srcLang="ja" label="日本語" />
          お使いのブラウザは音声の再生に対応していません。
        </audio>
      </CardContent>
    </Card>
  );
}
