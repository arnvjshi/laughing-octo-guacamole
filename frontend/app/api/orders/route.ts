import { type NextRequest, NextResponse } from "next/server"

// Mock orders data
const mockOrders = [
  {
    id: 1,
    quantity: 8,
    total_price: 18.0,
    status: "confirmed",
    group_name: "Tomato Bulk Buy",
    vendor_name: "Street Food Corner",
    created_at: "2024-02-08T10:30:00Z",
  },
  {
    id: 2,
    quantity: 3,
    total_price: 25.5,
    status: "pending",
    group_name: "Meat Monday Deal",
    vendor_name: "Quick Bites",
    created_at: "2024-02-09T14:15:00Z",
  },
  {
    id: 3,
    quantity: 15,
    total_price: 45.0,
    status: "delivered",
    group_name: "Dairy Collective",
    vendor_name: "Local Eats",
    created_at: "2024-02-07T09:20:00Z",
  },
  {
    id: 4,
    quantity: 12,
    total_price: 27.0,
    status: "confirmed",
    group_name: "Tomato Bulk Buy",
    vendor_name: "Quick Bites",
    created_at: "2024-02-08T16:45:00Z",
  },
  {
    id: 5,
    quantity: 5,
    total_price: 18.75,
    status: "pending",
    group_name: "Pepper Power",
    vendor_name: "Street Food Corner",
    created_at: "2024-02-09T11:30:00Z",
  },
  {
    id: 6,
    quantity: 20,
    total_price: 60.0,
    status: "confirmed",
    group_name: "Dairy Collective",
    vendor_name: "Local Eats",
    created_at: "2024-02-08T13:10:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendor_id = searchParams.get("vendor_id")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let orders = mockOrders
    if (vendor_id) {
      // Filter by vendor if specified (in real app, you'd use vendor_id)
      orders = mockOrders.filter((o) => o.vendor_name.includes("Street Food"))
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newOrder = {
      id: Math.max(...mockOrders.map((o) => o.id)) + 1,
      ...body,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    mockOrders.push(newOrder)

    return NextResponse.json({ success: true, id: newOrder.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
