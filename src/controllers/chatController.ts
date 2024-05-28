import { db } from "../database/models";

interface IChat {
  user: string;
  message: string;
  timestamp: Date;
}

interface IRoom {
  room: string;
  chats: IChat[];
}

interface IError {
  message: string;
}


async function createChat(room: string): Promise<IRoom> {
  const newRoom = await db.Chat.create({ room, chats: [] });
  return newRoom;
}

async function findChats(room: string): Promise<IRoom | null> {
  let chats = await db.Chat.findOne({ where: { room } });
  if (!chats) {
    await createChat(room);
  }
  chats = await db.Chat.findOne({ where: { room } });
  return chats;
}

async function addChat(room: string, chat: IChat): Promise<[number, IRoom[]]> {
  try {
    const chats = await findChats(room);
    if (chats) {
      chats.chats.push(chat);
      const updatedChat = await db.Chat.update(
        { chats: chats.chats },
        { where: { room } }
      );
      return updatedChat;
    } else {
      throw new Error('Room not found');
    }
  } catch (error) {
    const err: IError = {
      message: (error as Error).message
    };
    throw new Error(err.message);
  }
}

export default { findChats, addChat, createChat };
