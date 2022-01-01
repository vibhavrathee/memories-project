import  Mongoose  from "mongoose";

const postSchema = Mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    name: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});
                                //single collection name //data type
const PostMessage = Mongoose.model('PostMessage', postSchema);
export default PostMessage;