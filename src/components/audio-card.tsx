'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

  const togglePlay = () => {
    const audio = document.getElementById(`audio-${name}`) as HTMLAudioElement;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSelectToggle = () => {
    onToggleSelect(name);
  };

  return (
    <Card
      className={`relative w-full transition-shadow duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="truncate font-medium text-sm">{name}</CardTitle>
        <Music className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex h-20 items-center justify-center">
          <Button
            onClick={togglePlay}
            className="rounded-full bg-primary p-3 text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
        <audio id={`audio-${name}`} src={url} onEnded={() => setIsPlaying(false)}>
          <source src={url} type="audio/mpeg" />
          <track kind="captions" src={url} srcLang="en" label="English" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
      <div className="absolute right-2 top-2">
        <Checkbox
          id={`select-${name}`}
          checked={isSelected}
          onCheckedChange={handleSelectToggle}
          aria-label={`Select ${name}`}
        />
      </div>
    </Card>
  );
}
