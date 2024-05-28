import chatServices from '../controllers/chatController';
import { verifyToken } from '../helps/verifyToken';

async function isValidAuthToken(token: string) {
  try {
    let user = null;
    if (token) {
      user = verifyToken(token);
      return user;
    }
    return false;
  } catch (error) {
    return false;
  }
}

const join = async (socket: any) => {
  const authToken2 = socket.handshake.query.authToken;
  const user = await isValidAuthToken(authToken2);
  if (!authToken2 || !user) {
    socket.emit('unauthorized', 'Invalid authentication token');
    socket.disconnect(true);
    return;
  }
  const name = user.username;
  const userId = user.id;
  socket.id = userId;
  socket.username = name;

  socket.emit('joined', { id: userId, username: name });
  await chatServices.findChats('public').then((data) => {
    data?.chats.forEach((chat) => {
      socket.emit('message', chat);
    });
  });
  socket.username = name;
  if (name !== 'undefined') {
    socket.broadcast.emit('userJoined', `${name} has joined the chat`);
  }
};

const disconnect = (socket: any) => {
  if (socket.username) {
    socket.broadcast.emit('userLeft', `${socket.username} has left the chat`);
  }
};

const chats = (io: any) => {
  io.on('connection', async (socket: any) => {
    const authToken2 = socket.handshake.query.authToken;
    const user = await isValidAuthToken(authToken2);
    if (!authToken2 || !user) {
      socket.emit('unauthorized', 'Invalid authentication token');
      socket.disconnect(true);
      return;
    }
    socket.id = user.id;
    socket.username = user.username;
    socket.on('join', () => join(socket));
    socket.on('message', async (message: any) => {
      const messageObj: IChat = {
        user: user.username,
        message,
        timestamp: new Date(),
      };
      io.emit('message', messageObj);
      await chatServices.addChat('public', messageObj);
    });
    socket.on('typing', (message: any) => {
      socket.broadcast.emit('typing', message);
    });

    socket.on('disconnect', () => disconnect(socket));
  });
};

export default { chats, isValidAuthToken, join, disconnect };

interface IChat {
  user: string;
  message: string;
  timestamp: Date;
}
