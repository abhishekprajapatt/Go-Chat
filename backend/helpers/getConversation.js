import { ConversationModel } from '../models/conversationModel.js';
import { UserModel } from '../models/userModel.js';

export const getConversation = async (userId) => {
  try {
    const conversations = await ConversationModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name profile_pic')
      .populate('receiver', 'name profile_pic')
      .populate('messages')
      .sort({ updatedAt: -1 });

    return conversations.map((conv) => {
      const otherUser =
        conv.sender._id.toString() === userId ? conv.receiver : conv.sender;
      return {
        ...conv.toObject(),
        userDetails: otherUser,
        unseenMsg: conv.messages.filter(
          (msg) => !msg.seen && msg.msgByUserId.toString() !== userId
        ).length,
        lastMsg: conv.messages[conv.messages.length - 1],
      };
    });
  } catch (error) {
    console.error('Get conversation error:', error.message);
    return [];
  }
};
