# Email Validator API - JavaScript SDK

Official JavaScript/Node.js SDK for the Email Validator API.

## Installation

```bash
npm install @emailvalidator/sdk
```

Or using a CDN:

```html
<script src="https://unpkg.com/@emailvalidator/sdk"></script>
```

## Quick Start

```javascript
const EmailValidatorClient = require('@emailvalidator/sdk');

const client = new EmailValidatorClient('your-api-key');

// Validate a single email
const result = await client.validateEmail('user@example.com');
console.log(result);
// {
//   email: 'user@example.com',
//   isValid: true,
//   syntaxValid: true,
//   mxValid: true,
//   smtpValid: true,
//   isDisposable: false,
//   domain: 'example.com'
// }
```

## API Reference

### Constructor

```javascript
const client = new EmailValidatorClient(apiKey, options);
```

**Parameters:**
- `apiKey` (string): Your API key from the dashboard
- `options` (object, optional):
  - `baseUrl` (string): API base URL (default: 'https://api.emailvalidator.com')
  - `timeout` (number): Request timeout in milliseconds (default: 10000)

### Methods

#### `validateEmail(email)`

Validates a single email address.

```javascript
const result = await client.validateEmail('user@example.com');
```

**Returns:** Promise<ValidationResult>

#### `validateBulk(emails)`

Validates multiple email addresses (max 100).

```javascript
const result = await client.validateBulk([
  'user1@example.com',
  'user2@example.com'
]);
```

**Returns:** Promise<BulkValidationResult>

#### `getUsage(token)`

Gets usage statistics (requires JWT token).

```javascript
const usage = await client.getUsage('your-jwt-token');
```

**Returns:** Promise<UsageStats>

#### `getSubscription(token)`

Gets subscription information (requires JWT token).

```javascript
const subscription = await client.getSubscription('your-jwt-token');
```

**Returns:** Promise<SubscriptionInfo>

## Error Handling

```javascript
try {
  const result = await client.validateEmail('invalid-email');
} catch (error) {
  console.error('Validation error:', error.message);
}
```

## TypeScript Support

TypeScript definitions are included:

```typescript
import EmailValidatorClient from '@emailvalidator/sdk';

const client = new EmailValidatorClient('your-api-key');
```

## License

MIT
