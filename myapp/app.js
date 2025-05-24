var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const express = require('express'); 
// gestion de session
var session = require('./session');

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
const connexionRouter = require('./routes/connexion');


app.all("*", function (req, res, next) {

  const nonSecurePaths = ["/","/new_user","/authentification","/creation_compte"]; //list des urls non sécurisées
  const adminPaths = ["/organisations"]; //list des urls admin
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

app.use('/authentification', connexionRouter);





//app.use(flash());

app.get('/organisations', (req, res) => { 
    if (req.session.user) { 
        res.send('Bienvenue sur votre profil, ' + req.session.user + '!'); 
    } else { 
        res.redirect('/'); 
    }
  });
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