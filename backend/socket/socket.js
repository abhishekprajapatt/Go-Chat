import { Server } from 'socket.io';
import http from 'http';
import { UserModel } from '../models/userModel.js';
import { ConversationModel, MessageModel } from '../models/conversationModel.js';
import { auth } from '../middleware/auth.js';

export const initSocket = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  const onlineUsers = new Set();

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await UserModel.findById(decoded.id).select('-password');
      if (!user) throw new Error('Invalid token');
      socket.user = user;
      next();
    } catch (error) {
      socket.disconnect();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);
    onlineUsers.add(userId);
    io.emit('onlineUsers', Array.from(onlineUsers));

    socket.on('getMessages', async (receiverId) => {
      try {
        const conversation = await ConversationModel.findOne({
          participants: { $all: [socket.user._id, receiverId] },
        })
          .populate('messages')
          .populate('participants', 'name email profilePic')
          .sort({ updatedAt: -1 });

        socket.emit('messages', conversation?.messages || []);

        const userDetails = await UserModel.findById(receiverId).select('-password');
        socket.emit('userDetails', {
          _id: userDetails._id,
          name: userDetails.name,
          email: userDetails.email,
          profilePic: userDetails.profilePic,
          online: onlineUsers.has(receiverId),
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('sendMessage', async (data) => {
      try {
        let conversation = await ConversationModel.findOne({
          participants: { $all: [data.sender, data.receiver] },
        });

        if (!conversation) {
          conversation = await ConversationModel.create({
            participants: [data.sender, data.receiver],
          });
        }

        const message = await MessageModel.create({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          sender: data.sender,
        });

        await ConversationModel.findByIdAndUpdate(conversation._id, {
          $push: { messages: message._id },
        });

        const updatedConversation = await ConversationModel.findById(conversation._id)
          .populate('messages')
          .populate('participants', 'name email profilePic');

        io.to(data.sender).emit('messages', updatedConversation.messages);
        io.to(data.receiver).emit('messages', updatedConversation.messages);

        const senderConversations = await getConversations(data.sender);
        const receiverConversations = await getConversations(data.receiver);
        io.to(data.sender).emit('conversations', senderConversations);
        io.to(data.receiver).emit('conversations', receiverConversations);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('markAsSeen', async (receiverId) => {
      try {
        const conversation = await ConversationModel.findOne({
          participants: { $all: [socket.user._id, receiverId] },
        });

        if (conversation) {
          await MessageModel.updateMany(
            { _id: { $in: conversation.messages }, sender: receiverId, seen: false },
            { seen: true }
          );

          const senderConversations = await getConversations(socket.user._id);
          const receiverConversations = await getConversations(receiverId);
          io.to(socket.user._id).emit('conversations', senderConversations);
          io.to(receiverId).emit('conversations', receiverConversations);
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('getConversations', async () => {
      try {
        const conversations = await getConversations(socket.user._id);
        socket.emit('conversations', conversations);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('onlineUsers', Array.from(onlineUsers));
    });
  });

  const getConversations = async (userId) => {
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate('participants', 'name email profilePic')
      .populate('messages')
      .sort({ updatedAt: -1 });

    return conversations.map((conv) => {
      const otherUser = conv.participants.find((p) => p._id.toString() !== userId);
      return {
        _id: conv._id,
        userDetails: otherUser,
        messages: conv.messages,
        unseenCount: conv.messages.filter((m) => !m.seen && m.sender.toString() !== userId).length,
        lastMessage: conv.messages[conv.messages.length - 1],
      };
    });
  };

  return server;
};