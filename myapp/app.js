var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var new_userRouter = require('./routes/new_user');
var usersRouter = require('./routes/utilisateurs');
var organisationRouter = require('./routes/organisation');
var fiche_de_posteRouter = require('./routes/fiche_de_poste');

// Nouveaux routers
const utilisateursRouter = require('./routes/utilisateurs');
const candidaturesRouter = require('./routes/candidatures');
const piecesRouter = require('./routes/pieces');

var offreRouter = require('./routes/offre');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routage principal
app.use('/', loginRouter);
app.use('/new_user', new_userRouter);
app.use('/users', usersRouter);

app.use('/utilisateurs', utilisateursRouter);
app.use('/candidatures', candidaturesRouter);
app.use('/pieces', piecesRouter);
app.use('/organisations',organisationRouter)
app.use('/fiche_de_poste',fiche_de_posteRouter)

app.use('/offre',offreRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;