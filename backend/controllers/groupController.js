import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';



export const createGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description, city, area, deliveryRadius, minMembers, maxMembers, expiresAt } = req.body;

    if (!name || !city || !area) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Name, city, and area are required"
      });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        creatorId: userId,
        city,
        area,
        deliveryRadius: deliveryRadius || 5.0,
        minMembers: minMembers || 2,
        maxMembers: maxMembers || 50,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
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
        }
      }
    });

    // Add creator as admin member
    await prisma.groupMember.create({
      data: {
        userId: userId,
        groupId: group.id,
        role: 'ADMIN'
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Group created successfully",
      group
    });

  } catch (error) {
    console.error('CreateGroup Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating group",
      error: error.message
    });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            phone: true,
            businessName: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                businessName: true,
                businessCategory: true
              }
            }
          }
        },
        productOrders: {
          include: {
            product: true,
            user: {
              select: {
                id: true,
                name: true
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

    res.status(StatusCodes.OK).json({
      message: "Left group successfully"
    });

  } catch (error) {
    console.error('LeaveGroup Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error leaving group",
      error: error.message
    });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await prisma.groupMember.findMany({
      where: {
        groupId: groupId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            businessName: true,
            businessCategory: true,
            isVerified: true
          }
        }
      },
      orderBy: {
        joinedAt: 'asc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Group members retrieved successfully",
      members,
      count: members.length
    });

  } catch (error) {
    console.error('GetGroupMembers Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving group members",
      error: error.message
    });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.userId;

    // Check if current user is group creator or admin
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    const currentUserMember = await prisma.groupMember.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
        isActive: true
      }
    });

    if (group.creatorId !== userId && (!currentUserMember || currentUserMember.role === 'MEMBER')) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Only group creator or admin can update member roles"
      });
    }

    // Update member role
    const updatedMember = await prisma.groupMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Member role updated successfully",
      member: updatedMember
    });

  } catch (error) {
    console.error('UpdateMemberRole Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating member role",
      error: error.message
    });
  }
}

export const getGroupsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { status } = req.query;

    const whereClause = {
      city: city,
      ...(status && { status })
    };

    const groups = await prisma.group.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Groups retrieved successfully",
      groups,
      count: groups.length
    });

  } catch (error) {
    console.error('GetGroupsByCity Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving groups by city",
      error: error.message
    });
  }
};

export const getGroupsByArea = async (req, res) => {
  try {
    const { city, area } = req.params;
    const { status } = req.query;

    const whereClause = {
      city: city,
      area: area,
      ...(status && { status })
    };

    const groups = await prisma.group.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Groups retrieved successfully",
      groups,
      count: groups.length
    });

  } catch (error) {
    console.error('GetGroupsByArea Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving groups by area",
      error: error.message
    });
  }
};

export const getActiveGroups = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's city and area
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { city: true, area: true }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    const groups = await prisma.group.findMany({
      where: {
        city: user.city,
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date()
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter groups where user can join (not already a member and space available)
    const availableGroups = [];
    
    for (const group of groups) {
      const isMember = await prisma.groupMember.findFirst({
        where: {
          userId: userId,
          groupId: group.id,
          isActive: true
        }
      });

      if (!isMember && group._count.members < group.maxMembers) {
        availableGroups.push(group);
      }
    }

    res.status(StatusCodes.OK).json({
      message: "Active groups retrieved successfully",
      groups: availableGroups,
      count: availableGroups.length
    });

  } catch (error) {
    console.error('GetActiveGroups Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving active groups",
      error: error.message
    });
  }
};

export const updateGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Check if user is group creator or admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { userId: userId }
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
        message: "Only group creator or admin can update status"
      });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { status },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Group status updated successfully",
      group: updatedGroup
    });

  } catch (error) {
    console.error('UpdateGroupStatus Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating group status",
      error: error.message
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    // Check if user is group creator
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    if (group.creatorId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Only group creator can delete the group"
      });
    }

    // Delete group and all related data (cascades)
    await prisma.group.delete({
      where: { id: groupId }
    });

    res.status(StatusCodes.OK).json({
      message: "Group deleted successfully"
    });

  } catch (error) {
    console.error('DeleteGroup Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting group",
      error: error.message
    });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    // Check if group exists and is active
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Group not found"
      });
    }

    if (group.status !== 'ACTIVE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group is not accepting new members"
      });
    }

    if (group._count.members >= group.maxMembers) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Group is full"
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
        isActive: true
      }
    });

    if (existingMember) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You are already a member of this group"
      });
    }

    // Add user to group
    const member = await prisma.groupMember.create({
      data: {
        userId: userId,
        groupId: groupId,
        role: 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            businessName: true
          }
        }
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Joined group successfully",
      member
    });

  } catch (error) {
    console.error('JoinGroup Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error joining group",
      error: error.message
    });
  }
};

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.userId;

        // Check if user is a member
        const member = await prisma.groupMember.findFirst({
            where: {
                userId: userId,
                groupId: groupId,
                isActive: true
            }
        });

        if (!member) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "You are not a member of this group"
            });
        }

        // Check if user is group creator
        const group = await prisma.group.findUnique({
            where: { id: groupId }
        });

        if (group.creatorId === userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Group creator cannot leave the group. Delete the group instead."
            });
        }

        // Remove user from group
        await prisma.groupMember.delete({
            where: { id: member.id }
        });

        res.status(StatusCodes.OK).json({
            message: "member removed successfully",
        })
    } catch (error) {
        console.error('LeaveGroup Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error leaving group",
            error: error.message
        });
    }
}

