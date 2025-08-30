// MongoDB initialization script for GreenChain
db = db.getSiblingDB('greenchain');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role', 'companyName'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 8
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'producer', 'verifier', 'buyer', 'regulator']
        },
        companyName: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100
        }
      }
    }
  }
});

db.createCollection('otps', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'otp'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        otp: {
          bsonType: 'string',
          pattern: '^[0-9]{4}$'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ companyName: 1 });
db.users.createIndex({ resetToken: 1 });

db.otps.createIndex({ email: 1 });
db.otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Create default admin user (for demo purposes)
const adminPassword = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6'; // password: admin123

db.users.insertOne({
  email: 'admin@greenchain.com',
  password: adminPassword,
  role: 'admin',
  companyName: 'GreenChain Admin',
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('GreenChain database initialized successfully!');
print('Default admin user created: admin@greenchain.com / admin123');