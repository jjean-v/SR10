var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const express = require('express'); 
// gestion de session
var session = require('./session');
const new_organisationRouter = require('./routes/organisation/new_organisation');

const app = express();

// Initialisation de la session
app.use(session.init());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Initialisation de la session
// check user before app.use (path, router)







app.all("*", function (req, res, next) {

  const nonSecurePaths = ["/","/utilisateurs/new_user","/authentification","/utilisateurs/creation_compte"]; //list des urls non sécurisées
  const adminPaths = []; //list des urls admin
  if (nonSecurePaths.includes(req.path)) return next();

  //authenticate user
  if (adminPaths.includes(req.path)) {
    if (session.isConnected(req.session, "admin")) return next();
    else
    res
    .status(403)
    .render("error", { message: " Unauthorized access", error: {} });
  } else {

    if (session.isConnected(req.session)) return next();
    // not authenticated
    else res.redirect("/");
  }
});

// Middleware global
app.use((req, res, next) => {
    res.locals.nom = req.session.nom || null;
    res.locals.prenom = req.session.prenom || null;
    res.locals.role = req.session.role || null;

    next();
});


// Routeurs
const loginRouter = require('./routes/login');

const organisationRouter = require('./routes/organisation/organisation');
const fiche_de_posteRouter = require('./routes/fiche_de_poste');
const utilisateursRouter = require('./routes/utilisateur');
const candidaturesRouter = require('./routes/candidatures');
const piecesRouter = require('./routes/pieces');

const offreRouter = require('./routes/offre');
const connexionRouter = require('./routes/connexion');

const new_candidatureRouter = require('./routes/new_candidature');
const new_fiche_de_posteRouter = require('./routes/new_fiche_de_poste');




// Routage principal
app.use('/', loginRouter);


app.use('/utilisateurs', utilisateursRouter);
app.use('/candidatures', candidaturesRouter);
app.use('/pieces', piecesRouter);
app.use('/organisations',organisationRouter)
app.use('/fiche_de_poste',fiche_de_posteRouter)

app.use('/offre', offreRouter)
app.use('/new_candidature', new_candidatureRouter);
app.use('/new_fiche_de_poste', new_fiche_de_posteRouter);
app.use('/new_organisation', new_organisationRouter);

app.use('/authentification', connexionRouter);


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
