const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const Twit = require('twit');
const T = new Twit(config);
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function tweet() {
    T.get('search/tweets', { q: 'i cant sleep', result_type: 'recent' }, function(err, data) {
        var userName = data.statuses[0].user.screen_name;
        // console.log(data.statuses[0]);

        if (data.statuses[0].in_reply_to_user_id !== null ? console.log('it was a retweet') : processing());

        function processing() {
            let randomNumber = Math.floor(Math.random() * (35)) + 1;

            var filename = 'public/' + randomNumber + '.jpg';
            var params = {
                encoding: 'base64'
            }
            var b64 = fs.readFileSync(filename, params);

            T.post('media/upload', { media_data: b64 }, uploaded);

            function uploaded(err, data, response) {

                var id = data.media_id_string;
                var tweet = {
                    status: '.@' + userName + ' Helo i came to help u slep',
                    media_ids: [id]
                }

                T.post('statuses/update', tweet, tweeted);

                function tweeted(err, data, response) {
                    if (err) {
                        console.log("Oops!" + err);
                    } else {
                        console.log("Yay!");
                    }
                }

            }

        }
    });
}

tweet();
var dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(tweet, dayInMilliseconds / 5);
