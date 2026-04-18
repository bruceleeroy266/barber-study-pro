-- Database Schema for Cuts by Malenny
-- Run this in PostgreSQL to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for admin authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    client_since DATE DEFAULT CURRENT_DATE,
    total_visits INTEGER DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hair profiles table
CREATE TABLE hair_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    hair_type VARCHAR(100),
    hair_condition TEXT,
    porosity VARCHAR(50),
    density VARCHAR(50),
    texture VARCHAR(100),
    scalp_condition VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Allergies table
CREATE TABLE allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    allergen VARCHAR(255) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    reaction_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hair goals table
CREATE TABLE hair_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    goal TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consultations table
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    consultation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hair_type VARCHAR(100),
    current_condition TEXT,
    desired_outcome TEXT,
    previous_chemical_services TEXT,
    home_care_routine TEXT,
    recommendations TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services catalog table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'noshow')),
    deposit_amount DECIMAL(10,2) DEFAULT 10.00,
    deposit_paid BOOLEAN DEFAULT false,
    deposit_transaction_id VARCHAR(255),
    notes TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CRITICAL: Double-booking protection
-- Partial unique index to prevent multiple confirmed appointments at same time
CREATE UNIQUE INDEX idx_unique_appointment_slot 
ON appointments (appointment_date, appointment_time) 
WHERE status = 'confirmed';

-- Chemical services table
CREATE TABLE chemical_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    appointment_id UUID REFERENCES appointments(id),
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_type VARCHAR(100) NOT NULL,
    formula TEXT NOT NULL,
    developer_volume VARCHAR(50),
    processing_time VARCHAR(50),
    starting_level VARCHAR(100),
    ending_level VARCHAR(100),
    technique_notes TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    before_photos TEXT[], -- Array of photo URLs
    after_photos TEXT[], -- Array of photo URLs
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(last_name, first_name);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_chemical_services_customer ON chemical_services(customer_id);
CREATE INDEX idx_chemical_services_date ON chemical_services(service_date);
CREATE INDEX idx_consultations_customer ON consultations(customer_id);
CREATE INDEX idx_allergies_customer ON allergies(customer_id);

-- Insert default services
INSERT INTO services (name, category, description, price, duration_minutes) VALUES
('Regular Haircut', 'Haircuts', 'Classic or modern styles, includes consultation and styling', 30.00, 30),
('Kids Haircut (12 & under)', 'Haircuts', 'Patient, kid-friendly service', 25.00, 30),
('Senior Haircut (65+)', 'Haircuts', 'Respectful service for our senior clients', 25.00, 30),
('Low Fade', 'Fades', 'Subtle fade starting just above the ears', 35.00, 45),
('Mid Fade', 'Fades', 'Classic fade starting at the temples', 35.00, 45),
('High Fade', 'Fades', 'Bold fade starting high on the sides', 35.00, 45),
('Skin/Bald Fade', 'Fades', 'Fade down to the skin for a clean look', 40.00, 45),
('Taper', 'Fades', 'Gradual length reduction, more conservative than fade', 30.00, 30),
('Beard Trim', 'Beard', 'Shape up and line up', 20.00, 20),
('Beard Sculpting', 'Beard', 'Detailed shaping and styling', 25.00, 25),
('Hot Towel Shave', 'Beard', 'Classic straight razor shave with hot towels', 35.00, 30),
('Mustache Trim', 'Beard', 'Clean up and shape', 10.00, 10),
('Haircut + Beard Trim', 'Packages', 'Most popular package - the complete look', 45.00, 50),
('Haircut + Hot Towel Shave', 'Packages', 'The full barber experience', 60.00, 60),
('Fade + Beard', 'Packages', 'Clean fade with shaped beard', 50.00, 60),
('The Works', 'Packages', 'Haircut, beard trim, hot towel treatment, and styling', 70.00, 75),
('Design/Line Work', 'Add-ons', 'Custom designs, parts, or patterns', 10.00, 10),
('Enhancement (Fiber)', 'Add-ons', 'Hair fiber for fuller-looking hairline', 10.00, 5),
('Shampoo', 'Add-ons', 'Relaxing wash with premium products', 10.00, 10),
('Conditioning Treatment', 'Add-ons', 'Deep conditioning for healthy hair', 15.00, 15),
('Scalp Treatment', 'Add-ons', 'Exfoliation and moisturizing treatment', 20.00, 20);

-- Insert default admin user (password: admin123 - change in production!)
-- Password hash is for 'admin123' - use bcrypt to generate in production
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@cutsbymalenny.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hair_profiles_updated_at BEFORE UPDATE ON hair_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
