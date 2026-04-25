import mongoose from "mongoose"

const checkboxSchema = new mongoose.Schema({
  states: {
    type: [Boolean],
    required: true,
    default: [],
  },
});

export const Checkbox = mongoose.model("Checkbox", checkboxSchema)