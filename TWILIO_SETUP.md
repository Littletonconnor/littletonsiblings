# Twilio SMS Setup Guide

This guide will walk you through setting up Twilio for Phase 2 SMS notifications.

## What You'll Get

- 📅 **Weekly Reminders** (Mondays at 9 AM): Sends SMS if someone hasn't checked in for over a week
- 📊 **Sunday Summaries** (Sundays at 6 PM): Sends a formatted summary of everyone's latest updates

## Step 1: Create a Twilio Account

1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Verify your email and phone number

## Step 2: Get Your Credentials

After signing up, you'll be taken to the Twilio Console.

### Account SID and Auth Token

1. On the Twilio Console homepage, you'll see:
   - **Account SID** (starts with "AC")
   - **Auth Token** (click the eye icon to reveal)
2. Copy both of these - you'll need them for your environment variables

### Get a Phone Number

1. In the Twilio Console, go to **Phone Numbers** > **Manage** > **Buy a number**
2. Choose a country (US is easiest)
3. Search for an available number
4. Click **Buy** (free with trial account)
5. Copy your new Twilio phone number (format: +1234567890)

**Trial Account Note**: With a trial account, you can only send SMS to verified phone numbers. You'll need to verify each family member's number in the Twilio Console.

### Verify Phone Numbers (Trial Only)

1. Go to **Phone Numbers** > **Manage** > **Verified Caller IDs**
2. Click **Add a new number**
3. Enter each family member's phone number
4. They'll receive a verification code via SMS
5. Enter the code to verify

**Important**: Once you verify the numbers, you can send them messages. When you're ready to go to production, you can upgrade your account to remove this restriction.

## Step 3: Configure Environment Variables

Add these to your `.env.local` file (local development) and Vercel dashboard (production):

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
FAMILY_GROUP_NUMBERS=+1234567890,+0987654321,+1111111111
CRON_SECRET=your_random_secret_here
```

### Environment Variable Descriptions

- `TWILIO_ACCOUNT_SID`: Your Account SID from the Twilio Console
- `TWILIO_AUTH_TOKEN`: Your Auth Token from the Twilio Console
- `TWILIO_PHONE_NUMBER`: The phone number you purchased from Twilio
- `FAMILY_GROUP_NUMBERS`: Comma-separated list of family members' phone numbers (must be verified if using trial account)
- `CRON_SECRET`: A random secret to protect your cron endpoints (generate with `openssl rand -base64 32`)

## Step 4: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each of the environment variables above
4. Redeploy your application

## Step 5: Test the Endpoints

You can manually test the cron endpoints:

### Test Weekly Reminder Check

```bash
curl -H "Authorization: Bearer your_cron_secret" \
  https://littletonsiblings.com/api/cron/check-reminders
```

### Test Weekly Summary

```bash
curl -H "Authorization: Bearer your_cron_secret" \
  https://littletonsiblings.com/api/cron/weekly-summary
```

## Cron Schedule

The cron jobs are configured in `vercel.json`:

- **check-reminders**: `0 9 * * 1` (Every Monday at 9:00 AM)
- **weekly-summary**: `0 18 * * 0` (Every Sunday at 6:00 PM)

You can adjust these schedules by modifying the cron expression in `vercel.json`.

### Cron Expression Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (0 and 7 are Sunday)
│ │ │ │ │
* * * * *
```

Examples:
- `0 9 * * 1` = Monday at 9:00 AM
- `0 18 * * 0` = Sunday at 6:00 PM
- `0 12 * * *` = Every day at noon

## Troubleshooting

### SMS Not Sending

1. **Check Twilio Console Logs**
   - Go to **Monitor** > **Logs** > **Messages**
   - Look for error messages

2. **Verify Phone Numbers**
   - If using trial account, ensure all numbers are verified
   - Check that numbers are in E.164 format (+1234567890)

3. **Check Environment Variables**
   - Verify all Twilio variables are set correctly in Vercel
   - Make sure there are no spaces in the credentials

### Cron Jobs Not Running

1. **Check Vercel Logs**
   - Go to your Vercel project > **Deployments** > click on latest deployment > **Functions**
   - Look for cron function logs

2. **Verify Cron Secret**
   - Make sure `CRON_SECRET` is set in both local and production environments

3. **Test Manually**
   - Use the curl commands above to test the endpoints manually
   - Check the response for error messages

### Trial Account Limitations

- **Message Limit**: Trial accounts can send a limited number of messages
- **Verified Numbers Only**: You can only send to verified numbers
- **Twilio Branding**: Messages include "Sent from your Twilio trial account"

**To remove limitations**: Upgrade your Twilio account
- Go to **Billing** in Twilio Console
- Add payment method
- Upgrade to a paid account ($0.0079 per SMS sent in the US)

## Cost Estimate

Once you upgrade from the trial:
- **SMS Cost**: ~$0.0079 per message sent (US)
- **Phone Number**: ~$1.15/month for a US phone number
- **Monthly Estimate**: If you have 4 family members and send 2 messages/week to each:
  - 4 numbers × 2 messages/week × 4 weeks = 32 messages
  - 32 × $0.0079 = $0.25/month + $1.15 = **~$1.40/month total**

## Need Help?

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio SMS Quickstart](https://www.twilio.com/docs/sms/quickstart)
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)

## Security Notes

- Never commit your `.env.local` file to git
- Keep your Auth Token secret
- Use the `CRON_SECRET` to protect your endpoints
- Consider rotating your Auth Token periodically

