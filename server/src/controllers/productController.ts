import { Request, Response } from 'express';
import { memoryStore, saveStoreToFile } from '../config/db';
import { Product } from '../types';

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

    let products = memoryStore.products.filter(p => p.isActive);

    // Filter by Category
    if (category && typeof category === 'string' && category !== 'All') {
      const catNorm = category.toLowerCase().replace(/[-_]/g, ' ').trim();
      products = products.filter(p => {
        const pCatNorm = p.category.toLowerCase().replace(/[-_]/g, ' ').trim();
        if (pCatNorm === catNorm) return true;
        // Alias mappings
        if ((catNorm === 'nuts' || catNorm === 'nut' || catNorm === 'nuts kernels' || catNorm === 'nuts & kernels') && pCatNorm === 'nuts') return true;
        if ((catNorm === 'dried fruits' || catNorm === 'dry fruits' || catNorm === 'dry fruit' || catNorm === 'dried fruit' || catNorm === 'dryfruits') && pCatNorm === 'dried fruits') return true;
        if ((catNorm === 'seeds' || catNorm === 'seed' || catNorm === 'super seeds') && pCatNorm === 'seeds') return true;
        if ((catNorm === 'combos' || catNorm === 'combo' || catNorm === 'combos packs' || catNorm === 'combos & packs' || catNorm === 'packs') && pCatNorm === 'combos') return true;
        if ((catNorm === 'gift packs' || catNorm === 'gifts' || catNorm === 'gift pack') && pCatNorm === 'gift packs') return true;
        if ((catNorm === 'snacks' || catNorm === 'snack') && pCatNorm === 'snacks') return true;
        return false;
      });
    }

    // Filter by Search Query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // Filter by Badge
    if (badge && typeof badge === 'string') {
      products = products.filter(p => p.badges && p.badges.includes(badge as any));
    }

    // Filter by Featured / Best Seller
    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }
    if (bestSeller === 'true') {
      products = products.filter(p => p.isBestSeller);
    }

    // Filter by Weight variant
    if (weight && typeof weight === 'string') {
      products = products.filter(p =>
        p.variants.some(v => v.weight.toLowerCase().includes(weight.toLowerCase()))
      );
    }

    // Filter by Price Range
    if (minPrice) {
      const min = Number(minPrice);
      products = products.filter(p => p.variants.some(v => v.price >= min));
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      products = products.filter(p => p.variants.some(v => v.price <= max));
    }

    // Sorting
    if (sort === 'price-low') {
      products.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (sort === 'price-high') {
      products.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: Popularity / Best Seller first
      products.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.reviewCount - a.reviewCount;
      });
    }

    // Limit count
    if (limit) {
      const l = parseInt(limit as string, 10);
      if (!isNaN(l)) {
        products = products.slice(0, l);
      }
    }

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
    const product = memoryStore.products.find(p => p.slug === slug || p.id === slug);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Fetch related products in the same category
    const related = memoryStore.products
      .filter(p => p.category === product.category && p.id !== product.id && p.isActive)
      .slice(0, 4);

    res.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
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

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: data.slug || slug,
      name: data.name,
      tamilName: data.tamilName || '',
      category: data.category,
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      quote: data.quote || '',
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=900&q=80'
      ],
      variants: data.variants,
      defaultWeight: data.defaultWeight || data.variants[0].weight,
      rating: 5.0,
      reviewCount: 1,
      badges: data.badges || [],
      ingredients: data.ingredients || [],
      storage: data.storage || 'Store in airtight container.',
      origin: data.origin || 'Sundarapuram, Coimbatore',
      isFeatured: !!data.isFeatured,
      isBestSeller: !!data.isBestSeller,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
    };

    memoryStore.products.unshift(newProduct);
    saveStoreToFile();

    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = memoryStore.products.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updated = {
      ...memoryStore.products[index],
      ...req.body,
    };

    memoryStore.products[index] = updated;
    saveStoreToFile();

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = memoryStore.products.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    memoryStore.products.splice(index, 1);
    saveStoreToFile();

    res.json({
      success: true,
      message: 'Product removed from catalog',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
