# Audit Logs Implementation Guide

## Overview

The audit logs functionality has been implemented on the frontend. This guide provides instructions for implementing the backend API routes and database structure.

## Frontend Changes Made

### 1. Updated AuditLogs Component (`src/components/admin/AuditLogs.tsx`)

- ✅ Connected to Redux store for state management
- ✅ Added pagination support
- ✅ Implemented filtering by action type and resource
- ✅ Added search functionality
- ✅ Proper error handling and loading states
- ✅ Responsive table with detailed view dialog

### 2. Updated SystemConfig Interface (`src/services/adminService.ts`)

- ✅ Added `created_by` field to handle nullable user references
- ✅ Updated types to match database structure

### 3. Redux Store (`src/store/adminSlice.ts`)

- ✅ Already had audit logs actions and reducers
- ✅ Proper state management for loading, error, and pagination

## Backend Implementation Required

### 1. Database Structure

Your `audit_logs` table should have this structure:

```sql
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    resource VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 2. API Routes to Implement

#### GET `/api/audit` - Get all audit logs (admin only)

- **Query Parameters:** `page`, `limit`, `action_type`
- **Access:** Admin only
- **Used by:** Admin audit logs page
- **Features:** Server-side filtering and pagination

#### GET `/api/audit/me` - Get current user's audit logs

- **Query Parameters:** `page`, `limit`
- **Access:** All authenticated users
- **Used by:** User's own audit logs
- **Features:** Basic pagination

### 3. Response Format

All endpoints should return this format:

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "created_by": 1,
        "resource": "config",
        "resource_id": "2025",
        "action": "config_updated",
        "created_at": "2025-07-17 19:07:32",
        "updated_at": "2025-07-17 19:07:32",
        "user": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 4. Helper Function

Implement the `createAuditLog` helper function to log actions:

```javascript
const createAuditLog = async (userId, action, resource, resourceId) => {
  // Implementation in backend-audit-logs-api.js
};
```

## Usage Examples

### Logging System Config Changes

```javascript
// When updating holidays
await createAuditLog(req.user.id, "config_updated", "config", "2025");
```

### Logging User Actions

```javascript
// When user logs in
await createAuditLog(req.user.id, "login", "auth", req.user.id.toString());

// When user creates a leave request
await createAuditLog(req.user.id, "create", "leave", leaveId.toString());
```

## Frontend Features

### 1. Filtering

- **Action Type**: Filter by config_updated, login, logout, create, update, delete
- **Resource**: Filter by auth, user, leave, admin, config
- **Search**: Search by user name or details content

### 2. Pagination

- 20 logs per page
- Navigation controls at the bottom

### 3. Detailed View

- Click the eye icon to view full log details
- Shows formatted JSON data
- Displays user information and timestamp

### 4. Timezone Handling

- **Database**: Store all timestamps in UTC
- **Frontend**: Automatically convert UTC to local timezone for display
- **Utility**: `src/utils/dateUtils.ts` provides consistent date formatting
- **Functions**:
  - `formatUTCDate()` - Full date and time
  - `formatUTCDateOnly()` - Date only
  - `formatUTCTimeOnly()` - Time only
  - `getTimezoneOffset()` - Get current timezone offset

### 5. Export Functionality

- Export button ready for implementation
- Can be extended to export CSV/Excel

## Testing

1. **Start the frontend**: `npm run dev`
2. **Implement backend routes** using the provided code
3. **Test the audit logs page** by navigating to Admin → Audit Logs
4. **Verify filtering and search** work correctly
5. **Test pagination** with multiple pages of data

## Security Considerations

1. **Admin-only access**: Ensure only admins can view all audit logs
2. **User isolation**: Users should only see their own logs
3. **Sensitive data**: Be careful not to log sensitive information
4. **Data retention**: Consider implementing log retention policies

## Next Steps

1. Implement the backend API routes
2. Add audit logging to existing actions (login, config updates, etc.)
3. Test the complete flow
4. Consider adding export functionality
5. Implement log retention policies if needed

## Troubleshooting

### Common Issues:

1. **White screen**: Check if API endpoints are implemented
2. **No data**: Verify database has audit_logs table and data
3. **CORS errors**: Ensure backend allows frontend origin
4. **Authentication errors**: Check token handling in API

### Debug Steps:

1. Check browser network tab for API calls
2. Verify Redux state in browser dev tools
3. Check backend logs for errors
4. Verify database queries return expected data
