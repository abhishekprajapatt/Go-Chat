import { ConversationModel, MessageModel } from '../models/conversationModel.js';

export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate('participants', 'name email profilePic')
      .populate('messages')
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const otherUser = conv.participants.find((p) => p._id.toString() !== userId);
      return {
        _id: conv._id,
        userDetails: otherUser,
        messages: conv.messages,
        unseenCount: conv.messages.filter((m) => !m.seen && m.sender.toString() !== userId).length,
        lastMessage: conv.messages[conv.messages.length - 1],
      };
    });

    res.status(200).json({ message: 'Conversations fetched', data: formattedConversations });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};