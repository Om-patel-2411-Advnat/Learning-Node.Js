const {validationResult} = require('express-validator');
const fs = require('fs');
const path = require('path');

const Post = require('../modals/post.js');
const User = require('../modals/user.js');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2 ;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage) ; 
  
    res.status(200).json({
      message: 'Fetched Posts',
      posts: posts ,
      totalItems : totalItems
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    const error = new Error('Validation failed!!');
    error.statusCode = 422;
    throw err ;
  }
  if(!req.file){
    const error = new Error('no image provided');
    error.statusCode = 422;
    throw err;
  }
  const imageUrl = req.file.path ;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title : title  ,
    content : content ,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save()
    const user = await User.findById(req.userId) ;
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: {
        _id: user._id,
        name: user.name
      }
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId ;
  const post = await Post.findById(postId)
  try {
    if(!post){
      const error = new Error('Not Found Post !!!');
      error.statusCode = 422;
      throw err;
    }
    res.status(200).json({
      message : 'Post Fetched' ,
      post : post 
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req , res , next) =>{
  const postId = req.params.postId ;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error('Validation failed!!');
    error.statusCode = 422;
    throw err;
  }

  const title = req.body.title ;
  const content = req.body.content ;
  let imageUrl = req.body.image ;
  if(req.file){
    imageUrl = req.file.path;
  }
  if(!imageUrl){
    const error = new Error('No file picked !!!');
    error.statusCode = 422;
    throw err;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Not Found Post !!!');
      error.statusCode = 422;
      throw error;
    };
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not Authorized !!!');
      error.statusCode = 403;
      throw error;
    };
    if(imageUrl !== post.imageUrl){
      clearImage(post.imageUrl);
    };
    post.title = title  ;
    post.content = content ;
    post.imageUrl = imageUrl ;
    
    await post.save();

    res.status(200).json({message : 'Post is Updated' , post : result});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId ;
  try {
    const post  = await Post.findById(postId)
    if (!post) {
      const error = new Error('Not Found Post !!!');
      error.statusCode = 422;
      throw err;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not Authorized !!!');
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    //check logged in user 
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    
    res.status(200).json({ message: 'Post is Deleted' })

  } catch (errors) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const clearImage = filePath => {
  filePath = path.join(__dirname , '..' , filePath);
  fs.unlink(filePath , err => console.log(err));
}
