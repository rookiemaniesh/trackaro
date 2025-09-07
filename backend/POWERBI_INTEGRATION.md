# PowerBI Backend Integration

This document describes the PowerBI backend integration for the Trackaro application, providing comprehensive PowerBI embedding and management capabilities.

## Overview

The PowerBI backend integration provides:
- PowerBI report and dashboard embedding
- Embed token generation
- Workspace and dataset management
- Authentication and authorization
- Comprehensive API endpoints

## Architecture

```
Frontend (PowerBIEmbed.tsx) 
    ↓
Backend API Routes
    ↓
PowerBI Service Layer
    ↓
Microsoft PowerBI API
```

## Components

### 1. PowerBI Service (`src/services/powerbiService.js`)
Core service for PowerBI API interactions:
- Authentication with Azure AD
- Report and dashboard management
- Embed token generation
- URL generation for embedding

### 2. PowerBI Workspace Service (`src/services/powerbiWorkspaceService.js`)
Extended service for workspace management:
- Dataset management
- Parameter handling
- Refresh operations
- Data source management

### 3. Authentication Middleware (`src/middleware/powerbiAuth.js`)
Security and validation:
- JWT token verification
- Access control
- Resource validation
- Usage logging

### 4. API Routes
- `src/routes/powerbi.js` - Core PowerBI operations
- `src/routes/powerbiWorkspace.js` - Workspace management

## Setup Instructions

### 1. Azure AD Service Principal Setup

1. **Create Service Principal**:
   ```bash
   az ad sp create-for-rbac --name "Trackaro-PowerBI-Service" --role contributor
   ```

2. **Grant PowerBI Permissions**:
   - Add service principal to PowerBI workspace
   - Grant appropriate roles (Admin, Member, or Contributor)

3. **Configure API Permissions**:
   - PowerBI Service API permissions
   - Microsoft Graph permissions (if needed)

### 2. Environment Configuration

Copy `env.powerbi.example` to `.env` and configure:

```env
POWERBI_CLIENT_ID=your_service_principal_client_id
POWERBI_CLIENT_SECRET=your_service_principal_client_secret
POWERBI_TENANT_ID=your_azure_tenant_id
POWERBI_WORKSPACE_ID=your_powerbi_workspace_id
```

### 3. Install Dependencies

```bash
npm install @azure/msal-node axios
```

### 4. Register Routes

Add to your main server file:

```javascript
const powerbiRoutes = require('./routes/powerbi');
const powerbiWorkspaceRoutes = require('./routes/powerbiWorkspace');

app.use('/api/powerbi', powerbiRoutes);
app.use('/api/powerbi/workspace', powerbiWorkspaceRoutes);
```

## API Endpoints

### Core PowerBI Operations

#### Get Reports
```http
GET /api/powerbi/reports
Authorization: Bearer <jwt_token>
```

#### Get Dashboards
```http
GET /api/powerbi/dashboards
Authorization: Bearer <jwt_token>
```

#### Generate Report Embed Token
```http
POST /api/powerbi/reports/:reportId/embed
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "accessLevel": "View"
}
```

#### Generate Dashboard Embed Token
```http
POST /api/powerbi/dashboards/:dashboardId/embed
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "accessLevel": "View"
}
```

#### Get Embed Configuration (Convenience)
```http
GET /api/powerbi/reports/:reportId/embed-config?accessLevel=View
Authorization: Bearer <jwt_token>
```

### Workspace Management

#### Get Workspaces
```http
GET /api/powerbi/workspace/workspaces
Authorization: Bearer <jwt_token>
```

#### Get Datasets
```http
GET /api/powerbi/workspace/datasets
Authorization: Bearer <jwt_token>
```

#### Refresh Dataset
```http
POST /api/powerbi/workspace/datasets/:datasetId/refresh
Authorization: Bearer <jwt_token>
```

#### Get Dataset Parameters
```http
GET /api/powerbi/workspace/datasets/:datasetId/parameters
Authorization: Bearer <jwt_token>
```

## Frontend Integration

### Using the PowerBIEmbed Component

```tsx
import PowerBIEmbed from '@/components/powerbi/PowerBIEmbed';

// Get embed configuration from backend
const response = await api.get(`/api/powerbi/reports/${reportId}/embed-config`);
const { embedToken, embedUrl } = response.data.data;

// Use in component
<PowerBIEmbed
  type="report"
  embedUrl={embedUrl}
  accessToken={embedToken}
  reportId={reportId}
  className="w-full h-96"
/>
```

### Example API Integration

```typescript
// Get all reports
const getReports = async () => {
  const response = await api.get('/api/powerbi/reports');
  return response.data.data.reports;
};

// Get embed configuration for a report
const getReportEmbedConfig = async (reportId: string) => {
  const response = await api.get(`/api/powerbi/reports/${reportId}/embed-config`);
  return response.data.data;
};

// Refresh a dataset
const refreshDataset = async (datasetId: string) => {
  const response = await api.post(`/api/powerbi/workspace/datasets/${datasetId}/refresh`);
  return response.data;
};
```

## Security Features

### 1. JWT Authentication
- All endpoints require valid JWT tokens
- Token verification middleware
- User context in requests

### 2. Access Control
- Role-based access (extensible)
- Resource validation
- GUID format validation

### 3. Embed Token Security
- Time-limited tokens (60 minutes default)
- View-only access by default
- No save/download permissions

### 4. Logging and Monitoring
- Request/response logging
- Performance monitoring
- Error tracking

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "message": "Failed to generate embed token",
  "error": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Best Practices

### 1. Token Management
- Generate tokens on-demand
- Implement token caching
- Handle token expiration

### 2. Error Handling
- Graceful degradation
- User-friendly error messages
- Retry mechanisms

### 3. Performance
- Cache embed configurations
- Implement rate limiting
- Monitor API usage

### 4. Security
- Validate all inputs
- Use HTTPS only
- Regular security audits

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify service principal credentials
   - Check Azure AD permissions
   - Ensure PowerBI workspace access

2. **Embed Token Issues**:
   - Verify report/dashboard IDs
   - Check dataset permissions
   - Ensure workspace access

3. **CORS Issues**:
   - Configure CORS headers
   - Verify domain whitelist
   - Check PowerBI settings

### Debug Mode

Enable debug logging:

```env
POWERBI_ENABLE_LOGGING=true
POWERBI_LOG_LEVEL=debug
```

## Monitoring and Analytics

### Key Metrics
- API response times
- Token generation success rate
- Embed load times
- Error rates

### Logging
- Request/response logs
- Performance metrics
- Security events
- User activity

## Future Enhancements

1. **Advanced Security**:
   - Row-level security (RLS)
   - Custom authentication
   - Multi-tenant support

2. **Performance**:
   - Token caching
   - CDN integration
   - Lazy loading

3. **Features**:
   - Real-time data
   - Custom visuals
   - Mobile optimization

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Contact the development team
4. Submit GitHub issues

## License

This PowerBI integration is part of the Trackaro application and follows the same licensing terms.
