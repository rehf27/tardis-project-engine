import * as Express from 'express';
import { createValidator } from 'express-joi-validation';
import ExpressRouter from 'express-promise-router';
import * as helmet from 'helmet';

import { ISchema } from 'src/types/routes';

// Import all the routes and middleware
import config from 'src/config';
import log from 'src/lib/logger';
import middleware from 'src/middleware';
import routes from 'src/routes';

const required = [];

const missing = required.filter(e => !process.env.hasOwnProperty(e));

if (missing.length) {
  log.error(`Missing some required env variables: ${missing.join(',')}`);
}

const serverConfig = config.server;

// Create the server
const server = Express();

// secure header setting
server.disable('x-powered-by');
server.use(helmet.noSniff());
server.use(helmet.hsts({
  maxAge: 5184000
}));

// Register the middleware
middleware.forEach(mid => server.use(mid));

// Create and configure the router
const router = ExpressRouter(serverConfig.router);
const validator = createValidator();

// Register the routes
routes.forEach((route: any) => {
  const schema: ISchema = route.schema || {};
  const next = (req, res, nxt) => nxt();

  // If the request has schema, validate the requests against the schema
  const validateBody = schema.body ? validator.body(schema.body as any) : next;
  const validateParams = schema.params ? validator.params(schema.params as any) : next;
  const validateQuery = schema.query ? validator.query(schema.query as any) : next;

  switch (route.method) {
    case 'GET':
      router.get(route.path, validateBody, validateParams, validateQuery, route.controller);
      break;
    case 'POST':
      router.post(route.path, validateBody, validateParams, validateQuery, route.controller);
      break;
    case 'PUT':
      router.put(route.path, validateBody, validateParams, validateQuery, route.controller);
      break;
    case 'PATCH':
      router.patch(route.path, validateBody, validateParams, validateQuery, route.controller);
      break;
    case 'DELETE':
      router.delete(route.path, validateBody, validateParams, validateQuery, route.controller);
      break;
    default:
      throw new Error(`Failed to load route. Invalid method: ${route.method} for path ${route.path}`);
  }
});

// Load the router
server.use('/', router);

server.use((err, req, res, next) => {
  log.error('error: ', {
    message: err.message,
    stack: err.stack
  });
  log.error('error info:', {
    route: req.url,
    method: req.method
  });
  try {
    res.status(err.statusCode || err.status || 500);
    if (config.returnCompleteErrors) {
      res.json({
        message: err.message,
        stack: err.stack,
        ...err
      });
    } else {
      res.end('');
    }
  } catch (err) {
    log.error('returnError', err);
  }
});

if (!module.parent) {
  // Start the server
  server.listen(serverConfig.port, () => {
    log.info(`The server has started on port ${serverConfig.port}`);
  });
}

export default server;
