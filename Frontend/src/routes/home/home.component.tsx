import React, { useState, FormEvent, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChoiceContainer, NameInput, SubmitButton } from './home.styles';
import GameInfo from '../../components/game-info/game-info.component';
import getSocket from '../../redux/socket/socketInstance';

const FormComponent = () => {
  const [value, setValue] = useState('');
	const [disabled, setDisabled] = useState(true)
	const navigate = useNavigate();
	const socket = getSocket();

	useEffect(() => {
		setDisabled(value.trim().length > 0 && value.trim().length < 3)
	}, [value])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
		navigate(`/online/${encodeURIComponent(value)}`)
  };

  return (
    <form onSubmit={handleSubmit}>
      <NameInput
        type='text'
        placeholder='Enter Username or Play as Guest'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
			<SubmitButton type='submit' btnStyle='play online' children={value.trim().length > 0 ? 'Submit' : 'Skip'} disabled={disabled}/>
    </form>
  );
};

const Home = (): JSX.Element => {
	return (
		<>
		<GameInfo />
		<ChoiceContainer>
			<FormComponent />
			<Outlet />
		</ChoiceContainer>
		</>
	);
};

export default Home;
