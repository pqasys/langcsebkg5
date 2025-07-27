// Test script to verify course issues are fixed
const { formatCurrencyWithSymbol } = require('./lib/utils');

// // // // // // // // // // // // console.log('Testing formatCurrencyWithSymbol function...');

// Test with USD
console.log('USD test:', formatCurrencyWithSymbol(100, 'USD'));

// Test with EUR
console.log('EUR test:', formatCurrencyWithSymbol(100, 'EUR'));

// Test with default currency
console.log('Default test:', formatCurrencyWithSymbol(100));

// Test with invalid currency
console.log('Invalid currency test:', formatCurrencyWithSymbol(100, 'INVALID'));

console.log('Currency formatting tests completed!'); 