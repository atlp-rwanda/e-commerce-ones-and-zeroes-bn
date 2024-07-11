import {
  addChat as addChatController,
  findChats as findChatsController,
} from '../controllers/chatController';
import { decodeToken } from './token';
import { Request, Response, NextFunction } from 'express';

async function isValidAuthToken(token: string) {
  if (!token) return false;
  try {
    const user = decodeToken(token);
    return user || false;
  } catch (error) {
    return false;
  }
}

const createRequest = (body: any = {}): Partial<Request> => ({
  body,
});

const createResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = (statusCode: number) => {
    res.statusCode = statusCode;
    return res as Response;
  };
  res.json = (data: any) => data;
  return res;
};

const join = async (socket: any) => {
  const token = socket.handshake.query.token;

  const user = await isValidAuthToken(token);

  if (!token || !user) {
    socket.emit('unauthorized', 'Invalid authentication token');
    socket.disconnect(true);
    return;
  }

  const { firstName: username, userId } = user;
  socket.id = userId;
  socket.username = username;

  socket.emit('joined', { id: userId, username });

  const req = createRequest();
  const res = createResponse();
  (req as any).user = user;

  const data: any = await findChatsController(req as Request, res as Response);
  data?.chats.forEach((chat: any) => {
    socket.emit('message', chat);
  });

  if (username) {
    socket.broadcast.emit('userJoined', `${username} has joined the chat`);
  }
};

const disconnect = (socket: any) => {
  if (socket.username) {
    socket.broadcast.emit('userLeft', `${socket.username} has left the chat`);
  }
};

const handleChatMessage = async (io: any, socket: any, message: any) => {
  const { username, id: userId } = socket;

  const messageObj: IChat = {
    username,
    userId,
    message,
    timestamp: new Date(),
  };
  io.emit('newMessage', messageObj);

  const req = createRequest(messageObj);
  const res = createResponse();
  const user = { username, userId };

  (req as any).user = user;

  await addChatController(req as Request, res as Response);
};

const chats = (io: any) => {
  io.on('connection', async (socket: any) => {
    const token = socket.handshake.auth.token;

    console.log('front', token);
    const user = await isValidAuthToken(token);

    if (!token || !user) {
      socket.emit('unauthorized', 'Invalid authentication token');
      socket.disconnect(true);
      return;
    }

    socket.id = user.userId;
    socket.username = user.firstName;

    socket.on('join', () => join(socket));
    socket.on('message', (message: any) => {
      handleChatMessage(io, socket, message);
    });
    socket.on('typing', (message: any) => {
      socket.broadcast.emit('typing', {
        username: user.firstName,
        userId: user.userId,
      });
    });
    socket.on('disconnect', () => disconnect(socket));
  });
};

export default { chats };

interface IChat {
  username: string;
  userId: string;
  message: string;
  timestamp: Date;
}
