import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import icons from '../../data';

import iconClick from '../../sounds/game-click.mp3';

import Icon from '../../components/icon/icon.component';
import OnlineGamePlay from './game-play.component';

import {
  setOpponent,
  setGamePlay,
  setPlayerChoice,
} from '../../redux/players/online-players.slice';

import { GameBodyContainer } from '../../styles/game-body.styles';
import getSocket from '../../redux/socket/socketInstance';
import { RoomContainer } from './lobby.styles';
import Button from '../../components/button/button.component';

const OnlineGameBody = (): JSX.Element => {
  const [play] = useSound(iconClick, { volume: 0.25 });
  const { playerOneActive, gamePlay, exitMsg } = useAppSelector(
    (state) => state.onlinePlayers
  );
  const { room } = useAppSelector((state) => state.socket);

  const dispatch = useAppDispatch();
  const socket = getSocket();
  useEffect(() => {
    socket.on('p1Choice', ({ choice }) => {
      !playerOneActive && dispatch(setOpponent(choice));
    });

    socket.on('p2Choice', ({ choice }) => {
      playerOneActive && dispatch(setOpponent(choice));
    });

    return () => {
      socket.off('p1Choice');
      socket.off('p2Choice');
    };
  }, []);

  const iconClickHandler = (e: any) => {
    dispatch(setGamePlay(!gamePlay));
    const choice = e.target.closest('#icon-wrapper').value;
    dispatch(setPlayerChoice(choice));
    play();

    const choiceEvent = playerOneActive ? 'p1Choice' : 'p2Choice';
    socket.emit(choiceEvent, { choice, room: room });
    socket.emit('game-play');
  };

  return (
    <>
      {gamePlay ? (
        <OnlineGamePlay />
      ) : (
        <div>
          {!exitMsg.length && (
            <GameBodyContainer>
              {icons.map(({ id, title, image }) => (
                <Icon
                  key={id}
                  iconId={id}
                  title={title}
                  image={image}
                  handler={iconClickHandler}
                />
              ))}
            </GameBodyContainer>
          )}
        </div>
      )}
      <RoomContainer>
        <div style={{ position: 'fixed', left: '5%', top: '15%' }}>
          <Button
            type='submit'
            btnStyle='primary'
            children='Back to Game Lobby'
            handler={(e) => window.location.reload()}
          />
        </div>
      </RoomContainer>
    </>
  );
};

export default OnlineGameBody;
