module.exports = (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'You must log in!' });
    }

    if (!req.user.admin && !req.user.apexAdmin){
        return res.status(401).send({ error: 'unAuthorized Route'})
    }
  
    next();
  };