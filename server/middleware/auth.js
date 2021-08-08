function auth(req, res, next) {
  if (req.session.auth) {
    return next()
  }
  res.status(403).send({message:"Не авторизован"})
}

module.exports = auth
