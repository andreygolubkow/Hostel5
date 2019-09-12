let app = new (require("express")).Router();
const models = require("./../models");
const passport = require("passport");
const VKontakteStrategy = require("passport-vkontakte").Strategy;
const config = require("../config");

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new VKontakteStrategy(
    {
      clientID: config.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
      clientSecret: config.VKONTAKTE_APP_SECRET,
      callbackURL: config.VK_CALLBACK,
      profileFields: ["bdate"],
      apiVersion: "5.17"
    },
    function(accessToken, refreshToken, params, profile, done) {
      // console.log(params.email); // getting the email
      models.User.findOrCreate(
        { vkId: profile.id },
        {
          vkId: profile.id,
          name: profile.displayName,
          username: profile.username,
          url: profile.url
        },
        {},
        function(err, user) {
          return done(err, user);
        }
      );
    }
  )
);

// Сериализация паспорта
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// ДеСериализация паспорта
passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get(
  "/auth/vk/callback",
  passport.authenticate("vkontakte", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/cabinet/");
  }
);

app.get(
  "/auth/vk",
  passport.authenticate("vkontakte", { scope: ["email", "notify"] }),
  function(req, res) {}
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = app;
