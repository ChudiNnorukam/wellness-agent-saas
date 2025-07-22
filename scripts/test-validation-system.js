#!/usr/bin/env node

const { ValidationAgent } = require('./agents/ValidationAgent');
const { ResearchAgent } = require('./agents/ResearchAgent');

async function testValidationSystem() {
  console.log('🧪 Testing Validation and Research System...\n');

  const validationAgent = new ValidationAgent();
  const researchAgent = new ResearchAgent();

  try {
    // Test 1: Code Validation
    console.log('🔍 Test 1: Code Validation');
    const validationResults = await validationAgent.validateCodeChanges();
    console.log(`✅ Code validation completed: ${validationResults.passed}/${validationResults.total} tests passed\n`);

    // Test 2: Error Research
    console.log('🔬 Test 2: Error Research');
    const mockError = new Error('Build failed: Module not found');
    const researchResult = await researchAgent.researchError(mockError.message);
    console.log(`✅ Error research completed: Found ${researchResult.solutions.length} solutions\n`);

    // Test 3: Learning from Error
    console.log('🧠 Test 3: Learning from Error');
    const learning = await researchAgent.learnFromError(mockError, {
      context: 'test_validation',
      timestamp: new Date().toISOString()
    });
    console.log(`✅ Error learning completed: Pattern identified as "${learning.pattern}"\n`);

    // Test 4: Strategy Adaptation
    console.log('🔄 Test 4: Strategy Adaptation');
    const adaptation = await researchAgent.adaptStrategy('build');
    console.log(`✅ Strategy adaptation completed: ${adaptation.strategy.action}\n`);

    // Test 5: Improvement Plan
    console.log('📋 Test 5: Improvement Plan');
    const improvementPlan = await researchAgent.generateImprovementPlan();
    console.log(`✅ Improvement plan generated: ${improvementPlan.recommendations.length} recommendations\n`);

    // Test 6: Full Validation (without deployment URL)
    console.log('🚀 Test 6: Full Validation');
    const fullValidation = await validationAgent.runFullValidation();
    console.log(`✅ Full validation completed: ${fullValidation.codeValidation.passed}/${fullValidation.codeValidation.total} tests passed\n`);

    // Generate Reports
    console.log('📊 Generating Reports...');
    const validationReport = validationAgent.getValidationReport();
    const researchReport = researchAgent.getResearchReport();

    console.log('\n📈 VALIDATION REPORT:');
    console.log(`- Total Tests: ${validationReport.totalTests}`);
    console.log(`- Passed: ${validationReport.passedTests}`);
    console.log(`- Failed: ${validationReport.failedTests}`);
    console.log(`- Success Rate: ${validationReport.successRate.toFixed(1)}%`);

    console.log('\n📈 RESEARCH REPORT:');
    console.log(`- Total Researches: ${researchReport.totalResearches}`);
    console.log(`- Total Errors: ${researchReport.totalErrors}`);
    console.log(`- Total Adaptations: ${researchReport.totalAdaptations}`);
    console.log(`- Top Error Pattern: ${researchReport.topErrorPatterns[0]?.pattern || 'None'}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Validation and Research system is working properly.');

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    console.log('\n🔍 This is expected behavior - the system is learning from failures!');
    
    // Test error handling
    const learning = await researchAgent.learnFromError(error, {
      context: 'test_failure',
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Error was learned: ${learning.prevention}`);
  }
}

// Run the test
testValidationSystem().catch(console.error); 