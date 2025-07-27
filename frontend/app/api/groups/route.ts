import { type NextRequest, NextResponse } from "next/server"

// Enhanced mock groups data with more variety
const mockGroups = [
  {
    id: 1,
    name: "Tomato Bulk Buy",
    description: "Group buy for fresh organic tomatoes - perfect for sauces and cooking",
    target_quantity: 50,
    current_quantity: 32,
    price_per_unit: 2.25,
    deadline: "2024-02-15T10:00:00Z",
    status: "active",
    product_name: "Fresh Tomatoes",
    creator_name: "Street Food Corner",
    product_id: 1,
    created_by: 1,
  },
  {
    id: 2,
    name: "Meat Monday Deal",
    description: "Weekly meat group purchase for better prices - premium ground beef",
    target_quantity: 20,
    current_quantity: 15,
    price_per_unit: 8.5,
    deadline: "2024-02-12T15:00:00Z",
    status: "active",
    product_name: "Ground Beef",
    creator_name: "Quick Bites",
    product_id: 2,
    created_by: 2,
  },
  {
    id: 3,
    name: "Dairy Collective",
    description: "Bulk dairy products for the week - fresh whole milk from local farms",
    target_quantity: 100,
    current_quantity: 78,
    price_per_unit: 3.0,
    deadline: "2024-02-14T12:00:00Z",
    status: "active",
    product_name: "Whole Milk",
    creator_name: "Local Eats",
    product_id: 3,
    created_by: 3,
  },
  {
    id: 4,
    name: "Pepper Power",
    description: "Colorful bell peppers group buy - mixed colors for vibrant dishes",
    target_quantity: 30,
    current_quantity: 12,
    price_per_unit: 3.75,
    deadline: "2024-02-16T09:00:00Z",
    status: "active",
    product_name: "Bell Peppers",
    creator_name: "Street Food Corner",
    product_id: 4,
    created_by: 1,
  },
  {
    id: 5,
    name: "Chicken Champions",
    description: "Premium chicken breast group order - boneless, fresh cut",
    target_quantity: 25,
    current_quantity: 25,
    price_per_unit: 12.5,
    deadline: "2024-02-10T14:00:00Z",
    status: "completed",
    product_name: "Chicken Breast",
    creator_name: "Quick Bites",
    product_id: 5,
    created_by: 2,
  },
  {
    id: 6,
    name: "Cheese Please",
    description: "Aged cheddar cheese blocks - perfect for melting and cooking",
    target_quantity: 15,
    current_quantity: 8,
    price_per_unit: 6.25,
    deadline: "2024-02-18T11:00:00Z",
    status: "active",
    product_name: "Cheddar Cheese",
    creator_name: "Local Eats",
    product_id: 6,
    created_by: 3,
  },
  {
    id: 7,
    name: "Spice It Up",
    description: "Exotic spices and seasonings bundle - bring flavor to your dishes",
    target_quantity: 40,
    current_quantity: 18,
    price_per_unit: 4.99,
    deadline: "2024-02-20T16:00:00Z",
    status: "active",
    product_name: "Spice Mix",
    creator_name: "Flavor Town",
    product_id: 7,
    created_by: 4,
  },
  {
    id: 8,
    name: "Fresh Fish Friday",
    description: "Weekly fresh seafood delivery - sustainable fishing practices",
    target_quantity: 12,
    current_quantity: 9,
    price_per_unit: 15.75,
    deadline: "2024-02-16T08:00:00Z",
    status: "active",
    product_name: "Fresh Salmon",
    creator_name: "Ocean Bites",
    product_id: 8,
    created_by: 5,
  },
  {
    id: 9,
    name: "Bread Basket",
    description: "Artisan bread loaves - freshly baked daily",
    target_quantity: 60,
    current_quantity: 35,
    price_per_unit: 3.5,
    deadline: "2024-02-17T07:00:00Z",
    status: "active",
    product_name: "Artisan Bread",
    creator_name: "Bakery Corner",
    product_id: 9,
    created_by: 6,
  },
  {
    id: 10,
    name: "Veggie Variety Pack",
    description: "Mixed seasonal vegetables - perfect for healthy cooking",
    target_quantity: 35,
    current_quantity: 22,
    price_per_unit: 5.25,
    deadline: "2024-02-19T13:00:00Z",
    status: "active",
    product_name: "Mixed Vegetables",
    creator_name: "Green Garden",
    product_id: 10,
    created_by: 7,
  },
  {
    id: 11,
    name: "Rice & Nice",
    description: "Premium basmati rice bulk order - long grain, aromatic",
    target_quantity: 80,
    current_quantity: 45,
    price_per_unit: 2.8,
    deadline: "2024-02-21T10:00:00Z",
    status: "active",
    product_name: "Basmati Rice",
    creator_name: "Grain Masters",
    product_id: 11,
    created_by: 8,
  },
  {
    id: 12,
    name: "Oil & Vinegar",
    description: "Cooking oils and vinegars combo - essential kitchen supplies",
    target_quantity: 25,
    current_quantity: 14,
    price_per_unit: 8.99,
    deadline: "2024-02-22T14:00:00Z",
    status: "active",
    product_name: "Cooking Oil Set",
    creator_name: "Kitchen Essentials",
    product_id: 12,
    created_by: 9,
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return NextResponse.json(mockGroups)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newGroup = {
      id: Math.max(...mockGroups.map((g) => g.id)) + 1,
      ...body,
      current_quantity: 0,
      status: "active",
      creator_name: "Your Vendor",
      created_at: new Date().toISOString(),
    }

    mockGroups.push(newGroup)

    return NextResponse.json({ success: true, id: newGroup.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
