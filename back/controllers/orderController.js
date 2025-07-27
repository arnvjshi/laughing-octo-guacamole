import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';



export const addProductToOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId, productId, quantity, unitPrice, notes } = req.body;

    if (!groupId || !productId || !quantity || !unitPrice) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group ID, product ID, quantity, and unit price are required"
      });
    }

    // Check if user is member of the group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
        isActive: true
      }
    });

    if (!groupMember) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not a member of this group"
      });
    }

    // Check if group is still active
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group || group.status !== 'ACTIVE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group is not accepting new orders"
      });
    }

    // Check if user already has this product in their order
    const existingOrder = await prisma.productOrder.findFirst({
      where: {
        userId,
        groupId,
        productId
      }
    });

    if (existingOrder) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product already in your order. Use update quantity instead."
      });
    }

    const totalPrice = quantity * unitPrice;

    const productOrder = await prisma.productOrder.create({
      data: {
        userId,
        groupId,
        productId,
        quantity,
        unitPrice,
        totalPrice,
        notes
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
            category: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        }
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Product added to order successfully",
      productOrder
    });

  } catch (error) {
    console.error('AddProductToOrder Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error adding product to order",
      error: error.message
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productOrderId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Valid quantity is required"
      });
    }

    // Check if product order exists and belongs to user
    const productOrder = await prisma.productOrder.findFirst({
      where: {
        id: productOrderId,
        userId
      }
    });

    if (!productOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product order not found"
      });
    }

    // Check if group is still active
    const group = await prisma.group.findUnique({
      where: { id: productOrder.groupId }
    });

    if (!group || group.status !== 'ACTIVE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot modify order - group is locked"
      });
    }

    const totalPrice = quantity * productOrder.unitPrice;

    const updatedOrder = await prisma.productOrder.update({
      where: { id: productOrderId },
      data: {
        quantity,
        totalPrice
      },
      include: {
        product: {
          select: {
            name: true,
            unit: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Product quantity updated successfully",
      productOrder: updatedOrder
    });

  } catch (error) {
    console.error('UpdateProductQuantity Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating product quantity",
      error: error.message
    });
  }
};

export const removeProductFromOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { productOrderId } = req.params;

    // Check if product order exists and belongs to user
    const productOrder = await prisma.productOrder.findFirst({
      where: {
        id: productOrderId,
        userId
      }
    });

    if (!productOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product order not found"
      });
    }

    // Check if group is still active
    const group = await prisma.group.findUnique({
      where: { id: productOrder.groupId }
    });

    if (!group || group.status !== 'ACTIVE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot modify order - group is locked"
      });
    }

    await prisma.productOrder.delete({
      where: { id: productOrderId }
    });

    res.status(StatusCodes.OK).json({
      message: "Product removed from order successfully"
    });

  } catch (error) {
    console.error('RemoveProductFromOrder Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error removing product from order",
      error: error.message
    });
  }
};

export const getUserOrdersInGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    const orders = await prisma.productOrder.findMany({
      where: {
        userId,
        groupId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
            category: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(StatusCodes.OK).json({
      message: "User orders retrieved successfully",
      orders,
      totalAmount,
      count: orders.length
    });

  } catch (error) {
    console.error('GetUserOrdersInGroup Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving user orders",
      error: error.message
    });
  }
};

export const getGroupOrders = async (req, res) => {
  try {
    const { groupId } = req.params;

    const orders = await prisma.productOrder.findMany({
      where: { groupId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
            category: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group orders by product for bulk calculation
    const productSummary = {};
    orders.forEach(order => {
      const productId = order.productId;
      if (!productSummary[productId]) {
        productSummary[productId] = {
          product: order.product,
          totalQuantity: 0,
          totalAmount: 0,
          orders: []
        };
      }
      productSummary[productId].totalQuantity += order.quantity;
      productSummary[productId].totalAmount += order.totalPrice;
      productSummary[productId].orders.push({
        userId: order.userId,
        user: order.user,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice
      });
    });

    const totalGroupAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(StatusCodes.OK).json({
      message: "Group orders retrieved successfully",
      orders,
      productSummary,
      totalGroupAmount,
      count: orders.length
    });

  } catch (error) {
    console.error('GetGroupOrders Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving group orders",
      error: error.message
    });
  }
};

export const calculateGroupTotal = async (req, res) => {
  try {
    const { groupId } = req.params;

    const orders = await prisma.productOrder.findMany({
      where: { groupId },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Calculate totals by product
    const productTotals = {};
    const userTotals = {};

    orders.forEach(order => {
      // Product totals
      if (!productTotals[order.productId]) {
        productTotals[order.productId] = {
          product: order.product,
          totalQuantity: 0,
          totalAmount: 0
        };
      }
      productTotals[order.productId].totalQuantity += order.quantity;
      productTotals[order.productId].totalAmount += order.totalPrice;

      // User totals
      if (!userTotals[order.userId]) {
        userTotals[order.userId] = {
          user: order.user,
          totalAmount: 0,
          itemCount: 0
        };
      }
      userTotals[order.userId].totalAmount += order.totalPrice;
      userTotals[order.userId].itemCount += 1;
    });

    const grandTotal = Object.values(productTotals).reduce((sum, item) => sum + item.totalAmount, 0);

    res.status(StatusCodes.OK).json({
      message: "Group totals calculated successfully",
      productTotals,
      userTotals,
      grandTotal,
      orderCount: orders.length
    });

  } catch (error) {
    console.error('CalculateGroupTotal Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error calculating group total",
      error: error.message
    });
  }
};

export const createFinalOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId, supplierId, deliveryAddress, deliveryNotes } = req.body;

    if (!groupId || !supplierId || !deliveryAddress) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group ID, supplier ID, and delivery address are required"
      });
    }

    // Check if user is group creator or admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    const member = group.members[0];
    if (group.creatorId !== userId && (!member || member.role === 'MEMBER')) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Only group creator or admin can place final order"
      });
    }

    if (group.status !== 'ACTIVE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group is not ready for order placement"
      });
    }

    // Get all product orders for this group
    const productOrders = await prisma.productOrder.findMany({
      where: { groupId },
      include: {
        product: true
      }
    });

    if (productOrders.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No products in group order"
      });
    }

    const subtotal = productOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const deliveryCharge = 50; // Fixed delivery charge for demo
    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + deliveryCharge + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${groupId.slice(-4)}`;

    // Create final order
    const order = await prisma.order.create({
      data: {
        groupId,
        supplierId,
        orderNumber,
        subtotal,
        deliveryCharge,
        tax,
        totalAmount,
        deliveryAddress,
        deliveryNotes,
        status: 'PENDING'
      },
      include: {
        group: {
          select: {
            name: true,
            _count: {
              select: {
                members: true
              }
            }
          }
        },
        supplier: {
          select: {
            companyName: true,
            user: {
              select: {
                phone: true
              }
            }
          }
        }
      }
    });

    // Update group status
    await prisma.group.update({
      where: { id: groupId },
      data: { status: 'ORDER_PLACED' }
    });

    // Update supplier total orders
    await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        totalOrders: {
          increment: 1
        }
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Final order placed successfully",
      order
    });

  } catch (error) {
    console.error('CreateFinalOrder Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating final order",
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            city: true,
            area: true,
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    businessName: true
                  }
                }
              }
            },
            productOrders: {
              include: {
                product: true,
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        supplier: {
          select: {
            id: true,
            companyName: true,
            rating: true,
            user: {
              select: {
                phone: true,
                city: true,
                area: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found"
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Order retrieved successfully",
      order
    });

  } catch (error) {
    console.error('GetOrderById Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving order",
      error: error.message
    });
  }
};

export const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, limit = 10 } = req.query;

    // Get groups where user is a member
    const userGroups = await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true }
    });

    const groupIds = userGroups.map(g => g.groupId);

    const whereClause = {
      groupId: { in: groupIds },
      ...(status && { status })
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        group: {
          select: {
            name: true,
            city: true,
            area: true
          }
        },
        supplier: {
          select: {
            companyName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit)
    });

    res.status(StatusCodes.OK).json({
      message: "Order history retrieved successfully",
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('GetUserOrderHistory Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving order history",
      error: error.message
    });
  }
};

export const getSupplierOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    // Get supplier profile
    const supplier = await prisma.supplier.findUnique({
      where: { userId }
    });

    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier profile not found"
      });
    }

    const whereClause = {
      supplierId: supplier.id,
      ...(status && { status })
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        group: {
          select: {
            name: true,
            city: true,
            area: true,
            _count: {
              select: {
                members: true
              }
            },
            productOrders: {
              include: {
                product: {
                  select: {
                    name: true,
                    unit: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Supplier orders retrieved successfully",
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('GetSupplierOrders Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving supplier orders",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { status, deliveryEta, trackingNumber } = req.body;

    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Status is required"
      });
    }

    // Check if user is the supplier for this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        supplier: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found"
      });
    }

    if (order.supplier.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Only the assigned supplier can update order status"
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(deliveryEta && { deliveryEta: new Date(deliveryEta) }),
        ...(trackingNumber && { trackingNumber })
      },
      include: {
        group: {
          select: {
            name: true,
            members: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });

    // Create notifications for all group members
    const notifications = updatedOrder.group.members.map(member => ({
      userId: member.userId,
      title: "Order Status Updated",
      content: `Your group order "${updatedOrder.group.name}" status changed to ${status}`,
      type: 'ORDER_UPDATE'
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    res.status(StatusCodes.OK).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error('UpdateOrderStatus Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating order status",
      error: error.message
    });
  }
};

export const updateDeliveryETA = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { deliveryEta } = req.body;

    if (!deliveryEta) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Delivery ETA is required"
      });
    }

    // Check if user is the supplier for this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        supplier: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found"
      });
    }

    if (order.supplier.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Only the assigned supplier can update delivery ETA"
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryEta: new Date(deliveryEta)
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Delivery ETA updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error('UpdateDeliveryETA Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating delivery ETA",
      error: error.message
    });
  }
};

export const calculateCostSplit = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        group: {
          include: {
            productOrders: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    businessName: true
                  }
                }
              }
            },
            members: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found"
      });
    }

    const memberCount = order.group.members.length;
    const deliveryChargePerMember = order.deliveryCharge / memberCount;
    const taxPerMember = order.tax / memberCount;

    // Calculate individual contributions
    const userContributions = {};
    
    order.group.productOrders.forEach(productOrder => {
      const userId = productOrder.userId;
      if (!userContributions[userId]) {
        userContributions[userId] = {
          user: productOrder.user,
          productTotal: 0,
          deliveryShare: deliveryChargePerMember,
          taxShare: taxPerMember,
          totalAmount: 0
        };
      }
      userContributions[userId].productTotal += productOrder.totalPrice;
    });

    // Calculate final amounts
    Object.keys(userContributions).forEach(userId => {
      const contribution = userContributions[userId];
      contribution.totalAmount = contribution.productTotal + contribution.deliveryShare + contribution.taxShare;
    });

    res.status(StatusCodes.OK).json({
      message: "Cost split calculated successfully",
      orderTotal: order.totalAmount,
      userContributions,
      breakdown: {
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        tax: order.tax,
        memberCount
      }
    });

  } catch (error) {
    console.error('CalculateCostSplit Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error calculating cost split",
      error: error.message
    });
  }
};
    