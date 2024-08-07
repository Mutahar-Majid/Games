import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import icons from '../../data';


import Icon from '../../components/icon/icon.component';
import Button from '../../components/button/button.component';

import {
	increment,
	decrement,
	setResultOut,
	setWinnerText,
	setDidWin,
} from '../../redux/score/online-score.slice';
import { setGamePlay, setLeaderboard } from '../../redux/players/online-players.slice';
import {
	setOpponentPickedMessage,
	setOpponentRestartedMessage,
} from '../../redux/status/opponent-status.slice';

import { GameResultContainer } from '../../styles/game-result.styles';

import {
	GamePlayContainer,
	PlayerContainer,
	PlayerIdentity,
	SecondPlayer,
} from '../../styles/game-play.styles';
import getSocket from '../../redux/socket/socketInstance';
import { NormalText, RoomContainer, SubtitleText, TwoCellContainer, LeaderBoardContainer } from './lobby.styles';


const OnlineGamePlay = (): JSX.Element => {
	const { playerOneActive, playerChoice, opponent, leaderboard } = useAppSelector(state => state.onlinePlayers);
	const { resultOut, winnerText, didWin } = useAppSelector(state => state.onlineScorer);

	const dispatch = useAppDispatch();
	const socket = getSocket();

	const [firstPlayerData] = icons.filter(({ title }) => title === playerChoice);
	const image = firstPlayerData?.image;

	const [secondPlayerData] = icons.filter(({ title }) => title === opponent);
	const opponentImage = secondPlayerData?.image;

	useEffect(() => {
		socket.on('result', data => {
			dispatch(setResultOut(true));

			const { winner } = data;

			if ((winner === 'player1' && playerOneActive) || (winner === 'player2' && !playerOneActive)) {
				dispatch(setWinnerText(`you win`));
				dispatch(increment());
				dispatch(setDidWin(true));
				socket.emit('update-score');
			} else if (winner === 'player1' || winner === 'player2') {
				dispatch(setWinnerText(`you lose`));
			} else {
				dispatch(setWinnerText(`draw`));
			}
			socket.on('leaderboard', (data) => {
				dispatch(setLeaderboard(data))
			});
		});
		dispatch(setOpponentRestartedMessage(''));

		socket.on('restart-message', message => {
			dispatch(setOpponentRestartedMessage(message));
		});

		return () => {
			socket.off('result');
			socket.off('restart-message');
		};
	}, [resultOut]);

	const startNewGame = () => {
		dispatch(setGamePlay(false));
		dispatch(setDidWin(false));
		dispatch(setResultOut(false));
		socket.emit('restart');
		dispatch(setOpponentPickedMessage(''));
	};

	return (
    <GamePlayContainer>
      <PlayerContainer spaceBetween={resultOut}>
        <Icon
          key={11}
          title={playerChoice}
          image={image}
          won={didWin}
          customSize={true}
        />

        {!resultOut ? (
          <SecondPlayer className='empty' large={true}></SecondPlayer>
        ) : (
          <Icon
            key={22}
            title={opponent}
            image={opponentImage}
            customSize={true}
          />
        )}
      </PlayerContainer>

      <PlayerIdentity>
        <p>you picked</p>
        <p>an opposer picked</p>
      </PlayerIdentity>

      {resultOut && (
        <GameResultContainer>
          <p>{winnerText}</p>

          <Button
            type={'button'}
            btnStyle={'play again'}
            children={'play again'}
            handler={startNewGame}
          />
        </GameResultContainer>
      )}
      <RoomContainer>
        <LeaderBoardContainer>
          <SubtitleText>Leaderboard</SubtitleText>
          {leaderboard.map((item) => (
            <TwoCellContainer>
              <NormalText>{item.username}</NormalText>
              <NormalText>{item.score}</NormalText>
            </TwoCellContainer>
          ))}
        </LeaderBoardContainer>
      </RoomContainer>
    </GamePlayContainer>
  );
};

export default OnlineGamePlay;
