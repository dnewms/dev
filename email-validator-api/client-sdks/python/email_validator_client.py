"""
Email Validator API - Python SDK

A simple client for the Email Validator API
"""

import requests
from typing import List, Dict, Any, Optional
import time


class EmailValidatorClient:
    """Client for Email Validator API"""

    def __init__(self, api_key: str, base_url: str = "https://api.emailvalidator.com", timeout: int = 10):
        """
        Initialize the Email Validator client

        Args:
            api_key: Your API key from the dashboard
            base_url: API base URL (default: https://api.emailvalidator.com)
            timeout: Request timeout in seconds (default: 10)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-API-Key': api_key,
        })

    def _request(self, endpoint: str, method: str = 'GET', data: Optional[Dict] = None, headers: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Make a request to the API

        Args:
            endpoint: API endpoint
            method: HTTP method
            data: Request body
            headers: Additional headers

        Returns:
            Response data as dictionary

        Raises:
            requests.exceptions.RequestException: On request failure
        """
        url = f"{self.base_url}{endpoint}"
        request_headers = self.session.headers.copy()

        if headers:
            request_headers.update(headers)

        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                headers=request_headers,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            raise Exception('Request timeout')
        except requests.exceptions.HTTPError as e:
            try:
                error_data = response.json()
                raise Exception(error_data.get('message', str(e)))
            except:
                raise Exception(f'HTTP {response.status_code}')

    def validate_email(self, email: str) -> Dict[str, Any]:
        """
        Validate a single email address

        Args:
            email: Email address to validate

        Returns:
            Validation result dictionary

        Example:
            >>> client = EmailValidatorClient('your-api-key')
            >>> result = client.validate_email('user@example.com')
            >>> print(result['isValid'])
            True
        """
        return self._request('/api/v1/validate', method='POST', data={'email': email})

    def validate_bulk(self, emails: List[str]) -> Dict[str, Any]:
        """
        Validate multiple email addresses

        Args:
            emails: List of email addresses to validate (max 100)

        Returns:
            Bulk validation results

        Raises:
            ValueError: If emails is not a list or exceeds 100 items

        Example:
            >>> client = EmailValidatorClient('your-api-key')
            >>> results = client.validate_bulk(['user1@example.com', 'user2@example.com'])
            >>> print(results['total'])
            2
        """
        if not isinstance(emails, list):
            raise ValueError('emails must be a list')

        if len(emails) > 100:
            raise ValueError('Maximum 100 emails per request')

        return self._request('/api/v1/validate/bulk', method='POST', data={'emails': emails})

    def get_usage(self, token: str) -> Dict[str, Any]:
        """
        Get usage statistics

        Args:
            token: JWT token for authentication

        Returns:
            Usage statistics dictionary
        """
        return self._request('/api/usage', headers={'Authorization': f'Bearer {token}'})

    def get_subscription(self, token: str) -> Dict[str, Any]:
        """
        Get subscription information

        Args:
            token: JWT token for authentication

        Returns:
            Subscription details dictionary
        """
        return self._request('/api/subscription', headers={'Authorization': f'Bearer {token}'})

    def close(self):
        """Close the HTTP session"""
        self.session.close()

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()


# Example usage
if __name__ == '__main__':
    # Initialize client
    client = EmailValidatorClient('your-api-key')

    # Validate single email
    result = client.validate_email('user@example.com')
    print(f"Valid: {result['isValid']}")

    # Validate multiple emails
    bulk_result = client.validate_bulk([
        'user1@example.com',
        'user2@example.com'
    ])
    print(f"Total validated: {bulk_result['total']}")
    print(f"Valid: {bulk_result['valid']}")
    print(f"Invalid: {bulk_result['invalid']}")

    # Using context manager
    with EmailValidatorClient('your-api-key') as client:
        result = client.validate_email('test@example.com')
        print(result)
