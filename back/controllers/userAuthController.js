import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';



export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        supplierProfile: true
      }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      message: "User profile retrieved successfully",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        area: user.area,
        address: user.address,
        userType: user.userType,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        gstNumber: user.gstNumber,
        companyName: user.companyName,
        rating: user.rating,
        isVerified: user.isVerified,
        supplierProfile: user.supplierProfile,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('GetUserProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving user profile",
      error: error.message
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, city, area, address, language } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(city && { city }),
        ...(area && { area }),
        ...(address && { address }),
        ...(language && { language })
      },
      include: {
        supplierProfile: true
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        city: updatedUser.city,
        area: updatedUser.area,
        address: updatedUser.address,
        userType: updatedUser.userType,
        businessName: updatedUser.businessName,
        businessCategory: updatedUser.businessCategory,
        isVerified: updatedUser.isVerified,
        supplierProfile: updatedUser.supplierProfile
      }
    });

  } catch (error) {
    console.error('UpdateUserProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};

export const updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { businessName, businessCategory, gstNumber } = req.body;

    // Check if user is a vendor
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.userType !== 'VENDOR') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Only vendors can update business profile"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(businessName && { businessName }),
        ...(businessCategory && { businessCategory }),
        ...(gstNumber && { gstNumber })
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Business profile updated successfully",
      user: {
        id: updatedUser.id,
        businessName: updatedUser.businessName,
        businessCategory: updatedUser.businessCategory,
        gstNumber: updatedUser.gstNumber
      }
    });

  } catch (error) {
    console.error('UpdateBusinessProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating business profile",
      error: error.message
    });
  }
};

export const updateSupplierProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { companyName, description } = req.body;

    // Check if user is a supplier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { supplierProfile: true }
    });

    if (!user || user.userType !== 'SUPPLIER') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Only suppliers can update supplier profile"
      });
    }

    // Update user's company name
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(companyName && { companyName })
      }
    });

    // Update supplier profile
    const updatedSupplier = await prisma.supplier.update({
      where: { userId: userId },
      data: {
        ...(companyName && { companyName }),
        ...(description && { description })
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Supplier profile updated successfully",
      supplierProfile: updatedSupplier
    });

  } catch (error) {
    console.error('UpdateSupplierProfile Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating supplier profile",
      error: error.message
    });
  }
};

export const getUsersByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { userType } = req.query;

    const whereClause = {
      city: city,
      ...(userType && { userType })
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        city: true,
        area: true,
        userType: true,
        businessName: true,
        businessCategory: true,
        companyName: true,
        isVerified: true,
        rating: true
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Users retrieved successfully",
      users,
      count: users.length
    });

  } catch (error) {
    console.error('GetUsersByCity Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving users by city",
      error: error.message
    });
  }
};

export const getUsersByArea = async (req, res) => {
  try {
    const { city, area } = req.params;
    const { userType } = req.query;

    const whereClause = {
      city: city,
      area: area,
      ...(userType && { userType })
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        city: true,
        area: true,
        userType: true,
        businessName: true,
        businessCategory: true,
        companyName: true,
        isVerified: true,
        rating: true
      }
    });

    res.status(StatusCodes.OK).json({
      message: "Users retrieved successfully",
      users,
      count: users.length
    });

  } catch (error) {
    console.error('GetUsersByArea Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error retrieving users by area",
      error: error.message
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    // This would typically require admin permissions
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified }
    });

    res.status(StatusCodes.OK).json({
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        isVerified: updatedUser.isVerified
      }
    });

  } catch (error) {
    console.error('VerifyUser Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating verification status",
      error: error.message
    });
  }
};