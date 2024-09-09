import mongoose from "mongoose";

export const validatemongoID = async(id) => {
  const isValid =  await mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error('Invalid ID');
  }
}