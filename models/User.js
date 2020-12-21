const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
	type: String,
	required: [true, "Please add a name"],
  },
  email: {
	type: String,
	required: [true, "Please add an email"],
	unique: true,
	match: [
	  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
	  "Please add a valid email",
	],
  },
  role: {
	type: String,
	enum: ["user", "publisher"],
	default: "user",
  },
  password: {
	type: String,
	required: [true, "Please add a password"],
	minlength: [6, "Password must be at least 6 characters"],
	select: false,
  },
  resetPasswordToken: {
	type: String,
  },
  resetPasswordExpire: {
	type: Date
  },
  createdAt: {
	type: Date,
	default: Date.now(), 
  },
});

//encrypt password
UserSchema.pre("save", async function (next) {
	if(!this.isModified('password')){
		next();
	}
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT signature
UserSchema.methods.getJWTSignature = function () {
  console.log("JWTID" + this._id);
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
	expiresIn: process.env.JWT_EXPIRE,
  });
};

// Authenticate User with password and hashed password in db
UserSchema.methods.authPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Generate and hash Passwork token

UserSchema.methods.getResetPasswordToken = function () {
  // Generate a token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash Token and set to resetPassworktoken
	this.resetPasswordToken = crypto
	.createHash("sha256")
	.update(resetToken)
	.digest("hex"); 

	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return resetToken;
	
};
module.exports = mongoose.model("User", UserSchema);
