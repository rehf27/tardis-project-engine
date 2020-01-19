const redis = require("redis");
import logger from '../lib/logger';
const config = require("config");

export const apiCheck = (req, res, next) => {

    let URL = req.url;
    let publicURLs = [
        "/clients",
        "/ping"
    ];
    logger.info(URL);
    if (publicURLs.indexOf(URL) != -1) return next();

    let apikey = req.get('apikey') || req.query.apikey;

    if (!apikey) {
        return next({message: 'Missing API Key', status: 400})
    }
    let keyName = 'apikey-' + apikey;
    logger.info('API KEY:', apikey);
    logger.info(req.query);

    const rClient = redis.createClient()
    rClient.ttl(keyName, (err, ttl) => {
        if (err) return next(err);
        logger.info('TTL for key: ', ttl);
        logger.info('Type of data: ', typeof ttl);
        if (ttl < 0) {
            logger.info('Key not found or timedout');
            return next({
                message: 'API Key missing or too old, please request a new one',
                status: 400
            })
        } else { //if the key is still active, reset the TTL
            rClient.expire(keyName, config.get('clientKeys.ttl'), next)
        }
    })
};
