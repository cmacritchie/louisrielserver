module.exports = (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'You must log in!' });
    }

    if (!req.user.admin){
        return res.status(401).send({ error: 'unAuthorized Route'})
    }
  
    next();
  };