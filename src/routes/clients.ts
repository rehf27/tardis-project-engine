import logger from 'src/lib/logger';

const models = require("../models")

function updateModelKey(model, res, next) {
  console.log(model)
  model
    .updateAPIKey((err) => {
      if (err) return next(err)
      return res.json(model)
    })
}

function createNewClient(clientModel, info, res, next) {
  const ClientApp = new clientModel(info)

  ClientApp.save((err, model) => {
    if (err) return next(err)
    model.registerAPIKey((err) => {
      if (err) return next(err)
      res.json(model)
    })

  })
}

export default {
  method: 'POST',
  path: '/clients',
  controller: (req, res, next) => {
    logger.info('creating new client');
    const clientInfo = req.body;
    const clientModel = models.get('clientApp');
    const keyName = clientModel.normalizeName(clientInfo.name);

    clientModel.findOne({unique_name: keyName}).exec((error, foundModel) => {
      if (foundModel) {
        updateModelKey(foundModel, res, next)
      } else {
        createNewClient(clientModel, clientInfo, res, next)
      }
    })
  }
};
