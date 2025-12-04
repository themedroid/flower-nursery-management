CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    referral_code VARCHAR(20) UNIQUE,
    referred_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    company_name VARCHAR(255),
    address TEXT,
    notes TEXT,
    discount_percent INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_order_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id),
    referred_id INTEGER REFERENCES users(id),
    bonus_amount INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percent INTEGER DEFAULT 0,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_list_items (
    id SERIAL PRIMARY KEY,
    price_list_id INTEGER REFERENCES price_lists(id),
    product_id INTEGER REFERENCES products(id),
    custom_price INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount INTEGER NOT NULL,
    payment_method VARCHAR(50),
    payment_system VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    avg_order_value INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_daily(date);

INSERT INTO users (email, password_hash, full_name, role, referral_code) VALUES
('admin@balcvetov.com', '$2b$10$rQ3jXKvqZ8Y9M4JH7yZJN.xN4K5LQFh8P9nW2mT6rY8xV7kL3qE4W', 'Администратор', 'admin', 'ADMIN2006');
