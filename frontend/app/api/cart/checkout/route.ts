import { type NextRequest, NextResponse } from "next/server"

// Mock orders storage (in production, use a database)
const orders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { items, userId, totalPrice } = await request.json()

    if (!items || !userId || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create order
    const order = {
      id: Math.floor(Math.random() * 10000),
      userId,
      items,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 })
  }
}
