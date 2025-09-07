const { Client } = require('@azure/msal-node');
const axios = require('axios');

class PowerBIService {
  constructor() {
    this.clientId = process.env.POWERBI_CLIENT_ID;
    this.clientSecret = process.env.POWERBI_CLIENT_SECRET;
    this.tenantId = process.env.POWERBI_TENANT_ID;
    this.workspaceId = process.env.POWERBI_WORKSPACE_ID;
    this.authority = `https://login.microsoftonline.com/${this.tenantId}`;
    this.scope = ['https://analysis.windows.net/powerbi/api/.default'];
    
    this.msalConfig = {
      auth: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        authority: this.authority,
      },
    };
    
    this.confidentialClientApp = new Client(this.msalConfig);
  }

  /**
   * Get access token for PowerBI API
   */
  async getAccessToken() {
    try {
      const clientCredentialRequest = {
        scopes: this.scope,
      };

      const response = await this.confidentialClientApp.acquireTokenByClientCredential(clientCredentialRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error acquiring PowerBI access token:', error);
      throw new Error('Failed to acquire PowerBI access token');
    }
  }

  /**
   * Get all reports in the workspace
   */
  async getReports() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/reports`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching PowerBI reports:', error);
      throw new Error('Failed to fetch PowerBI reports');
    }
  }

  /**
   * Get all dashboards in the workspace
   */
  async getDashboards() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/dashboards`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching PowerBI dashboards:', error);
      throw new Error('Failed to fetch PowerBI dashboards');
    }
  }

  /**
   * Get specific report by ID
   */
  async getReport(reportId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/reports/${reportId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PowerBI report:', error);
      throw new Error('Failed to fetch PowerBI report');
    }
  }

  /**
   * Get specific dashboard by ID
   */
  async getDashboard(dashboardId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/dashboards/${dashboardId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PowerBI dashboard:', error);
      throw new Error('Failed to fetch PowerBI dashboard');
    }
  }

  /**
   * Generate embed token for a report
   */
  async generateReportEmbedToken(reportId, datasetId, accessLevel = 'View') {
    try {
      const accessToken = await this.getAccessToken();
      
      const embedTokenRequest = {
        accessLevel: accessLevel,
        allowSaveAs: false,
        identities: [
          {
            username: 'anonymous',
            roles: ['Viewer'],
            datasets: [datasetId]
          }
        ],
        datasets: [
          {
            id: datasetId
          }
        ],
        reports: [
          {
            id: reportId
          }
        ]
      };

      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/reports/${reportId}/GenerateToken`,
        embedTokenRequest,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating report embed token:', error);
      throw new Error('Failed to generate report embed token');
    }
  }

  /**
   * Generate embed token for a dashboard
   */
  async generateDashboardEmbedToken(dashboardId, accessLevel = 'View') {
    try {
      const accessToken = await this.getAccessToken();
      
      const embedTokenRequest = {
        accessLevel: accessLevel,
        allowSaveAs: false,
        identities: [
          {
            username: 'anonymous',
            roles: ['Viewer']
          }
        ]
      };

      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/dashboards/${dashboardId}/GenerateToken`,
        embedTokenRequest,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating dashboard embed token:', error);
      throw new Error('Failed to generate dashboard embed token');
    }
  }

  /**
   * Get dataset ID for a report
   */
  async getReportDataset(reportId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/reports/${reportId}/datasets`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value[0]?.id;
    } catch (error) {
      console.error('Error fetching report dataset:', error);
      throw new Error('Failed to fetch report dataset');
    }
  }

  /**
   * Generate embed URL for a report
   */
  generateReportEmbedUrl(reportId) {
    return `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${this.workspaceId}`;
  }

  /**
   * Generate embed URL for a dashboard
   */
  generateDashboardEmbedUrl(dashboardId) {
    return `https://app.powerbi.com/dashboardEmbed?dashboardId=${dashboardId}&groupId=${this.workspaceId}`;
  }
}

module.exports = PowerBIService;
