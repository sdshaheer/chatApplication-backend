const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        chatName: {
            type: String,
            trim: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupPicture: {
            type: String,
            default: 'https://www.tenniscall.com/images/chat.jpg'
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmin: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }

    },
    {
        collection: 'chat',
        timestamps: true
    },
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
