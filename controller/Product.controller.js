import Product from '../models/product.model.js';
import User from '../models/User.model.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// create product
export const createProduct = asyncHandler(async(req, res) => {
  let { title, slug, description, price, category, brand, sold, quantity, images, color, ratings } = req.body;
  if (title) {
    slug = slugify(title, { lower: true });
  }
  try {
    const newProduct = new Product({
      title,
      slug,
      description,
      price,
      category,
      brand,
      sold,
      quantity,
      images,
      color,
      ratings,
    })
    await newProduct.save();
    res.json({
      message: 'Product created successfully',
      status: 201,
      success: true,
    })
  } catch (err) {
    throw new Error("Error creating product!");
  }
});

// get all products
export const getAllProducts = asyncHandler(async(req, res) => {
  // filtering products
  const queryObj = {...req.query};
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((field) => delete queryObj[field]); 
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // sorting products
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
    console.log(sortBy)
  } else {
    query.sort('-createdAt');
  }

  // limiting products
  if (req.query.fields) {
    const fields = req.query.fiels.split(',').join(' ');
    query.select(fields);
    console.log(fields)
  } else {
    query.select('-__v')
  }

  // pagination
  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1)* limit;
  query = query.skip(skip).limit(limit);
  if(req.query.page) {
    const productCount = await Product.countDocuments();
    if(skip>= productCount) {
      throw new Error('Page not found');
    }
  }
  console.log(page, limit, skip)

  try {
    const products = await query;
    res.json({
      products,
      status: 200,
      success: true,
    })
  } catch (err) {
    throw new Error("Error fetching products!");
  }
});

// get single product 
export const getProducts = asyncHandler(async(req, res) => {
  // const { id } = req.params;
  const products = await Product.find(req.query);
  if (!products) {
    throw new Error("Product not found!");
  }
  res.json({
    product: products,
    status: 200,
    success: true,
  })
});

// update products
export const updateProducts = asyncHandler(async(req, res) => {
  const { id } = req.params;
  let { title, slug, description, price, category, brand, sold, quantity, images, color, ratings } = req.body;
  const products = await Product.findById(id);
  try {
    if(title) {
      slug = slugify(title, { lower: true });
    }
    const newProducts = {
      title: title || products.title,
      slug: slug || products.slug,
      description: description || products.description,
      price: price || products.price,
      category: category || products.category,
      brand: brand || products.brand,
      sold: sold || products.sold,
      quantity: quantity || products.quantity,
      images: images || products.images,
      color: color || products.color,
      ratings: ratings || products.ratings,
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, newProducts , { new: true }); 
    res.json({
      message: 'Product updated successfully',
      status: 200,
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    throw new Error("Update failed!");
  }
});

// delete products
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product =  await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found!');
    }
    res.json({
      message: 'Product deleted successfully',
      status: 200,
      success: true,
    }); 
  } catch (error) {
    throw new Error("Delete failed!");
  }
});

// add wishlist
export const addWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user =  await User.findById(_id);
    const alredyAdded = user.wishlist.find((id) => id.toString() === prodId)
    if(alredyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      )
      return res.json({
        message: 'Product removed from wishlist successfully',
        status: 200,
        success: true,
        user
      })
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      )
      return res.json({
        message: 'Product added to wishlist successfully',
        status: 200,
        success: true,
        user
      })
    }
  } catch (error) {
    throw new Error(error);
  }
});

// rating
export const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId, star, comment } = req.body;
  try {
    const product =  await Product.findById(prodId);
    // const postedBy = req.user.postedBy;
    // console.log(postedBy)
    const alreadyRated = product.ratings.find((id) => id.postedBy.toString() === _id.toString())
    if(alreadyRated) {
      const updateProduct = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        { $push: 
          { ratings: 
            { 
              star, 
              comment, 
              postedBy: _id 
            } 
          } 
        },
        { new: true }
      )
    }
    const getallRating = await Product.findById(prodId);
    let totalRating = getallRating.ratings.length;
    console.log(totalRating)
    let ratingSum = getallRating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let averageRating = Math.round(ratingSum / totalRating);
    console.log(averageRating)
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {totalrating: averageRating},
      { new: true }
    );
    res.json({
      message: 'Product rating updated successfully',
      status: 200,
      success: true,
      product: finalProduct,
    })
  } catch (error) {
    throw new Error(error);
  }
});