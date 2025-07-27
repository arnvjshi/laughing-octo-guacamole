import prisma from '../lib/prisma.js'
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
export const signUp = async (req, res) => {
  try {
    const { 
      phone, 
      name, 
      email, 
      password,
      city, 
      area,
      address,
      userType, 
      businessName, 
      businessCategory,
      gstNumber,
      companyName,
      language
    } = req.body;

    // Validation - phone and name are required, email is optional
    if (!phone || !name || !city || !area || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Phone, name, city, area, and password are required"
      });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please provide a valid email address"
        });
      }
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists with phone (required unique field)
    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUserByPhone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User with this phone number already exists"
      });
    }

    // Check if user already exists with email (if email provided)
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUserByEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User with this email already exists"
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        email: email || null, // email is optional
        password: hashedPassword,
        city,
        area,
        address: address || null,
        userType: userType || 'VENDOR', // Default to VENDOR as per schema
        businessName: businessName || null,
        businessCategory: businessCategory || null,
        gstNumber: gstNumber || null,
        companyName: companyName || null,
        language: language || 'en', // Default to 'en'
        clerkId: `clerk_${Date.now()}`, // Generate temporary clerk ID
        isVerified: true // Keep as false initially
      }
    });

    // Create supplier profile if userType is SUPPLIER
    if ((userType || 'VENDOR') === 'SUPPLIER') {
      await prisma.supplier.create({
        data: {
          user: {
            connect: { id: user.id }
          },
          companyName: companyName || name
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie("AuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(StatusCodes.CREATED).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        area: user.area,
        userType: user.userType,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        companyName: user.companyName,
        isVerified: user.isVerified
      },
      token
    });

  } catch (error) {
    console.error('SignUp Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during signup",
      error: error.message
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        supplierProfile: true
      }
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie("AuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(StatusCodes.OK).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        area: user.area,
        userType: user.userType,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        companyName: user.companyName,
        isVerified: user.isVerified,
        supplierProfile: user.supplierProfile
      },
      token
    });

  } catch (error) {
    console.error('SignIn Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during signin",
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("AuthToken");
    res.status(StatusCodes.OK).json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during logout",
      error: error.message
    });
  }
};

// Optional: Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.AuthToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        supplierProfile: true
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        city: true,
        area: true,
        userType: true,
        businessName: true,
        businessCategory: true,
        companyName: true,
        isVerified: true,
        supplierProfile: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      user
    });

  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid token",
      error: error.message
    });
  }
};