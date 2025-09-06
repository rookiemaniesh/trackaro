const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function testExpenseStorage() {
  console.log('🧪 Testing Expense Storage with User ID...\n');

  try {
    // Get a test user (or create one if none exists)
    let testUser = await prisma.user.findFirst();
    
    if (!testUser) {
      console.log('📝 Creating test user...');
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword'
        }
      });
      console.log('✅ Test user created:', testUser.id);
    } else {
      console.log('👤 Using existing test user:', testUser.id);
    }

    // Test expense data (similar to what AI model returns)
    const testExpenseData = {
      amount: 30,
      date: new Date().toISOString(),
      companions: [],
      description: "Test expense for 30",
      category: "entertainment", // Changed from hardcoded "food"
      subcategory: "movie", // Changed from hardcoded "dinner"
      paymentMethod: "upi"
    };

    console.log('💾 Test expense data:', JSON.stringify(testExpenseData, null, 2));

    // Add user_id to expense data
    const expenseDataWithUserId = {
      ...testExpenseData,
      user_id: testUser.id
    };

    console.log('💾 Expense data with user_id:', JSON.stringify(expenseDataWithUserId, null, 2));

    // Save expense to database
    const expense = await prisma.expense.create({
      data: {
        user_id: expenseDataWithUserId.user_id,
        amount: expenseDataWithUserId.amount,
        category: expenseDataWithUserId.category,
        subcategory: expenseDataWithUserId.subcategory || null,
        companions: expenseDataWithUserId.companions || [],
        date: new Date(expenseDataWithUserId.date),
        paymentMethod: expenseDataWithUserId.paymentMethod,
        description: expenseDataWithUserId.description || null
      }
    });

    console.log('✅ Expense saved to database:');
    console.log(JSON.stringify(expense, null, 2));

    // Verify the expense was saved correctly
    const savedExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: { user: true }
    });

    console.log('\n🔍 Verification - Saved expense with user:');
    console.log(JSON.stringify(savedExpense, null, 2));

    // Clean up test data
    await prisma.expense.delete({ where: { id: expense.id } });
    console.log('\n🧹 Test expense cleaned up');

  } catch (error) {
    console.error('❌ Error testing expense storage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testExpenseStorage().catch(console.error);
