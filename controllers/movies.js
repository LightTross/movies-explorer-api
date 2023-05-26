const Movies = require('../models/movie');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors/errors');

// создаем фильм
module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movies.create({
      owner: req.user._id,
      ...req.body,
    });
    return res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

// получаем все сохранённые текущим  пользователем фильмы
module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movies.find({ owner: req.user._id });
    if (!movies) {
      res.send('Не найдено');
    }
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

// удаляем фильм
module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movies.findById(req.params.movieId);
    if (!movie) {
      return next(new NotFoundError('Не найдено'));
    }
    if (movie.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Недостаточно прав для удаления'));
    }
    const deleteMovie = await Movies.findByIdAndRemove(req.params.movieId);
    return res.send({ message: `Фильм ${deleteMovie.nameRU} удален из сохраненных` });
  } catch (err) {
    return next(err);
  }
};
