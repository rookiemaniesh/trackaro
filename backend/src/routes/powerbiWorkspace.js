const express = require('express');
const PowerBIWorkspaceService = require('../services/powerbiWorkspaceService');
const { powerbiAuth, checkPowerBIAccess, validatePowerBIResource, logPowerBIUsage } = require('../middleware/powerbiAuth');

const router = express.Router();
const powerBIWorkspaceService = new PowerBIWorkspaceService();

// Apply middleware to all routes
router.use(powerbiAuth);
router.use(checkPowerBIAccess);
router.use(logPowerBIUsage);

/**
 * Get all workspaces
 * GET /api/powerbi/workspaces
 * Requires JWT authentication
 */
router.get('/workspaces', async (req, res) => {
  try {
    const workspaces = await powerBIWorkspaceService.getWorkspaces();
    
    res.json({
      success: true,
      data: {
        workspaces: workspaces.map(workspace => ({
          id: workspace.id,
          name: workspace.name,
          isReadOnly: workspace.isReadOnly,
          isOnDedicatedCapacity: workspace.isOnDedicatedCapacity,
          capacityId: workspace.capacityId,
          description: workspace.description,
          type: workspace.type
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI workspaces:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI workspaces',
      error: error.message
    });
  }
});

/**
 * Get current workspace information
 * GET /api/powerbi/workspace/info
 * Requires JWT authentication
 */
router.get('/workspace/info', async (req, res) => {
  try {
    const workspaceInfo = await powerBIWorkspaceService.getWorkspaceCapacity();
    
    res.json({
      success: true,
      data: {
        workspace: workspaceInfo
      }
    });
  } catch (error) {
    console.error('Error fetching workspace info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspace information',
      error: error.message
    });
  }
});

/**
 * Get all datasets in the workspace
 * GET /api/powerbi/datasets
 * Requires JWT authentication
 */
router.get('/datasets', async (req, res) => {
  try {
    const datasets = await powerBIWorkspaceService.getDatasets();
    
    res.json({
      success: true,
      data: {
        datasets: datasets.map(dataset => ({
          id: dataset.id,
          name: dataset.name,
          description: dataset.description || '',
          isRefreshable: dataset.isRefreshable,
          isEffectiveIdentityRequired: dataset.isEffectiveIdentityRequired,
          isEffectiveIdentityRolesRequired: dataset.isEffectiveIdentityRolesRequired,
          isOnPremGatewayRequired: dataset.isOnPremGatewayRequired,
          targetStorageMode: dataset.targetStorageMode,
          createdDate: dataset.createdDate,
          createReportEmbedURL: dataset.createReportEmbedURL,
          qnaEmbedURL: dataset.qnaEmbedURL
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI datasets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI datasets',
      error: error.message
    });
  }
});

/**
 * Get specific dataset details
 * GET /api/powerbi/datasets/:datasetId
 * Requires JWT authentication
 */
router.get('/datasets/:datasetId', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const dataset = await powerBIWorkspaceService.getDataset(datasetId);
    
    res.json({
      success: true,
      data: {
        dataset: {
          id: dataset.id,
          name: dataset.name,
          description: dataset.description || '',
          isRefreshable: dataset.isRefreshable,
          isEffectiveIdentityRequired: dataset.isEffectiveIdentityRequired,
          isEffectiveIdentityRolesRequired: dataset.isEffectiveIdentityRolesRequired,
          isOnPremGatewayRequired: dataset.isOnPremGatewayRequired,
          targetStorageMode: dataset.targetStorageMode,
          createdDate: dataset.createdDate,
          createReportEmbedURL: dataset.createReportEmbedURL,
          qnaEmbedURL: dataset.qnaEmbedURL
        }
      }
    });
  } catch (error) {
    console.error('Error fetching PowerBI dataset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PowerBI dataset',
      error: error.message
    });
  }
});

/**
 * Get dataset parameters
 * GET /api/powerbi/datasets/:datasetId/parameters
 * Requires JWT authentication
 */
router.get('/datasets/:datasetId/parameters', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const parameters = await powerBIWorkspaceService.getDatasetParameters(datasetId);
    
    res.json({
      success: true,
      data: {
        parameters: parameters.map(param => ({
          name: param.name,
          type: param.type,
          isRequired: param.isRequired,
          currentValue: param.currentValue
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dataset parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dataset parameters',
      error: error.message
    });
  }
});

/**
 * Update dataset parameters
 * POST /api/powerbi/datasets/:datasetId/parameters
 * Requires JWT authentication
 */
router.post('/datasets/:datasetId/parameters', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { parameters } = req.body;
    
    if (!parameters || !Array.isArray(parameters)) {
      return res.status(400).json({
        success: false,
        message: 'Parameters must be an array'
      });
    }
    
    const result = await powerBIWorkspaceService.updateDatasetParameters(datasetId, parameters);
    
    res.json({
      success: true,
      message: 'Dataset parameters updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating dataset parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dataset parameters',
      error: error.message
    });
  }
});

/**
 * Refresh a dataset
 * POST /api/powerbi/datasets/:datasetId/refresh
 * Requires JWT authentication
 */
router.post('/datasets/:datasetId/refresh', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const result = await powerBIWorkspaceService.refreshDataset(datasetId);
    
    res.json({
      success: true,
      message: 'Dataset refresh initiated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error refreshing dataset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh dataset',
      error: error.message
    });
  }
});

/**
 * Get dataset refresh history
 * GET /api/powerbi/datasets/:datasetId/refresh-history
 * Requires JWT authentication
 */
router.get('/datasets/:datasetId/refresh-history', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const refreshHistory = await powerBIWorkspaceService.getDatasetRefreshHistory(datasetId);
    
    res.json({
      success: true,
      data: {
        refreshHistory: refreshHistory.map(refresh => ({
          id: refresh.id,
          startTime: refresh.startTime,
          endTime: refresh.endTime,
          status: refresh.status,
          type: refresh.type,
          serviceExceptionJson: refresh.serviceExceptionJson
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dataset refresh history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dataset refresh history',
      error: error.message
    });
  }
});

/**
 * Get dataset data sources
 * GET /api/powerbi/datasets/:datasetId/datasources
 * Requires JWT authentication
 */
router.get('/datasets/:datasetId/datasources', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const dataSources = await powerBIWorkspaceService.getDatasetDataSources(datasetId);
    
    res.json({
      success: true,
      data: {
        dataSources: dataSources.map(source => ({
          datasourceType: source.datasourceType,
          connectionDetails: source.connectionDetails,
          datasourceId: source.datasourceId,
          gatewayId: source.gatewayId,
          name: source.name
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dataset data sources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dataset data sources',
      error: error.message
    });
  }
});

/**
 * Get dataset tables
 * GET /api/powerbi/datasets/:datasetId/tables
 * Requires JWT authentication
 */
router.get('/datasets/:datasetId/tables', validatePowerBIResource, async (req, res) => {
  try {
    const { datasetId } = req.params;
    const tables = await powerBIWorkspaceService.getDatasetTables(datasetId);
    
    res.json({
      success: true,
      data: {
        tables: tables.map(table => ({
          name: table.name,
          columns: table.columns?.map(col => ({
            name: col.name,
            dataType: col.dataType,
            isHidden: col.isHidden
          })) || [],
          measures: table.measures?.map(measure => ({
            name: measure.name,
            expression: measure.expression,
            isHidden: measure.isHidden
          })) || [],
          rows: table.rows?.length || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dataset tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dataset tables',
      error: error.message
    });
  }
});

/**
 * Get workspace users
 * GET /api/powerbi/workspace/users
 * Requires JWT authentication
 */
router.get('/workspace/users', async (req, res) => {
  try {
    const users = await powerBIWorkspaceService.getWorkspaceUsers();
    
    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          identifier: user.identifier,
          principalType: user.principalType,
          groupUserAccessRight: user.groupUserAccessRight,
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          graphId: user.graphId
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching workspace users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workspace users',
      error: error.message
    });
  }
});

module.exports = router;
