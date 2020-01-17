const CommandParser = require("../lib/commandParser")
const config = require("config")
const models = require("../models")
import logger from '../lib/logger';

export default [
    /**
     Create a new game
     The client app should be valid
     This will create a new game ID
     */
    {
        method: 'POST',
        path: '/games',
        controller: (req, res, next) => {
            const gameInfo = req.body
            logger.info("Creating a new game using: ", gameInfo);

            const GameInstance = new (models.get('game'))(gameInfo)

            GameInstance.save((err, model) => {
                console.log(err);
                if (err) return next(err);
                res.json(model)
            })
        }
    },
    /**
     Join a game using your username
     This will create a new game state object relating your user with the game ID you specify
     */
    {
        method: 'POST',
        path: '/games/:id',
        controller: (req, res, next) => {

            const joinModel = req.body;
            joinModel.game = req.params.id;

            const GameStateInstance = new (models.get('gameState'))(joinModel);

            GameStateInstance.save((err, model) => {
                if (err) {
                    if (err.code == 11000) return next({
                        error: true,
                        code: err.code,
                        message: 'That user is already inside the game'
                    });
                    return next(err)
                }
                res.json(model)
            })
        }
    },
    /**
     Returns the game state of a player for a specific game, including the details of the current scene
     */
    {
        method: 'GET',
        path: '/games/:id/state/:playername',
        controller: (req, res, next) => {
            const gameid = req.params.id;
            const playername = req.params.playername;

            models.get('gameState')
                .findOne({
                    game: gameid,
                    playername: playername
                })
                .populate('game')
                .exec((err, model) => {
                    if (err) return next(err)
                    if (!model) return next({
                        status: 404,
                        message: "Game state for player '" + playername + "' and game id: '" + gameid + "' not found"
                    })
                    res.json(model)
                });
        }
    },
    /**
     Interaction with a particular scene
     */
    {
        method: 'POST',
        path: '/games/:id/:playername/commands',
        controller: (req, res, next) => {

            const command = req.body;
            command.context = {
                gameId: req.params.id,
                playername: req.params.playername,
                //scene: req.params.scene
            };

			const parser = new CommandParser(command);

			const commandObj = parser.parse();
            if (!commandObj) return next({
                status: 400,
                errorCode: config.get("errorCodes.invalidCommand"),
                message: "Unknown command"
            });
            commandObj.run((err, result) => {
                if (err) return next(err);

                res.json(result);
            })
        }
    }
];
