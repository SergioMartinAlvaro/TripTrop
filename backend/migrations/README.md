# Database Migrations

## Overview

This directory contains SQL migration scripts for initializing and managing the TripTrop database schema.

## Files

- `db_init.sql` - Complete database initialization script with all tables, indexes, triggers, functions, and sample data

## Database Schema

### Core Tables

#### 1. **users**
Stores user account information including Google OAuth credentials.

**Key fields:**
- `id` (UUID) - Primary key
- `email` - Unique email address
- `google_id` - Google OAuth identifier
- `full_name`, `avatar_url` - Profile information
- `is_active` - Account status

#### 2. **user_preferences**
Stores user travel preferences and settings.

**Key fields:**
- `preferred_currency`, `preferred_language`
- `travel_style` - adventure, luxury, budget, relaxed, etc.
- `preferred_activities` - Array of activity types
- `budget_level` - low, medium, high, luxury
- `notification_preferences` - JSONB for notification settings
- `dietary_restrictions`, `accessibility_needs`

#### 3. **itineraries**
Stores AI-generated and user-created travel itineraries.

**Key fields:**
- `destination`, `start_date`, `end_date`
- `budget_amount`, `budget_currency`
- `status` - draft, planned, ongoing, completed, cancelled
- `is_public` - Allow sharing itineraries
- `ai_content` - JSONB: AI-generated itinerary content
- `flights_data`, `hotels_data`, `experiences_data` - JSONB: Selected items

#### 4. **search_history**
Tracks all user searches for analytics and quick re-search.

**Key fields:**
- `search_type` - flight, hotel, experience, itinerary
- `search_params` - JSONB: Search parameters
- `results` - JSONB: Search results
- `result_count` - Number of results returned

### Saved/Favorite Offers Tables

#### 5. **saved_flights**
Stores flight offers that users bookmark for later reference.

**Key fields:**
- `flight_id` - External API flight identifier
- `origin`, `destination`, `departure_date`, `return_date`
- `airline`, `price`, `currency`, `cabin_class`
- `stops`, `duration_minutes`
- `flight_details` - JSONB: Full flight details from API
- `is_booked` - Track if user booked this flight

#### 6. **saved_hotels**
Stores hotel offers that users bookmark.

**Key fields:**
- `hotel_id` - External API hotel identifier
- `name`, `destination`
- `check_in_date`, `check_out_date`
- `rating`, `stars`, `price_per_night`, `total_price`
- `amenities` - Array of amenities
- `hotel_details` - JSONB: Full hotel details from API
- `is_booked` - Track if user booked this hotel

#### 7. **saved_experiences**
Stores activities and experiences that users bookmark.

**Key fields:**
- `experience_id` - External API experience identifier
- `title`, `destination`, `category`
- `date`, `rating`, `reviews_count`
- `price`, `duration`
- `experience_details` - JSONB: Full experience details from API
- `is_booked` - Track if user booked this experience

### System Tables

#### 8. **notifications**
Stores user notifications for price alerts, reminders, and updates.

**Key fields:**
- `type` - price_alert, booking_reminder, trip_update, system
- `title`, `message`
- `related_entity_type`, `related_entity_id` - Link to related item
- `is_read`, `read_at`
- `priority` - low, normal, high, urgent
- `action_url` - Link for notification action

#### 9. **user_sessions**
Tracks active user sessions for security and analytics.

**Key fields:**
- `session_token` - Unique session identifier
- `ip_address`, `user_agent`, `device_info`
- `is_active`, `last_activity_at`, `expires_at`

## Indexes

The script creates 44 indexes for optimal query performance:
- B-tree indexes on frequently queried columns
- GIN indexes on JSONB columns for efficient JSON queries
- Composite indexes on date ranges and multi-column queries
- Partial indexes for filtered queries (e.g., active sessions only)

## Triggers and Functions

### Triggers
- `update_*_updated_at` - Automatically updates `updated_at` timestamp on row updates (6 triggers)

### Functions
1. `update_updated_at_column()` - Trigger function for timestamp updates
2. `cleanup_expired_sessions()` - Marks expired sessions as inactive
3. `get_unread_notification_count(user_id)` - Returns count of unread notifications
4. `mark_all_notifications_read(user_id)` - Marks all notifications as read

### Views
- `user_statistics` - Aggregates user activity statistics (itineraries, saved items, searches)

## Sample Data

The script includes sample data for development and testing:
- 3 test users (test@example.com, demo@triptrop.com, admin@triptrop.com)
- User preferences for test users
- Sample itinerary for demo user
- Sample search history
- Sample saved flight, hotel, and experience
- Welcome notification

This allows developers to immediately test the application without manually creating data.

## Usage

### Initial Setup

```bash
# Create database
createdb triptrop

# Run initialization script
psql -U your_user -d triptrop -f backend/migrations/db_init.sql
```

### Docker Setup

```bash
# If using Docker Compose, the script runs automatically
docker-compose up -d
```

### Verify Installation

```bash
# Connect to database
psql -U your_user -d triptrop

# List all tables
\dt

# Check sample data
SELECT email, full_name FROM users;

# Check user statistics
SELECT * FROM user_statistics;

# Get unread notifications for demo user
SELECT get_unread_notification_count(
    (SELECT id FROM users WHERE email = 'demo@triptrop.com')
);
```

## Query Examples

### Get User's Saved Items Summary
```sql
SELECT 
  u.email,
  COUNT(DISTINCT sf.id) as saved_flights,
  COUNT(DISTINCT sh.id) as saved_hotels,
  COUNT(DISTINCT se.id) as saved_experiences
FROM users u
LEFT JOIN saved_flights sf ON u.id = sf.user_id
LEFT JOIN saved_hotels sh ON u.id = sh.user_id
LEFT JOIN saved_experiences se ON u.id = se.user_id
WHERE u.email = 'demo@triptrop.com'
GROUP BY u.email;
```

### Search History by Type
```sql
SELECT search_type, COUNT(*) as search_count
FROM search_history
GROUP BY search_type
ORDER BY search_count DESC;
```

### Find Itineraries by Destination
```sql
SELECT title, destination, start_date, status
FROM itineraries
WHERE destination ILIKE '%paris%'
ORDER BY start_date DESC;
```

### Get Active User Sessions
```sql
SELECT u.email, us.ip_address, us.last_activity_at
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE us.is_active = TRUE
ORDER BY us.last_activity_at DESC;
```

### Clean Up Expired Sessions
```sql
SELECT cleanup_expired_sessions();
```

## Maintenance

### Regular Tasks

1. **Clean up expired sessions** (run daily):
   ```sql
   SELECT cleanup_expired_sessions();
   ```

2. **Archive old search history** (optional, run monthly):
   ```sql
   DELETE FROM search_history 
   WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '6 months';
   ```

3. **Monitor database size**:
   ```sql
   SELECT 
     pg_size_pretty(pg_database_size('triptrop')) as db_size,
     pg_size_pretty(pg_total_relation_size('search_history')) as search_history_size,
     pg_size_pretty(pg_total_relation_size('notifications')) as notifications_size;
   ```

## Schema Updates

When adding new migrations:
1. Create a new file: `YYYYMMDD_description.sql`
2. Use `CREATE TABLE IF NOT EXISTS` for safety
3. Add appropriate indexes
4. Update this README

## Troubleshooting

### Issue: Extension not available
```
ERROR: could not open extension control file
```
**Solution**: Install PostgreSQL contrib package
```bash
sudo apt-get install postgresql-contrib
```

### Issue: Permission denied
```
ERROR: permission denied for table users
```
**Solution**: Grant appropriate permissions (see PERMISSIONS section in db_init.sql)

### Issue: Database already exists
```
ERROR: database "triptrop" already exists
```
**Solution**: Drop and recreate, or skip database creation
```bash
dropdb triptrop  # If you want to start fresh
createdb triptrop
```

## Performance Tuning

The script includes performance optimizations:
- Indexes on all foreign keys
- GIN indexes on JSONB columns
- Partial indexes for common filtered queries
- Composite indexes for multi-column queries

For production, consider:
- Enabling query logging to identify slow queries
- Using `EXPLAIN ANALYZE` to optimize queries
- Adjusting `work_mem` and `shared_buffers` based on workload
- Setting up connection pooling (pgBouncer)

## Security Considerations

- All foreign keys use `ON DELETE CASCADE` for automatic cleanup
- User sessions expire automatically
- Sample passwords should be changed in production
- Grant only necessary permissions to application user
- Consider row-level security for multi-tenant scenarios

## Data Privacy

- User data is protected by foreign key constraints
- Deleted users automatically remove all associated data (CASCADE)
- Implement data retention policies as needed
- Consider GDPR/privacy requirements for user data

## Backup and Recovery

```bash
# Backup database
pg_dump -U your_user triptrop > triptrop_backup.sql

# Restore database
psql -U your_user -d triptrop < triptrop_backup.sql

# Backup specific table
pg_dump -U your_user -t users triptrop > users_backup.sql
```

## Version History

- **v1.0.0** - Initial comprehensive schema with:
  - Core tables (users, itineraries, search_history)
  - Saved offers tables (flights, hotels, experiences)
  - System tables (notifications, sessions, preferences)
  - Sample data and helper functions
  - 44 indexes for optimal performance
  - 6 triggers and 4 utility functions
  - 1 aggregation view

## Contributing

When modifying the schema:
1. Test changes locally first
2. Create migration scripts for existing databases
3. Update this README
4. Update relevant models in `backend/app/models/`
5. Update API documentation if endpoints change

## License

MIT License - See LICENSE file for details
