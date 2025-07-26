# BulkBite - Smart Group Buying for Street Vendors

A visually stunning web application that connects street vendors with suppliers through intelligent group buying, featuring glassmorphism design, neumorphism effects, and smooth GSAP animations.

## ✨ Features

### 🎨 Design Excellence
- **Glassmorphism & Neumorphism**: Beautiful UI with modern glass-like cards and soft 3D button effects
- **GSAP Animations**: Smooth transitions, micro-interactions, and page animations
- **3-Color Palette**: Indigo (#6366f1), Emerald (#10b981), Amber (#f59e0b)
- **2-Font System**: Inter (primary) and Poppins (headings)
- **Mobile-First**: Fully responsive design optimized for all devices

### 🏪 User Roles
- **Vendors**: Street food vendors who participate in group buying
- **Suppliers**: Product suppliers who fulfill group orders

### 📱 Pages & Features
- **Login Page**: Role selection with animated user type switcher
- **Vendor Dashboard**: Groups, orders, suppliers, and map view
- **Supplier Dashboard**: Products, order management, reviews, and map view
- **Interactive Map**: Beautiful placeholder map with animated location pins
- **Real-time Data**: All pages show live API data with loading states

### 🔌 API Endpoints (Mock Data)
- `POST /api/login` - User authentication
- `GET /api/products` - Product listings
- `GET /api/groups` - Group buying opportunities
- `GET /api/orders` - Order management
- `GET /api/suppliers` - Supplier directory
- `GET /api/mapdata` - Location data for maps

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
\`\`\`bash
git clone <repository-url>
cd bulkbite-webapp
npm install
\`\`\`

2. **Run the development server:**
\`\`\`bash
npm run dev
\`\`\`

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### 🎯 Usage

1. **Login**: Choose between Vendor or Supplier role
2. **Explore**: Navigate through different dashboard sections
3. **Interact**: Experience smooth animations and transitions
4. **Test APIs**: All endpoints return mock data for demonstration

## 🏗️ Architecture

### Frontend Structure
\`\`\`
app/
├── page.tsx                 # Login page
├── vendor/page.tsx          # Vendor dashboard
├── supplier/page.tsx        # Supplier dashboard
├── api/                     # API routes
│   ├── login/route.ts
│   ├── products/route.ts
│   ├── groups/route.ts
│   ├── orders/route.ts
│   ├── suppliers/route.ts
│   └── mapdata/route.ts
├── layout.tsx               # Root layout
└── globals.css              # Global styles

components/
├── DashboardLayout.tsx      # Shared dashboard layout
└── MapView.tsx              # Interactive map component
\`\`\`

### Design System
- **Colors**: 3-color palette with gradients
- **Typography**: Inter + Poppins font combination
- **Effects**: Glassmorphism cards, neumorphism buttons
- **Animations**: GSAP-powered transitions and micro-interactions

### API Design
All endpoints use **static mock data** - no database required:
- Simulated API delays for realistic UX
- RESTful design ready for real backend integration
- Comprehensive mock datasets for all features

## 🎨 Visual Features

### Glassmorphism Effects
- Translucent cards with backdrop blur
- Gradient borders and shadows
- Layered depth perception

### Neumorphism Elements
- Soft 3D button effects
- Inset and outset shadows
- Tactile interaction feedback

### GSAP Animations
- Page entrance transitions
- Hover micro-interactions
- Loading state animations
- Smooth tab switching

### Interactive Map
- Animated location pins
- Floating elements
- Gradient connections
- Hover effects

## 🔧 Customization

### Colors
Update the color palette in \`tailwind.config.js\`:
\`\`\`js
colors: {
  primary: '#6366f1',    // Indigo
  secondary: '#10b981',  // Emerald  
  accent: '#f59e0b',     // Amber
}
\`\`\`

### Fonts
Modify font imports in \`app/layout.tsx\`:
\`\`\`tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ ... })
\`\`\`

### Animations
Customize GSAP animations in component files:
\`\`\`tsx
gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1 })
\`\`\`

## 🚀 Production Deployment

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables
No environment variables required - all data is mocked.

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting**

## 🔌 Integration Ready

### Database Integration
Replace mock data in API routes with real database calls:
\`\`\`tsx
// Replace this:
const mockProducts = [...]

// With this:
const products = await db.products.findMany()
\`\`\`

### Authentication
Add real authentication to API routes:
\`\`\`tsx
// Add JWT verification
const token = request.headers.get('authorization')
const user = verifyToken(token)
\`\`\`

### Map Integration
Replace the MapView placeholder with real maps:
- Google Maps API
- Leaflet
- Mapbox
- OpenStreetMap

## 📱 Mobile Experience

- **Touch-Optimized**: All interactions work perfectly on mobile
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Navigation**: Collapsible sidebar with smooth animations
- **Performance**: Optimized for mobile networks

## 🎯 Demo Credentials

Use any email/name combination:
- **Vendor**: Any email with "Vendor" role
- **Supplier**: Any email with "Supplier" role

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

**BulkBite** - Connecting street vendors through smart group buying! 🏪✨
