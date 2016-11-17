var request = require('request');

exports.searchDocs = function searchDocs(searched) {
    return new Promise((resolve, reject) => {
        url = 'https://docs.microsoft.com/api/search?Search={0}&Locale=en-us&$top=5'.replace('{0}', searched);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body).results);
            }
        });
    });
};

exports.createReplyFromResults = function createReplyFromResults(results) {
    return new Promise((resolve, reject) => {
        var reply = '';
        if (results.length == 0)
            reply = 'No results found'
        else {
            reply = 'Here are the top ' + results.length + ' results for your search:\n';
            results.forEach(function (result) {
                reply += '- [{1}]({0})\n'.replace('{0}', result.url).replace('{1}', result.title);
            });
        }
        resolve(reply);
    });
};