import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    membershipNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    membershipType: {
      type: new mongoose.Schema(
        {
          name: { type: String, required: true, trim: true },
          maxBooks: { type: Number, required: true, min: 0 },
        },
        { _id: false },
      ),
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Member = mongoose.model("Member", memberSchema);
