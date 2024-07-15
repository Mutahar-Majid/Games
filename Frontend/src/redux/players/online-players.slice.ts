import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface OnlinePlayersState {
	isPlaying: boolean;
	playerOneActive: boolean;
	playerChoice: string;
	gamePlay: boolean;
	opponent: string;
	leaderboard: any[];
	exitMsg: string;
}

const initialState = {
	isPlaying: false,
	playerOneActive: false,
	playerChoice: '',
	gamePlay: false,
	opponent: '',
	leaderboard: [],
	exitMsg: ''
} as OnlinePlayersState;

export const onlinePlayersSlice = createSlice({
	name: 'players',
	initialState,
	reducers: {
		setIsPlaying: (state, action: PayloadAction<boolean>) => {
			state.isPlaying = action.payload;
		},

		setPlayerOneActive: (state, action: PayloadAction<boolean>) => {
			state.playerOneActive = action.payload;
		},

		setPlayerChoice: (state, action: PayloadAction<string>) => {
			state.playerChoice = action.payload;
		},

		setGamePlay: (state, action: PayloadAction<boolean>) => {
			state.gamePlay = action.payload;
		},

		setOpponent: (state, action: PayloadAction<string>) => {
			state.opponent = action.payload;
		},
		setLeaderboard: (state, action: PayloadAction<any[]>) => {
			state.leaderboard = [...action.payload];
		},
		setExitMsg: (state, action: PayloadAction<string>) => {
			state.exitMsg = action.payload;
		}
	},
});

export const { setIsPlaying, setPlayerOneActive, setPlayerChoice, setGamePlay, setOpponent, setLeaderboard, setExitMsg } =
	onlinePlayersSlice.actions;

export default onlinePlayersSlice.reducer;
