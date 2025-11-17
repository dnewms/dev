#!/bin/bash

# U-M Engineering Newsletter Builder - Setup Verification Script
# This script verifies that your development environment is properly configured

echo "🔍 Verifying U-M Engineering Newsletter Builder Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if all checks pass
ALL_CHECKS_PASSED=true

# Check Node.js version
echo "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"

    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${RED}✗${NC} Node.js version must be 18 or higher"
        ALL_CHECKS_PASSED=false
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo "   Please install Node.js 18 or higher from https://nodejs.org/"
    ALL_CHECKS_PASSED=false
fi
echo ""

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm is installed: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm is not installed"
    ALL_CHECKS_PASSED=false
fi
echo ""

# Check if node_modules exists
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies are installed"
else
    echo -e "${YELLOW}!${NC} Dependencies not installed"
    echo "   Run: npm install"
    ALL_CHECKS_PASSED=false
fi
echo ""

# Check for .env.local
echo "Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"

    # Check if it contains API keys (without showing values)
    if grep -q "SENDGRID_API_KEY\|MAILCHIMP_API_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} Email provider API key configured"
    else
        echo -e "${YELLOW}!${NC} No email provider API key found in .env.local"
        echo "   Add SENDGRID_API_KEY or MAILCHIMP_API_KEY to enable email sending"
    fi
else
    echo -e "${YELLOW}!${NC} .env.local file not found"
    echo "   Copy .env.example to .env.local and add your API keys"
    echo "   Run: cp .env.example .env.local"
fi
echo ""

# Check critical files
echo "Checking project files..."
CRITICAL_FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.ts"
    "app/page.tsx"
    "app/layout.tsx"
    "components/Navigation.tsx"
    "lib/store.ts"
)

FILES_OK=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file is missing"
        FILES_OK=false
        ALL_CHECKS_PASSED=false
    fi
done
echo ""

# Check pages
echo "Checking application pages..."
PAGES=(
    "app/builder/page.tsx"
    "app/templates/page.tsx"
    "app/contacts/page.tsx"
    "app/analytics/page.tsx"
    "app/archive/page.tsx"
    "app/settings/page.tsx"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo -e "${GREEN}✓${NC} $page"
    else
        echo -e "${RED}✗${NC} $page is missing"
        ALL_CHECKS_PASSED=false
    fi
done
echo ""

# Check builder components
echo "Checking builder components..."
COMPONENTS=(
    "components/builder/BuilderSidebar.tsx"
    "components/builder/BuilderCanvas.tsx"
    "components/builder/BuilderPreview.tsx"
    "components/builder/EditableBlock.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo -e "${GREEN}✓${NC} $component"
    else
        echo -e "${RED}✗${NC} $component is missing"
        ALL_CHECKS_PASSED=false
    fi
done
echo ""

# Summary
echo "═══════════════════════════════════════════════════"
if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your environment is ready. To start the development server:"
    echo "  npm run dev"
    echo ""
    echo "Then open http://localhost:3000 in your browser"
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Please address the issues above before continuing."
    echo ""
    echo "Common fixes:"
    echo "  1. Install dependencies:    npm install"
    echo "  2. Create .env.local:       cp .env.example .env.local"
    echo "  3. Add your API keys to .env.local"
fi
echo "═══════════════════════════════════════════════════"
echo ""
echo "Need help? Check the README.md or DEPLOYMENT.md files"
echo ""
