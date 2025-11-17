/**
 * Email Validator API - JavaScript/Node.js SDK
 *
 * A simple client for the Email Validator API
 */

class EmailValidatorClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.emailvalidator.com';
    this.timeout = options.timeout || 10000;
  }

  /**
   * Make a request to the API
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Validate a single email address
   *
   * @param {string} email - Email address to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateEmail(email) {
    return this._request('/api/v1/validate', {
      method: 'POST',
      body: { email },
    });
  }

  /**
   * Validate multiple email addresses
   *
   * @param {string[]} emails - Array of email addresses to validate (max 100)
   * @returns {Promise<Object>} Bulk validation results
   */
  async validateBulk(emails) {
    if (!Array.isArray(emails)) {
      throw new Error('emails must be an array');
    }

    if (emails.length > 100) {
      throw new Error('Maximum 100 emails per request');
    }

    return this._request('/api/v1/validate/bulk', {
      method: 'POST',
      body: { emails },
    });
  }

  /**
   * Get usage statistics
   *
   * @param {string} token - JWT token for authentication
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsage(token) {
    return this._request('/api/usage', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  /**
   * Get subscription information
   *
   * @param {string} token - JWT token for authentication
   * @returns {Promise<Object>} Subscription details
   */
  async getSubscription(token) {
    return this._request('/api/subscription', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailValidatorClient;
}

if (typeof window !== 'undefined') {
  window.EmailValidatorClient = EmailValidatorClient;
}

/**
 * Example usage:
 *
 * const client = new EmailValidatorClient('your-api-key');
 *
 * // Validate single email
 * const result = await client.validateEmail('user@example.com');
 * console.log(result.isValid);
 *
 * // Validate multiple emails
 * const bulkResult = await client.validateBulk([
 *   'user1@example.com',
 *   'user2@example.com'
 * ]);
 * console.log(bulkResult.results);
 */
