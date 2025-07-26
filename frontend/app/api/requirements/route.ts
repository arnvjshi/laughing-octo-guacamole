import { type NextRequest, NextResponse } from "next/server"

// Mock requirements data - items that vendors are looking for
const mockRequirements = [
  {
    id: 1,
    item_name: "Organic Quinoa",
    description: "High-quality organic quinoa for health-conscious customers",
    requested_by: "Health Food Corner",
    vendor_id: 1,
    quantity_needed: 25,
    unit: "kg",
    max_price: 8.5,
    deadline: "2024-02-20T10:00:00Z",
    location: "Downtown Market",
    status: "active",
    urgency: "high",
    created_at: "2024-02-10T09:00:00Z",
    contact_info: "vendor1@example.com",
    additional_notes: "Need for weekend health food festival. Quality is more important than price.",
  },
  {
    id: 2,
    item_name: "Fresh Avocados",
    description: "Ripe avocados for daily smoothie menu",
    requested_by: "Smoothie Station",
    vendor_id: 2,
    quantity_needed: 50,
    unit: "pieces",
    max_price: 2.0,
    deadline: "2024-02-18T08:00:00Z",
    location: "Food Truck Plaza",
    status: "active",
    urgency: "medium",
    created_at: "2024-02-11T14:30:00Z",
    contact_info: "vendor2@example.com",
    additional_notes: "Need consistent daily supply. Prefer Hass variety.",
  },
  {
    id: 3,
    item_name: "Artisan Bread Flour",
    description: "High-gluten flour for fresh bread making",
    requested_by: "Bakery Corner",
    vendor_id: 3,
    quantity_needed: 100,
    unit: "kg",
    max_price: 3.25,
    deadline: "2024-02-22T12:00:00Z",
    location: "Central Park Area",
    status: "active",
    urgency: "low",
    created_at: "2024-02-09T11:15:00Z",
    contact_info: "vendor3@example.com",
    additional_notes: "Looking for bulk discount. Weekly delivery preferred.",
  },
  {
    id: 4,
    item_name: "Premium Coffee Beans",
    description: "Single-origin coffee beans for specialty drinks",
    requested_by: "Coffee Cart Express",
    vendor_id: 4,
    quantity_needed: 15,
    unit: "kg",
    max_price: 25.0,
    deadline: "2024-02-25T15:00:00Z",
    location: "Business District",
    status: "active",
    urgency: "medium",
    created_at: "2024-02-12T08:45:00Z",
    contact_info: "vendor4@example.com",
    additional_notes: "Ethiopian or Colombian preferred. Need roasting date within 2 weeks.",
  },
  {
    id: 5,
    item_name: "Fresh Mozzarella",
    description: "Daily fresh mozzarella for pizza and sandwiches",
    requested_by: "Italian Street Food",
    vendor_id: 5,
    quantity_needed: 20,
    unit: "kg",
    max_price: 12.0,
    deadline: "2024-02-19T07:00:00Z",
    location: "Little Italy District",
    status: "active",
    urgency: "high",
    created_at: "2024-02-13T16:20:00Z",
    contact_info: "vendor5@example.com",
    additional_notes: "Must be made fresh daily. Buffalo mozzarella preferred if available.",
  },
  {
    id: 6,
    item_name: "Organic Vegetables Mix",
    description: "Seasonal organic vegetables for healthy wraps",
    requested_by: "Green Wrap Co",
    vendor_id: 6,
    quantity_needed: 40,
    unit: "kg",
    max_price: 6.75,
    deadline: "2024-02-21T09:00:00Z",
    location: "University Campus",
    status: "active",
    urgency: "medium",
    created_at: "2024-02-08T13:10:00Z",
    contact_info: "vendor6@example.com",
    additional_notes: "Variety pack needed: lettuce, tomatoes, cucumbers, peppers. Organic certification required.",
  },
  {
    id: 7,
    item_name: "Gluten-Free Flour",
    description: "Alternative flour for gluten-free baking",
    requested_by: "Allergy-Free Treats",
    vendor_id: 7,
    quantity_needed: 30,
    unit: "kg",
    max_price: 7.5,
    deadline: "2024-02-24T11:00:00Z",
    location: "Health District",
    status: "active",
    urgency: "low",
    created_at: "2024-02-07T10:30:00Z",
    contact_info: "vendor7@example.com",
    additional_notes: "Almond or rice flour preferred. Need certified gluten-free facility.",
  },
  {
    id: 8,
    item_name: "Fresh Seafood Mix",
    description: "Daily fresh fish and shellfish for seafood dishes",
    requested_by: "Ocean Bites",
    vendor_id: 8,
    quantity_needed: 35,
    unit: "kg",
    max_price: 18.0,
    deadline: "2024-02-17T06:00:00Z",
    location: "Harbor District",
    status: "urgent",
    urgency: "high",
    created_at: "2024-02-14T05:45:00Z",
    contact_info: "vendor8@example.com",
    additional_notes: "Need daily delivery. Salmon, shrimp, and white fish. Sustainability certification preferred.",
  },
  {
    id: 9,
    item_name: "Exotic Spices",
    description: "Rare spices for authentic ethnic cuisine",
    requested_by: "Spice Route Kitchen",
    vendor_id: 9,
    quantity_needed: 5,
    unit: "kg",
    max_price: 45.0,
    deadline: "2024-02-28T14:00:00Z",
    location: "Cultural Quarter",
    status: "active",
    urgency: "low",
    created_at: "2024-02-06T12:00:00Z",
    contact_info: "vendor9@example.com",
    additional_notes: "Looking for cardamom, saffron, star anise. Authentic sourcing important.",
  },
  {
    id: 10,
    item_name: "Plant-Based Protein",
    description: "Vegan protein alternatives for plant-based menu",
    requested_by: "Vegan Delights",
    vendor_id: 10,
    quantity_needed: 60,
    unit: "kg",
    max_price: 9.25,
    deadline: "2024-02-23T13:00:00Z",
    location: "Green District",
    status: "active",
    urgency: "medium",
    created_at: "2024-02-11T09:15:00Z",
    contact_info: "vendor10@example.com",
    additional_notes: "Tofu, tempeh, or seitan. Organic preferred. Need variety for different dishes.",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const urgency = searchParams.get("urgency")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    let requirements = mockRequirements

    // Filter by status
    if (status && status !== "all") {
      requirements = requirements.filter((req) => req.status === status)
    }

    // Filter by urgency
    if (urgency && urgency !== "all") {
      requirements = requirements.filter((req) => req.urgency === urgency)
    }

    // Sort by urgency and date
    requirements.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 }
      const urgencyDiff =
        urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder]
      if (urgencyDiff !== 0) return urgencyDiff
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json(requirements)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, you'd send a quote/response to the vendor
    const response = {
      id: Math.floor(Math.random() * 1000),
      requirement_id: body.requirement_id,
      supplier_id: body.supplier_id,
      quoted_price: body.quoted_price,
      available_quantity: body.available_quantity,
      delivery_date: body.delivery_date,
      message: body.message,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, response })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 })
  }
}
