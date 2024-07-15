import logo from '../../assets/images/logo-bonus.svg';
import { TitleText } from '../../routes/online/lobby.styles';
import { GameInfoContainer, GameLogo, GameScore } from './game-info.styles';


type GameInfoProps = {
	score?: number;
	userName?: string;
};

const GameInfo = ({ score, userName }: GameInfoProps): JSX.Element => {
	return (
		<GameInfoContainer>
			<GameLogo to='#'>
				<img src={logo} alt='' />
			</GameLogo>

			<h1>{userName}</h1>
			{score != undefined && 
				<GameScore>
					<span>score</span>
					<span>{score}</span>
				</GameScore>
			}
		</GameInfoContainer>
	);
};

export default GameInfo;
