// Test different FORCE_TOPIC scenarios

console.log("🧪 Testing FORCE_TOPIC handling...\n");

function testForceTopic(value, description) {
  process.env.FORCE_TOPIC = value;
  const forceTopic = process.env.FORCE_TOPIC?.trim();
  const shouldUseForcedTopic =
    forceTopic &&
    forceTopic.length > 0 &&
    forceTopic !== "undefined" &&
    forceTopic !== "null";

  console.log(`${description}:`);
  console.log(`  Input: "${value}"`);
  console.log(`  Trimmed: "${forceTopic}"`);
  console.log(`  Will use forced topic: ${shouldUseForcedTopic}`);
  console.log(
    `  Action: ${
      shouldUseForcedTopic
        ? `Use "${forceTopic}"`
        : "Use random topic selection"
    }`
  );
  console.log();
}

// Test scenarios
testForceTopic("party planning for Berlin events", "✅ Valid topic provided");
testForceTopic("", "❌ Empty string");
testForceTopic("   ", "❌ Whitespace only");
testForceTopic(undefined, "❌ Undefined");
testForceTopic("null", '❌ String "null"');
testForceTopic("undefined", '❌ String "undefined"');

console.log("✅ Test completed!");
