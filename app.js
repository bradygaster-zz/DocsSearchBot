var restify = require('restify');
var builder = require('botbuilder');
var docs = require('./docs');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// create the bot and wire up the dialogs
var bot = new builder.UniversalBot(connector, function (session) {
    if (session.message.text == 'help' || session.message.text == 'hi') {
        session.beginDialog('/fre');
    }
    else {
        session.beginDialog('/search');
    }
});

// perform the search
bot.dialog('/search', function (session) {
     docs.searchDocs(session.message.text)
        .then((result) => {
            docs.createReplyFromResults(result.results, result.searched)
                .then((reply) => {
                    session.send(reply);
                    session.endDialog();
                });
        });
});

// introduce the bot
bot.dialog('/fre', function (session) {
    session.send('Welcome to the [docs.microsoft.com](http://docs.microsoft.com) search bot. Simply type in a search term (\'ASP.NET\', \'StringBuilder\', or \'IPrincipal\', for example), and I\'ll find you relevant links from our documentation.');
    session.endDialog();
});