const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const webhookURL = 'https://discord.com/api/webhooks/1238506414163493045/FSrenW5e4KrYmG5f5eHhguVgUOKixaGrhThBBKnjz4kswqEFjFjCO7lERsLojcJpKkaS';

// Configuration de session pour stocker l'état d'authentification
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
    clientID: '1238509323693326366',
    clientSecret: 'OM_Marps_fLqkxfJ5ITDiAzMF1tiAEWa',
    callbackURL: 'http://noefirst.github.io/votebouteille/callback', // L'URL de rappel après l'authentification
    scope: ['identify'] // Demander l'accès aux informations d'identification de l'utilisateur
}, (accessToken, refreshToken, profile, done) => {
    // Cette fonction est appelée après que l'utilisateur a été authentifié avec Discord
    // Ici, vous pouvez gérer la logique pour récupérer les informations du profil
    return done(null, profile);
}));

// Middleware pour vérifier si l'utilisateur est authentifié
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/login', passport.authenticate('discord'));

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
    // Rediriger l'utilisateur vers la page de vote après l'authentification réussie
    res.redirect('/vote');
});

app.get('/vote', ensureAuthenticated, (req, res) => {
    // Renvoie la page HTML de vote
});

app.post('/vote', ensureAuthenticated, (req, res) => {
    const { username, profilePic, banner } = req.user;

    // Envoie le message au webhook Discord
    const embed = {
        color: 0x0099ff,
        title: 'Nouveau Vote !',
        description: `${username} a voté pour Bouteille !`,
        thumbnail: {
            url: profilePic
        },
        image: {
            url: banner
        }
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        console.error('Erreur :', error);
        res.sendStatus(500);
    });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
