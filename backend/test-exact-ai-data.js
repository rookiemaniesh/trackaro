const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function testExactAIData() {
  console.log('🧪 Testing Exact AI Model Data Storage...\n');

  try {
    // Get a test user
    let testUser = await prisma.user.findFirst();
    
    if (!testUser) {
      console.log('📝 Creating test user...');
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword'
        }
      });
    }

    // Simulate exact AI model response data (like your example)
    const aiModelResponse = {
      "amount": 99999,
      "date": "2025-09-06T11:35:45.449Z",
      "companions": [],
      "description": "Mock expense for 99999",
      "category": "transportation", // Changed from hardcoded "food"
      "subcategory": "uber", // Changed from hardcoded "dinner"
      "paymentMethod": "upi"
    };

    console.log('🤖 AI Model Response Data:');
    console.log(JSON.stringify(aiModelResponse, null, 2));

    // Add user_id (this is what the backend does)
    const expenseDataWithUserId = {
      ...aiModelResponse,
      user_id: testUser.id
    };

    console.log('\n💾 Expense Data with User ID:');
    console.log(JSON.stringify(expenseDataWithUserId, null, 2));

    // Save to database exactly as the backend does
    const expense = await prisma.expense.create({
      data: {
        user_id: expenseDataWithUserId.user_id,
        amount: expenseDataWithUserId.amount,
        category: expenseDataWithUserId.category, // Exact category from AI
        subcategory: expenseDataWithUserId.subcategory, // Exact subcategory from AI
        companions: expenseDataWithUserId.companions || [],
        date: new Date(expenseDataWithUserId.date),
        paymentMethod: expenseDataWithUserId.paymentMethod,
        description: expenseDataWithUserId.description || null
      }
    });

    console.log('\n✅ Expense Saved to Database:');
    console.log(JSON.stringify(expense, null, 2));

    // Verify the data matches exactly
    console.log('\n🔍 Verification:');
    console.log('Original AI category:', aiModelResponse.category);
    console.log('Saved category:', expense.category);
    console.log('Categories match:', aiModelResponse.category === expense.category);
    
    console.log('Original AI subcategory:', aiModelResponse.subcategory);
    console.log('Saved subcategory:', expense.subcategory);
    console.log('Subcategories match:', aiModelResponse.subcategory === expense.subcategory);

    // Clean up
    await prisma.expense.delete({ where: { id: expense.id } });
    console.log('\n🧹 Test expense cleaned up');

  } catch (error) {
    console.error('❌ Error testing exact AI data storage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testExactAIData().catch(console.error);
