#!/usr/bin/env node

var fs = require('fs');
var HipchatClient = require('hipchat-client');
var Steam = require('steam');
var util = require('util');
var _ = require('lodash');

var hipchat = new HipchatClient(process.env.HIPCHAT_TOKEN);

var FRIENDS = _.zipObject(process.env.USER_IDS.split(','),
                          process.env.USER_NAMES.split(','));

function message(text, color, notify) {
  hipchat.api.rooms.message({
    room_id: process.env.HIPCHAT_ROOM,
    from: process.env.HIPCHAT_FROM,
    message: text,
    color: color,
    notify: notify
  }, function (err) {
    if (err) {
      console.error('hipchat error', err);
    }
  });
}

var user = {
  accountName: process.env.ACCOUNT_NAME,
  password: process.env.PASSWORD
};

if (process.argv[2]) {
  user.authCode = process.argv[2];
}

if (fs.existsSync('./.sentry')) {
  user.shaSentryfile = fs.readFileSync('./.sentry');
}

var steam = new Steam.SteamClient();

steam.logOn(user);

steam.on('error', function (err) {
  console.error(err);
});

steam.on('loggedOn', function () {
  console.log('logged on');
});

steam.on('sentry', function (sentry) {
  fs.writeFile('./.sentry', sentry, function (err) {
    if (err) {
      throw err;
    }

    console.log('wrote sentry');
  });
});

steam.on('user', function (user) {
  console.log('user', JSON.stringify(user, null, 2));

  if (!FRIENDS[user.friendid]) {
    return;
  }

  var profileUrl = util.format(
    '<a href="http://steamcommunity.com/profiles/%s">%s</a>',
    user.friendid,
    FRIENDS[user.friendid]);

  var gameUrl = util.format(
    '<a href="http://store.steampowered.com/app/%s/">%s</a>',
    user.gameid,
    user.gameName);

  if (user.gameName) {
    message(util.format('%s is now playing %s', profileUrl, gameUrl), 'green',
            1);
  } else {
    message(util.format('%s is no longer playing a game', profileUrl),
            'yellow', 0);
  }
});
