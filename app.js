const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const CustomError = require("./utils/CustomError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const User = require("./models/user.js");

const mongo_Url = "mongodb://127.0.0.1:27017/homely-find";
async function main() {
  await mongoose.connect(mongo_Url);
}
const sessionOption = {
  secret: "secreatCode",
  resave: false,
  saveUninitialized: true,
  Cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listing", listing);
app.use("/listing/:id/review", review);
app.use("/", user);

app.listen(3000, (req, res) => {
  console.log("app is listening on port 3000");
});

app.get("/", (req, res) => {
  console.log("i am the root directory");
});

app.use("/session", (req, res) => {});

//error hanndling for unknown pages
app.all("*", (err, req, res, next) => {
  next(new CustomError(500, "Page Not Found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});
