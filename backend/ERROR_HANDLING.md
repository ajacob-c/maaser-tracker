# Error Handling and Logging System

This document describes the comprehensive error handling and logging system implemented in the maaser-tracker backend.

## Overview

The application now includes:
- Structured logging with Winston
- Centralized error handling
- Request logging middleware
- Input validation
- Security improvements
- Production-ready error responses

## Logging System

### Logger Configuration (`utils/logger.js`)

The logging system uses Winston with the following features:

- **Log Levels**: error, warn, info, http, debug
- **Environment-based logging**: Debug level in development, warn level in production
- **Multiple transports**: Console and file logging
- **Structured logging**: JSON format for file logs, colored console output
- **Log rotation**: Separate error log file

### Log Files

- `logs/error.log`: Contains only error-level logs
- `logs/combined.log`: Contains all log levels

### Usage Examples

```javascript
const logger = require('./utils/logger');

logger.error('Critical error occurred', { userId: '123', action: 'login' });
logger.warn('Suspicious activity detected', { ip: '192.168.1.1' });
logger.info('User action completed', { userId: '123', action: 'data_fetch' });
logger.http('API request processed', { method: 'GET', path: '/api/data' });
logger.debug('Debug information', { data: someObject });
```

## Error Handling System

### Custom Error Class (`utils/errorHandler.js`)

The `AppError` class provides:
- Custom error codes for frontend handling
- Consistent error structure
- Stack trace capture

```javascript
const { AppError } = require('./utils/errorHandler');

throw new AppError('User not found', 404, 'USER_NOT_FOUND');
```

### Central Error Handler

The central error handler (`errorHandler`) automatically:
- Logs all errors with context
- Handles common error types (MongoDB, JWT, validation)
- Formats error responses for production/development
- Provides consistent error structure

### Async Error Wrapper

The `asyncHandler` wrapper eliminates the need for try-catch blocks:

```javascript
const { asyncHandler } = require('./utils/errorHandler');

router.get('/data', asyncHandler(async (req, res) => {
    // Your route logic here
    // Errors are automatically caught and handled
}));
```

## Request Logging Middleware

### Features

- Logs all incoming requests with metadata
- Tracks response times
- Records user agent, IP, and user ID
- Different log levels for successful vs failed requests

### Logged Information

- HTTP method and URL
- Request timestamp
- Response status code
- Response time
- User ID (if authenticated)
- IP address
- User agent

## Security Improvements

### Input Validation

All routes now include comprehensive input validation:

- **Email validation**: Proper email format checking
- **Password strength**: Minimum 6 characters
- **Amount validation**: Positive numbers only
- **Date validation**: Valid year/month ranges
- **User authorization**: Users can only access their own data

### Error Response Security

- **Development mode**: Includes stack traces and detailed error info
- **Production mode**: Generic error messages without sensitive data
- **Consistent error codes**: Frontend can handle specific error types

## API Response Format

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errorCode": "SPECIFIC_ERROR_CODE",
  "timestamp": "2025-07-02T15:30:11.301Z"
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `MISSING_CREDENTIALS` | Email or password missing | 400 |
| `INVALID_EMAIL` | Invalid email format | 400 |
| `WEAK_PASSWORD` | Password too short | 400 |
| `EMAIL_EXISTS` | Email already registered | 400 |
| `INVALID_CREDENTIALS` | Wrong email/password | 400 |
| `MISSING_FIELDS` | Required fields missing | 400 |
| `INVALID_AMOUNT` | Amount must be positive | 400 |
| `INVALID_YEAR` | Year out of valid range | 400 |
| `INVALID_MONTH` | Month out of valid range | 400 |
| `UNAUTHORIZED_ACCESS` | Accessing another user's data | 403 |
| `NO_TOKEN` | No authentication token | 401 |
| `INVALID_TOKEN` | Invalid JWT token | 401 |
| `TOKEN_EXPIRED` | JWT token expired | 401 |
| `RESOURCE_NOT_FOUND` | Requested resource not found | 404 |
| `ROUTE_NOT_FOUND` | API endpoint not found | 404 |
| `VALIDATION_ERROR` | Data validation failed | 400 |
| `DUPLICATE_FIELD` | Duplicate data in unique field | 400 |
| `DATABASE_ERROR` | Database connection failed | 500 |

## Testing

### Test the Logging System

```bash
cd backend
node test-logging.js
```

### Test Error Handling

The error handling can be tested by:
1. Making invalid API requests
2. Using expired tokens
3. Attempting to access unauthorized data
4. Sending malformed data

## Production Considerations

### Environment Variables

Ensure these environment variables are set in production:

```bash
NODE_ENV=production
JWT_SECRET=your_secure_secret
MONGO_URI=your_production_mongodb_uri
FRONTEND_URL=https://your-frontend-domain.com
```

### Log Management

- Log files will grow over time - implement log rotation
- Consider using external logging services (Sentry, LogRocket)
- Monitor error logs for critical issues
- Set up alerts for high error rates

### Monitoring

The health check endpoint provides basic monitoring:

```
GET /health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2025-07-02T15:30:11.301Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

## Migration Notes

### Frontend Changes Required

The frontend will need to be updated to handle the new response format:

- Check for `status` field in responses
- Handle `errorCode` for specific error types
- Update error handling to use new error structure

### Breaking Changes

- All API responses now include a `status` field
- Error responses have a consistent structure
- Some error messages have changed for security
- Authentication errors now include `errorCode` field 