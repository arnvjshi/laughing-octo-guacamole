import { type NextRequest, NextResponse } from "next/server"

// Mock user data
const mockUsers = {
  vendors: [
    { id: 1, name: "Street Food Corner", email: "vendor1@example.com", type: "vendor" },
    { id: 2, name: "Quick Bites", email: "vendor2@example.com", type: "vendor" },
    { id: 3, name: "Local Eats", email: "vendor3@example.com", type: "vendor" },
  ],
  suppliers: [
    { id: 1, name: "Fresh Produce Co", email: "supplier1@example.com", type: "supplier" },
    { id: 2, name: "Meat & More", email: "supplier2@example.com", type: "supplier" },
    { id: 3, name: "Dairy Delights", email: "supplier3@example.com", type: "supplier" },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, user_type } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find existing user or create new one
    const userList = user_type === "vendor" ? mockUsers.vendors : mockUsers.suppliers
    let user = userList.find((u) => u.email === email)

    if (!user) {
      // Create new user
      const newId = Math.max(...userList.map((u) => u.id)) + 1
      user = {
        id: newId,
        name: name || `New ${user_type}`,
        email,
        type: user_type,
      }
      userList.push(user)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
