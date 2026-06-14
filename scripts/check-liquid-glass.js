#!/usr/bin/env node

/**
 * Liquid Glass V2 Integration Checker
 * 
 * Validates that all required files exist and are properly configured.
 * Run: node scripts/check-liquid-glass.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'src/app/globals-liquid-glass.css',
  'src/components/ui/liquid-glass-v2.tsx',
  'src/components/ui/liquid-glass-svg-filter.tsx',
  'src/lib/utils/liquid-glass-manager.ts',
  'src/app/liquid-glass-demo/page.tsx',
];

const OPTIONAL_FILES = [
  'src/app/calculator-v2/page.tsx',
  'src/components/examples/liquid-glass-dashboard-cards.tsx',
  'src/types/liquid-glass.d.ts',
];

const DOCS = [
  'LIQUID_GLASS_INTEGRATION.md',
  'LIQUID_GLASS_V2_SPEC.md',
  'README_LIQUID_GLASS.md',
];

console.log('🔍 Checking Liquid Glass V2 Integration...\n');

let hasErrors = false;
let warnings = 0;

// Check required files
console.log('📋 Required Files:');
REQUIRED_FILES.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Files:');
OPTIONAL_FILES.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  ${file} - not found (optional)`);
    warnings++;
  }
});

console.log('\n📚 Documentation:');
DOCS.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  ${file} - not found`);
    warnings++;
  }
});

// Check CSS import in layout
console.log('\n🔍 Checking CSS Import in Layout:');
const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('globals-liquid-glass.css')) {
    console.log('  ✅ CSS imported in layout.tsx');
  } else {
    console.log('  ⚠️  globals-liquid-glass.css not imported in layout.tsx');
    console.log('     Add: import "./globals-liquid-glass.css";');
    warnings++;
  }
  
  if (layoutContent.includes('LiquidGlassSVGFilter')) {
    console.log('  ✅ SVG filter mounted in layout.tsx');
  } else {
    console.log('  ⚠️  LiquidGlassSVGFilter not mounted in layout.tsx');
    console.log('     Add: <LiquidGlassSVGFilter />');
    warnings++;
  }
} else {
  console.log('  ❌ layout.tsx not found');
  hasErrors = true;
}

// Check SVG filter definition
console.log('\n🔍 Checking SVG Filter:');
const svgFilterPath = path.join(
  process.cwd(),
  'src/components/ui/liquid-glass-svg-filter.tsx'
);
if (fs.existsSync(svgFilterPath)) {
  const svgContent = fs.readFileSync(svgFilterPath, 'utf8');
  if (svgContent.includes('id="liquid-glass-refraction"')) {
    console.log('  ✅ SVG filter ID: liquid-glass-refraction');
  } else {
    console.log('  ❌ SVG filter ID mismatch');
    hasErrors = true;
  }
  
  if (svgContent.includes('feTurbulence')) {
    console.log('  ✅ feTurbulence element present');
  }
  if (svgContent.includes('feDisplacementMap')) {
    console.log('  ✅ feDisplacementMap element present');
  }
}

// Check manager singleton
console.log('\n🔍 Checking Manager:');
const managerPath = path.join(
  process.cwd(),
  'src/lib/utils/liquid-glass-manager.ts'
);
if (fs.existsSync(managerPath)) {
  const managerContent = fs.readFileSync(managerPath, 'utf8');
  if (managerContent.includes('window.liquidGlassManager')) {
    console.log('  ✅ Global singleton pattern detected');
  }
  if (managerContent.includes('prefers-reduced-motion')) {
    console.log('  ✅ Reduced motion support detected');
  }
  if (managerContent.includes('requestAnimationFrame')) {
    console.log('  ✅ rAF optimization detected');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Integration has ERRORS - fix required files');
  process.exit(1);
} else if (warnings > 0) {
  console.log(`⚠️  Integration complete with ${warnings} warnings`);
  console.log('✅ Core functionality should work');
  process.exit(0);
} else {
  console.log('✅ Perfect! All checks passed');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm run dev');
  console.log('   2. Visit http://localhost:3000/liquid-glass-demo');
  console.log('   3. Test cursor tracking and all 5 variants');
  process.exit(0);
}
