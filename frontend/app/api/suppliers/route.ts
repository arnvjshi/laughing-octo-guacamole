import { type NextRequest, NextResponse } from "next/server"

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    name: "Fresh Produce Co",
    email: "supplier1@example.com",
    location: "Downtown Market District",
    description: "Premium fresh fruits and vegetables supplier with 15+ years experience",
    latitude: 40.7128,
    longitude: -74.006,
    rating: 5,
  },
  {
    id: 2,
    name: "Meat & More",
    email: "supplier2@example.com",
    location: "Industrial Food Hub",
    description: "Quality meat and protein products, certified organic options available",
    latitude: 40.7589,
    longitude: -73.9851,
    rating: 4,
  },
  {
    id: 3,
    name: "Dairy Delights",
    email: "supplier3@example.com",
    location: "Warehouse District",
    description: "Fresh dairy products and beverages, farm-to-table quality",
    latitude: 40.7831,
    longitude: -73.9712,
    rating: 5,
  },
  {
    id: 4,
    name: "Spice World",
    email: "supplier4@example.com",
    location: "Culinary Quarter",
    description: "Exotic spices and seasonings from around the world",
    latitude: 40.7505,
    longitude: -73.9934,
    rating: 4,
  },
  {
    id: 5,
    name: "Ocean Fresh Seafood",
    email: "supplier5@example.com",
    location: "Harbor District",
    description: "Daily fresh seafood delivery, sustainable fishing practices",
    latitude: 40.7282,
    longitude: -74.0776,
    rating: 5,
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    return NextResponse.json(mockSuppliers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay for review submission
    await new Promise((resolve) => setTimeout(resolve, 600))

    // In a real app, you'd save the review to database
    const newReview = {
      id: Math.floor(Math.random() * 1000),
      ...body,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, id: newReview.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
