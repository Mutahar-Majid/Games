import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';


import {
	setOpponentPickedMessage,
	setOpponentRestartedMessage
} from '../../redux/status/opponent-status.slice';
import { setExitMsg } from '../../redux/players/online-players.slice';

import { GameStatusContainer } from './game-status.styles';
import getSocket from '../../redux/socket/socketInstance';

const GameStatus = (): JSX.Element => {
	const { resultOut } = useAppSelector(state => state.onlineScorer);
	const { gamePlay, exitMsg } = useAppSelector(state => state.onlinePlayers);
	const { opponentPickedMessage, opponentRestartedMessage } = useAppSelector(
		state => state.opponentStatus
	);

	const socket = getSocket();

	const dispatch = useAppDispatch();

	useEffect(() => {
		socket.on('status', message => {
			dispatch(setOpponentPickedMessage(message));
		});

		socket.on('connected', () => {
			dispatch(setExitMsg('opponent reconnected!'));

			setTimeout(() => {
				dispatch(setExitMsg(''));
			}, 1000);
		});

		socket.on('disconnected', message => {
			dispatch(setExitMsg(message));
			dispatch(setOpponentPickedMessage(''));
			dispatch(setOpponentRestartedMessage(''));
		});

		dispatch(setOpponentRestartedMessage(''));

		return () => {
			socket.off('status');
			socket.off('connected');
			socket.off('disconnected');
		};
	}, []);

	return (
		<GameStatusContainer>
			{!resultOut && <p>{opponentPickedMessage}</p>}
			{gamePlay && resultOut && <p>{opponentRestartedMessage}</p>}
			<p>{exitMsg}</p>
		</GameStatusContainer>
	);
};

export default GameStatus;
