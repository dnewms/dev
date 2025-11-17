export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Email Validator API',
    version: '1.0.0',
    description: 'Production-ready email validation API with syntax checking, MX records validation, SMTP verification, and disposable domain detection.',
    contact: {
      name: 'API Support',
      email: 'support@emailvalidatorapi.com',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for authentication',
      },
    },
    schemas: {
      ValidationResult: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          isValid: { type: 'boolean', example: true },
          syntaxValid: { type: 'boolean', example: true },
          mxValid: { type: 'boolean', example: true },
          smtpValid: { type: 'boolean', example: true },
          isDisposable: { type: 'boolean', example: false },
          domain: { type: 'string', example: 'example.com' },
          suggestion: { type: 'string', nullable: true, example: null },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      BulkValidationResponse: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: { $ref: '#/components/schemas/ValidationResult' },
          },
          total: { type: 'integer', example: 10 },
          valid: { type: 'integer', example: 8 },
          invalid: { type: 'integer', example: 2 },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    '/api/v1/validate': {
      post: {
        summary: 'Validate single email',
        description: 'Validates a single email address with comprehensive checks',
        tags: ['Validation'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Validation result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationResult' },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Invalid or missing API key',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '403': {
            description: 'Quota exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/v1/validate/bulk': {
      post: {
        summary: 'Validate multiple emails',
        description: 'Validates up to 100 email addresses in a single request',
        tags: ['Validation'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['emails'],
                properties: {
                  emails: {
                    type: 'array',
                    items: { type: 'string', format: 'email' },
                    example: ['user1@example.com', 'user2@example.com'],
                    maxItems: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Bulk validation results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BulkValidationResponse' },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '403': {
            description: 'Quota exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/usage': {
      get: {
        summary: 'Get usage statistics',
        description: 'Returns usage statistics and quota information',
        tags: ['Account'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'Usage statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalValidations: { type: 'integer' },
                    validationsThisMonth: { type: 'integer' },
                    monthlyQuota: { type: 'integer' },
                    remainingQuota: { type: 'integer' },
                    validationsByDay: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date: { type: 'string', format: 'date' },
                          count: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: 'Validation', description: 'Email validation endpoints' },
    { name: 'Account', description: 'Account management endpoints' },
  ],
};
