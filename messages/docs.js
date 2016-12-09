var request = require('request');

exports.searchDocs = function searchDocs(searched) {
    return new Promise((resolve, reject) => {
        parm = encodeURIComponent(searched);
        url = process.env['DocsSearchApiUrl'].replace('{0}', parm);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve({
                    'results': JSON.parse(body).results,
                    'searched': searched
                });
            }
        });
    });
};

exports.createReplyFromResults = function createReplyFromResults(results, searched) {
    return new Promise((resolve, reject) => {
        var reply = '';
        if (results.length == 0)
            reply = 'No results found'
        else {
            reply = 'Here are the top ' + results.length + ' results for your search for "' + searched + '":\n';
            results.forEach(function (result) {
                reply += '- [{1}]({0})\n'.replace('{0}', result.url).replace('{1}', result.title);
            });
        }
        resolve(reply);
    });
};