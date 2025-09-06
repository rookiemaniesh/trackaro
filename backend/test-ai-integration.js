const axios = require('axios');

/**
 * Test script to verify your AI model integration
 * This script sends test queries to your AI service and validates responses
 */

// Configuration - Update these with your AI service details
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/process';
const AI_SERVICE_KEY = process.env.AI_SERVICE_KEY || 'your-api-key-here';

const testQueries = [
  "How much did I spend last month?",
  "What is my total spending?",
  "Show me my food expenses",
  "How much did I spend on transport?",
  "What are my biggest expense categories?",
  "How much did I spend with Anjali?",
  "I spent 500 on dinner with UPI",
  "I spent 1200 on groceries"
];

async function testAIService() {
  console.log('🤖 Testing AI Service Integration\n');
  console.log(`Service URL: ${AI_SERVICE_URL}`);
  console.log(`API Key: ${AI_SERVICE_KEY ? 'Configured' : 'Not configured'}\n`);
  
  let successCount = 0;
  let totalTests = testQueries.length;
  
  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`\n${i + 1}. Testing: "${query}"`);
    console.log('─'.repeat(60));
    
    try {
      const requestBody = {
        user_prompt: query,
        user_id: 'test-user-123'
      };
      
      const response = await axios.post(AI_SERVICE_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_SERVICE_KEY}`,
          'User-Agent': 'Trackaro-Backend/1.0'
        },
        timeout: 30000
      });
      
      console.log('✅ Request successful');
      console.log(`📊 Status: ${response.status}`);
      console.log(`📝 Response:`, JSON.stringify(response.data, null, 2));
      
      // Validate response format
      const isValid = validateResponse(response.data);
      console.log(`🔍 Valid Format: ${isValid ? '✅ Yes' : '❌ No'}`);
      
      if (isValid) {
        successCount++;
      }
      
    } catch (error) {
      console.log('❌ Request failed');
      if (error.response) {
        console.log(`📊 Status: ${error.response.status}`);
        console.log(`📝 Error:`, error.response.data);
      } else if (error.request) {
        console.log('📝 Error: No response received');
        console.log('💡 Make sure your AI service is running and accessible');
      } else {
        console.log(`📝 Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n\n📋 Test Summary');
  console.log('─'.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${totalTests - successCount}`);
  console.log(`Success Rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 All tests passed! Your AI service is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

function validateResponse(response) {
  if (!response || typeof response !== 'object') {
    console.log('❌ Response is not an object');
    return false;
  }
  
  // Check required fields
  if (!response.type || !response.message) {
    console.log('❌ Missing required fields: type or message');
    return false;
  }
  
  // Validate type
  if (!['query', 'expense'].includes(response.type)) {
    console.log('❌ Invalid type. Must be "query" or "expense"');
    return false;
  }
  
  // Validate data field
  if (!response.data) {
    console.log('❌ Missing data field');
    return false;
  }
  
  // Validate expense response
  if (response.type === 'expense') {
    const data = response.data;
    if (typeof data.amount !== 'number' || !data.date || !data.category) {
      console.log('❌ Invalid expense data. Missing amount, date, or category');
      return false;
    }
  }
  
  return true;
}

// Health check function
async function healthCheck() {
  console.log('🏥 Performing health check...\n');
  
  try {
    const healthUrl = AI_SERVICE_URL.replace('/api/process', '/health');
    const response = await axios.get(healthUrl, {
      headers: {
        'Authorization': `Bearer ${AI_SERVICE_KEY}`
      },
      timeout: 5000
    });
    
    console.log('✅ Health check passed');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response:`, response.data);
    return true;
    
  } catch (error) {
    console.log('❌ Health check failed');
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
    } else {
      console.log(`📝 Error: ${error.message}`);
    }
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting AI Service Integration Test\n');
  
  // First, try health check
  const isHealthy = await healthCheck();
  
  if (!isHealthy) {
    console.log('\n⚠️  Health check failed, but continuing with API tests...\n');
  }
  
  // Run the main tests
  await testAIService();
  
  console.log('\n✨ Test completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAIService, healthCheck, validateResponse };
