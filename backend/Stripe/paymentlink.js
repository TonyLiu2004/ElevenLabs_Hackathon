// createPaymentLink.js
// Import necessary modules
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY); // Replace with your actual secret key


// Creates a Stripe payment link for a given item name and price.
async function createPaymentLink(name, priceInDollars) {
  try {
    const priceInCents = Math.round(priceInDollars * 100); // Convert dollars to cents

    const link = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: { url: 'https://yourapp.com/thankyou' }, // Change this to your redirect URL
      },
    });

    return link.url;
  } catch (error) {
    console.error('❌ Failed to create payment link:', error.message);
    throw error;
  }
}

module.exports = createPaymentLink;
