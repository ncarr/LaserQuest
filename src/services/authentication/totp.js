// Would have been great, but totally unused

const feathersLocal = require('feathers-authentication-local');
const TotpStrategy = require('passport-totp').Strategy;

const defaults = {
  name: 'totp',
  usernameField: 'email',
  passwordField: 'password'
};

module.exports = function init(options = {}) {
  return function totpAuth() {
    const app = this;
    const _super = app.setup;

    if (!app.passport) {
      console.log(app);
      throw new Error(`Can not find app.passport. Did you initialize feathers-authentication before feathers-authentication-totp?`);
    }

    let name = options.name || defaults.name;
    let authOptions = app.get('auth') || {};
    let localOptions = options;
    let localSettings = {};
    localSettings.name = localOptions.name || defaults.name;
    localSettings.usernameField = localOptions.usernameField || defaults.usernameField;
    localSettings.passwordField = localOptions.passwordField || defaults.passwordField;

    app.setup = function () {
      let result = _super.apply(this, arguments);
      let localVerifier = new feathersLocal.Verifier(app, localSettings);

      if (!localVerifier.verify) {
        throw new Error(`Your verifier must implement a 'verify' function. It should have the same signature as a local passport verify callback.`)
      }

      // Register 'local' strategy with passport
      app.passport.use(localSettings.name, new feathersLocal.Strategy(localSettings, localVerifier.verify.bind(localVerifier)));
      app.passport.use(localSettings.name, new TotpStrategy(function(user, done) {
        // setup function, supply key and period to done callback
        app.service('user').get(user.id, function(err, obj) {
          if (err) { return done(err); }
          return done(null, obj.mfa, 30);
        });
      }));

      return result;
    }
  };
}
