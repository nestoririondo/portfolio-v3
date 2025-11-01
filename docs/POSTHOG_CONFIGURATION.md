# PostHog Configuration and Development Setup

This document explains how PostHog tracking is configured to avoid localhost/development traffic while maintaining production analytics.

## Current Configuration

### Automatic Filtering
PostHog tracking is automatically disabled in the following scenarios:

1. **Development Environment**: `NODE_ENV === "development"`
2. **Localhost/Local IPs**: 
   - `localhost`
   - `127.0.0.1`
   - `192.168.*` (local network)
   - `10.*` (private network)
   - `*.local` (mDNS domains)
   - `*.ngrok.*` (tunneling)
   - Vercel preview deployments (`*git-*.vercel.app`)

### Manual Controls
You can manually control PostHog tracking with environment variables:

```bash
# Force disable PostHog even in production
NEXT_PUBLIC_DISABLE_POSTHOG=true

# Override environment detection (useful for staging)
NEXT_PUBLIC_ENVIRONMENT_OVERRIDE=development
```

## Environment Setup

### For Local Development
1. Copy `.env.local.example` to `.env.local`
2. Add your PostHog credentials:
   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```

### For Staging Environment
If you want to disable tracking on staging servers:
```bash
NEXT_PUBLIC_ENVIRONMENT_OVERRIDE=development
```

### For Production
Ensure these variables are NOT set (or set to false):
```bash
NEXT_PUBLIC_DISABLE_POSTHOG=false
NEXT_PUBLIC_ENVIRONMENT_OVERRIDE=
```

## Usage in Code

### Safe Event Tracking
Use the provided wrapper functions instead of direct PostHog calls:

```typescript
import { trackEvent, identifyUser, setUserProperties } from '@/lib/posthog';

// Track custom events
trackEvent('button_clicked', { button_name: 'contact_form' });

// Identify users
identifyUser('user_123', { email: 'user@example.com' });

// Set user properties
setUserProperties({ plan: 'premium' });
```

### Direct PostHog Access
If you need direct access, always check if it's loaded:

```typescript
import { posthog } from '@/lib/posthog';

if (typeof window !== "undefined" && posthog.__loaded) {
  posthog.capture('custom_event');
}
```

## Console Messages

When tracking is disabled, you'll see console messages explaining why:

- `"PostHog tracking disabled in development environment"`
- `"PostHog tracking disabled for localhost/local development"`
- `"PostHog tracking manually disabled via environment variable"`
- `"PostHog tracking disabled via environment override"`

## PostHog Dashboard Configuration

### Server-Side Filtering (Backup)
As an additional safeguard, you can set up filters in your PostHog dashboard:

1. Go to Project Settings → Data Management → Properties
2. Create a filter to exclude events where:
   - `$current_url` contains `localhost`
   - `$current_url` contains `127.0.0.1`
   - `$current_url` contains `192.168`
   - `$current_url` contains `.local`
   - `$current_url` contains `ngrok`

### Test Account Filtering
You can also set up test account filtering:

1. Go to Project Settings → Test Account Filters
2. Add filters for your development/test user emails or IDs

## Verification

### Check if Tracking is Working
1. Open browser dev tools
2. Go to Network tab
3. Visit your site
4. Look for requests to PostHog (`i.posthog.com` or your custom host)
5. In development, you should see NO PostHog requests
6. In production, you should see PostHog requests

### Console Verification
Check the browser console for PostHog status messages to confirm tracking state.

## Troubleshooting

### Tracking Still Happening in Development
1. Check browser console for PostHog messages
2. Verify `NODE_ENV=development` is set
3. Check if you're accessing via a non-localhost domain
4. Add manual disable flag: `NEXT_PUBLIC_DISABLE_POSTHOG=true`

### Tracking Not Working in Production
1. Verify PostHog credentials are set correctly
2. Check that disable flags are not set
3. Ensure domain is not matching localhost patterns
4. Check PostHog dashboard for data

### Mixed Environments
For staging environments that use production builds:
```bash
NEXT_PUBLIC_ENVIRONMENT_OVERRIDE=development
```

## Security Notes

- PostHog keys are public by nature (client-side tracking)
- Sensitive tracking should use server-side PostHog SDK
- Always use HTTPS for PostHog endpoints in production
- Consider implementing CSP headers for additional security