import { type NextRequest, NextResponse } from "next/server"

// Mock cart storage (in production, use a database)
const userCarts: { [userId: string]: any[] } = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const cart = userCarts[userId] || []
    return NextResponse.json({ success: true, cart })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json()

    if (!userId || !productId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize cart if it doesn't exist
    if (!userCarts[userId]) {
      userCarts[userId] = []
    }

    // Check if item already exists in cart
    const existingItemIndex = userCarts[userId].findIndex((item) => item.id === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      userCarts[userId][existingItemIndex].quantity += quantity
    } else {
      // Add new item (you would fetch product details from database)
      const newItem = {
        id: productId,
        quantity,
        addedAt: new Date().toISOString(),
      }
      userCarts[userId].push(newItem)
    }

    return NextResponse.json({ success: true, message: "Item added to cart" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!userCarts[userId]) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const itemIndex = userCarts[userId].findIndex((item) => item.id === productId)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item
      userCarts[userId].splice(itemIndex, 1)
    } else {
      // Update quantity
      userCarts[userId][itemIndex].quantity = quantity
    }

    return NextResponse.json({ success: true, message: "Cart updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const productId = searchParams.get("productId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (productId) {
      // Remove specific item
      if (userCarts[userId]) {
        userCarts[userId] = userCarts[userId].filter((item) => item.id !== Number.parseInt(productId))
      }
    } else {
      // Clear entire cart
      userCarts[userId] = []
    }

    return NextResponse.json({ success: true, message: "Cart updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
