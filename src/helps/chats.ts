import  chatServices  from '../controllers/chatController';

import { decodeToken } from '../utils';

async function isValidAuthToken(token) {
  try {
    let user = null;
    if (token) {
      user = decodeToken(token);
      return user;
    }
    return false;
  } catch (error) {
    return false;
  }
}

const join = async (socket) => {
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
    data.chats.forEach((chat) => {
      socket.emit('message', chat);
    });
  });
  socket.username = name;
  if (name !== 'undefined') {
    socket.broadcast.emit('userJoined', `${name} has joined the chat`);
  }
};
const disconnect = (socket) => {
  if (socket.username) {
    socket.broadcast.emit('userLeft', `${socket.username} has left the chat`);
  }
};

const chats = (io) => {
  io.on('connection', async (socket) => {
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
    socket.on('message', async (message) => {
      const messageObj = {
        userId: user.id,
        username: user.username,
        message,
        date: new Date(),
      };
      io.emit('message', messageObj);
      chatServices.addChat('public', messageObj);
    });
    socket.on('typing', (message) => {
      socket.broadcast.emit('typing', message);
    });

    socket.on('disconnect', () => disconnect(socket));
  });
};

export default { chats, isValidAuthToken, join, disconnect };
