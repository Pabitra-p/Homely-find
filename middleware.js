module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const Listing = require("./models/listing");
const review = require("./models/review.js");
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can not edit this information");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

const { listingSchema } = require("./schema.js");
const CustomError = require("./utils/CustomError.js");
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new CustomError(400, errMsg);
  } else {
    next();
  }
};

const Review = require("./models/review");
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const cleanedReviewId = reviewId.trim();
  let review = await Review.findById(cleanedReviewId);
  if (!review.createdBy._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can not delete this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

const { bookingSchema } = require("./schema.js");

module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new CustomError(400, errMsg);
  } else {
    next();
  }
};
