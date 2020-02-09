import logger from 'src/lib/logger';

import clientApp from 'src/models/clientApp';
import { normalizeName } from 'src/lib/normalizeName';

function updateModelKey(model, res, next) {
  console.log(model);
  model
    .updateAPIKey((err) => {
      if (err) return next(err);
      return res.json(model)
    })
}

function createNewClient(clientModel, info, res, next) {
  const ClientApp = new clientModel(info);

  ClientApp.save((err, model) => {
    if (err) return next(err);
    model.registerAPIKey((err) => {
      if (err) return next(err);
      res.json(model)
    })

  });
}

export default {
  method: 'POST',
  path: '/clients',
  controller: (req, res, next) => {
    logger.info('creating new client');
    const clientInfo = req.body;
    const keyName = normalizeName(clientInfo.name);

    clientApp.findOne({unique_name: keyName}, (error, clientApp) => {
      if (clientApp) {
        updateModelKey(clientApp, res, next)
      } else {
        createNewClient(clientApp, clientInfo, res, next)
      }
    });
  }
};
