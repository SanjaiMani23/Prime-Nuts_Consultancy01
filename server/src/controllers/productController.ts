import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      search,
      badge,
      minPrice,
      maxPrice,
      weight,
      sort,
      featured,
      bestSeller,
      limit,
    } = req.query;

    const query: any = { isActive: true };

    // Filter by Category
    if (category && typeof category === 'string' && category !== 'All') {
      const catNorm = category.toLowerCase().replace(/[-_]/g, ' ').trim();
      let matchedCategory = '';
      if (['nuts', 'nut', 'nuts kernels', 'nuts & kernels'].includes(catNorm)) matchedCategory = 'Nuts';
      else if (['dried fruits', 'dry fruits', 'dry fruit', 'dried fruit', 'dryfruits'].includes(catNorm)) matchedCategory = 'Dried Fruits';
      else if (['seeds', 'seed', 'super seeds'].includes(catNorm)) matchedCategory = 'Seeds';
      else if (['combos', 'combo', 'combos packs', 'combos & packs', 'packs'].includes(catNorm)) matchedCategory = 'Combos';
      else if (['gift packs', 'gifts', 'gift pack'].includes(catNorm)) matchedCategory = 'Gift Packs';
      else if (['snacks', 'snack'].includes(catNorm)) matchedCategory = 'Snacks';
      
      if (matchedCategory) {
        query.category = matchedCategory;
      }
    }

    // Filter by Search Query
    if (search && typeof search === 'string') {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { tamilName: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by Badge
    if (badge && typeof badge === 'string') {
      query.badges = badge;
    }

    // Filter by Featured / Best Seller
    if (featured === 'true') query.isFeatured = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    // Filter by Weight variant
    if (weight && typeof weight === 'string') {
      query['variants.weight'] = { $regex: weight, $options: 'i' };
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = Number(minPrice);
      if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sort === 'price-low') {
      productsQuery = productsQuery.sort({ 'variants.0.price': 1 });
    } else if (sort === 'price-high') {
      productsQuery = productsQuery.sort({ 'variants.0.price': -1 });
    } else if (sort === 'rating') {
      productsQuery = productsQuery.sort({ rating: -1 });
    } else if (sort === 'newest') {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    } else {
      // Default: Popularity / Best Seller first
      productsQuery = productsQuery.sort({ isBestSeller: -1, reviewCount: -1 });
    }

    // Limit count
    if (limit) {
      const l = parseInt(limit as string, 10);
      if (!isNaN(l)) {
        productsQuery = productsQuery.limit(l);
      }
    }

    const products = await productsQuery.exec();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    // Check if slug is an object ID
    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: slug } : { slug };
    
    const product = await Product.findOne(query);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Fetch related products in the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    if (!data.name || !data.category || !data.variants || data.variants.length === 0) {
      res.status(400).json({ success: false, message: 'Name, category, and at least one weight variant are required.' });
      return;
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const productData = {
      ...data,
      slug: data.slug || slug,
      defaultWeight: data.defaultWeight || data.variants[0].weight,
      createdAt: new Date().toISOString(),
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const deleted = await Product.findOneAndDelete(query);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Product removed from catalog',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
