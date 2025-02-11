/// <reference types="vite-plugin-svgr/client" />

import { FC, Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PlayIcon from '@icons/play.svg?react';
import PauseIcon from '@icons/pause.svg?react';
import DownloadIcon from '@icons/download.svg?react';
import CloseIcon from '@icons/close.svg?react';

import { getCallRecording } from '../api.ts';
import { ICall } from '../types.ts';
import { getFormattedDuration } from '../utils';
import { IconButton } from './styled.ts';
import { Loader } from './Loader.tsx';

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
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Состояние для отображения плеера

  // Загрузка аудио при ховере
  useEffect(() => {
    if (isHovered && call.record && call.partnership_id && !audioUrl) {
      setIsLoading(true); // Начинаем загрузку
      getCallRecording(call.record, call.partnership_id)
        .then((blob) => {
          setAudioUrl(URL.createObjectURL(blob));
          setIsPlayerVisible(true); // Показываем плеер после загрузки
        })
        .catch((error) => console.error('Ошибка при загрузке записи:', error))
        .finally(() => setIsLoading(false)); // Завершаем загрузку
    }
  }, [isHovered, call, audioUrl]);

  // Управление видимостью плеера
  useEffect(() => {
    if (isHovered && audioUrl) {
      setIsPlayerVisible(true); // Показываем плеер при ховере, если аудио загружено
    }
  }, [isHovered, audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const seekAudio = (e: MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
    }
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false); // Скрываем плеер
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!call.record) return null;

  return (
    <Fragment>
      {!isPlayerVisible && !isLoading && <Time>{getFormattedDuration(call.time)}</Time>}
      {isPlayerVisible && audioUrl ? (
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
          <IconButton as="button" onClick={handleClosePlayer}>
            <CloseIcon />
          </IconButton>
          <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />
        </PlayerContainer>
      ) : (
        isLoading && <Loader fullScreen={false} /> // Показываем Loader во время загрузки
      )}
    </Fragment>
  );
};

export { PlayerCell };


