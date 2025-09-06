const axios = require('axios');

// Railway AI Model URL
const RAILWAY_AI_URL = 'https://insightful-laughter-production-7c35.up.railway.app/process';

/**
 * Test Railway AI Model Integration
 */
async function testRailwayAI() {
  console.log('🚀 Testing Railway AI Model Integration...\n');

  // Test cases
  const testCases = [
    {
      name: 'Expense Input',
      input: {
        text: "I spent 500 today on dinner",
        user_id: "22f8e821-16ea-4f98-a945-30f0e20181f5"
      }
    },
    {
      name: 'Expense with Payment Method',
      input: {
        text: "I spent 1000 on groceries using UPI",
        user_id: "22f8e821-16ea-4f98-a945-30f0e20181f5"
      }
    },
    {
      name: 'Query Input',
      input: {
        text: "How much did I spend last month?",
        user_id: "22f8e821-16ea-4f98-a945-30f0e20181f5"
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`📤 Input:`, JSON.stringify(testCase.input, null, 2));

    try {
      const response = await axios.post(RAILWAY_AI_URL, testCase.input, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      console.log(`✅ Response Status: ${response.status}`);
      console.log(`📥 Response Data:`, JSON.stringify(response.data, null, 2));

      // Validate response structure
      if (response.data.type && response.data.data && response.data.message) {
        console.log(`✅ Valid response structure`);
        
        if (response.data.type === 'expense') {
          const expenseData = response.data.data;
          console.log(`💰 Expense Data:`, {
            amount: expenseData.amount,
            category: expenseData.category,
            subcategory: expenseData.subcategory,
            date: expenseData.date,
            companions: expenseData.companions,
            description: expenseData.description,
            paymentMethod: expenseData.paymentMethod
          });
        }
      } else {
        console.log(`❌ Invalid response structure`);
      }

    } catch (error) {
      console.log(`❌ Error:`, error.response?.data || error.message);
      if (error.response) {
        console.log(`📊 Status Code: ${error.response.status}`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// Run the test
testRailwayAI().catch(console.error);

