import { GameRepo } from './game.repo';
import { ClientRepo } from './client.repo';

export interface IRepositories {
	gameRepo:GameRepo;
	clientRepo:ClientRepo;
}

export const repos: IRepositories = {
	gameRepo: new GameRepo(),
	clientRepo: new ClientRepo(),
};
