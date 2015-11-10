// may have to hit the page manually and enter captcha before this works
var request = require('request');
var cheerio = require('cheerio');

// request one URL at a time to make sure don't get blocked by captcha
// use command line argument to specify which page to request
var pageRequest = process.argv[2];
if (typeof pageRequest == 'undefined') {
    console.log('\nPlease remake request with a command-line argument indicating which page to request.\n');
    return;
}

var url = 'http://www.freeimages.com/search/animal?orientation=s&resolution=-1m&page=' + pageRequest;

request(url, function (err, res, html) {
    if (!err && res.statusCode == 200) {

        var $ = cheerio.load(html);
        var allAvatars = $('.thumb-img.offset-preview > img').toArray();

        if (allAvatars.length == 0) {
            console.log("\nREQUEST BLOCKED BY CAPTCHA, OR INVALID REQUEST\n");
            return;
        }

        allAvatars.forEach(function(img) {
            saveToMongo(img.attribs.src);
        });

        console.log('\nsuccess!\n');
    }
    else {
        console.log('error occurred:');
        console.log(err);
    }
});

function saveToMongo(imageURL) {
    var formData = {
        url: imageURL
    }

    request.post('http://trofir.com/api/avatars').form(formData);
}
