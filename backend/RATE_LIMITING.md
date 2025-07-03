# Rate Limiting Implementation

This document describes the rate limiting system implemented in the maaser-tracker backend.

## Overview

Rate limiting is implemented using the `express-rate-limit` package to protect the API from abuse, brute-force attacks, and accidental overload.

## Rate Limiting Rules

### 1. General Rate Limiter
- **Applied to:** All routes
- **Limit:** 100 requests per 15 minutes per IP address
- **Purpose:** Prevent general API abuse

### 2. Authentication Rate Limiter
- **Applied to:** `/auth/*` routes (login, register)
- **Limit:** 5 requests per 15 minutes per IP address
- **Purpose:** Prevent brute-force attacks on authentication

### 3. Data Modification Rate Limiter
- **Applied to:** `/income/*` and `/tzedaka/*` routes
- **Limit:** 50 requests per 15 minutes per IP address
- **Purpose:** Prevent rapid data modification that could overwhelm the database

## Implementation Details

### Middleware Location
- **File:** `middleware/rateLimiter.js`
- **Applied in:** `server.js`

### Response Format
When rate limit is exceeded, the server returns:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later.",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

### HTTP Headers
The server includes rate limit information in response headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time when the limit resets (Unix timestamp)

## Error Codes

| Error Code | Description | Applied To |
|------------|-------------|------------|
| `RATE_LIMIT_EXCEEDED` | General rate limit exceeded | All routes |
| `AUTH_RATE_LIMIT_EXCEEDED` | Authentication rate limit exceeded | `/auth/*` routes |
| `DATA_RATE_LIMIT_EXCEEDED` | Data modification rate limit exceeded | `/income/*`, `/tzedaka/*` routes |

## Logging

Rate limit violations are logged with:
- IP address
- User agent
- Request URL
- Timestamp

## Testing

To test rate limiting:

```bash
cd backend
node test-rate-limit.js
```

This will make multiple requests to trigger rate limiting and show the responses.

## Configuration

Rate limits can be adjusted in `middleware/rateLimiter.js`:

```javascript
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Time window (15 minutes)
    max: 100, // Maximum requests per window
    // ... other options
});
```

## Production Considerations

### Environment-Specific Limits
Consider adjusting limits based on your environment:
- **Development:** Higher limits for testing
- **Production:** Stricter limits for security

### Monitoring
- Monitor rate limit violations in logs
- Set up alerts for unusual patterns
- Consider using external monitoring services

### IP Address Handling
- Behind proxy/load balancer: Configure `trust proxy`
- IPv6: Ensure proper IP address extraction
- Rate limiting by user ID: Consider authenticated user limits

## Security Benefits

1. **Brute Force Protection:** Limits login attempts
2. **DDoS Mitigation:** Prevents overwhelming requests
3. **Resource Protection:** Ensures fair usage
4. **Cost Control:** Prevents excessive database queries

## Frontend Handling

The frontend should handle 429 responses gracefully:
- Show user-friendly error messages
- Implement exponential backoff for retries
- Display retry countdown if available 