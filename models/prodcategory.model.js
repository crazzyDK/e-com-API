import mongoose from "mongoose";

const prodcategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  }
},
{
  timestamps: true,
});

const ProdCategory = mongoose.model("PCategory", prodcategorySchema);

export default ProdCategory;