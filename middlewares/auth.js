const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { Unauthorized } = require('../errors/messageErrors');

module.exports = (req, res, next) => {
  // извлекаем токен
  const token = req.cookies.jwt;
  let payload;

  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError(Unauthorized));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  return next();
};