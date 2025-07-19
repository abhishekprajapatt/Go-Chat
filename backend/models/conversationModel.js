import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    seen: { type: Boolean, default: false },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model('Message', messageSchema);
export const ConversationModel = mongoose.model('Conversation', conversationSchema);