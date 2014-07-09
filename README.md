## steam-hipchat

Get alerts in HipChat when your friends play games on Steam.

```sh
gem install foreman
cp env.example .env
$EDITOR .env
foreman start # this will fail since you need a Steam Guard code
... wait for an email from Steam Guard ...
foreman run ./index.js <Steam Guard code from the email>
```

After you specify a Steam Guard code your sentry hash will be saved to disk in
the file `.sentry` and you can launch steam-hipchat with `foreman start`.
