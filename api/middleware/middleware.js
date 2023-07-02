const { router } = require("../server")

const User = require('../users/users-model')
const Post = require('../posts/posts-model')

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}` 
  )
  next()
}

async function validateUserId(req, res, next) {
  try {
    const find = await User.getById(req.params.id)

  if(find) {
    res.json(req.user)
    next()
  } else {
      res.status(404).json({
      message: "user not found",
      err: err.message,
      stack: err.stack,
    })
  }
}
catch(err) {
  res.status(500).json({
    message: "Error",
  })
}
}

function validateUser(req, res, next) {

  const { name } = req.body
  if(!name) {
    res.status(400).json({
      message: "missing required name field",
      err: err.message,
      stack: err.stack,
    })
  } else {
    next()
  } 
}

function validatePost(req, res, next) {
  const { text } = req.body
  if(!text || !text.trim()) {
    res.status(400).json({
      message: "missing required text field"
    })
  } else {
    res.text = text.trim()
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  validateUser, 
  validateUserId, 
  logger, 
  validatePost,
}