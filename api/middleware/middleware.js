// const { router } = require("../server")

const User = require('../users/users-model')
const Post = require('../posts/posts-model')

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}` 
  )
  next()
}

async function validateUserId(req, res, next) {
  const { id } = req.params
  try {
    const user = await User.getById(id)

  if(!user) {
    res.status(404).json({message: "user not found"})
    next()
  } else {
    res.status(201).json(user)
    req.user = user
    next()
    }
  }

  catch(err) {
    res.status(500).json({
      message: "Error",
    })
  }
}

function validateUser(req, res, next) {

 try {  
  const { name } = req.body

    if(!name) {
      res.status(400).json({
        message: "missing required name field",
        err: err.message,
        stack: err.stack,
      })
    } else {
      res.status(201).json(name)
      next()
    } 
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

function validatePost(req, res, next) {
  try {  
    const { text } = req.body
    if(!text || !text.trim()) {
      res.status(400).json({
        message: "missing required text field"
      })
    } else {
     res.status(201).json(text)
      next()
    }
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  validateUser, 
  validateUserId, 
  logger, 
  validatePost,
}