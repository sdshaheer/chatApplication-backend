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
            default: 'https://wabetainfo.com/wp-content/uploads/2022/05/WA_GROUP_FB.png'
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
