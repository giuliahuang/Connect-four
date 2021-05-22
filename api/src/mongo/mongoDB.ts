import mongoose = require('mongoose');
import * as user from '/workspace/api/src/users/User';

export async function setUpDB(){
// Connect to mongodb and launch the HTTP server trough Express
  try {
    await mongoose.connect('mongodb://localhost:27017/connectfourdb');
    console.log("Connected to MongoDB");
    const doc = await user.getModel().findOne({ mail: "admin@postmessages.it" });
    if (!doc) {
      console.log("Creating admin user");

      var u = user.newUser({
        username: "admin",
        mail: "admin@connectfour.it"
      });
      u.setAdmin();
      u.setModerator();
      u.setPassword("admin");
      return u.save();
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.log("Error Occurred during initialization");
    console.log(err);
  }
}

