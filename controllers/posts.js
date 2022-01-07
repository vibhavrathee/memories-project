import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPost = async(req, res) => {
    const {id} = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch(error){
        res.status(404).json({message: error.message});
    }
}

export const getPosts = async (req, res) => {
    const {page} =req.query;
    console.log("Page", page);
    console.log("getPost called")
    try {
        const LIMIT = 4;
        var startIndex = 0;
        if(page)
        startIndex = (Number(page)-1)*LIMIT;
        const total = await PostMessage.countDocuments({});
        //newest post first
        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
        // console.log(page, posts.length);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});
        //these are received by the fronEnd
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

//Query -> /posts?page=1 -> page = 1 
//params -> /posts/:id -> id = 123
export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');//ignore case //Test test all same
        const posts = await PostMessage.find({$or:[{title}, {tags: {$in: tags.split(',')}}]});
        res.json({data: posts}); 
    } catch(error) {
        console.log(error)
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

export const commentPost = async(req, res) => {
    const {id} =req.params;
    const {value} = req.body;

    const post = await PostMessage.findById(id)

    post.comments.push(value);

    //{new: true} so that updated post is returned
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
    res.json(updatedPost);
}


