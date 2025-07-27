import { type NextRequest, NextResponse } from "next/server"

// Mock user storage (in production, use a database)
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = users.find((user) => user.email === userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name: userData.fullName,
      email: userData.email,
      type: userData.userType,
      phone: userData.phoneNumber,
      businessName: userData.businessName,
      address: userData.address,
      foodType: userData.foodType,
      primaryLocation: userData.primaryLocation,
      description: userData.description,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
