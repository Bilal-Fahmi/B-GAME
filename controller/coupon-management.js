const Coupon = require("../models/couponSchema");

const couponCheck = async (coupon_id) => {
  try {
    const coupon = await Coupon.findOne({ coupon_id });
    return coupon ? true : false;
  } catch (error) {
    console.error(error);
  }
};

const addcoupon = (req, res) => {
  console.log(req.body);
  const newCoupon = new Coupon({
    code: req.body.code,
    status: req.body.status,
    user_allowed: req.body.user_allowed,
    minimum_purchase: req.body.minimum_purchase,
    claimed_users: req.body.claimed_users,
    last_updated: req.body.last_updated,
    last_updated_user: req.body.last_updated_user,
    expiry: req.body.expiry,
    discount: req.body.discount,
  });

  newCoupon.save((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.redirect("/admin/coupontable");
    }
  });
};

const allcoupons = (req, res) => {
  Coupon.find({}, (error, coupons) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      res.send(coupons);
    }
  });
};

const singlecoupon = (req, res) => {
  Coupon.findOne({ code }, (error, coupon) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      res.send(coupon);
    }
  });
};

const updatecoupon = (req, res) => {
  Coupon.findOneandUpdate(
    { code },
    { discount },
    { user_allowed },
    { minimum_purchase },
    { expiry },
    (error) => {
      if (error) {
        res.send("Something went wrong");
      } else {
        res.send("Coupon updated successfully");
      }
    }
  );
};

const listcoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Listed" } }
    ).then(() => {
      res.redirect("/admin/coupontable");
    });
  } catch (err) {
    next(err);
  }
  {
  }
};

const unlistcoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Unlisted" } }
    ).then(() => {
      res.redirect("/admin/coupontable");
    });
  } catch (err) {
    next(err);
  }
};

const deletecoupon = async (req, res) => {
  try {
    const code = req.params.code;
    await Coupon.deleteOne({ code: code }).then(() => {
      res.redirect("/admin/coupontable");
      console.log("coupon deleted");
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  couponCheck,
  addcoupon,
  allcoupons,
  singlecoupon,
  updatecoupon,
  deletecoupon,
  listcoupon,
  unlistcoupon,
};
