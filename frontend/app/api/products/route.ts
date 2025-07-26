import { type NextRequest, NextResponse } from "next/server"

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    description: "Organic red tomatoes, perfect for cooking",
    price: 2.5,
    unit: "kg",
    min_quantity: 5,
    supplier_id: 1,
    supplier_name: "Fresh Produce Co",
  },
  {
    id: 2,
    name: "Ground Beef",
    description: "Premium quality ground beef",
    price: 8.99,
    unit: "kg",
    min_quantity: 2,
    supplier_id: 2,
    supplier_name: "Meat & More",
  },
  {
    id: 3,
    name: "Whole Milk",
    description: "Fresh whole milk from local farms",
    price: 3.25,
    unit: "liter",
    min_quantity: 10,
    supplier_id: 3,
    supplier_name: "Dairy Delights",
  },
  {
    id: 4,
    name: "Bell Peppers",
    description: "Mixed color bell peppers",
    price: 4.0,
    unit: "kg",
    min_quantity: 3,
    supplier_id: 1,
    supplier_name: "Fresh Produce Co",
  },
  {
    id: 5,
    name: "Chicken Breast",
    description: "Boneless chicken breast, fresh cut",
    price: 12.99,
    unit: "kg",
    min_quantity: 2,
    supplier_id: 2,
    supplier_name: "Meat & More",
  },
  {
    id: 6,
    name: "Cheddar Cheese",
    description: "Aged cheddar cheese blocks",
    price: 6.75,
    unit: "kg",
    min_quantity: 1,
    supplier_id: 3,
    supplier_name: "Dairy Delights",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supplier_id = searchParams.get("supplier_id")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let products = mockProducts
    if (supplier_id) {
      products = mockProducts.filter((p) => p.supplier_id === Number.parseInt(supplier_id))
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newProduct = {
      id: Math.max(...mockProducts.map((p) => p.id)) + 1,
      ...body,
      supplier_name: "Your Company",
    }

    mockProducts.push(newProduct)

    return NextResponse.json({ success: true, id: newProduct.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
