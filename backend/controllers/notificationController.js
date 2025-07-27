import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';



export const createNotification = async (req, res) => {
  try {
    const { userId, title, content, type, metadata } = req.body;

    if (!userId || !title || !content || !type) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User ID, title, content, and type are required"
      });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        content,
        type,
        metadata
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Notification created successfully",
      notification
    });

  } catch (error) {
    console.error('CreateNotification Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating notification",
      error: error.message
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { isRead, type, limit = 20 } = req.query;

    const whereClause = {
      userId,
      ...(isRead !== undefined && { isRead: isRead === 'true' }),
      ...(type && { type })
    };

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit)
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Notifications retrieved successfully",
      notifications,
      unreadCount,
      count: notifications.length
    });

  } catch (error) {
    console.error('GetUserNotifications Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving notifications",
      error: error.message
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    // Check if notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Notification not found"
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    res.status(StatusCodes.OK).json({
      message: "Notification marked as read",
      notification: updatedNotification
    });

  } catch (error) {
    console.error('MarkNotificationRead Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error marking notification as read",
      error: error.message
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.status(StatusCodes.OK).json({
      message: "All notifications marked as read",
      updatedCount: result.count
    });

  } catch (error) {
    console.error('MarkAllNotificationsRead Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error marking all notifications as read",
      error: error.message
    });
  }
};

export const sendOrderStatusNotification = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Order ID and status are required"
      });
    }

    // Get order with group members
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found"
      });
    }

    // Create notifications for all group members
    const notifications = order.group.members.map(member => ({
      userId: member.userId,
      title: "Order Status Update",
      content: `Your group order "${order.group.name}" is now ${status.toLowerCase()}`,
      type: 'ORDER_UPDATE',
      metadata: {
        orderId,
        status,
        orderNumber: order.orderNumber
      }
    }));

    const createdNotifications = await prisma.notification.createMany({
      data: notifications
    });

    res.status(StatusCodes.CREATED).json({
      message: "Order status notifications sent successfully",
      notificationCount: createdNotifications.count
    });

  } catch (error) {
    console.error('SendOrderStatusNotification Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error sending order status notifications",
      error: error.message
    });
  }
};

export const sendGroupNotification = async (req, res) => {
  try {
    const { groupId, title, content, type = 'SYSTEM_ANNOUNCEMENT' } = req.body;

    if (!groupId || !title || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group ID, title, and content are required"
      });
    }

    // Get group members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    // Create notifications for all group members
    const notifications = group.members.map(member => ({
      userId: member.userId,
      title,
      content,
      type,
      metadata: {
        groupId,
        groupName: group.name
      }
    }));

    const createdNotifications = await prisma.notification.createMany({
      data: notifications
    });

    res.status(StatusCodes.CREATED).json({
      message: "Group notifications sent successfully",
      notificationCount: createdNotifications.count
    });

  } catch (error) {
    console.error('SendGroupNotification Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error sending group notifications",
      error: error.message
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    // Check if notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Notification not found"
      });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.status(StatusCodes.OK).json({
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error('DeleteNotification Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting notification",
      error: error.message
    });
  }
};

export const sendWelcomeNotification = async (userId) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: "Welcome to BulkBite!",
        content: "Welcome to BulkBite! Start saving money by joining group orders in your area.",
        type: 'SYSTEM_ANNOUNCEMENT'
      }
    });
  } catch (error) {
    console.error('SendWelcomeNotification Error:', error);
  }
};

export const sendGroupJoinNotification = async (groupId, newMemberName) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!group) return;

    const notifications = group.members.map(member => ({
      userId: member.userId,
      title: "New Member Joined",
      content: `${newMemberName} joined your group "${group.name}"`,
      type: 'GROUP_INVITATION',
      metadata: {
        groupId,
        groupName: group.name,
        newMemberName
      }
    }));

    await prisma.notification.createMany({
      data: notifications
    });
  } catch (error) {
    console.error('SendGroupJoinNotification Error:', error);
  }
};

export const sendPaymentReminderNotification = async (userId, orderId, amount) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: "Payment Reminder",
        content: `Please complete your payment of ₹${amount} for your group order`,
        type: 'PAYMENT_REMINDER',
        metadata: {
          orderId,
          amount
        }
      }
    });
  } catch (error) {
    console.error('SendPaymentReminderNotification Error:', error);
  }
};