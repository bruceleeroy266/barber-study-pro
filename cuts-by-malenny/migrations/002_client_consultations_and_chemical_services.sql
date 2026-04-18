-- Migration: Add client consultations and chemical service tracking
-- This enables recording client hair history and chemical services applied

-- ============================================
-- CLIENT CONSULTATIONS TABLE
-- Stores initial and ongoing consultation data
-- ============================================
CREATE TABLE client_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Consultation metadata
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consultation_type VARCHAR(20) DEFAULT 'initial' CHECK (consultation_type IN ('initial', 'follow_up', 'chemical_service')),
    performed_by VARCHAR(100), -- barber/stylist name
    
    -- Hair history
    hair_type VARCHAR(50), -- fine, medium, coarse
    hair_texture VARCHAR(50), -- straight, wavy, curly, coily
    hair_density VARCHAR(20), -- thin, medium, thick
    hair_condition TEXT, -- overall condition notes
    scalp_condition VARCHAR(50), -- dry, oily, normal, dandruff, sensitive
    
    -- Previous chemical services
    previous_color BOOLEAN DEFAULT false,
    previous_color_date DATE,
    previous_color_notes TEXT,
    
    previous_relaxer BOOLEAN DEFAULT false,
    previous_relaxer_date DATE,
    previous_relaxer_notes TEXT,
    
    previous_perm BOOLEAN DEFAULT false,
    previous_perm_date DATE,
    previous_perm_notes TEXT,
    
    previous_bleach BOOLEAN DEFAULT false,
    previous_bleach_date DATE,
    previous_bleach_notes TEXT,
    
    -- Allergies and sensitivities
    has_allergies BOOLEAN DEFAULT false,
    allergy_details TEXT,
    sensitive_scalp BOOLEAN DEFAULT false,
    
    -- Goals and preferences
    desired_outcome TEXT,
    lifestyle_notes TEXT, -- how often they wash, style, etc.
    maintenance_commitment VARCHAR(20), -- low, medium, high
    
    -- Photos (store file paths or URLs)
    before_photo_url TEXT,
    after_photo_url TEXT,
    
    -- Notes
    notes TEXT,
    recommendations TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CHEMICAL SERVICES TABLE
-- Records specific chemical services performed
-- ============================================
CREATE TABLE chemical_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    consultation_id UUID REFERENCES client_consultations(id) ON DELETE SET NULL,
    
    -- Service details
    service_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN (
        'hair_color',
        'root_touchup',
        'highlights',
        'balayage',
        'bleach',
        'toner',
        'relaxer',
        'keratin_treatment',
        'perm',
        'color_correction',
        'other'
    )),
    
    -- Brand and product info
    brand_name VARCHAR(100),
    product_line VARCHAR(100),
    product_name VARCHAR(100),
    
    -- Formula details (for color services)
    formula TEXT, -- e.g., "6N + 7G 1:1 with 20vol"
    developer_volume VARCHAR(10), -- 10vol, 20vol, 30vol, 40vol
    mixing_ratio VARCHAR(20), -- e.g., "1:1", "1:2"
    
    -- Processing
    application_method VARCHAR(50), -- all over, roots only, balayage, foils, etc.
    processing_time_minutes INTEGER,
    processing_notes TEXT,
    
    -- Results
    result_color VARCHAR(50), -- final color achieved
    result_notes TEXT,
    client_satisfaction INTEGER CHECK (client_satisfaction BETWEEN 1 AND 5),
    
    -- Photos
    before_photo_url TEXT,
    after_photo_url TEXT,
    
    -- Follow-up
    next_service_recommended DATE,
    next_service_type VARCHAR(50),
    home_care_instructions TEXT,
    
    -- Cost tracking
    service_cost DECIMAL(10,2),
    product_cost DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CHEMICAL FORMULA TEMPLATES
-- Reusable formulas for quick reference
-- ============================================
CREATE TABLE chemical_formula_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) NOT NULL, -- e.g., "Natural Brown", "Ash Blonde"
    service_type VARCHAR(50) NOT NULL,
    
    brand_name VARCHAR(100),
    product_line VARCHAR(100),
    formula TEXT NOT NULL,
    developer_volume VARCHAR(10),
    mixing_ratio VARCHAR(20),
    processing_time_minutes INTEGER,
    
    -- For which hair types this works best
    best_for_hair_type VARCHAR(50),
    best_for_hair_texture VARCHAR(50),
    
    notes TEXT,
    is_favorite BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CLIENT ALLERGY ALERTS
-- Quick reference for client sensitivities
-- ============================================
CREATE TABLE client_allergy_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    allergen_type VARCHAR(50) NOT NULL, -- ppd, ammonia, fragrance, specific brand, etc.
    allergen_name VARCHAR(100),
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    reaction_description TEXT,
    
    -- Alert display
    alert_active BOOLEAN DEFAULT true,
    alert_message TEXT, -- e.g., "SEVERE PPD ALLERGY - Use PPD-free color only"
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CLIENT PHOTOS TABLE
-- Stores before/after and consultation photos
-- ============================================
CREATE TABLE client_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES client_consultations(id) ON DELETE SET NULL,
    chemical_service_id UUID REFERENCES chemical_services(id) ON DELETE SET NULL,
    
    -- Photo metadata
    photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('before', 'after', 'consultation', 'chemical', 'other')),
    description TEXT,
    
    -- Storage (using file path or URL - configure based on your storage solution)
    file_path TEXT NOT NULL, -- local path or cloud storage URL
    file_name VARCHAR(255),
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(50),
    
    -- Upload metadata
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- For external storage (S3, Cloudinary, etc.)
    storage_provider VARCHAR(50) DEFAULT 'local', -- local, s3, cloudinary, etc.
    external_id VARCHAR(255) -- ID from external storage provider
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_consultations_customer ON client_consultations(customer_id);
CREATE INDEX idx_consultations_date ON client_consultations(consultation_date);
CREATE INDEX idx_chemical_services_customer ON chemical_services(customer_id);
CREATE INDEX idx_chemical_services_date ON chemical_services(service_date);
CREATE INDEX idx_chemical_services_appointment ON chemical_services(appointment_id);
CREATE INDEX idx_allergy_alerts_customer ON client_allergy_alerts(customer_id);
CREATE INDEX idx_allergy_alerts_active ON client_allergy_alerts(customer_id, alert_active) WHERE alert_active = true;
CREATE INDEX idx_photos_customer ON client_photos(customer_id);
CREATE INDEX idx_photos_type ON client_photos(customer_id, photo_type);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE client_consultations IS 'Stores client hair history, goals, and consultation notes';
COMMENT ON TABLE chemical_services IS 'Records all chemical services performed with formulas and results';
COMMENT ON TABLE chemical_formula_templates IS 'Reusable color/formula templates for quick reference';
COMMENT ON TABLE client_allergy_alerts IS 'Active allergy warnings for clients';
COMMENT ON TABLE client_photos IS 'Before/after and consultation photos for clients';

-- ============================================
-- SAMPLE FORMULA TEMPLATES
-- ==========================================
INSERT INTO chemical_formula_templates 
(name, service_type, brand_name, formula, developer_volume, mixing_ratio, processing_time_minutes, notes)
VALUES
('Natural Black', 'hair_color', 'Wella', '2N', '20vol', '1:1', 30, 'Full coverage natural black'),
('Dark Brown', 'hair_color', 'Wella', '3N', '20vol', '1:1', 30, 'Rich dark brown'),
('Medium Brown', 'hair_color', 'Wella', '5N', '20vol', '1:1', 30, 'Natural medium brown'),
('Light Brown', 'hair_color', 'Wella', '6N', '20vol', '1:1', 30, 'Warm light brown'),
('Ash Brown', 'hair_color', 'Wella', '6A', '20vol', '1:1', 30, 'Cool toned light brown'),
('Golden Brown', 'hair_color', 'Wella', '6G', '20vol', '1:1', 30, 'Warm golden light brown');
