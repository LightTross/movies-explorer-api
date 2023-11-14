# **Фильмы**
Дипломная работа от Яндекс Практикума
Репозиторий для приложения проекта `movies-explorer`, бэкенд часть приложения со следующими возможностями: авторизации и регистрации пользователей, операции с фильмами и пользователями.

### Поддерживаемые маршруты:
----------------------------
/signup - регистрация пользователя
/signin - авторизация пользователя
GET /users/me - возвращает информацию о текущем пользователе
PATCH /users/me — обновляет профиль(email и имя)
GET /movies - возвращает все сохранённые текущим пользователем фильмы
POST /movies - создаёт фильм с переданными данными(country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId)
DELETE /movies/_id - удаляет сохранённый фильм по id

### В проекте были использованы следующие технологии:
-----------------------------------------------------
* Rest API
* Node.js
* Express.js
* MongoDB
* Сelebrate
* Winston
* Helmet
* Limitter
-----------------------------------------------------

### Ссылка на репозиторий:
[https://github.com/LightTross/movies-explorer-api/tree/level-1]

## Ссылки на проект

IP 51.250.29.174

Backend api.talalayeva.promovies.nomoredomains.rocks/

### Инструкция по развёртыванию:
--------------------------------
Клонируем репозиторий через ssh:

    git clone git@github.com:LightTross/movies-explorer-api.git

Устанавливаем зависимости:

    npm install

Запускаем сервер:

    npm run start

Запускаем сервер с hot-reload:

    npm run dev 

### Планы по доработке проекта:
-------------------------------
* улучшить валидацию
