require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} = require('../errors/errors');

const {
  IncorrectData,
  DoubleMail,
  Exit,
  Unauthorized,
  SuccessCheck,
  UserIsNotFound,
} = require('../errors/messageErrors');

// создаем пользователя
module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash, name });
    res.status(201).send({
      email: newUser.email,
      name: newUser.name,
      _id: newUser._id,

    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(IncorrectData));
    } else if (err.code === 11000) {
      next(new ConflictError(DoubleMail));
    } else {
      next(err);
    }
  }
};

// Аутентификация пользователя
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign({ _id: user._id }, NODE_ENV ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        sameSite: true,
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ jwt: token });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.signout = async (req, res) => {
  res.clearCookie('jwt').send({ message: Exit });
};

// провека на куки
module.exports.checkCookie = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie) {
    throw new UnauthorizedError(Unauthorized);
  }
  const token = cookie.jwt;
  try {
    jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
    res.send({ message: SuccessCheck });
  } catch (err) {
    res.send({ message: Unauthorized });
  }
};

// получаем информацию о текущем пользователе
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return next(new NotFoundError(UserIsNotFound));
    }
    return res.send(currentUser);
  } catch (err) {
    return next(err);
  }
};

// обновляем профиль
module.exports.updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const updateProfile = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.send({ email: updateProfile.email, name: updateProfile.name });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(IncorrectData));
    } else if (err.name === 'MongoServerError') {
      next(new ConflictError(DoubleMail));
    }
    next(err);
  }
};
