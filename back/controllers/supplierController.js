import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';


export const createSupplierProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyName, description } = req.body;

    // Check if user is a supplier
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.userType !== 'SUPPLIER') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Only supplier users can create supplier profile"
      });
    }

    // Check if supplier profile already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (existingSupplier) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Supplier profile already exists"
      });
    }

    const supplier = await prisma.supplier.create({
      data: {
        userId,
        companyName: companyName || user.name,
        description
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            city: true,
            area: true
          }
        }
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Supplier profile created successfully",
      supplier
    });

  } catch (error) {
    console.error('CreateSupplierProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating supplier profile",
      error: error.message
    });
  }
};

export const getSupplierProfile = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            city: true,
            area: true,
            isVerified: true
          }
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                unit: true,
                imageUrl: true
              }
            }
          },
          where: {
            isAvailable: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier not found"
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Supplier profile retrieved successfully",
      supplier
    });

  } catch (error) {
    console.error('GetSupplierProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving supplier profile",
      error: error.message
    });
  }
};

export const updateSupplierProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyName, description } = req.body;

    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { userId },
      data: {
        ...(companyName && { companyName }),
        ...(description && { description })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            city: true,
            area: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Supplier profile updated successfully",
      supplier: updatedSupplier
    });

  } catch (error) {
    console.error('UpdateSupplierProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating supplier profile",
      error: error.message
    });
  }
};

export const addSupplierProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, pricePerUnit, minQuantity, maxQuantity, discountTiers, deliveryTime } = req.body;

    if (!productId || !pricePerUnit || !minQuantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product ID, price per unit, and minimum quantity are required"
      });
    }

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found"
      });
    }

    // Check if supplier already offers this product
    const existingSupplierProduct = await prisma.supplierProduct.findUnique({
      where: {
        supplierId_productId: {
          supplierId: supplier.id,
          productId: productId
        }
      }
    });

    if (existingSupplierProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You already offer this product"
      });
    }

    const supplierProduct = await prisma.supplierProduct.create({
      data: {
        supplierId: supplier.id,
        productId,
        pricePerUnit,
        minQuantity,
        maxQuantity,
        discountTiers,
        deliveryTime
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true
          }
        }
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Product added to supplier catalog successfully",
      supplierProduct
    });

  } catch (error) {
    console.error('AddSupplierProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error adding product to supplier catalog",
      error: error.message
    });
  }
};

export const updateSupplierProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { supplierProductId } = req.params;
    const { pricePerUnit, minQuantity, maxQuantity, discountTiers, deliveryTime, isAvailable } = req.body;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    // Check if supplier product exists and belongs to this supplier
    const supplierProduct = await prisma.supplierProduct.findFirst({
      where: {
        id: supplierProductId,
        supplierId: supplier.id
      }
    });

    if (!supplierProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier product not found"
      });
    }

    const updatedSupplierProduct = await prisma.supplierProduct.update({
      where: { id: supplierProductId },
      data: {
        ...(pricePerUnit && { pricePerUnit }),
        ...(minQuantity && { minQuantity }),
        ...(maxQuantity !== undefined && { maxQuantity }),
        ...(discountTiers && { discountTiers }),
        ...(deliveryTime && { deliveryTime }),
        ...(isAvailable !== undefined && { isAvailable })
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Supplier product updated successfully",
      supplierProduct: updatedSupplierProduct
    });

  } catch (error) {
    console.error('UpdateSupplierProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating supplier product",
      error: error.message
    });
  }
};

export const removeSupplierProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { supplierProductId } = req.params;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    // Check if supplier product exists and belongs to this supplier
    const supplierProduct = await prisma.supplierProduct.findFirst({
      where: {
        id: supplierProductId,
        supplierId: supplier.id
      }
    });

    if (!supplierProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier product not found"
      });
    }

    await prisma.supplierProduct.delete({
      where: { id: supplierProductId }
    });

    res.status(StatusCodes.OK).json({
      message: "Product removed from supplier catalog successfully"
    });

  } catch (error) {
    console.error('RemoveSupplierProduct Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error removing product from supplier catalog",
      error: error.message
    });
  }
};

export const getSupplierProducts = async (req, res) => {
  try {
    const userId = req.userId;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    const products = await prisma.supplierProduct.findMany({
      where: { supplierId: supplier.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            unit: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Supplier products retrieved successfully",
      products,
      count: products.length
    });

  } catch (error) {
    console.error('GetSupplierProducts Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving supplier products",
      error: error.message
    });
  }
};

export const updateProductAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const { supplierProductId } = req.params;
    const { isAvailable } = req.body;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    const updatedProduct = await prisma.supplierProduct.update({
      where: {
        id: supplierProductId,
        supplierId: supplier.id
      },
      data: { isAvailable },
      include: {
        product: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: `Product ${isAvailable ? 'enabled' : 'disabled'} successfully`,
      supplierProduct: updatedProduct
    });

  } catch (error) {
    console.error('UpdateProductAvailability Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating product availability",
      error: error.message
    });
  }
};

export const getProductSuppliers = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sortBy = 'price' } = req.query;

    let orderBy = {};
    switch (sortBy) {
      case 'price':
        orderBy = { pricePerUnit: 'asc' };
        break;
      case 'rating':
        orderBy = { supplier: { rating: 'desc' } };
        break;
      case 'orders':
        orderBy = { supplier: { totalOrders: 'desc' } };
        break;
      default:
        orderBy = { pricePerUnit: 'asc' };
    }

    const suppliers = await prisma.supplierProduct.findMany({
      where: {
        productId,
        isAvailable: true
      },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            description: true,
            rating: true,
            totalOrders: true,
            isVerified: true,
            user: {
              select: {
                city: true,
                area: true
              }
            }
          }
        }
      },
      orderBy
    });

    res.status(StatusCodes.OK).json({
      message: "Product suppliers retrieved successfully",
      suppliers,
      count: suppliers.length
    });

  } catch (error) {
    console.error('GetProductSuppliers Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving product suppliers",
      error: error.message
    });
  }
};

export const compareSupplierPrices = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.query;

    const suppliers = await prisma.supplierProduct.findMany({
      where: {
        productId,
        isAvailable: true,
        minQuantity: { lte: parseFloat(quantity) || 1 }
      },
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
      orderBy: {
        pricePerUnit: 'asc'
      }
    });

    const comparisons = suppliers.map(supplier => {
      let finalPrice = supplier.pricePerUnit;
      let discountApplied = 0;

      // Apply discount tiers if available
      if (supplier.discountTiers && quantity) {
        const tiers = supplier.discountTiers;
        for (const tier of tiers) {
          if (quantity >= tier.minQuantity) {
            finalPrice = tier.pricePerUnit;
            discountApplied = ((supplier.pricePerUnit - tier.pricePerUnit) / supplier.pricePerUnit) * 100;
          }
        }
      }

      return {
        supplierId: supplier.supplier.id,
        companyName: supplier.supplier.companyName,
        rating: supplier.supplier.rating,
        isVerified: supplier.supplier.isVerified,
        originalPrice: supplier.pricePerUnit,
        finalPrice,
        discountApplied: Math.round(discountApplied * 100) / 100,
        totalCost: finalPrice * (parseFloat(quantity) || 1),
        minQuantity: supplier.minQuantity,
        maxQuantity: supplier.maxQuantity,
        deliveryTime: supplier.deliveryTime
      };
    });

    res.status(StatusCodes.OK).json({
      message: "Price comparison retrieved successfully",
      comparisons,
      bestDeal: comparisons[0] // First one is cheapest due to ordering
    });

  } catch (error) {
    console.error('CompareSupplierPrices Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error comparing supplier prices",
      error: error.message
    });
  }
};