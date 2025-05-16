const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db_connect");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query("select * from users where id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    done(null, result.rows[0]);
  });
});

const local = passport.use(
  new LocalStrategy(function (username, password, done) {
    pool.query(
      "select * from users where name = $1",
      [username],
      async (err, result) => {
        const user = result.rows[0];
        // need to handle the exception for no user returned
        try {
          const matchedPw = await bcrypt.compare(password, user.password);
          // console.log(matchedPw);
          if (err) return done(err);
          if (!user) return done(null, false);
          if (!matchedPw) return done(null, false);
          return done(null, user);
        } catch (error) {
          console.log(error);
          return;
        }
      }
    );
  })
);

module.exports = local;
