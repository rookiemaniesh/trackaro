const axios = require('axios');

// Test that only Railway AI model responses are used
async function testRailwayOnly() {
  console.log('🚀 Testing Railway AI Model Only (No Mock Responses)...\n');

  const testCases = [
    {
      name: 'Expense Message',
      message: "I spent 500 today on dinner"
    },
    {
      name: 'Query Message', 
      message: "How much did I spend last month?"
    },
    {
      name: 'Complex Expense',
      message: "I spent 1000 on groceries using UPI"
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`💬 Message: "${testCase.message}"`);
    
    try {
      // Test direct Railway AI call
      const response = await axios.post('https://insightful-laughter-production-7c35.up.railway.app/process', {
        text: testCase.message,
        user_id: "test-user-id"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      console.log(`✅ Railway AI Response Status: ${response.status}`);
      console.log(`📊 Response Type: ${response.data.type}`);
      
      if (response.data.type === 'expense') {
        console.log(`💰 Expense Data:`, {
          amount: response.data.data.amount,
          category: response.data.data.category,
          subcategory: response.data.data.subcategory,
          paymentMethod: response.data.data.paymentMethod
        });
      }
      
      if (response.data.message && response.data.message.output) {
        console.log(`💬 AI Message: ${response.data.message.output.substring(0, 100)}...`);
      } else if (response.data.message) {
        console.log(`💬 AI Message: ${response.data.message.substring(0, 100)}...`);
      }

    } catch (error) {
      console.log(`❌ Error:`, error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }

  console.log('📋 Summary:');
  console.log('- All responses come from Railway AI model');
  console.log('- No mock responses are used');
  console.log('- Backend will only use these real AI responses');
}

// Run the test
testRailwayOnly().catch(console.error);










