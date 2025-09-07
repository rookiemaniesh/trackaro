const express = require('express');
const PowerBIService = require('../services/powerbiService');
const { powerbiAuth, checkPowerBIAccess, validatePowerBIResource, logPowerBIUsage } = require('../middleware/powerbiAuth');

const router = express.Router();
const powerBIService = new PowerBIService();

// Apply middleware to all routes
router.use(powerbiAuth);
router.use(checkPowerBIAccess);
router.use(logPowerBIUsage);

/**
 * Get all available reports
 * GET /api/powerbi/reports
 * Requires JWT authentication
 */
router.get('/reports', async (req, res) => {
  try {
    const reports = await powerBIService.getReports();
    
    res.json({
      success: true,
      data: {
        reports: reports.map(report => ({
          id: report.id,
          name: report.name,
          webUrl: report.webUrl,
          embedUrl: report.embedUrl,
          datasetId: report.datasetId,
          description: report.description || '',
          createdAt: report.createdDateTime,
          modifiedAt: report.modifiedDateTime
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI reports',
      error: error.message
    });
  }
});

/**
 * Get all available dashboards
 * GET /api/powerbi/dashboards
 * Requires JWT authentication
 */
router.get('/dashboards', async (req, res) => {
  try {
    const dashboards = await powerBIService.getDashboards();
    
    res.json({
      success: true,
      data: {
        dashboards: dashboards.map(dashboard => ({
          id: dashboard.id,
          displayName: dashboard.displayName,
          webUrl: dashboard.webUrl,
          embedUrl: dashboard.embedUrl,
          description: dashboard.description || '',
          createdAt: dashboard.createdDateTime,
          modifiedAt: dashboard.modifiedDateTime
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI dashboards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI dashboards',
      error: error.message
    });
  }
});

/**
 * Get specific report details
 * GET /api/powerbi/reports/:reportId
 * Requires JWT authentication
 */
router.get('/reports/:reportId', validatePowerBIResource, async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await powerBIService.getReport(reportId);
    
    res.json({
      success: true,
      data: {
        report: {
          id: report.id,
          name: report.name,
          webUrl: report.webUrl,
          embedUrl: report.embedUrl,
          datasetId: report.datasetId,
          description: report.description || '',
          createdAt: report.createdDateTime,
          modifiedAt: report.modifiedDateTime
        }
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI report',
      error: error.message
    });
  }
});

/**
 * Get specific dashboard details
 * GET /api/powerbi/dashboards/:dashboardId
 * Requires JWT authentication
 */
router.get('/dashboards/:dashboardId', validatePowerBIResource, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const dashboard = await powerBIService.getDashboard(dashboardId);
    
    res.json({
      success: true,
      data: {
        dashboard: {
          id: dashboard.id,
          displayName: dashboard.displayName,
          webUrl: dashboard.webUrl,
          embedUrl: dashboard.embedUrl,
          description: dashboard.description || '',
          createdAt: dashboard.createdDateTime,
          modifiedAt: dashboard.modifiedDateTime
        }
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI dashboard',
      error: error.message
    });
  }
});

/**
 * Generate embed token for a report
 * POST /api/powerbi/reports/:reportId/embed
 * Requires JWT authentication
 */
router.post('/reports/:reportId/embed', validatePowerBIResource, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { accessLevel = 'View' } = req.body;
    
    // Get the dataset ID for the report
    const datasetId = await powerBIService.getReportDataset(reportId);
    if (!datasetId) {
      return res.status(400).json({
        success: false,
        message: 'No dataset found for this report'
      });
    }
    
    // Generate embed token
    const embedToken = await powerBIService.generateReportEmbedToken(reportId, datasetId, accessLevel);
    
    // Generate embed URL
    const embedUrl = powerBIService.generateReportEmbedUrl(reportId);
    
    res.json({
      success: true,
      data: {
        embedToken: embedToken.token,
        embedUrl: embedUrl,
        reportId: reportId,
        datasetId: datasetId,
        expiry: embedToken.expiration,
        accessLevel: accessLevel
      }
    });
  } catch (error) {
    console.error('Error generating report embed token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report embed token',
      error: error.message
    });
  }
});

/**
 * Generate embed token for a dashboard
 * POST /api/powerbi/dashboards/:dashboardId/embed
 * Requires JWT authentication
 */
router.post('/dashboards/:dashboardId/embed', validatePowerBIResource, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { accessLevel = 'View' } = req.body;
    
    // Generate embed token
    const embedToken = await powerBIService.generateDashboardEmbedToken(dashboardId, accessLevel);
    
    // Generate embed URL
    const embedUrl = powerBIService.generateDashboardEmbedUrl(dashboardId);
    
    res.json({
      success: true,
      data: {
        embedToken: embedToken.token,
        embedUrl: embedUrl,
        dashboardId: dashboardId,
        expiry: embedToken.expiration,
        accessLevel: accessLevel
      }
    });
  } catch (error) {
    console.error('Error generating dashboard embed token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard embed token',
      error: error.message
    });
  }
});

/**
 * Get embed configuration for a report (convenience endpoint)
 * GET /api/powerbi/reports/:reportId/embed-config
 * Requires JWT authentication
 */
router.get('/reports/:reportId/embed-config', validatePowerBIResource, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { accessLevel = 'View' } = req.query;
    
    // Get report details
    const report = await powerBIService.getReport(reportId);
    
    // Get dataset ID
    const datasetId = await powerBIService.getReportDataset(reportId);
    if (!datasetId) {
      return res.status(400).json({
        success: false,
        message: 'No dataset found for this report'
      });
    }
    
    // Generate embed token
    const embedToken = await powerBIService.generateReportEmbedToken(reportId, datasetId, accessLevel);
    
    // Generate embed URL
    const embedUrl = powerBIService.generateReportEmbedUrl(reportId);
    
    res.json({
      success: true,
      data: {
        type: 'report',
        embedToken: embedToken.token,
        embedUrl: embedUrl,
        reportId: reportId,
        datasetId: datasetId,
        expiry: embedToken.expiration,
        accessLevel: accessLevel,
        report: {
          id: report.id,
          name: report.name,
          description: report.description || ''
        }
      }
    });
  } catch (error) {
    console.error('Error getting report embed config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report embed configuration',
      error: error.message
    });
  }
});

/**
 * Get embed configuration for a dashboard (convenience endpoint)
 * GET /api/powerbi/dashboards/:dashboardId/embed-config
 * Requires JWT authentication
 */
router.get('/dashboards/:dashboardId/embed-config', validatePowerBIResource, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { accessLevel = 'View' } = req.query;
    
    // Get dashboard details
    const dashboard = await powerBIService.getDashboard(dashboardId);
    
    // Generate embed token
    const embedToken = await powerBIService.generateDashboardEmbedToken(dashboardId, accessLevel);
    
    // Generate embed URL
    const embedUrl = powerBIService.generateDashboardEmbedUrl(dashboardId);
    
    res.json({
      success: true,
      data: {
        type: 'dashboard',
        embedToken: embedToken.token,
        embedUrl: embedUrl,
        dashboardId: dashboardId,
        expiry: embedToken.expiration,
        accessLevel: accessLevel,
        dashboard: {
          id: dashboard.id,
          displayName: dashboard.displayName,
          description: dashboard.description || ''
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard embed config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard embed configuration',
      error: error.message
    });
  }
});

/**
 * Health check endpoint
 * GET /api/powerbi/health
 */
router.get('/health', async (req, res) => {
  try {
    // Try to get access token to verify configuration
    await powerBIService.getAccessToken();
    
    res.json({
      success: true,
      message: 'PowerBI service is healthy',
      data: {
        workspaceId: powerBIService.workspaceId,
        tenantId: powerBIService.tenantId,
        clientId: powerBIService.clientId ? 'configured' : 'not configured'
      }
    });
  } catch (error) {
    console.error('PowerBI health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'PowerBI service is not healthy',
      error: error.message
    });
  }
});

module.exports = router;
