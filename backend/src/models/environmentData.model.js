import { Schema, model } from "mongoose";

const environmentDataSchema = new Schema(
  {
    humidity:{
        type:Number,
    },
    temperature:{
        type:Number,
    },
    ch4_ppm:{
        type:Number
    },
  },
  { timestamps: true }
);

const environmentData = model("environmentData", environmentDataSchema);

export default environmentData;