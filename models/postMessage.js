import  Mongoose  from "mongoose";

const postSchema = ({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});
                                //single collection name //data type
const PostMessage = Mongoose.model('PostMessage', postSchema);
export default PostMessage;