const {validationResult} = require('express-validator');

const Post = require('../modals/post.js');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message : 'Fetched Posts' ,
        posts : posts
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.createPost = (req, res, next) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    const error = new Error('Validation failed!!');
    error.statusCode = 422;
    throw err ;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title : title  ,
    content : content ,
    imageUrl : 'images/sample.png',
    creator: { name: 'OM PATEL' },
  })
  post.save()
    .then(result =>  {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId ;
  Post.findById(postId)
    .then(post => {
      if(!post){
        const error = new Error('Not Found Post !!!');
        error.statusCode = 422;
        throw err;
      }
      res.status(200).json({
        message : 'Post Fetched' ,
        post : post 
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};
