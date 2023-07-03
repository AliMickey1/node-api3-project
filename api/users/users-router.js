const express = require('express');

const router = express.Router();

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model')
const Post = require('../posts/posts-model')
const {
  validateUserId,
  validatePost, 
  validateUser,
  } = require('../middleware/middleware')

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    next(err)
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)

});


  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
router.post('/', validateUser, async (req, res) => {
  try {
  const { name } = req.body
  const newUser = await User.insert(name)
  res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: "missing required name field"})
  }
});


  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
router.put('/:id', validateUser, validateUserId, async (req, res) => {
  const changes = req.body
  const { id } = req.params
  const updatedUser = await User.update(changes, id)
    res.status(201).json(updatedUser)

});


  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
router.delete('/:id', validateUser, async (req, res) => {
  try {
    const user = await User.getById(req.params.id)
    User.remove(user)
    res.status(200).json(user)
    } catch (err) {
     res.status(500).json({message: 'Error deleting'})
    }
});


  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
router.get('/:id/posts', validateUser, (req, res) => {
  const { id } = req.params
  User.getUserPosts(id)
  .then(message =>{
    res.status(200).json(message)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Error retrieving posts"})
  }) 

});


  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
router.post(
  '/:id/posts', 
  validateUserId, 
  validatePost,
  async (req, res) => {
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'something tragic inside posts router happenned',
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router