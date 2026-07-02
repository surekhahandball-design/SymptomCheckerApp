# SymptomChecker API Documentation

## Base URL
```
Production: https://symptom-checker-backend.onrender.com/api
Development: http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}

Response: 200 OK
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token
```
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Admin Login
```
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@symptomchecker.com",
  "password": "admin@123"
}

Response: 200 OK
{
  "success": true,
  "message": "Admin logged in successfully",
  "data": {
    "admin": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## User Endpoints

### Get User Profile
```
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210",
    "role": "user",
    ...
  }
}
```

### Update Profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "address": "123 Main St",
  "city": "New York"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Change Password
```
PUT /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123",
  "confirmPassword": "NewPass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get Dashboard Data
```
GET /users/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "recentSymptomChecks": [ ... ],
    "upcomingAppointments": [ ... ],
    "healthTips": [ ... ]
  }
}
```

---

## Symptom Endpoints

### Get All Symptoms
```
GET /symptoms?category=General
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": [ ... ]
}
```

### Get Symptoms Grouped by Category
```
GET /symptoms/grouped
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": {
    "General": [ ... ],
    "Respiratory": [ ... ],
    ...
  }
}
```

### Check Symptoms
```
POST /symptoms/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "selectedSymptoms": ["Fever", "Cough"],
  "textInput": "I have fever and cough since 2 days"
}

Response: 200 OK
{
  "success": true,
  "message": "Symptoms analyzed successfully",
  "data": {
    "results": [
      {
        "diseaseId": "...",
        "name": "Cold",
        "probability": 85,
        "severity": "medium",
        ...
      }
    ],
    "historyId": "..."
  }
}
```

---

## Disease Endpoints

### Get All Diseases
```
GET /diseases?page=1&limit=10&severity=high
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

### Get Disease by ID
```
GET /diseases/:id
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

### Search Diseases
```
GET /diseases/search?query=diabetes
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": [ ... ]
}
```

### Create Disease (Admin)
```
POST /diseases
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Diabetes",
  "symptoms": ["Fatigue", "Increased Thirst"],
  "description": "...",
  "causes": [ ... ],
  "treatment": "...",
  "doctorType": ["Endocrinologist"],
  "severity": "medium",
  "medicines": [ ... ],
  "tests": ["Blood Test"],
  "precautions": [ ... ],
  "emergencyWarning": "..."
}

Response: 201 Created
{
  "success": true,
  "message": "Disease created successfully",
  "data": { ... }
}
```

---

## Doctor Endpoints

### Get All Doctors
```
GET /doctors?specialization=Cardiologist&city=Delhi&rating=4&page=1&limit=10
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get Doctor by ID
```
GET /doctors/:id
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

### Search Doctors
```
GET /doctors/search?query=Cardiologist
Authorization: Not required

Response: 200 OK
{
  "success": true,
  "data": [ ... ]
}
```

---

## Appointment Endpoints

### Book Appointment
```
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "...",
  "appointmentDate": "2024-01-15T10:00:00Z",
  "appointmentTime": "10:00 AM",
  "reason": "Checkup",
  "symptoms": ["Fever"],
  "consultationType": "in-person"
}

Response: 201 Created
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": { ... }
}
```

### Get User Appointments
```
GET /appointments/user/appointments?status=confirmed&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get Appointment by ID
```
GET /appointments/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

### Update Appointment
```
PUT /appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "appointmentDate": "2024-01-16T10:00:00Z",
  "appointmentTime": "11:00 AM",
  "reason": "Follow-up"
}

Response: 200 OK
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": { ... }
}
```

### Cancel Appointment
```
DELETE /appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancelReason": "Cannot attend"
}

Response: 200 OK
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": { ... }
}
```

---

## History Endpoints

### Get Symptom History
```
GET /history?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get History by ID
```
GET /history/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

### Delete History Record
```
DELETE /history/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "History deleted successfully"
}
```

### Delete All History
```
DELETE /history
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "All history deleted successfully"
}
```

---

## Admin Endpoints

### Get Dashboard Statistics
```
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalDoctors": 50,
    "totalDiseases": 200,
    "totalAppointments": 500,
    "recentAppointments": [ ... ],
    "mostSearchedSymptoms": [ ... ],
    "mostCommonDiseases": [ ... ]
  }
}
```

### Get All Users
```
GET /admin/users?page=1&limit=10
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

### Delete User
```
DELETE /admin/users/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Create Health Tip
```
POST /admin/health-tips
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Stay Hydrated",
  "description": "Drink at least 8 glasses of water daily",
  "category": "Nutrition",
  "priority": 1
}

Response: 201 Created
{
  "success": true,
  "message": "Health tip created successfully",
  "data": { ... }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Disease not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per minute per IP
- Error: 429 Too Many Requests

## HTTP Status Codes

- 200 OK - Request successful
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication required
- 403 Forbidden - Permission denied
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate entry
- 500 Internal Server Error - Server error

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Check Symptoms
```bash
curl -X POST http://localhost:5000/api/symptoms/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "selectedSymptoms": ["Fever", "Cough"],
    "textInput": "I have fever and cough since 2 days"
  }'
```

---

**Last Updated:** January 2024
