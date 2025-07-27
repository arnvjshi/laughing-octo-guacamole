import prisma from '../lib/prisma.js'

export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's groups
    const userGroups = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            orders: {
              select: {
                totalAmount: true,
                status: true
              }
            }
          }
        }
      }
    });

    // Get user's product orders
    const productOrders = await prisma.productOrder.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            category: true
          }
        }
      }
    });

    // Calculate statistics
    const totalGroups = userGroups.length;
    const completedOrders = userGroups.filter(g => 
      g.group.orders.some(o => o.status === 'DELIVERED')
    ).length;

    const totalSpent = productOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Calculate estimated savings (assuming 15% savings through group buying)
    const estimatedIndividualCost = totalSpent * 1.15;
    const totalSavings = estimatedIndividualCost - totalSpent;

    // Product categories ordered
    const categoryStats = {};
    productOrders.forEach(order => {
      const category = order.product.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          totalAmount: 0
        };
      }
      categoryStats[category].count += 1;
      categoryStats[category].totalAmount += order.totalPrice;
    });

    res.status(StatusCodes.OK).json({
      message: "User statistics retrieved successfully",
      stats: {
        totalGroups,
        completedOrders,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        savingsPercentage: Math.round((totalSavings / estimatedIndividualCost) * 100),
        totalProductOrders: productOrders.length,
        categoryStats
      }
    });

  } catch (error) {
    console.error('GetUserStats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving user statistics",
      error: error.message
    });
  }
};

export const getGroupStats = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                businessName: true
              }
            }
          }
        },
        productOrders: {
          include: {
            product: {
              select: {
                name: true,
                category: true
              }
            }
          }
        },
        orders: {
          select: {
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    // Calculate group statistics
    const memberCount = group.members.length;
    const totalProductOrders = group.productOrders.length;
    const totalValue = group.productOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Calculate average order value per member
    const avgOrderPerMember = memberCount > 0 ? totalValue / memberCount : 0;

    // Product categories in group
    const categoryBreakdown = {};
    group.productOrders.forEach(order => {
      const category = order.product.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = {
          count: 0,
          totalAmount: 0
        };
      }
      categoryBreakdown[category].count += 1;
      categoryBreakdown[category].totalAmount += order.totalPrice;
    });

    // Group success metrics
    const hasCompletedOrder = group.orders.some(order => order.status === 'DELIVERED');
    const groupEfficiency = memberCount >= group.minMembers ? 'Efficient' : 'Needs More Members';

    res.status(StatusCodes.OK).json({
      message: "Group statistics retrieved successfully",
      stats: {
        groupId: group.id,
        groupName: group.name,
        memberCount,
        minMembers: group.minMembers,
        maxMembers: group.maxMembers,
        totalProductOrders,
        totalValue: Math.round(totalValue * 100) / 100,
        avgOrderPerMember: Math.round(avgOrderPerMember * 100) / 100,
        categoryBreakdown,
        groupEfficiency,
        hasCompletedOrder,
        status: group.status,
        createdAt: group.createdAt
      }
    });

  } catch (error) {
    console.error('GetGroupStats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving group statistics",
      error: error.message
    });
  }
};

export const getSupplierStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: {
              select: {
                name: true,
                category: true
              }
            }
          }
        },
        orders: {
          select: {
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    // Calculate supplier statistics
    const totalProducts = supplier.products.length;
    const activeProducts = supplier.products.filter(p => p.isAvailable).length;
    const totalOrders = supplier.orders.length;
    const completedOrders = supplier.orders.filter(o => o.status === 'DELIVERED').length;
    const totalRevenue = supplier.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyRevenue = supplier.orders
      .filter(o => o.status === 'DELIVERED' && new Date(o.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Average order value
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    // Product category breakdown
    const categoryStats = {};
    supplier.products.forEach(supplierProduct => {
      const category = supplierProduct.product.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          activeCount: 0
        };
      }
      categoryStats[category].count += 1;
      if (supplierProduct.isAvailable) {
        categoryStats[category].activeCount += 1;
      }
    });

    // Success rate
    const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    res.status(StatusCodes.OK).json({
      message: "Supplier statistics retrieved successfully",
      stats: {
        supplierId: supplier.id,
        companyName: supplier.companyName,
        rating: supplier.rating,
        totalProducts,
        activeProducts,
        totalOrders,
        completedOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        successRate: Math.round(successRate * 100) / 100,
        categoryStats,
        isVerified: supplier.isVerified
      }
    });

  } catch (error) {
    console.error('GetSupplierStats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving supplier statistics",
      error: error.message
    });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    // Get overall platform statistics
    const totalUsers = await prisma.user.count();
    const totalVendors = await prisma.user.count({
      where: { userType: 'VENDOR' }
    });
    const totalSuppliers = await prisma.user.count({
      where: { userType: 'SUPPLIER' }
    });

    const totalGroups = await prisma.group.count();
    const activeGroups = await prisma.group.count({
      where: { status: 'ACTIVE' }
    });

    const totalOrders = await prisma.order.count();
    const completedOrders = await prisma.order.count({
      where: { status: 'DELIVERED' }
    });

    const totalProducts = await prisma.product.count();

    // Calculate total platform revenue
    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalAmount: true }
    });

    // Calculate total savings (estimated)
    const totalOrderValue = await prisma.productOrder.aggregate({
      _sum: { totalPrice: true }
    });

    const estimatedIndividualCost = (totalOrderValue._sum.totalPrice || 0) * 1.15;
    const totalSavings = estimatedIndividualCost - (totalOrderValue._sum.totalPrice || 0);

    // Group success rate
    const groupSuccessRate = totalGroups > 0 ? 
      (await prisma.group.count({ where: { status: 'COMPLETED' } }) / totalGroups) * 100 : 0;

    // City-wise distribution
    const cityStats = await prisma.user.groupBy({
      by: ['city'],
      _count: {
        city: true
      },
      orderBy: {
        _count: {
          city: 'desc'
        }
      },
      take: 10
    });

    // Popular product categories
    const categoryStats = await prisma.productOrder.groupBy({
      by: ['productId'],
      _count: {
        productId: true
      },
      _sum: {
        totalPrice: true
      },
      orderBy: {
        _count: {
          productId: 'desc'
        }
      },
      take: 10
    });

    res.status(StatusCodes.OK).json({
      message: "Platform statistics retrieved successfully",
      stats: {
        users: {
          total: totalUsers,
          vendors: totalVendors,
          suppliers: totalSuppliers
        },
        groups: {
          total: totalGroups,
          active: activeGroups,
          successRate: Math.round(groupSuccessRate * 100) / 100
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          successRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
        },
        products: {
          total: totalProducts
        },
        revenue: {
          total: Math.round((totalRevenue._sum.totalAmount || 0) * 100) / 100,
          totalSavings: Math.round(totalSavings * 100) / 100
        },
        cityDistribution: cityStats.map(city => ({
          city: city.city,
          userCount: city._count.city
        })),
        topProducts: categoryStats.length // Simplified for demo
      }
    });

  } catch (error) {
    console.error('GetPlatformStats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving platform statistics",
      error: error.message
    });
  }
};

export const calculateSavings = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        productOrders: {
          include: {
            product: {
              include: {
                suppliers: {
                  where: { isAvailable: true },
                  orderBy: { pricePerUnit: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    let totalGroupCost = 0;
    let totalIndividualCost = 0;

    // Calculate savings for each product
    const productSavings = [];

    for (const order of group.productOrders) {
      const groupQuantity = group.productOrders
        .filter(o => o.productId === order.productId)
        .reduce((sum, o) => sum + o.quantity, 0);

      const bestSupplier = order.product.suppliers[0];
      
      if (bestSupplier) {
        const groupPrice = order.unitPrice; // Current group price
        const individualPrice = bestSupplier.pricePerUnit; // Individual purchase price
        
        const groupCost = groupQuantity * groupPrice;
        const individualCost = groupQuantity * individualPrice;
        const savings = individualCost - groupCost;
        const savingsPercentage = individualCost > 0 ? (savings / individualCost) * 100 : 0;

        totalGroupCost += groupCost;
        totalIndividualCost += individualCost;

        productSavings.push({
          productName: order.product.name,
          quantity: groupQuantity,
          groupPrice,
          individualPrice,
          groupCost: Math.round(groupCost * 100) / 100,
          individualCost: Math.round(individualCost * 100) / 100,
          savings: Math.round(savings * 100) / 100,
          savingsPercentage: Math.round(savingsPercentage * 100) / 100
        });
      }
    }

    const totalSavings = totalIndividualCost - totalGroupCost;
    const totalSavingsPercentage = totalIndividualCost > 0 ? 
      (totalSavings / totalIndividualCost) * 100 : 0;

    res.status(StatusCodes.OK).json({
      message: "Savings calculated successfully",
      savings: {
        totalGroupCost: Math.round(totalGroupCost * 100) / 100,
        totalIndividualCost: Math.round(totalIndividualCost * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        totalSavingsPercentage: Math.round(totalSavingsPercentage * 100) / 100,
        productSavings
      }
    });

  } catch (error) {
    console.error('CalculateSavings Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error calculating savings",
      error: error.message
    });
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularProducts = await prisma.productOrder.groupBy({
      by: ['productId'],
      _count: {
        productId: true
      },
      _sum: {
        quantity: true,
        totalPrice: true
      },
      orderBy: {
        _count: {
          productId: 'desc'
        }
      },
      take: parseInt(limit)
    });

    const productsWithDetails = await Promise.all(
      popularProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            category: true,
            unit: true,
            imageUrl: true
          }
        });

        return {
          product,
          orderCount: item._count.productId,
          totalQuantity: item._sum.quantity,
          totalRevenue: Math.round((item._sum.totalPrice || 0) * 100) / 100
        };
      })
    );

    res.status(StatusCodes.OK).json({
      message: "Popular products retrieved successfully",
      products: productsWithDetails
    });

  } catch (error) {
    console.error('GetPopularProducts Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving popular products",
      error: error.message
    });
  }
};

export const getPopularSuppliers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            orders: true
          }
        },
        user: {
          select: {
            city: true,
            area: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalOrders: 'desc' }
      ],
      take: parseInt(limit)
    });

    const suppliersWithStats = suppliers.map(supplier => ({
      id: supplier.id,
      companyName: supplier.companyName,
      rating: supplier.rating,
      totalOrders: supplier.totalOrders,
      activeOrders: supplier._count.orders,
      isVerified: supplier.isVerified,
      location: {
        city: supplier.user.city,
        area: supplier.user.area
      }
    }));

    res.status(StatusCodes.OK).json({
      message: "Popular suppliers retrieved successfully",
      suppliers: suppliersWithStats
    });

  } catch (error) {
    console.error('GetPopularSuppliers Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving popular suppliers",
      error: error.message
    });
  }
};