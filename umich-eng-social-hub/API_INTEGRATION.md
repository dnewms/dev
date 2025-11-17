# Social Media API Integration Guide

This document provides detailed instructions for integrating the UMich Engineering Social Hub with various social media platforms.

## Table of Contents

1. [Twitter/X API Integration](#twitterx-api-integration)
2. [LinkedIn API Integration](#linkedin-api-integration)
3. [Instagram API Integration](#instagram-api-integration)
4. [AI Services Integration](#ai-services-integration)
5. [Environment Variables](#environment-variables)
6. [Testing API Connections](#testing-api-connections)

---

## Twitter/X API Integration

### Prerequisites

- Twitter Developer Account
- Elevated access (required for posting)

### Setup Steps

1. **Create a Twitter Developer Account**
   - Visit [developer.twitter.com](https://developer.twitter.com)
   - Apply for a developer account
   - Create a new project and app

2. **Get API Credentials**
   - Navigate to your app's "Keys and tokens" section
   - Generate the following:
     - API Key (Consumer Key)
     - API Secret Key (Consumer Secret)
     - Access Token
     - Access Token Secret
     - Bearer Token

3. **Configure API Permissions**
   - Set app permissions to "Read and Write"
   - Enable OAuth 2.0 if needed

4. **Add to Environment Variables**
   ```env
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_SECRET=your_access_secret
   TWITTER_BEARER_TOKEN=your_bearer_token
   ```

### Implementation Example

```typescript
// lib/twitter.ts
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function postTweet(content: string, mediaIds?: string[]) {
  try {
    const tweet = await client.v2.tweet({
      text: content,
      media: mediaIds ? { media_ids: mediaIds } : undefined,
    });
    return tweet;
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}

export async function uploadMedia(buffer: Buffer, mimeType: string) {
  const mediaId = await client.v1.uploadMedia(buffer, { mimeType });
  return mediaId;
}
```

### Rate Limits

- Tweet creation: 50 requests per 15 minutes (user context)
- Media upload: 500 MB per 24 hours

---

## LinkedIn API Integration

### Prerequisites

- LinkedIn Developer Account
- Company/Organization Page (for posting to organization pages)

### Setup Steps

1. **Create LinkedIn App**
   - Visit [LinkedIn Developers](https://www.linkedin.com/developers)
   - Create a new app
   - Associate with your organization's LinkedIn page

2. **Request API Access**
   - Request "Marketing Developer Platform" access
   - Wait for approval (can take several days)

3. **Get API Credentials**
   - Client ID
   - Client Secret
   - Organization ID

4. **Configure OAuth 2.0**
   - Add redirect URL: `https://yourapp.com/api/auth/linkedin/callback`
   - Select required scopes:
     - `w_member_social` (share content)
     - `r_organization_social` (read organization content)
     - `w_organization_social` (post to organization)

5. **Add to Environment Variables**
   ```env
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_ORGANIZATION_ID=your_org_id
   LINKEDIN_REDIRECT_URI=https://yourapp.com/api/auth/linkedin/callback
   ```

### Implementation Example

```typescript
// lib/linkedin.ts
import axios from 'axios';

export async function postToLinkedIn(
  accessToken: string,
  content: string,
  organizationId: string
) {
  const url = 'https://api.linkedin.com/v2/ugcPosts';

  const data = {
    author: `urn:li:organization:${organizationId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting to LinkedIn:', error);
    throw error;
  }
}
```

### Rate Limits

- UGC Posts: 100 posts per user per day
- Organization posts: Determined by LinkedIn

---

## Instagram API Integration

### Prerequisites

- Facebook Developer Account
- Instagram Business Account
- Facebook Page connected to Instagram account

### Setup Steps

1. **Create Facebook App**
   - Visit [Facebook Developers](https://developers.facebook.com)
   - Create a new app (Business type)
   - Add Instagram Graph API product

2. **Get Required Permissions**
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_manage_posts`

3. **Get API Credentials**
   - App ID
   - App Secret
   - Access Token (long-lived)
   - Instagram Business Account ID

4. **Add to Environment Variables**
   ```env
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   INSTAGRAM_ACCESS_TOKEN=your_access_token
   INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
   ```

### Implementation Example

```typescript
// lib/instagram.ts
import axios from 'axios';

export async function postToInstagram(
  accessToken: string,
  accountId: string,
  imageUrl: string,
  caption: string
) {
  try {
    // Step 1: Create media container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }
    );

    const creationId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
      {
        creation_id: creationId,
        access_token: accessToken,
      }
    );

    return publishResponse.data;
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    throw error;
  }
}
```

### Rate Limits

- Content Publishing: 25 API calls per user per 24 hours
- Media upload size: 8MB (photos), 100MB (videos)

---

## AI Services Integration

### OpenAI API (for Caption Generation)

1. **Get API Key**
   - Visit [OpenAI Platform](https://platform.openai.com)
   - Create an API key

2. **Add to Environment Variables**
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Implementation Example**

```typescript
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaptions(topic: string, count: number = 4) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a social media expert for University of Michigan Engineering. Generate engaging, professional captions that highlight innovation and excellence.',
        },
        {
          role: 'user',
          content: `Generate ${count} different social media captions about: ${topic}. Include relevant hashtags like #UMichEngineering.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Twitter/X
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
TWITTER_BEARER_TOKEN=

# LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_REDIRECT_URI=

# Instagram/Facebook
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=

# OpenAI
OPENAI_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/social_hub
```

---

## Testing API Connections

### Test Script

Create `scripts/test-apis.ts`:

```typescript
import { testTwitterConnection } from '@/lib/twitter';
import { testLinkedInConnection } from '@/lib/linkedin';
import { testInstagramConnection } from '@/lib/instagram';

async function testAllConnections() {
  console.log('Testing API connections...\n');

  // Test Twitter
  try {
    await testTwitterConnection();
    console.log('✓ Twitter API: Connected');
  } catch (error) {
    console.error('✗ Twitter API: Failed', error);
  }

  // Test LinkedIn
  try {
    await testLinkedInConnection();
    console.log('✓ LinkedIn API: Connected');
  } catch (error) {
    console.error('✗ LinkedIn API: Failed', error);
  }

  // Test Instagram
  try {
    await testInstagramConnection();
    console.log('✓ Instagram API: Connected');
  } catch (error) {
    console.error('✗ Instagram API: Failed', error);
  }
}

testAllConnections();
```

Run with: `npx tsx scripts/test-apis.ts`

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Rotate credentials regularly** - Update tokens every 90 days
3. **Use separate credentials** for development and production
4. **Implement rate limiting** in your application
5. **Monitor API usage** to detect unusual activity
6. **Use HTTPS** for all API communications
7. **Validate and sanitize** all user input before posting

---

## Troubleshooting

### Common Issues

**"Invalid credentials" error**
- Verify all environment variables are set correctly
- Check if access tokens have expired
- Ensure API permissions are properly configured

**"Rate limit exceeded" error**
- Implement exponential backoff
- Queue posts instead of immediate publishing
- Monitor and log API usage

**"Media upload failed" error**
- Check file size limits
- Verify media format is supported
- Ensure media URL is publicly accessible (for Instagram)

---

## Additional Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

## Support

For issues or questions regarding API integration, contact:
- Technical Support: support@umich.edu
- Developer Documentation: [internal wiki link]
