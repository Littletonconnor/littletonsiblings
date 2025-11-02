# Littleton Siblings Health Check 💙

A cute family health check app where siblings can submit weekly status updates with messages and mood scores.

## Features

- 🔐 Secure login for family members
- 📝 Weekly check-ins with messages and mood ratings (1-4)
- 📊 Public JSON healthcheck endpoint
- 🎨 Beautiful, warm UI with custom color palette
- 📱 Mobile-responsive design

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials
   - Generate a NEXTAUTH_SECRET

3. **Set up the database**
   - Run the SQL schema in your Supabase dashboard
   - See `SETUP.md` for detailed instructions

4. **Seed users**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000)

## Documentation

See [SETUP.md](./SETUP.md) for comprehensive setup instructions, deployment guide, and troubleshooting.

## API Endpoints

### GET /api/healthcheck
Public endpoint that returns the latest update for each user.

**Response:**
```json
[
  {
    "displayName": "Connor",
    "lastUpdatedAt": "2025-11-01T12:00:00Z",
    "message": "Great week! Launched a new project.",
    "score": 4
  }
]
```

### POST /api/updates
Authenticated endpoint to submit a new weekly update.

**Body:**
```json
{
  "message": "Had a great week!",
  "score": 4
}
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Color Palette

- Background: `#fffffe`
- Card: `#faeee7`
- Headline: `#33272a`
- Paragraph: `#594a4e`
- Highlight: `#ff8ba7`
- Secondary: `#ffc6c7`
- Tertiary: `#c3f0ca`

## Deployment

Deploy to Vercel with one click or follow the deployment guide in [SETUP.md](./SETUP.md).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/littletonsiblings-healthcheck)

## Phase 2: SMS Notifications ✅

- 📲 SMS reminders via Twilio for overdue check-ins (Mondays at 9 AM)
- 📅 Weekly family summary messages every Sunday (Sundays at 6 PM)

See [TWILIO_SETUP.md](./TWILIO_SETUP.md) for setup instructions.

### Future Enhancements

- 📈 Historical view of all updates in the UI
- 📊 Analytics dashboard for family check-in trends

## License

Private family project
# littletonsiblings
