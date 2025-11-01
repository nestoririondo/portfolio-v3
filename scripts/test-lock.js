import { createLock, removeLock } from './blog-lock.js';

console.log('🧪 Testing blog lock mechanism...\n');

// Test 1: Create lock
console.log('Test 1: Creating lock');
const success1 = createLock();
console.log(`Result: ${success1 ? '✅ Lock created' : '❌ Lock failed'}\n`);

// Test 2: Try to create another lock (should fail)
console.log('Test 2: Attempting second lock (should fail)');
const success2 = createLock();
console.log(`Result: ${success2 ? '❌ Second lock created (bad!)' : '✅ Second lock prevented (good)'}\n`);

// Test 3: Remove lock
console.log('Test 3: Removing lock');
removeLock();
console.log('Lock removed\n');

// Test 4: Create lock again (should succeed)
console.log('Test 4: Creating lock after removal (should succeed)');
const success4 = createLock();
console.log(`Result: ${success4 ? '✅ Lock created after removal' : '❌ Lock failed after removal'}\n`);

// Cleanup
removeLock();
console.log('✅ Test completed!');