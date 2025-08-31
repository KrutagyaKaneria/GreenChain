# 🎯 GreenChain Role Access Guide

## 🔑 **How the Role System Works**

The GreenChain platform uses a **role-based access control system**. Here's how it works:

### **During Signup:**
- Users choose their role (Admin, Producer, Verifier, Buyer, Regulator)
- Each role has specific permissions and dashboard features
- Role is stored in the user's account

### **During Login:**
- Users login with email/password (no role selection needed)
- System automatically detects their role from their account
- Users are redirected to their role-specific dashboard

### **After Login:**
- Each role sees a different dashboard with relevant features
- Only Admin users can see the blockchain integration section

---

## 👥 **Available Roles & Access**

### **🔴 Admin Role**
- **Access**: Full system access
- **Dashboard**: Admin Dashboard with blockchain integration
- **Features**: 
  - User management
  - System settings
  - Blockchain operations
  - Analytics and reports
  - System monitoring

### **🏭 Producer Role**
- **Access**: Hydrogen production management
- **Dashboard**: Producer Dashboard
- **Features**:
  - IoT sensor management
  - Credit issuance
  - Production tracking
  - Facility management

### **✅ Verifier Role**
- **Access**: Credit verification
- **Dashboard**: Verifier Dashboard
- **Features**:
  - Credit verification
  - Compliance checking
  - Audit trails
  - Certification management

### **💰 Buyer Role**
- **Access**: Credit purchasing
- **Dashboard**: Buyer Dashboard
- **Features**:
  - Browse marketplace
  - Purchase credits
  - Portfolio management
  - Transaction history

### **📋 Regulator Role**
- **Access**: Regulatory oversight
- **Dashboard**: Regulator Dashboard
- **Features**:
  - Compliance monitoring
  - Regulatory reporting
  - Policy management
  - Audit oversight

---

## 🚀 **How to Access Admin Dashboard**

### **Method 1: Use Pre-Created Admin Account**
```
📧 Email: admin@greenchain.com
🔑 Password: Admin123!
```

**Steps:**
1. Go to: `http://localhost:3000/login`
2. Enter the admin credentials above
3. Click "Sign In"
4. You'll be redirected to the Admin Dashboard
5. Scroll down to find "🔗 Blockchain Integration" section

### **Method 2: Create New Admin via Signup**
1. Go to: `http://localhost:3000/signup`
2. Fill in the form:
   - Email: `your-admin-email@example.com`
   - Password: `YourSecurePassword123!`
   - Role: **Select "Admin"** from dropdown
   - Company Name: `Your Admin Company`
3. Complete email verification
4. Login with your new admin credentials

### **Method 3: Create Admin via Script**
```bash
# Run the admin creation script
node create-admin.js
```

---

## 🎮 **Testing Different Roles**

### **Create Test Users for Each Role**

You can create test users for each role using the signup process:

#### **Producer Test Account:**
```
📧 Email: producer@greenchain.com
🔑 Password: Producer123!
👤 Role: Producer
🏭 Company: Green Hydrogen Producer Ltd
```

#### **Verifier Test Account:**
```
📧 Email: verifier@greenchain.com
🔑 Password: Verifier123!
👤 Role: Verifier
✅ Company: Green Certifications Inc
```

#### **Buyer Test Account:**
```
📧 Email: buyer@greenchain.com
🔑 Password: Buyer123!
👤 Role: Buyer
💰 Company: Steel Manufacturing Co
```

#### **Regulator Test Account:**
```
📧 Email: regulator@greenchain.com
🔑 Password: Regulator123!
👤 Role: Regulator
📋 Company: Environmental Protection Agency
```

---

## 🔗 **Blockchain Integration Access**

### **Who Can Access Blockchain Features?**
- ✅ **Admin users only**
- ❌ Other roles cannot see blockchain integration

### **What You'll See in Admin Dashboard:**
1. **🔗 Blockchain Integration Section**
   - Network status (Polygon Mumbai Testnet)
   - Total credits counter
   - Verified credits counter
   - Wallet balance

2. **🧪 Test Operation Buttons:**
   - Issue Credit
   - Verify Credit
   - Create Listing
   - Refresh Data

3. **📋 Transaction History:**
   - Recent blockchain transactions
   - Transaction hashes
   - Timestamps

---

## 🎯 **Quick Start Guide**

### **To See Blockchain Integration Working:**

1. **Start Backend:**
   ```bash
   node server.js
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Login as Admin:**
   - Go to: `http://localhost:3000/login`
   - Email: `admin@greenchain.com`
   - Password: `Admin123!`

4. **Access Blockchain Section:**
   - Scroll down to "🔗 Blockchain Integration"
   - Click test buttons to see live blockchain operations
   - Watch transaction history update in real-time

---

## 🚨 **Troubleshooting**

### **If you can't login:**
1. Make sure backend is running (`node server.js`)
2. Make sure frontend is running (`npm run dev`)
3. Check that MongoDB is connected
4. Verify the admin user exists in database

### **If blockchain section doesn't appear:**
1. Make sure you're logged in as Admin role
2. Check browser console for errors (F12)
3. Verify the blockchain API endpoints are working

### **If buttons don't work:**
1. Check browser console for API errors
2. Verify backend blockchain routes are accessible
3. Make sure you're authenticated

---

## 📊 **Role Comparison Summary**

| Role | Dashboard | Blockchain Access | Key Features |
|------|-----------|-------------------|--------------|
| **Admin** | ✅ Admin Dashboard | ✅ Full Access | User management, System settings, Blockchain ops |
| **Producer** | ✅ Producer Dashboard | ❌ No Access | IoT sensors, Credit issuance, Production tracking |
| **Verifier** | ✅ Verifier Dashboard | ❌ No Access | Credit verification, Compliance checking |
| **Buyer** | ✅ Buyer Dashboard | ❌ No Access | Marketplace, Credit purchasing, Portfolio |
| **Regulator** | ✅ Regulator Dashboard | ❌ No Access | Compliance monitoring, Regulatory reporting |

---

**🎯 Now you know how to access the Admin Dashboard and see the blockchain integration working!**
