import mongoose from "mongoose";
import argon2 from "argon2"; // Import argon2 instead of bcryptjs

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
});

// Pre-save hook to hash password before saving it to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash password if it's modified

  try {
    // Hash the password using Argon2
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,  // Use the argon2id variant
      memoryCost: 65536,       // 64MB of memory
      timeCost: 3,             // 3 iterations
      parallelism: 4           // 4 parallel threads
    });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", UserSchema);
