import express, { Application, NextFunction } from 'express';
import connectDB from './frameworks/database/mongodb/connection';
import http from 'http';
import serverConfig from './frameworks/webserver/server';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import connection from './frameworks/database/redis/connection';
import colors from 'colors.ts';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandling';
import configKeys from './config'; 
import AppError from './utils/appError';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types/socketInterfaces';
import { Server } from 'socket.io';
import socketConfig from './frameworks/websocket/socket';
import { authService } from './frameworks/services/authService';

colors?.enable();

(async () => {
  try {
    //* Connect to MongoDB
    await connectDB();

    const app: Application = express();
    const server = http.createServer(app);

    //* WebSocket setup
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
      cors: {
        origin: configKeys.ORIGIN_PORT,
        methods: ['GET', 'POST'],
      },
    });

    socketConfig(io, authService());

    //* Connect to Redis
    const redisClient = connection().createRedisClient();

    //* Express app configuration
    expressConfig(app);

    //* Register routes
    routes(app, connection().createRedisClient); // ✅ correct


    //* Error handling
    app.use(errorHandlingMiddleware);

    app.all('*', (req, res, next: NextFunction) => {
      next(new AppError('Not found', 404));
    });

    //* Start HTTP server
    serverConfig(server).startServer();

  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
})();

export type RedisClient = ReturnType<typeof connection>['createRedisClient'];
