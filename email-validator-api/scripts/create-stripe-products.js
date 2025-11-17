/**
 * Script to create Stripe products and prices
 * Run this once to set up your Stripe products
 */

require('dotenv').config();
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  console.log('Creating Stripe products and prices...\n');

  try {
    // Starter Plan
    const starterProduct = await stripe.products.create({
      name: 'Starter Plan',
      description: '5,000 email validations per month',
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log('✅ Starter Plan created');
    console.log(`   Product ID: ${starterProduct.id}`);
    console.log(`   Price ID: ${starterPrice.id}`);
    console.log(`   Add to .env: STRIPE_PRICE_STARTER="${starterPrice.id}"\n`);

    // Pro Plan
    const proProduct = await stripe.products.create({
      name: 'Pro Plan',
      description: '25,000 email validations per month with priority support',
    });

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log('✅ Pro Plan created');
    console.log(`   Product ID: ${proProduct.id}`);
    console.log(`   Price ID: ${proPrice.id}`);
    console.log(`   Add to .env: STRIPE_PRICE_PRO="${proPrice.id}"\n`);

    // Enterprise Plan
    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise Plan',
      description: '200,000 email validations per month with dedicated support',
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 49900, // $499.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log('✅ Enterprise Plan created');
    console.log(`   Product ID: ${enterpriseProduct.id}`);
    console.log(`   Price ID: ${enterprisePrice.id}`);
    console.log(`   Add to .env: STRIPE_PRICE_ENTERPRISE="${enterprisePrice.id}"\n`);

    console.log('All products created successfully!');
    console.log('\nNext steps:');
    console.log('1. Add the price IDs to your .env file');
    console.log('2. Set up a webhook endpoint in Stripe Dashboard');
    console.log('3. Add the webhook secret to your .env file');
  } catch (error) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
