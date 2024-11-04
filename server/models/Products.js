import mongoose from "mongoose";
import validator from "validator";

const productSchema = new mongoose.Schema(
  {
    // USERID
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // TITLE
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value) => !validator.isEmpty(value),
        message: "Title cannot be empty",
      },
    },

    // PRICE
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // DESCRIPTION
    description: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !validator.isEmpty(value),
        message: "Description cannot be empty",
      },
    },

    // CATEGORY
    category: {
      type: String,
      trim: true,
    },

    // AUTHOR
    Seller: {
      name: {
        type: String,
        required: [true, "Seller name is required"],
        trim: true,
        validate: {
          validator: (value) => !validator.isEmpty(value),
          message: "Seller name cannot be empty",
        },
      },
    },

    // IMAGES
    images: [
      {
        type: String,
        validate: {
          validator: (value) => validator.isURL(value),
          message: "Each image must be a valid URL",
        },
      },
    ],

    // AVAILABILITY (QUANTITY)
    availability: {
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"],
      },
      in_stock: {
        type: Boolean,
        default: true,
      },
    },

    // DATE CREATED
    date_created: {
      type: Date,
      default: Date.now,
    },

    },

  // TIMESTAMPS
  { timestamps: true }
);

// COLLECTION
const Product = mongoose.model("Products", productSchema);

export default Product;