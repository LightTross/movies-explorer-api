const router = require('express').Router();

const {
  createUser,
  login,
  signout,
  checkCookie,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const { NotFoundError } = require('../errors/errors');

const { PageNotFound } = require('../errors/messageErrors');

const {
  signInValidation,
  signUpValidation,
} = require('../middlewares/validations');

router.get('/check', checkCookie);
router.post('/signup', signUpValidation, createUser);
router.post('/signin', signInValidation, login);
router.get('/signout', signout);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(PageNotFound));
});

module.exports = { router };
