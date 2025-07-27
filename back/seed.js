import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.notification.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productOrder.deleteMany();
    await prisma.supplierProduct.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.product.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Hash password function
    const hashPassword = async (password) => {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    };

    // Create Users (Vendors and Suppliers) with hashed passwords
    const users = [
      // Vendors
      {
        id: 'user-1',
        clerkId: 'clerk_vendor_1',
        phone: '+919876543210',
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        password: await hashPassword('password123'), // Added password
        language: 'en',
        city: 'Nagpur',
        area: 'Sadar',
        address: 'Shop 12, Main Market, Sadar',
        userType: 'VENDOR',
        businessName: 'Raj General Store',
        businessCategory: 'GROCERY',
        gstNumber: 'GST123456789',
        rating: 4.5,
        isVerified: true,
      },
      {
        id: 'user-2',
        clerkId: 'clerk_vendor_2',
        phone: '+919876543211',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: await hashPassword('priya2025'), // Added password
        language: 'hi',
        city: 'Nagpur',
        area: 'Dharampeth',
        address: 'Restaurant Road, Dharampeth',
        userType: 'VENDOR',
        businessName: 'Priya Restaurant',
        businessCategory: 'RESTAURANT',
        rating: 4.8,
        isVerified: true,
      },
      {
        id: 'user-3',
        clerkId: 'clerk_vendor_3',
        phone: '+919876543212',
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        password: await hashPassword('amit@123'), // Added password
        language: 'en',
        city: 'Nagpur',
        area: 'Sitabuldi',
        userType: 'VENDOR',
        businessName: 'Fresh Vegetables Corner',
        businessCategory: 'VEGETABLE_VENDOR',
        rating: 4.2,
        isVerified: false,
      },
      {
        id: 'user-4',
        clerkId: 'clerk_vendor_4',
        phone: '+919876543213',
        name: 'Sunita Devi',
        email: 'sunita.devi@example.com',
        password: await hashPassword('sunita456'), // Added password
        language: 'hi',
        city: 'Nagpur',
        area: 'Sadar',
        userType: 'VENDOR',
        businessName: 'Sunita Medical',
        businessCategory: 'MEDICAL_SHOP',
        gstNumber: 'GST987654321',
        rating: 4.7,
        isVerified: true,
      },
      // Suppliers
      {
        id: 'user-5',
        clerkId: 'clerk_supplier_1',
        phone: '+919876543214',
        name: 'Vikram Singh',
        email: 'vikram.singh@agritech.com',
        password: await hashPassword('vikram@2025'), // Added password
        language: 'en',
        city: 'Nagpur',
        area: 'Industrial Area',
        userType: 'SUPPLIER',
        companyName: 'AgriTech Supplies',
        rating: 4.6,
        isVerified: true,
      },
      {
        id: 'user-6',
        clerkId: 'clerk_supplier_2',
        phone: '+919876543215',
        name: 'Meera Joshi',
        email: 'meera@freshproduce.com',
        password: await hashPassword('meera@fresh'), // Added password
        language: 'en',
        city: 'Nagpur',
        area: 'MIDC',
        userType: 'SUPPLIER',
        companyName: 'Fresh Produce Hub',
        rating: 4.9,
        isVerified: true,
      },
      {
        id: 'user-7',
        clerkId: 'clerk_supplier_3',
        phone: '+919876543216',
        name: 'Ramesh Gupta',
        email: 'ramesh@spicesworld.com',
        password: await hashPassword('ramesh@spices'), // Added password
        language: 'hi',
        city: 'Nagpur',
        area: 'Kalamna',
        userType: 'SUPPLIER',
        companyName: 'Spices World',
        rating: 4.4,
        isVerified: true,
      },
    ];

    // Create users one by one since we're using async password hashing
    for (const userData of users) {
      await prisma.user.create({ data: userData });
    }
    console.log('👥 Created users with hashed passwords');

    // Create Supplier Profiles
    const suppliers = [
      {
        id: 'supplier-1',
        userId: 'user-5',
        companyName: 'AgriTech Supplies',
        description: 'Premium quality vegetables and fruits direct from farms',
        rating: 4.6,
        totalOrders: 150,
        isVerified: true,
      },
      {
        id: 'supplier-2',
        userId: 'user-6',
        companyName: 'Fresh Produce Hub',
        description: 'Fresh fruits, vegetables, and dairy products',
        rating: 4.9,
        totalOrders: 200,
        isVerified: true,
      },
      {
        id: 'supplier-3',
        userId: 'user-7',
        companyName: 'Spices World',
        description: 'Authentic spices and cooking ingredients',
        rating: 4.4,
        totalOrders: 120,
        isVerified: true,
      },
    ];

    await prisma.supplier.createMany({ data: suppliers });
    console.log('🏭 Created suppliers');

    // Create Products
    const products = [
      // Vegetables
      { id: 'prod-1', name: 'Onions', description: 'Fresh red onions', category: 'VEGETABLES', unit: 'kg' },
      { id: 'prod-2', name: 'Potatoes', description: 'Premium quality potatoes', category: 'VEGETABLES', unit: 'kg' },
      { id: 'prod-3', name: 'Tomatoes', description: 'Fresh ripe tomatoes', category: 'VEGETABLES', unit: 'kg' },
      { id: 'prod-4', name: 'Carrots', description: 'Fresh carrots', category: 'VEGETABLES', unit: 'kg' },
      { id: 'prod-5', name: 'Green Chili', description: 'Fresh green chilies', category: 'VEGETABLES', unit: 'kg' },
      
      // Fruits
      { id: 'prod-6', name: 'Bananas', description: 'Ripe bananas', category: 'FRUITS', unit: 'dozen' },
      { id: 'prod-7', name: 'Apples', description: 'Fresh red apples', category: 'FRUITS', unit: 'kg' },
      { id: 'prod-8', name: 'Oranges', description: 'Juicy oranges', category: 'FRUITS', unit: 'kg' },
      
      // Grains & Cereals
      { id: 'prod-9', name: 'Basmati Rice', description: 'Premium basmati rice', category: 'GRAINS_CEREALS', unit: 'kg' },
      { id: 'prod-10', name: 'Wheat Flour', description: 'Fresh wheat flour', category: 'GRAINS_CEREALS', unit: 'kg' },
      
      // Dairy
      { id: 'prod-11', name: 'Milk', description: 'Fresh cow milk', category: 'DAIRY', unit: 'liter' },
      { id: 'prod-12', name: 'Paneer', description: 'Fresh paneer', category: 'DAIRY', unit: 'kg' },
      
      // Spices
      { id: 'prod-13', name: 'Turmeric Powder', description: 'Pure turmeric powder', category: 'SPICES', unit: 'kg' },
      { id: 'prod-14', name: 'Red Chili Powder', description: 'Spicy red chili powder', category: 'SPICES', unit: 'kg' },
      { id: 'prod-15', name: 'Garam Masala', description: 'Premium garam masala', category: 'SPICES', unit: 'kg' },
      
      // Cooking Oil
      { id: 'prod-16', name: 'Sunflower Oil', description: 'Pure sunflower cooking oil', category: 'COOKING_OIL', unit: 'liter' },
    ];

    await prisma.product.createMany({ data: products });
    console.log('🥕 Created products');

    // Create Supplier Products with pricing
    const supplierProducts = [
      // AgriTech Supplies (supplier-1)
      { id: 'sp-1', supplierId: 'supplier-1', productId: 'prod-1', pricePerUnit: 25.0, minQuantity: 10, maxQuantity: 500, isAvailable: true, deliveryTime: '2-3 days' },
      { id: 'sp-2', supplierId: 'supplier-1', productId: 'prod-2', pricePerUnit: 20.0, minQuantity: 10, maxQuantity: 500, isAvailable: true, deliveryTime: '2-3 days' },
      { id: 'sp-3', supplierId: 'supplier-1', productId: 'prod-3', pricePerUnit: 30.0, minQuantity: 10, maxQuantity: 300, isAvailable: true, deliveryTime: '1-2 days' },
      { id: 'sp-4', supplierId: 'supplier-1', productId: 'prod-4', pricePerUnit: 35.0, minQuantity: 5, maxQuantity: 200, isAvailable: true, deliveryTime: '2-3 days' },
      
      // Fresh Produce Hub (supplier-2)
      { id: 'sp-5', supplierId: 'supplier-2', productId: 'prod-6', pricePerUnit: 40.0, minQuantity: 5, maxQuantity: 100, isAvailable: true, deliveryTime: '1 day' },
      { id: 'sp-6', supplierId: 'supplier-2', productId: 'prod-7', pricePerUnit: 120.0, minQuantity: 5, maxQuantity: 200, isAvailable: true, deliveryTime: '1-2 days' },
      { id: 'sp-7', supplierId: 'supplier-2', productId: 'prod-8', pricePerUnit: 60.0, minQuantity: 5, maxQuantity: 150, isAvailable: true, deliveryTime: '1 day' },
      { id: 'sp-8', supplierId: 'supplier-2', productId: 'prod-11', pricePerUnit: 45.0, minQuantity: 10, maxQuantity: 200, isAvailable: true, deliveryTime: '1 day' },
      { id: 'sp-9', supplierId: 'supplier-2', productId: 'prod-12', pricePerUnit: 250.0, minQuantity: 2, maxQuantity: 50, isAvailable: true, deliveryTime: '1 day' },
      
      // Spices World (supplier-3)
      { id: 'sp-10', supplierId: 'supplier-3', productId: 'prod-13', pricePerUnit: 200.0, minQuantity: 1, maxQuantity: 50, isAvailable: true, deliveryTime: '2-3 days' },
      { id: 'sp-11', supplierId: 'supplier-3', productId: 'prod-14', pricePerUnit: 180.0, minQuantity: 1, maxQuantity: 50, isAvailable: true, deliveryTime: '2-3 days' },
      { id: 'sp-12', supplierId: 'supplier-3', productId: 'prod-15', pricePerUnit: 300.0, minQuantity: 1, maxQuantity: 30, isAvailable: true, deliveryTime: '3-4 days' },
      { id: 'sp-13', supplierId: 'supplier-3', productId: 'prod-16', pricePerUnit: 90.0, minQuantity: 5, maxQuantity: 100, isAvailable: true, deliveryTime: '2-3 days' },
      
      // Cross-supplier products for price comparison
      { id: 'sp-14', supplierId: 'supplier-2', productId: 'prod-1', pricePerUnit: 28.0, minQuantity: 15, maxQuantity: 400, isAvailable: true, deliveryTime: '1-2 days' },
      { id: 'sp-15', supplierId: 'supplier-2', productId: 'prod-2', pricePerUnit: 22.0, minQuantity: 15, maxQuantity: 400, isAvailable: true, deliveryTime: '1-2 days' },
    ];

    await prisma.supplierProduct.createMany({ data: supplierProducts });
    console.log('💰 Created supplier products with pricing');

    // Create Groups
    const groups = [
      {
        id: 'group-1',
        name: 'Sadar Market Group',
        description: 'Weekly grocery buying group for Sadar area',
        creatorId: 'user-1',
        city: 'Nagpur',
        area: 'Sadar',
        deliveryRadius: 3.0,
        minMembers: 5,
        maxMembers: 20,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        id: 'group-2',
        name: 'Restaurant Supplies Group',
        description: 'Bulk buying group for restaurants in Dharampeth',
        creatorId: 'user-2',
        city: 'Nagpur',
        area: 'Dharampeth',
        deliveryRadius: 5.0,
        minMembers: 3,
        maxMembers: 15,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        id: 'group-3',
        name: 'Fresh Vegetables Group',
        description: 'Daily fresh vegetables for Sitabuldi area',
        creatorId: 'user-3',
        city: 'Nagpur',
        area: 'Sitabuldi',
        deliveryRadius: 2.0,
        minMembers: 4,
        maxMembers: 25,
        status: 'LOCKED',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
    ];

    await prisma.group.createMany({ data: groups });
    console.log('👥 Created groups');

    // Create Group Members
    const groupMembers = [
      // Group 1 members
      { id: 'gm-1', userId: 'user-1', groupId: 'group-1', role: 'ADMIN' },
      { id: 'gm-2', userId: 'user-4', groupId: 'group-1', role: 'MEMBER' },
      
      // Group 2 members
      { id: 'gm-3', userId: 'user-2', groupId: 'group-2', role: 'ADMIN' },
      { id: 'gm-4', userId: 'user-1', groupId: 'group-2', role: 'MEMBER' },
      
      // Group 3 members
      { id: 'gm-5', userId: 'user-3', groupId: 'group-3', role: 'ADMIN' },
      { id: 'gm-6', userId: 'user-1', groupId: 'group-3', role: 'MEMBER' },
      { id: 'gm-7', userId: 'user-4', groupId: 'group-3', role: 'MODERATOR' },
    ];

    await prisma.groupMember.createMany({ data: groupMembers });
    console.log('🤝 Created group members');

    // Create Product Orders (User's cart items in groups)
    const productOrders = [
      // Group 1 orders
      { id: 'po-1', groupId: 'group-1', productId: 'prod-1', userId: 'user-1', quantity: 15, unitPrice: 25.0, totalPrice: 375.0, notes: 'Good quality onions needed' },
      { id: 'po-2', groupId: 'group-1', productId: 'prod-2', userId: 'user-1', quantity: 20, unitPrice: 20.0, totalPrice: 400.0 },
      { id: 'po-3', groupId: 'group-1', productId: 'prod-1', userId: 'user-4', quantity: 10, unitPrice: 25.0, totalPrice: 250.0 },
      
      // Group 2 orders
      { id: 'po-4', groupId: 'group-2', productId: 'prod-3', userId: 'user-2', quantity: 25, unitPrice: 30.0, totalPrice: 750.0, notes: 'For restaurant use' },
      { id: 'po-5', groupId: 'group-2', productId: 'prod-6', userId: 'user-2', quantity: 10, unitPrice: 40.0, totalPrice: 400.0 },
      { id: 'po-6', groupId: 'group-2', productId: 'prod-11', userId: 'user-1', quantity: 20, unitPrice: 45.0, totalPrice: 900.0 },
      
      // Group 3 orders
      { id: 'po-7', groupId: 'group-3', productId: 'prod-3', userId: 'user-3', quantity: 30, unitPrice: 30.0, totalPrice: 900.0 },
      { id: 'po-8', groupId: 'group-3', productId: 'prod-4', userId: 'user-1', quantity: 15, unitPrice: 35.0, totalPrice: 525.0 },
      { id: 'po-9', groupId: 'group-3', productId: 'prod-5', userId: 'user-4', quantity: 5, unitPrice: 40.0, totalPrice: 200.0 },
    ];

    await prisma.productOrder.createMany({ data: productOrders });
    console.log('🛒 Created product orders');

    // Create Final Orders (Consolidated orders to suppliers)
    const orders = [
      {
        id: 'order-1',
        groupId: 'group-1',
        supplierId: 'supplier-1',
        orderNumber: 'ORD-2025-001',
        subtotal: 1025.0,
        deliveryCharge: 50.0,
        tax: 51.25,
        discount: 25.0,
        totalAmount: 1101.25,
        deliveryAddress: 'Sadar Market Area, Nagpur',
        deliveryEta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        deliveryNotes: 'Please deliver before 10 AM',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK001',
      },
      {
        id: 'order-2',
        groupId: 'group-2',
        supplierId: 'supplier-2',
        orderNumber: 'ORD-2025-002',
        subtotal: 2050.0,
        deliveryCharge: 75.0,
        tax: 102.5,
        discount: 50.0,
        totalAmount: 2177.5,
        deliveryAddress: 'Dharampeth Restaurant Area, Nagpur',
        deliveryEta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK002',
      },
    ];

    await prisma.order.createMany({ data: orders });
    console.log('📦 Created final orders');

    // Create Chat Messages
    const chatMessages = [
      {
        id: 'msg-1',
        groupId: 'group-1',
        senderId: 'user-1',
        content: 'Hello everyone! Welcome to Sadar Market Group. Let\'s start adding items to our cart.',
        messageType: 'TEXT',
        isSystemMessage: false,
      },
      {
        id: 'msg-2',
        groupId: 'group-1',
        senderId: 'user-4',
        content: 'Thanks for creating this group! I need onions and potatoes.',
        messageType: 'TEXT',
        isSystemMessage: false,
      },
      {
        id: 'msg-3',
        groupId: 'group-1',
        senderId: 'user-1',
        content: 'Group order has been placed successfully!',
        messageType: 'SYSTEM_NOTIFICATION',
        isSystemMessage: true,
      },
      {
        id: 'msg-4',
        groupId: 'group-2',
        senderId: 'user-2',
        content: 'Looking for fresh vegetables for my restaurant. Quality is very important.',
        messageType: 'TEXT',
        isSystemMessage: false,
      },
      {
        id: 'msg-5',
        groupId: 'group-2',
        senderId: 'user-1',
        content: 'I can also add some items to reach minimum quantity.',
        messageType: 'TEXT',
        isSystemMessage: false,
      },
    ];

    await prisma.chatMessage.createMany({ data: chatMessages });
    console.log('💬 Created chat messages');

    // Create Notifications
    const notifications = [
      {
        id: 'notif-1',
        userId: 'user-1',
        title: 'Order Confirmed',
        content: 'Your order ORD-2025-001 has been confirmed by the supplier.',
        type: 'ORDER_UPDATE',
        isRead: false,
        metadata: { orderId: 'order-1', orderNumber: 'ORD-2025-001' },
      },
      {
        id: 'notif-2',
        userId: 'user-4',
        title: 'Group Order Placed',
        content: 'Group order for Sadar Market Group has been placed successfully.',
        type: 'ORDER_UPDATE',
        isRead: false,
        metadata: { groupId: 'group-1', groupName: 'Sadar Market Group' },
      },
      {
        id: 'notif-3',
        userId: 'user-2',
        title: 'Order Processing',
        content: 'Your order ORD-2025-002 is now being processed.',
        type: 'ORDER_UPDATE',
        isRead: true,
        metadata: { orderId: 'order-2', orderNumber: 'ORD-2025-002' },
      },
      {
        id: 'notif-4',
        userId: 'user-1',
        title: 'New Group Invitation',
        content: 'You have been invited to join Fresh Vegetables Group.',
        type: 'GROUP_INVITATION',
        isRead: false,
        metadata: { groupId: 'group-3', groupName: 'Fresh Vegetables Group' },
      },
      {
        id: 'notif-5',
        userId: 'user-4',
        title: 'Delivery Update',
        content: 'Your order will be delivered tomorrow between 9-11 AM.',
        type: 'DELIVERY_UPDATE',
        isRead: false,
        metadata: { orderId: 'order-1', estimatedTime: '9-11 AM' },
      },
    ];

    await prisma.notification.createMany({ data: notifications });
    console.log('🔔 Created notifications');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users: 7 (4 Vendors, 3 Suppliers) - All with encrypted passwords');
    console.log('- Suppliers: 3');
    console.log('- Products: 16');
    console.log('- Supplier Products: 15');
    console.log('- Groups: 3');
    console.log('- Group Members: 7');
    console.log('- Product Orders: 9');
    console.log('- Final Orders: 2');
    console.log('- Chat Messages: 5');
    console.log('- Notifications: 5');

    console.log('\n🔐 Test Login Credentials:');
    console.log('- Raj Patel: raj.patel@example.com / password123');
    console.log('- Priya Sharma: priya.sharma@example.com / priya2025');
    console.log('- Amit Kumar: amit.kumar@example.com / amit@123');
    console.log('- Sunita Devi: sunita.devi@example.com / sunita456');
    console.log('- Vikram Singh: vikram.singh@agritech.com / vikram@2025');
    console.log('- Meera Joshi: meera@freshproduce.com / meera@fresh');
    console.log('- Ramesh Gupta: ramesh@spicesworld.com / ramesh@spices');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

export default seedDatabase;