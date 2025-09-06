const axios = require('axios');

// Test the enhanced logging with Railway AI model
async function testEnhancedLogging() {
  console.log('🚀 Testing Enhanced Logging with Railway AI Model...\n');

  const testMessage = "I spent 500 today on dinner";
  const userId = "22f8e821-16ea-4f98-a945-30f0e20181f5";
  
  console.log(`📤 Sending test message: "${testMessage}"`);
  console.log(`👤 User ID: ${userId}\n`);

  try {
    // Send message to backend
    const response = await axios.post('http://localhost:5000/api/messages', {
      content: testMessage
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // You'll need to replace this with a real token
      }
    });

    console.log('✅ Backend Response:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    if (error.response) {
      console.log('❌ Backend Error Response:');
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Network Error:', error.message);
    }
  }
}

// Instructions for testing
console.log('📋 Testing Instructions:');
console.log('1. Make sure backend is running: npm run dev');
console.log('2. Get a valid JWT token by logging in through the frontend');
console.log('3. Replace YOUR_JWT_TOKEN_HERE with the actual token');
console.log('4. Run this script: node test-enhanced-logging.js');
console.log('5. Check the backend console for detailed AI response logging\n');

// Uncomment the line below to run the test
// testEnhancedLogging().catch(console.error);





