const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"

const auth = (req, res, next) => {
  const header = req.headers.authorization
  let token = null

  if (header) {
    const headerParts = header.split(" ")
    if (headerParts.length > 1) {
      token = headerParts[1]
    }
  }

  const jwtHeader = {
    algorithm: "HS256"
  }

  if (token == null) {
    res.status(401).json({ message: "Unauthorized" })
  } else {
    jwt.verify(token, SECRET_KEY, jwtHeader, (error, user) => {
      if (error) {
        res
          .status(401)
          .json({
            message: "Invalid token"
          })
      } else {
        console.log(user)
        next()
      }
    })
  }
}

const isRole = (authRoles = []) => (req, res, next) => {
  const header = req.headers.authorization
  let token = null

  if (header) {
    const headerParts = header.split(" ")
    if (headerParts.length > 1) {
      token = headerParts[1]
    }
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  let decoded
  try {
    decoded = jwt.verify(token, SECRET_KEY)
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
    return
  }

  if (authRoles.includes(decoded.role)) {
    next()
  } else {
    res.json({
      message: "You are not authorized to access this resource"
    })
  }
}

module.exports = { auth, isRole }
