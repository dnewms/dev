'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-gray-600">
            Complete API reference for Email Validator API
          </p>
        </div>
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}
