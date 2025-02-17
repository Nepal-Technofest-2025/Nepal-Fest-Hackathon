import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who will receive the notification
      required: true,
    },
    isRead: {
      type: Boolean, // Marks if the notification has been read by this user
      default: false,
    },
    message: {
      type: String, // The notification message
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;