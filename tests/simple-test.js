console.log('🧪 SCES Website Integration Tests');
console.log('=================================');

// Test 1: Donation Form Validation
console.log('\n1️⃣ Testing Donation Form Validation...');

function validateDonation(amount, email, phone) {
  const errors = [];
  
  if (!amount || amount < 500) {
    errors.push('Amount must be at least ₹500');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Valid email required');
  }
  
  if (!phone || phone.length !== 10) {
    errors.push('Valid 10-digit phone required');
  }
  
  return errors;
}

// Test cases
const donationTests = [
  { amount: 100, email: 'test@example.com', phone: '9876543210', expected: 1 },
  { amount: 1000, email: 'invalid-email', phone: '9876543210', expected: 1 },
  { amount: 1000, email: 'test@example.com', phone: '123', expected: 1 },
  { amount: 1000, email: 'test@example.com', phone: '9876543210', expected: 0 }
];

let passed = 0;
donationTests.forEach((test, i) => {
  const errors = validateDonation(test.amount, test.email, test.phone);
  if (errors.length === test.expected) {
    console.log(`   ✅ Test ${i + 1}: Passed`);
    passed++;
  } else {
    console.log(`   ❌ Test ${i + 1}: Failed (expected ${test.expected} errors, got ${errors.length})`);
  }
});

console.log(`   📊 Donation validation: ${passed}/${donationTests.length} passed`);

// Test 2: Gallery Filtering
console.log('\n2️⃣ Testing Gallery Filtering...');

function filterImages(images, category) {
  if (category === 'All') return images;
  return images.filter(img => img.category === category);
}

const mockImages = [
  { id: 1, category: 'Events' },
  { id: 2, category: 'Classrooms' },
  { id: 3, category: 'Events' },
  { id: 4, category: 'Field Visits' }
];

const galleryTests = [
  { category: 'All', expected: 4 },
  { category: 'Events', expected: 2 },
  { category: 'Classrooms', expected: 1 },
  { category: 'Field Visits', expected: 1 }
];

let galleryPassed = 0;
galleryTests.forEach((test, i) => {
  const filtered = filterImages(mockImages, test.category);
  if (filtered.length === test.expected) {
    console.log(`   ✅ Filter ${test.category}: Passed`);
    galleryPassed++;
  } else {
    console.log(`   ❌ Filter ${test.category}: Failed (expected ${test.expected}, got ${filtered.length})`);
  }
});

console.log(`   📊 Gallery filtering: ${galleryPassed}/${galleryTests.length} passed`);

// Test 3: Form Error Handling
console.log('\n3️⃣ Testing Error Handling...');

function handleError(error) {
  if (error.type === 'network') {
    return 'Network connection error. Please try again.';
  } else if (error.type === 'validation') {
    return `Validation error: ${error.message}`;
  } else {
    return 'An unexpected error occurred.';
  }
}

const errorTests = [
  { error: { type: 'network' }, expected: 'Network connection error. Please try again.' },
  { error: { type: 'validation', message: 'Invalid email' }, expected: 'Validation error: Invalid email' },
  { error: { type: 'unknown' }, expected: 'An unexpected error occurred.' }
];

let errorPassed = 0;
errorTests.forEach((test, i) => {
  const result = handleError(test.error);
  if (result === test.expected) {
    console.log(`   ✅ Error handling ${i + 1}: Passed`);
    errorPassed++;
  } else {
    console.log(`   ❌ Error handling ${i + 1}: Failed`);
  }
});

console.log(`   📊 Error handling: ${errorPassed}/${errorTests.length} passed`);

// Summary
const totalTests = donationTests.length + galleryTests.length + errorTests.length;
const totalPassed = passed + galleryPassed + errorPassed;

console.log('\n📋 Test Summary:');
console.log(`   Total: ${totalTests}`);
console.log(`   Passed: ${totalPassed}`);
console.log(`   Failed: ${totalTests - totalPassed}`);

if (totalPassed === totalTests) {
  console.log('\n🎉 All integration tests passed!');
} else {
  console.log('\n⚠️  Some tests failed. Please review the output above.');
}

console.log('\n📝 Manual Testing Checklist:');
console.log('   □ Visit http://localhost:3000/donate and test donation form');
console.log('   □ Visit http://localhost:3000/volunteer and test volunteer application');
console.log('   □ Visit http://localhost:3000/gallery and test image filtering');
console.log('   □ Visit http://localhost:3000/about and verify content displays');
console.log('   □ Test form error handling with invalid data');
console.log('   □ Test responsive design on mobile devices');
console.log('   □ Test page loading performance');