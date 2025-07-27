import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';



export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const whereClause = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                rating: true,
                isVerified: true
              }
            }
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pricePerUnit: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Products retrieved successfully",
      products,
      count: products.length
    });

  } catch (error) {
    console.error('GetAllProducts Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving products",
      error: error.message
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await prisma.product.findMany({
      where: { category },
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                rating: true,
                isVerified: true
              }
            }
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pricePerUnit: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Products retrieved successfully",
      products,
      count: products.length
    });

  } catch (error) {
    console.error('GetProductsByCategory Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving products by category",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                description: true,
                rating: true,
                totalOrders: true,
                isVerified: true
              }
            }
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pricePerUnit: 'asc'
          }
        }
      }
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found"
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Product retrieved successfully",
      product
    });

  } catch (error) {
    console.error('GetProductById Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving product",
      error: error.message
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Search query is required"
      });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                rating: true,
                isVerified: true
              }
            }
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pricePerUnit: 'asc'
          },
          take: 3 // Show top 3 suppliers per product
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Search results retrieved successfully",
      products,
      count: products.length,
      query: q
    });

  } catch (error) {
    console.error('SearchProducts Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error searching products",
      error: error.message
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, unit, imageUrl } = req.body;

    if (!name || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Name and category are required"
      });
    }

    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        category
      }
    });

    if (existingProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product with this name already exists in this category"
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        unit: unit || 'kg',
        imageUrl
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error('AddProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error adding product",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, category, unit, imageUrl } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found"
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(unit && { unit }),
        ...(imageUrl && { imageUrl })
      },
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                rating: true
              }
            }
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error('UpdateProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating product",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        _count: {
          select: {
            suppliers: true,
            orders: true
          }
        }
      }
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found"
      });
    }

    // Check if product has active orders
    if (product._count.orders > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot delete product with existing orders"
      });
    }

    // Delete product (this will also delete related supplier products due to cascade)
    await prisma.product.delete({
      where: { id: productId }
    });

    res.status(StatusCodes.OK).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error('DeleteProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting product",
      error: error.message
    });
  }
};