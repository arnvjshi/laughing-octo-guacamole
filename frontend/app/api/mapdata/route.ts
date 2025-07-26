import { NextResponse } from "next/server"

// Mock map data
const mockMapData = {
  vendors: [
    {
      id: 1,
      name: "Street Food Corner",
      latitude: 40.7128,
      longitude: -74.006,
      type: "vendor",
    },
    {
      id: 2,
      name: "Quick Bites",
      latitude: 40.7589,
      longitude: -73.9851,
      type: "vendor",
    },
    {
      id: 3,
      name: "Local Eats",
      latitude: 40.7831,
      longitude: -73.9712,
      type: "vendor",
    },
    {
      id: 4,
      name: "Tasty Treats",
      latitude: 40.7505,
      longitude: -73.9934,
      type: "vendor",
    },
  ],
  suppliers: [
    {
      id: 1,
      name: "Fresh Produce Co",
      latitude: 40.7282,
      longitude: -74.0776,
      type: "supplier",
    },
    {
      id: 2,
      name: "Meat & More",
      latitude: 40.6892,
      longitude: -74.0445,
      type: "supplier",
    },
    {
      id: 3,
      name: "Dairy Delights",
      latitude: 40.7614,
      longitude: -73.9776,
      type: "supplier",
    },
    {
      id: 4,
      name: "Spice World",
      latitude: 40.7489,
      longitude: -73.968,
      type: "supplier",
    },
  ],
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(mockMapData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch map data" }, { status: 500 })
  }
}
