var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// gestion de session
const session = require('./model/session');

// Initialisation de la session
// check user before app.use (path, router)
app.all("*", function (req, res, next) {

  const nonSecurePaths = ["/","/authentification"];
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

 app.post('/authentification', (req, res) => {
  // Vérification des informations d'identification de l'utilisateur
  console.log(req.body);
  if (req.body.email == '14jean04@gmail.com' && req.body.password == 'pwd') {
    // Création d'une session utilisateur
    req.session.user = req.body.email;
    // Ajouter le rôle aussi dans la session
    req.session.role = 'user' ;
    res.send('Authentification réussie !');
  } else {
    res.send('Nom d\'utilisateur ou mot de passe incorrect.');
  }
});

// Routeurs
const loginRouter = require('./routes/login');
const new_userRouter = require('./routes/new_user');

const organisationRouter = require('./routes/organisation/organisation');
const fiche_de_posteRouter = require('./routes/fiche_de_poste');
const utilisateursRouter = require('./routes/utilisateur/utilisateurs');
const recruteurRouter = require('./routes/utilisateur/recruteur');
const candidaturesRouter = require('./routes/candidatures');
const piecesRouter = require('./routes/pieces');

const offreRouter = require('./routes/offre/offre');
const liste_recruteur_fiche_posteRouter = require('./routes/offre/creer_offre');
const new_offreRouter = require('./routes/offre/new_offre');
const new_candidatureRouter = require('./routes/new_candidature');
const new_fiche_de_posteRouter = require('./routes/new_fiche_de_poste');



// Routage principal
app.use('/', loginRouter);
app.use('/new_user', new_userRouter);
app.use('/creation_compte',new_userRouter);


app.use('/utilisateurs', utilisateursRouter);
app.use('/utilisateurs/recruteur', recruteurRouter);
app.use('/candidatures', candidaturesRouter);
app.use('/pieces', piecesRouter);
app.use('/organisations',organisationRouter)
app.use('/fiche_de_poste',fiche_de_posteRouter)

app.use('/offre', offreRouter)
app.use('/new_offre',liste_recruteur_fiche_posteRouter);
app.use('/creation_offre',new_offreRouter);
app.use('/new_candidature', new_candidatureRouter);
app.use('/new_fiche_de_poste', new_fiche_de_posteRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



app.post('/authentification', (req, res) => {
  // Vérification des informations d'identification de l'utilisateur
  if (req.body.email === '14jean04@gmail.com' && req.body.password === 'Vivesj') {
    // Création d'une session utilisateur
    req.session.user = req.body.username;
    // Ajouter le rôle aussi dans la session
    req.session.role = 'user' ;
    res.send('Authentification réussie !');
  } else {
    res.send('Nom d\'utilisateur ou mot de passe incorrect.');
  }
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
