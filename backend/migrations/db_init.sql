-- ============================================================================
-- Database initialization script for TripTrop
-- PostgreSQL with UUID and JSONB support
-- 
-- This script creates all necessary tables, indexes, triggers, and sample data
-- for the TripTrop travel assistant application.
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- For fuzzy text search (optional)

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users table: Stores user account information
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ----------------------------------------------------------------------------
-- User Preferences table: Stores user travel preferences and settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    preferred_language VARCHAR(10) DEFAULT 'en',
    travel_style VARCHAR(50),  -- adventure, luxury, budget, relaxed, etc.
    preferred_activities TEXT[],  -- Array of activities: culture, food, nature, etc.
    budget_level VARCHAR(20) DEFAULT 'medium',  -- low, medium, high, luxury
    notification_preferences JSONB DEFAULT '{"email": true, "push": false}',
    accessibility_needs TEXT,
    dietary_restrictions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Indexes for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ----------------------------------------------------------------------------
-- Itineraries table: Stores AI-generated and user-created travel itineraries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_amount DECIMAL(10, 2),
    budget_currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft',  -- draft, planned, ongoing, completed, cancelled
    is_public BOOLEAN DEFAULT FALSE,  -- Allow sharing itineraries
    ai_content JSONB,  -- AI-generated itinerary content
    flights_data JSONB,  -- Selected flight information
    hotels_data JSONB,  -- Selected hotel information
    experiences_data JSONB,  -- Selected experiences information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for itineraries
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON itineraries(destination);
CREATE INDEX IF NOT EXISTS idx_itineraries_dates ON itineraries(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_is_public ON itineraries(is_public) WHERE is_public = TRUE;

-- GIN indexes for JSONB columns to enable efficient querying
CREATE INDEX IF NOT EXISTS idx_itineraries_ai_content ON itineraries USING GIN(ai_content);
CREATE INDEX IF NOT EXISTS idx_itineraries_flights_data ON itineraries USING GIN(flights_data);
CREATE INDEX IF NOT EXISTS idx_itineraries_hotels_data ON itineraries USING GIN(hotels_data);
CREATE INDEX IF NOT EXISTS idx_itineraries_experiences_data ON itineraries USING GIN(experiences_data);

-- ----------------------------------------------------------------------------
-- Search History table: Tracks user searches for analytics and quick re-search
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_type VARCHAR(50) NOT NULL,  -- flight, hotel, experience, itinerary
    search_params JSONB NOT NULL,
    results JSONB,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search_history
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_params ON search_history USING GIN(search_params);

-- ============================================================================
-- SAVED/FAVORITE OFFERS TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Saved Flights: Stores flight offers that users want to save/bookmark
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flight_id VARCHAR(100) NOT NULL,  -- External API flight ID
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date TIMESTAMP WITH TIME ZONE,
    return_date TIMESTAMP WITH TIME ZONE,
    airline VARCHAR(255),
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    cabin_class VARCHAR(50),
    stops INTEGER,
    duration_minutes INTEGER,
    flight_details JSONB,  -- Full flight details from API
    notes TEXT,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for saved_flights
CREATE INDEX IF NOT EXISTS idx_saved_flights_user_id ON saved_flights(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_flights_origin_dest ON saved_flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_saved_flights_departure_date ON saved_flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_saved_flights_price ON saved_flights(price);
CREATE INDEX IF NOT EXISTS idx_saved_flights_created_at ON saved_flights(created_at DESC);

-- ----------------------------------------------------------------------------
-- Saved Hotels: Stores hotel offers that users want to save/bookmark
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_id VARCHAR(100) NOT NULL,  -- External API hotel ID
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    rating DECIMAL(2, 1),
    stars INTEGER,
    price_per_night DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    amenities TEXT[],
    hotel_details JSONB,  -- Full hotel details from API
    notes TEXT,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for saved_hotels
CREATE INDEX IF NOT EXISTS idx_saved_hotels_user_id ON saved_hotels(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_hotels_destination ON saved_hotels(destination);
CREATE INDEX IF NOT EXISTS idx_saved_hotels_dates ON saved_hotels(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_saved_hotels_rating ON saved_hotels(rating DESC);
CREATE INDEX IF NOT EXISTS idx_saved_hotels_price ON saved_hotels(price_per_night);
CREATE INDEX IF NOT EXISTS idx_saved_hotels_created_at ON saved_hotels(created_at DESC);

-- ----------------------------------------------------------------------------
-- Saved Experiences: Stores activities/experiences users want to save/bookmark
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_id VARCHAR(100) NOT NULL,  -- External API experience ID
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    category VARCHAR(100),  -- tours, food, culture, adventure, etc.
    date DATE,
    rating DECIMAL(2, 1),
    reviews_count INTEGER,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    duration VARCHAR(50),  -- "2 hours", "Full day", etc.
    experience_details JSONB,  -- Full experience details from API
    notes TEXT,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for saved_experiences
CREATE INDEX IF NOT EXISTS idx_saved_experiences_user_id ON saved_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_experiences_destination ON saved_experiences(destination);
CREATE INDEX IF NOT EXISTS idx_saved_experiences_category ON saved_experiences(category);
CREATE INDEX IF NOT EXISTS idx_saved_experiences_date ON saved_experiences(date);
CREATE INDEX IF NOT EXISTS idx_saved_experiences_rating ON saved_experiences(rating DESC);
CREATE INDEX IF NOT EXISTS idx_saved_experiences_created_at ON saved_experiences(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS AND SESSIONS TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Notifications: Stores user notifications for price alerts, reminders, etc.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- price_alert, booking_reminder, trip_update, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),  -- flight, hotel, experience, itinerary
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'normal',  -- low, normal, high, urgent
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);

-- ----------------------------------------------------------------------------
-- User Sessions: Tracks active user sessions for security and analytics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_flights_updated_at
    BEFORE UPDATE ON saved_flights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_hotels_updated_at
    BEFORE UPDATE ON saved_hotels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_experiences_updated_at
    BEFORE UPDATE ON saved_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE user_sessions 
    SET is_active = FALSE 
    WHERE expires_at < CURRENT_TIMESTAMP AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT AND TESTING
-- ============================================================================

-- Insert test users
INSERT INTO users (email, full_name, is_active) VALUES
    ('test@example.com', 'Test User', TRUE),
    ('demo@triptrop.com', 'Demo User', TRUE),
    ('admin@triptrop.com', 'Admin User', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert user preferences for test users
INSERT INTO user_preferences (user_id, preferred_currency, preferred_language, travel_style, preferred_activities, budget_level)
SELECT 
    id, 
    'USD', 
    'en', 
    'relaxed',
    ARRAY['culture', 'food', 'nature'],
    'medium'
FROM users 
WHERE email IN ('test@example.com', 'demo@triptrop.com')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample itineraries
INSERT INTO itineraries (user_id, title, destination, description, start_date, end_date, budget_amount, budget_currency, status, ai_content)
SELECT 
    u.id,
    'Summer Trip to Paris',
    'Paris, France',
    'A wonderful 5-day trip exploring the City of Lights',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    CURRENT_TIMESTAMP + INTERVAL '35 days',
    1500.00,
    'USD',
    'planned',
    '{"overview": "Explore Paris with visits to iconic landmarks, museums, and cafes", "days": [{"day": 1, "date": "2024-06-01", "activities": [{"time": "09:00", "title": "Visit Eiffel Tower", "description": "Start your trip at the iconic Eiffel Tower", "cost": "30 EUR"}]}]}'::jsonb
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- Insert sample search history
INSERT INTO search_history (user_id, search_type, search_params, result_count)
SELECT 
    u.id,
    'flight',
    '{"origin": "JFK", "destination": "CDG", "departure_date": "2024-06-01", "passengers": 2}'::jsonb,
    15
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- Insert sample saved flights
INSERT INTO saved_flights (user_id, flight_id, origin, destination, departure_date, airline, price, currency, cabin_class, stops, duration_minutes, flight_details)
SELECT 
    u.id,
    'FL001-SAMPLE',
    'JFK',
    'CDG',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    'Air France',
    599.99,
    'USD',
    'economy',
    0,
    420,
    '{"flight_number": "AF007", "aircraft": "Boeing 777", "amenities": ["WiFi", "Entertainment"]}'::jsonb
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- Insert sample saved hotels
INSERT INTO saved_hotels (user_id, hotel_id, name, destination, check_in_date, check_out_date, rating, stars, price_per_night, total_price, currency, amenities, hotel_details)
SELECT 
    u.id,
    'HT001-SAMPLE',
    'Hotel Le Grand Paris',
    'Paris, France',
    (CURRENT_TIMESTAMP + INTERVAL '30 days')::date,
    (CURRENT_TIMESTAMP + INTERVAL '35 days')::date,
    4.5,
    4,
    180.00,
    900.00,
    'USD',
    ARRAY['WiFi', 'Breakfast', 'Pool', 'Spa'],
    '{"address": "123 Rue de Rivoli, Paris", "description": "Charming hotel in the heart of Paris"}'::jsonb
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- Insert sample saved experiences
INSERT INTO saved_experiences (user_id, experience_id, title, destination, category, rating, reviews_count, price, currency, duration, experience_details)
SELECT 
    u.id,
    'EXP001-SAMPLE',
    'Louvre Museum Skip-the-Line Tour',
    'Paris, France',
    'culture',
    4.8,
    2340,
    65.00,
    'USD',
    '3 hours',
    '{"description": "Explore the world-famous Louvre Museum with an expert guide", "includes": ["Skip-the-line access", "Expert guide", "Headsets"]}'::jsonb
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, related_entity_type, priority)
SELECT 
    u.id,
    'system',
    'Welcome to TripTrop!',
    'Start planning your next adventure with AI-powered itinerary generation.',
    NULL,
    'normal'
FROM users u
WHERE u.email = 'demo@triptrop.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    COUNT(DISTINCT i.id) as total_itineraries,
    COUNT(DISTINCT sf.id) as saved_flights_count,
    COUNT(DISTINCT sh.id) as saved_hotels_count,
    COUNT(DISTINCT se.id) as saved_experiences_count,
    COUNT(DISTINCT s.id) as total_searches,
    u.created_at
FROM users u
LEFT JOIN itineraries i ON u.id = i.user_id
LEFT JOIN saved_flights sf ON u.id = sf.user_id
LEFT JOIN saved_hotels sh ON u.id = sh.user_id
LEFT JOIN saved_experiences se ON u.id = se.user_id
LEFT JOIN search_history s ON u.id = s.user_id
GROUP BY u.id, u.email, u.full_name, u.created_at;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get unread notification count for a user
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM notifications WHERE user_id = p_user_id AND is_read = FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE notifications 
    SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
    WHERE user_id = p_user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERMISSIONS (Uncomment and adjust based on your database user)
-- ============================================================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_db_user;

-- ============================================================================
-- USEFUL QUERY EXAMPLES
-- ============================================================================

-- Query itineraries with specific AI content
-- SELECT * FROM itineraries WHERE ai_content @> '{"days": [{"day": 1}]}';

-- Query search history by destination
-- SELECT * FROM search_history WHERE search_params->>'destination' = 'Paris';

-- Get all flight searches with specific parameters
-- SELECT * FROM search_history 
-- WHERE search_type = 'flight' 
-- AND search_params->>'origin' = 'JFK';

-- Count searches by type
-- SELECT search_type, COUNT(*) 
-- FROM search_history 
-- GROUP BY search_type;

-- Get user's saved items summary
-- SELECT 
--   u.email,
--   COUNT(DISTINCT sf.id) as saved_flights,
--   COUNT(DISTINCT sh.id) as saved_hotels,
--   COUNT(DISTINCT se.id) as saved_experiences
-- FROM users u
-- LEFT JOIN saved_flights sf ON u.id = sf.user_id
-- LEFT JOIN saved_hotels sh ON u.id = sh.user_id
-- LEFT JOIN saved_experiences se ON u.id = se.user_id
-- WHERE u.email = 'demo@triptrop.com'
-- GROUP BY u.email;

-- Get unread notifications for a user
-- SELECT * FROM notifications 
-- WHERE user_id = (SELECT id FROM users WHERE email = 'demo@triptrop.com')
-- AND is_read = FALSE
-- ORDER BY created_at DESC;

-- Clean up expired sessions
-- SELECT cleanup_expired_sessions();

-- ============================================================================
-- END OF INITIALIZATION SCRIPT
-- ============================================================================
