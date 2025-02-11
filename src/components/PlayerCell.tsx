/// <reference types="vite-plugin-svgr/client" />

import { FC, useState, useEffect, useRef, Fragment, MouseEvent } from 'react';
import styled from 'styled-components';
import PlayIcon from '@icons/play.svg?react';
import PauseIcon from '@icons/pause.svg?react';
import DownloadIcon from '@icons/download.svg?react';
import CloseIcon from '@icons/close.svg?react';

import { getCallRecording } from '../api.ts';
import { ICall } from '../types.ts';
import { getFormattedDuration } from '../utils';
import { IconButton } from './styled.ts';

const PlayerContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #EAF0FA;
    border-radius: 48px;
`;

const Time = styled.div`
    font-size: 14px;
    color: #122945;
`;

const PlayPauseWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFF;
    height: 24px;
    width: 24px;
    border-radius: 50%;
`;

const ProgressBar = styled.div`
    flex: 1;
    height: 6px;
    background: #ADBFDF;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
`;

const ProgressFill = styled.div`
    height: 100%;
    background: #002CFB;
    border-radius: 3px;
    transition: width 0.1s ease-in-out;
`;

interface ICallPlayerProps {
  isHovered: boolean;
  call: ICall;
}

const PlayerCell: FC<ICallPlayerProps> = ({ isHovered, call }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsOpen(true);
    setIsPlaying(false);
    setProgress(0);

    const fetchRecording = async () => {
      if (isHovered && call.record && call.partnership_id) {
        try {
          const blob = await getCallRecording(call.record, call.partnership_id);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } catch (error) {
          console.error('Ошибка при загрузке записи:', error);
        }
      }
    };

    fetchRecording();
  }, [isHovered, call]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(percentage);
  };

  const seekAudio = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress((newTime / audioRef.current.duration) * 100);
  };

  if (!call.record) {
    return null;
  }

  return (
    <Fragment>
      {isHovered && isOpen && audioUrl ? (
        <PlayerContainer>
          <IconButton onClick={togglePlay}>
            <PlayPauseWrapper>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </PlayPauseWrapper>
          </IconButton>
          <Time>{getFormattedDuration(call.time)}</Time>
          <ProgressBar onClick={seekAudio}>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <IconButton as="a" href={audioUrl} download>
            <DownloadIcon />
          </IconButton>
          <IconButton as="button" onClick={(prev) => setIsOpen(!prev)}>
            <CloseIcon />
          </IconButton>
          <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />
        </PlayerContainer>
      ) : (
        <Time>{getFormattedDuration(call.time)}</Time>
      )}
    </Fragment>
  );
};

export { PlayerCell };


