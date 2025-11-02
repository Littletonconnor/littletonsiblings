# Littleton Siblings Health Check - Setup Guide

This guide will help you set up the application from scratch.

## Prerequisites

- Node.js 20.9.0 or higher (use nvm: `nvm use`)
- A Supabase account
- Vercel account (for deployment)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (this takes a few minutes)
3. Go to **Project Settings** > **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (for seeding only - keep this secret!)

### Create the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase-schema.sql` and run it
4. This will create the `users` and `updates` tables with proper indexes and security policies

## 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# For seeding only (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

To generate a NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

## 4. Seed the Database

Before seeding, edit `scripts/seed.ts` to add your family members:

```typescript
const users = [
  {
    username: "connor",
    password: "temppass123",  // Change this!
    display_name: "Connor",
  },
  {
    username: "sarah",
    password: "temppass123",  // Change this!
    display_name: "Sarah",
  },
  // Add more siblings...
];
```

Then run the seed script:

```bash
npx tsx scripts/seed.ts
```

**Important**: The seed script uses temporary passwords. Make sure to change these to secure passwords and share them privately with each sibling.

## 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the same environment variables from your `.env.local` (except SUPABASE_SERVICE_ROLE_KEY)
4. Update `NEXTAUTH_URL` to your production URL (e.g., `https://littletonsiblings.com`)
5. Deploy!

### Domain Setup

1. In Vercel, go to your project settings > **Domains**
2. Add your custom domain: `littletonsiblings.com`
3. Follow Vercel's instructions to update your DNS settings
4. Update the `NEXTAUTH_URL` environment variable to `https://littletonsiblings.com`

## Testing the API

Once deployed, you can test the healthcheck endpoint:

```bash
curl https://littletonsiblings.com/api/healthcheck
```

This should return a JSON array of the latest updates.

## Phase 2: Twilio SMS

Phase 2 adds SMS notifications for:
- Weekly reminders when someone hasn't checked in (Mondays at 9 AM)
- Sunday summaries sent to the family group chat (Sundays at 6 PM)

### Setting Up Twilio

See [TWILIO_SETUP.md](./TWILIO_SETUP.md) for detailed instructions on:
- Creating a Twilio account
- Getting your credentials
- Configuring phone numbers
- Testing the SMS functionality

Additional environment variables needed:
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
FAMILY_GROUP_NUMBERS=+1234567890,+0987654321
CRON_SECRET=your_random_secret_here
```

## Troubleshooting

### "Invalid login credentials"
- Make sure you've run the seed script
- Verify you're using the correct username/password
- Check Supabase logs in the dashboard

### "Failed to fetch updates"
- Verify your Supabase URL and anon key are correct
- Check that the tables were created successfully
- Look at the browser console for detailed errors

### Database connection issues
- Ensure your Supabase project is active
- Verify the API keys are correct in `.env.local`
- Check that RLS policies are set up correctly

## Need Help?

Check the Supabase dashboard logs and browser console for detailed error messages.
