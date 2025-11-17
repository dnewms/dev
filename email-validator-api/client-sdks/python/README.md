# Email Validator API - Python SDK

Official Python SDK for the Email Validator API.

## Installation

```bash
pip install email-validator-sdk
```

## Quick Start

```python
from email_validator_client import EmailValidatorClient

# Initialize the client
client = EmailValidatorClient('your-api-key')

# Validate a single email
result = client.validate_email('user@example.com')
print(result)
# {
#   'email': 'user@example.com',
#   'isValid': True,
#   'syntaxValid': True,
#   'mxValid': True,
#   'smtpValid': True,
#   'isDisposable': False,
#   'domain': 'example.com'
# }
```

## API Reference

### EmailValidatorClient

```python
client = EmailValidatorClient(api_key, base_url='https://api.emailvalidator.com', timeout=10)
```

**Parameters:**
- `api_key` (str): Your API key from the dashboard
- `base_url` (str, optional): API base URL
- `timeout` (int, optional): Request timeout in seconds (default: 10)

### Methods

#### `validate_email(email)`

Validates a single email address.

```python
result = client.validate_email('user@example.com')
```

**Returns:** dict with validation result

#### `validate_bulk(emails)`

Validates multiple email addresses (max 100).

```python
result = client.validate_bulk([
    'user1@example.com',
    'user2@example.com'
])
```

**Returns:** dict with bulk validation results

#### `get_usage(token)`

Gets usage statistics (requires JWT token).

```python
usage = client.get_usage('your-jwt-token')
```

**Returns:** dict with usage statistics

#### `get_subscription(token)`

Gets subscription information (requires JWT token).

```python
subscription = client.get_subscription('your-jwt-token')
```

**Returns:** dict with subscription info

## Error Handling

```python
try:
    result = client.validate_email('invalid-email')
except Exception as e:
    print(f'Validation error: {e}')
```

## Context Manager

The client can be used as a context manager:

```python
with EmailValidatorClient('your-api-key') as client:
    result = client.validate_email('user@example.com')
    print(result)
```

## Examples

### Validate Single Email

```python
from email_validator_client import EmailValidatorClient

client = EmailValidatorClient('your-api-key')
result = client.validate_email('user@example.com')

if result['isValid']:
    print('Email is valid!')
else:
    print('Email is invalid')
    if result['suggestion']:
        print(f'Did you mean: {result["suggestion"]}?')
```

### Bulk Validation

```python
emails = [
    'user1@example.com',
    'user2@example.com',
    'invalid@domain'
]

result = client.validate_bulk(emails)

print(f'Total: {result["total"]}')
print(f'Valid: {result["valid"]}')
print(f'Invalid: {result["invalid"]}')

for validation in result['results']:
    print(f'{validation["email"]}: {validation["isValid"]}')
```

### Check Usage

```python
# Get JWT token from login
token = 'your-jwt-token'

usage = client.get_usage(token)
print(f'Used this month: {usage["validationsThisMonth"]}')
print(f'Monthly quota: {usage["monthlyQuota"]}')
print(f'Remaining: {usage["remainingQuota"]}')
```

## Requirements

- Python 3.7+
- requests >= 2.25.0

## License

MIT
