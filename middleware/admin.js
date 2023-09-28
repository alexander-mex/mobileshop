module.exports = function(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    res.locals.isAdmin = true;
    return next();
  } else {
    res.status(403).send('Доступ запрещен. Только администраторы могут получить доступ к этой функции.');
  }
};