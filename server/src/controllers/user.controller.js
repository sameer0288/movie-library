import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

// Function to handle signup logic
const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user with the same email already exists
    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
      console.log("Signup error: email already used");
      return responseHandler.badrequest(res, "email already used");
    }

    // Create new user
    const user = new userModel();
    user.displayName = displayName;
    user.email = email;
    user.setPassword(password);
    await user.save();

    // Generate a token
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24d" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error("Signup error:", error);
    responseHandler.error(res);
  }
};

// Function to handle signin logic
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email }).select("email password salt id displayName");
    if (!user) {
      console.log("Signin error: User not exist");
      return responseHandler.badrequest(res, "User not exist");
    }

    // Validate password
    if (!user.validPassword(password)) {
      console.log("Signin error: Wrong password");
      return responseHandler.badrequest(res, "Wrong password");
    }

    // Generate a token
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive fields before sending the response
    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error("Signin error:", error);
    responseHandler.error(res);
  }
};

// Function to handle password update
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    // Find user by id
    const user = await userModel.findById(req.user.id).select("password id salt");
    if (!user) {
      console.log("Update password error: Unauthorized user");
      return responseHandler.unauthorize(res);
    }

    // Validate current password
    if (!user.validPassword(password)) {
      console.log("Update password error: Wrong password");
      return responseHandler.badrequest(res, "Wrong password");
    }

    // Update password
    user.setPassword(newPassword);
    await user.save();

    responseHandler.ok(res);
  } catch (error) {
    console.error("Update password error:", error);
    responseHandler.error(res);
  }
};

// Function to get user info
const getInfo = async (req, res) => {
  try {
    // Find user by id
    const user = await userModel.findById(req.user.id);
    if (!user) {
      console.log("Get info error: User not found");
      return responseHandler.notfound(res);
    }

    responseHandler.ok(res, user);
  } catch (error) {
    console.error("Get info error:", error);
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword
};
