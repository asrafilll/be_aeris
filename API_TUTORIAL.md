# API Tutorial: Intercom & Camera Playback

This tutorial explains how to use the Intercom and Camera Playback APIs for the junior development team.

## Base Configuration

**Base URL:** `http://localhost:{SERVER_PORT}/api/pattern`  
**Authentication:** Required for all endpoints using `token` header or in request body

## 1. Intercom API

### Endpoint
```
POST /api/pattern/intercom
```

### Purpose
Initiates intercom communication with a vehicle device.

### Required Parameters
- `deviceId` (string): The unique identifier of the vehicle device
- `channel` (number): Must be `1` for intercom functionality  
- `token` (string): Authentication token

### Request Example
```bash
curl -X POST http://localhost:3000/api/pattern/intercom \
  -H "Content-Type: application/json" \
  -H "token: YOUR_AUTH_TOKEN" \
  -d '{
    "deviceId": "DEVICE_123",
    "channel": 1,
    "token": "YOUR_AUTH_TOKEN"
  }'
```

### JavaScript Example
```javascript
const intercomRequest = {
  deviceId: "DEVICE_123",
  channel: 1,
  token: "YOUR_AUTH_TOKEN"
};

const response = await fetch('/api/pattern/intercom', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': 'YOUR_AUTH_TOKEN'
  },
  body: JSON.stringify(intercomRequest)
});

const result = await response.json();
console.log(result);
```

### Response Format
```json
{
  "code": 200,
  "status": "success",
  "data": {
    // External service response data
  }
}
```

### Error Responses
- `400`: Missing or invalid parameters
- `500`: External service error or configuration issues

## 2. Camera Playback API

### Endpoint
```
POST /api/pattern/camera/playback
```

### Purpose
Retrieves camera playback URLs for all three camera channels (front, driver, rear).

### Required Parameters
- `deviceId` (string): The unique identifier of the vehicle device
- `token` (string): Authentication token

### Optional Parameters
- `startTime` (string): Start time in format `YYYY-MM-DD HH:mm:ss` (defaults to current day 00:00:00)
- `endTime` (string): End time in format `YYYY-MM-DD HH:mm:ss` (defaults to current day 23:59:59)

### Request Example (with time range)
```bash
curl -X POST http://localhost:3000/api/pattern/camera/playback \
  -H "Content-Type: application/json" \
  -H "token: YOUR_AUTH_TOKEN" \
  -d '{
    "deviceId": "DEVICE_123",
    "startTime": "2024-01-15 08:00:00",
    "endTime": "2024-01-15 18:00:00",
    "token": "YOUR_AUTH_TOKEN"
  }'
```

### Request Example (current day)
```bash
curl -X POST http://localhost:3000/api/pattern/camera/playback \
  -H "Content-Type: application/json" \
  -H "token: YOUR_AUTH_TOKEN" \
  -d '{
    "deviceId": "DEVICE_123",
    "token": "YOUR_AUTH_TOKEN"
  }'
```

### JavaScript Example
```javascript
const playbackRequest = {
  deviceId: "DEVICE_123",
  startTime: "2024-01-15 08:00:00", // Optional
  endTime: "2024-01-15 18:00:00",   // Optional
  token: "YOUR_AUTH_TOKEN"
};

const response = await fetch('/api/pattern/camera/playback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': 'YOUR_AUTH_TOKEN'
  },
  body: JSON.stringify(playbackRequest)
});

const result = await response.json();
console.log(result);
```

### Response Format
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "front": {
      "webrtcUrl": "webrtc://...",
      "rtmpUrl": "rtmp://...",
      "webUrl": "http://...",
      "webFlvUrl": "http://...flv"
    },
    "driver": {
      "webrtcUrl": "webrtc://...",
      "rtmpUrl": "rtmp://...",
      "webUrl": "http://...",
      "webFlvUrl": "http://...flv"
    },
    "rear": {
      "webrtcUrl": "webrtc://...",
      "rtmpUrl": "rtmp://...",
      "webUrl": "http://...",
      "webFlvUrl": "http://...flv"
    }
  }
}
```

### Camera Channels
- **front**: Front-facing camera
- **driver**: Driver-facing camera  
- **rear**: Rear-facing camera

### Error Responses
- `400`: Missing deviceId/token or invalid time format
- `500`: All camera channels failed to load

## Common Error Handling

Both APIs return structured error responses:

```json
{
  "code": 400,
  "status": "failed",
  "message": "Error description",
  "details": "Additional error details (if available)"
}
```

## Authentication

All requests require authentication via:
1. `token` header in HTTP request
2. `token` field in request body

Make sure to obtain a valid token through the login endpoint first:
```
POST /api/pattern/auth
```

## Tips for Junior Developers

1. **Always validate input**: Check deviceId and token before making requests
2. **Handle errors gracefully**: Both APIs can fail, implement proper error handling
3. **Time format matters**: Use `YYYY-MM-DD HH:mm:ss` format for camera playback times
4. **Intercom channel**: Always use channel `1` for intercom functionality
5. **Camera fallback**: Individual camera channels may fail while others succeed
6. **Timeout consideration**: APIs have 10-second timeouts, implement loading states

## Testing

Test the APIs using:
- Postman or similar REST client
- curl commands (examples provided above)
- Browser developer tools for frontend integration

Remember to replace `YOUR_AUTH_TOKEN` and `DEVICE_123` with actual values in your tests.