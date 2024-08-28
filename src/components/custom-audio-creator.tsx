'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Pause, Play } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const MAX_DURATION = 3600; // 最大1時間（秒）

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Track = React.memo(({ track, audio, totalDuration, isSelected, onSelect, onResize, onRemove }) => {
  const trackRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      onSelect(track.id);
      const startX = e.clientX;
      const startLeft = track.startTime;

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const newStartTime = Math.max(
          0,
          Math.min(startLeft + (dx / trackRef.current.offsetWidth) * totalDuration, totalDuration - track.duration),
        );
        onResize(track.id, newStartTime, track.duration);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [track, totalDuration, onSelect, onResize],
  );

  const handleResizeStart = useCallback(
    (e, direction) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startDuration = track.duration;
      const startLeft = track.startTime;

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        if (direction === 'left') {
          const newStartTime = Math.max(
            0,
            Math.min(startLeft + (dx / trackRef.current.offsetWidth) * totalDuration, startLeft + startDuration - 1),
          );
          const newDuration = startLeft + startDuration - newStartTime;
          onResize(track.id, newStartTime, newDuration);
        } else {
          const newDuration = Math.max(
            1,
            Math.min(startDuration + (dx / trackRef.current.offsetWidth) * totalDuration, totalDuration - startLeft),
          );
          onResize(track.id, startLeft, newDuration);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [track, totalDuration, onResize],
  );

  return (
    <div
      ref={trackRef}
      className={`absolute h-12 bg-teal-500 rounded-md cursor-move ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
      style={{
        left: `${(track.startTime / totalDuration) * 100}%`,
        width: `${(track.duration / totalDuration) * 100}%`,
        top: '0',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center h-full px-2 text-white text-xs">
        <div
          className="w-3 h-full bg-teal-700 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        ></div>
        <span className="truncate">
          {audio.name} ({formatTime(track.duration)})
        </span>
        <div
          className="w-3 h-full bg-teal-700 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        ></div>
      </div>
      <button
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center"
        onClick={() => onRemove(track.id)}
      >
        ×
      </button>
    </div>
  );
});

const CustomAudioCreator = ({ presetAudios, userId }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const timelineRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  const totalDuration = Math.max(
    1,
    Math.min(
      MAX_DURATION,
      tracks.reduce((max, track) => Math.max(max, track.startTime + track.duration), 0),
    ),
  );

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleDragStart = useCallback((e, audioId) => {
    e.dataTransfer.setData('text/plain', audioId);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const audioId = e.dataTransfer.getData('text');
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const dropPosition = (e.clientX - timelineRect.left) / timelineRect.width;
      const startTime = Math.floor(dropPosition * totalDuration);

      const audio = presetAudios.find((a) => a.id === audioId);
      if (!audio) return;

      const newTrack = {
        id: Date.now(),
        audioId,
        startTime,
        duration: audio.duration,
        volume: 1,
      };

      setTracks((prevTracks) => [...prevTracks, newTrack]);
    },
    [presetAudios, totalDuration],
  );

  const handleTrackResize = useCallback((trackId, newStartTime, newDuration) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.id === trackId ? { ...track, startTime: newStartTime, duration: newDuration } : track,
      ),
    );
  }, []);

  const handleRemoveTrack = useCallback(
    (trackId) => {
      setTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));
      if (selectedTrack === trackId) {
        setSelectedTrack(null);
      }
    },
    [selectedTrack],
  );

  const handleVolumeChange = useCallback((trackId, volume) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => (track.id === trackId ? { ...track, volume: Number(volume) } : track)),
    );
  }, []);

  const playTracks = useCallback(() => {
    if (!audioContextRef.current) return;

    tracks.forEach((track) => {
      const audio = presetAudios.find((a) => a.id === track.audioId);
      if (!audio) return;

      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${audio.path}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContextRef.current.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.loop = true;

          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.value = track.volume;

          source.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);

          const startDelay = track.startTime - currentTime;
          if (startDelay >= 0) {
            source.start(audioContextRef.current.currentTime + startDelay, 0);
            source.stop(audioContextRef.current.currentTime + startDelay + track.duration);
          } else {
            const loopStartTime = -startDelay % audioBuffer.duration;
            source.start(audioContextRef.current.currentTime, loopStartTime);
            source.stop(audioContextRef.current.currentTime + track.duration + startDelay);
          }
        })
        .catch((error) => console.error('Error playing audio:', error));
    });
  }, [tracks, presetAudios, currentTime]);

  const updateCurrentTime = useCallback(() => {
    if (!isPlaying) return;

    setCurrentTime((prevTime) => {
      const newTime = prevTime + 0.1; // Update every 100ms
      if (newTime >= totalDuration) {
        setIsPlaying(false);
        return 0;
      }
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
      return newTime;
    });
  }, [isPlaying, totalDuration]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
    } else {
      setIsPlaying(true);
      setCurrentTime(0); // Reset current time when starting playback
      updateCurrentTime();
      playTracks();
    }
  }, [isPlaying, playTracks, updateCurrentTime]);

  const handleCreateCustomAudio = useCallback(async () => {
    if (!name || tracks.length === 0) {
      toast({
        title: 'エラー',
        description: '名前と少なくとも1つの音源を追加してください。',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/custom-audios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          userId,
          totalDuration,
          tracks,
        }),
      });

      if (!response.ok) {
        throw new Error('カスタム音源の作成に失敗しました。');
      }

      toast({
        title: '成功',
        description: 'カスタム音源が作成されました。',
      });
      setName('');
      setTracks([]);
    } catch (error) {
      console.error('Error creating custom audio:', error);
      toast({
        title: 'エラー',
        description: 'カスタム音源の作成中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  }, [name, userId, totalDuration, tracks, toast]);

  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6">カスタム音源を作成</h3>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="カスタム音源の名前"
        className="mb-6"
      />
      <div className="mb-6">
        <h4 className="font-medium mb-3">プリセット音源:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {presetAudios.map((audio) => (
            <div
              key={audio.id}
              draggable
              onDragStart={(e) => handleDragStart(e, audio.id)}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-md px-3 py-2 cursor-move"
            >
              {audio.name}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-medium mb-3">タイムライン: {formatTime(totalDuration)}</h4>
        <div
          ref={timelineRef}
          className="h-32 bg-white relative rounded-md overflow-hidden shadow-inner"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {tracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              audio={presetAudios.find((a) => a.id === track.audioId)}
              totalDuration={totalDuration}
              isSelected={selectedTrack === track.id}
              onSelect={setSelectedTrack}
              onResize={handleTrackResize}
              onRemove={handleRemoveTrack}
            />
          ))}
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          ></div>
        </div>
      </div>
      {selectedTrack && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">音量:</h4>
          <Slider
            value={[tracks.find((t) => t.id === selectedTrack)?.volume || 1]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => handleVolumeChange(selectedTrack, value)}
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>
        <Button onClick={handlePlayPause} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
      </div>
      <Button
        onClick={handleCreateCustomAudio}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-3 text-lg font-semibold"
      >
        カスタム音源を作成
      </Button>
      <Toaster />
    </div>
  );
};

export default CustomAudioCreator;
