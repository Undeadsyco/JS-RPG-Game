import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const chatModel = mongoose.model('chat', chatSchema);
export default chatModel;
