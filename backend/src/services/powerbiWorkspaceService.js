const PowerBIService = require('./powerbiService');

class PowerBIWorkspaceService extends PowerBIService {
  constructor() {
    super();
  }

  /**
   * Get all workspaces (groups) accessible to the service principal
   */
  async getWorkspaces() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        'https://api.powerbi.com/v1.0/myorg/groups',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching PowerBI workspaces:', error);
      throw new Error('Failed to fetch PowerBI workspaces');
    }
  }

  /**
   * Get datasets in the current workspace
   */
  async getDatasets() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching PowerBI datasets:', error);
      throw new Error('Failed to fetch PowerBI datasets');
    }
  }

  /**
   * Get specific dataset details
   */
  async getDataset(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PowerBI dataset:', error);
      throw new Error('Failed to fetch PowerBI dataset');
    }
  }

  /**
   * Get dataset parameters
   */
  async getDatasetParameters(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/parameters`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching dataset parameters:', error);
      throw new Error('Failed to fetch dataset parameters');
    }
  }

  /**
   * Update dataset parameters
   */
  async updateDatasetParameters(datasetId, parameters) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/Default.UpdateParameters`,
        { updateDetails: parameters },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating dataset parameters:', error);
      throw new Error('Failed to update dataset parameters');
    }
  }

  /**
   * Refresh a dataset
   */
  async refreshDataset(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/refreshes`,
        { notifyOption: 'NoNotification' },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error refreshing dataset:', error);
      throw new Error('Failed to refresh dataset');
    }
  }

  /**
   * Get refresh history for a dataset
   */
  async getDatasetRefreshHistory(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/refreshes`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching dataset refresh history:', error);
      throw new Error('Failed to fetch dataset refresh history');
    }
  }

  /**
   * Get data sources for a dataset
   */
  async getDatasetDataSources(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/datasources`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching dataset data sources:', error);
      throw new Error('Failed to fetch dataset data sources');
    }
  }

  /**
   * Get tables in a dataset
   */
  async getDatasetTables(datasetId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/datasets/${datasetId}/tables`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching dataset tables:', error);
      throw new Error('Failed to fetch dataset tables');
    }
  }

  /**
   * Get workspace users and their roles
   */
  async getWorkspaceUsers() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}/users`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching workspace users:', error);
      throw new Error('Failed to fetch workspace users');
    }
  }

  /**
   * Get workspace capacity information
   */
  async getWorkspaceCapacity() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${this.workspaceId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        id: response.data.id,
        name: response.data.name,
        isReadOnly: response.data.isReadOnly,
        isOnDedicatedCapacity: response.data.isOnDedicatedCapacity,
        capacityId: response.data.capacityId,
        description: response.data.description,
        type: response.data.type
      };
    } catch (error) {
      console.error('Error fetching workspace capacity:', error);
      throw new Error('Failed to fetch workspace capacity');
    }
  }
}

module.exports = PowerBIWorkspaceService;
