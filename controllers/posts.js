import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    console.log("getPost called")
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
        //these are received by the fronEnd
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPost = async(req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async(req, res) => {
    const {id: _id} = req.params;
    console.log('updatePost called');
    const post = req.body;//sendByFrontEnd//JS object
    // console.log(post);
    if(!mongoose.Types.ObjectId.isValid(_id))
    {
        return res.status(404).send('No Post with that Id');
    }
                                    //our modal doesn't contain id we have to explicitly add it
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true});//new to recieve updatedPost
    return res.json(updatedPost);
}   

export const deletePost = async(req, res) => {
    const {id: _id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id))
    {
        return res.status(404).send('No Post with that Id');
    }
    await PostMessage.findByIdAndRemove(_id);
    res.json({message: 'Post deletd successfully!'});
}

export const likePost = async(req, res) => {
    const {id} = req.params;

    if(!req.userId) {
        return res.json({message: "Unauthenticated"})
    }
 
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).send('No Post with that Id');
    }
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1) {
        //like the post
        post.likes.push(req.userId);
    } else {
        //dislike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
    return res.json(updatedPost);//will be received by frontEnd
}