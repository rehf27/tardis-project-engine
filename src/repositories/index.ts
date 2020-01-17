import { GameRepo } from './game.repo';

export interface IRepositories {
	gameRepo:GameRepo;
}

export const repos: IRepositories = {
	gameRepo: new GameRepo(),
};
