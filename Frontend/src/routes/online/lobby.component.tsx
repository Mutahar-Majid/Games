import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import OnlineGameStart from './game-start.component';
import Button from '../../components/button/button.component';

import { setSockets, setRoom } from '../../redux/socket/socket.slice';
import {
  setPlayerOneActive,
  setIsPlaying,
  setLeaderboard,
} from '../../redux/players/online-players.slice';

import {
  FormInput,
  RoomContainer,
  Separator,
  SubtitleText,
  TitleText,
  TwoCellContainer,
  NormalText
} from './lobby.styles';
import GameInfo from '../../components/game-info/game-info.component';
import Spinner from '../../components/spinner/spinner.component';
import getSocket from '../../redux/socket/socketInstance';
import { useParams } from 'react-router-dom';

const Lobby = (): JSX.Element => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const socket = getSocket();
  const { username } = useParams<{ username: string }>();

  const { room, sockets } = useAppSelector((state) => state.socket);
  const { isPlaying } = useAppSelector((state) => state.onlinePlayers);
  const { score } = useAppSelector((state) => state.onlineScorer);

  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit('get-available-rooms', username);
  }, []);
  useEffect(() => {
    socket.on('connect', () => {
      // console.log('You connected to ', socket.id);
    });
    socket.on('available-rooms', setAvailableRooms);
    socket.on('updated-users', (users) => {
      // console.log(users);
      dispatch(setSockets(users));
    });

    socket.on('full', (message) => {
      setSuccessMessage(message);
    });

    sockets.length === 2 && dispatch(setIsPlaying(true));
    return () => {
      socket.off('connect');
      socket.off('available-rooms');
      socket.off('updated-users');
      socket.off('start');
    };
  }, [sockets]);

  const handleChangeRoom = (e: any) => {
    dispatch(setRoom(e.target.value.trim()));
  };

  const handleCreateRoom = (e: any) => {
    e.preventDefault();
    dispatch(setPlayerOneActive(true));
    room && socket.emit('create-room', { room, username });
    room &&
      socket.emit('join-room', {room, username}) &&
      setSuccessMessage(`You created room ${room} & joined`);
  };

  const handleJoinRoom = (e: any, room: string) => {
    e.preventDefault();
    room && dispatch(setRoom(room));
    room && socket.emit('join-room', {room, username});
  };

  return (
    <>
      <GameInfo userName={username} score={score} />
      <TitleText>{isPlaying ? 'Game Room' : 'Game Lobby' }</TitleText>
      {isPlaying ? (
        <OnlineGameStart />
      ) : sockets.length > 0 ? (
        <>
          <Spinner />
          <RoomContainer>
            {<p>{successMessage}</p>}
            {successMessage && !successMessage.includes('two players') && (
              <p>Wait for an opponent to join</p>
            )}
          </RoomContainer>
        </>
      ) : (
        <RoomContainer>
          <SubtitleText>Create New Room:</SubtitleText>
          <form onSubmit={handleCreateRoom}>
            <FormInput
              type='text'
              onChange={handleChangeRoom}
              aria-label='join-room'
              placeholder='type room code'
            />
            <br />
            <Button type='submit' btnStyle='primary' children='create room' />
          </form>
          <Separator />
          <SubtitleText>Join Available Rooms:</SubtitleText>
          {!!availableRooms?.length && (
            <>
              {availableRooms.map((room: any) => (
                <TwoCellContainer>
                  <NormalText>{room.id}</NormalText>
                  <Button
                    type='submit'
                    btnStyle='primary'
                    children='join room'
                    handler={(e) => handleJoinRoom(e, room.name)}
                  />
                </TwoCellContainer>
              ))}
            </>
          )}
          <Button
            type='submit'
            btnStyle='primary'
            children='Get Available Rooms'
            handler={() => socket.emit('get-available-rooms', username)}
          />
          {<p>{successMessage}</p>}
          {successMessage && !successMessage.includes('two players') && (
            <p>Wait for an opponent to join</p>
          )}
        </RoomContainer>
      )}
    </>
  );
};

export default Lobby;
