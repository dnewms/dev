'use client';

export default function AffiliateLinks() {
  // Replace these with your actual affiliate links
  const affiliateProducts = [
    {
      name: 'Tesla Powerwall',
      description: 'Home battery storage system for solar energy',
      imageUrl: '/products/powerwall.jpg',
      affiliateUrl: 'YOUR_TESLA_AFFILIATE_LINK',
      price: 'From $11,500',
      category: 'Battery Storage'
    },
    {
      name: 'Enphase IQ8',
      description: 'Microinverters for maximum solar efficiency',
      imageUrl: '/products/enphase.jpg',
      affiliateUrl: 'YOUR_ENPHASE_AFFILIATE_LINK',
      price: 'Request Quote',
      category: 'Inverters'
    },
    {
      name: 'SunPower Panels',
      description: 'Premium efficiency solar panels',
      imageUrl: '/products/sunpower.jpg',
      affiliateUrl: 'YOUR_SUNPOWER_AFFILIATE_LINK',
      price: 'From $20,000',
      category: 'Solar Panels'
    },
    {
      name: 'Solar Monitoring System',
      description: 'Track your solar production in real-time',
      imageUrl: '/products/monitoring.jpg',
      affiliateUrl: 'YOUR_MONITORING_AFFILIATE_LINK',
      price: 'From $299',
      category: 'Monitoring'
    }
  ];

  const handleAffiliateClick = (productName: string, url: string) => {
    // Track affiliate click for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        product_name: productName,
        affiliate_url: url
      });
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recommended Solar Products
          </h2>
          <p className="text-lg text-gray-600">
            Top-rated solar equipment to maximize your investment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {affiliateProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                {/* Replace with actual product images */}
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold text-blue-600 mb-2">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price}
                  </span>
                  <button
                    onClick={() => handleAffiliateClick(product.name, product.affiliateUrl)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            We may earn a commission from purchases made through affiliate links at no additional cost to you.
          </p>
        </div>

        {/* Featured Installers - Another monetization opportunity */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Get Free Quotes from Top Local Installers
            </h3>
            <p className="text-blue-100">
              Compare prices and find the best deal for your solar installation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100 text-sm">Free Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-sm">Vetted Installers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100 text-sm">Average Rating</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="#calculator"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Get Your Free Quotes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
