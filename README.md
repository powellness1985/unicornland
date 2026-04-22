# Unicorn Land — A Game by Waverly Powell (age 6)

A web game designed by my 6-year-old daughter Waverly from voice memo interviews, built by her dad using Claude Code. Part of the chrispowell.ai portfolio as a demonstration of voice-to-product AI-assisted development workflow with privacy-safe telemetry for data-driven iteration.

## The Story

Waverly designed this game entirely in voice memo interviews. From her imagination came Fruity the winged unicorn, the magical popsicle, Firey the silly dragon, and the philosophy that *"Fruity never gives up, even in the rain."*

This project demonstrates the full cycle:
1. **Voice memo → transcript**: Capture a child's creative vision
2. **Claude-assisted build**: Translate imagination into a playable game
3. **Deployment**: Ship a real product to the web
4. **Data-driven iteration**: Use anonymous play telemetry to improve the experience

## Design Philosophy

- **No losing states, no game over**: Pure sandbox delight and creative play
- **Encouragement-driven**: Original phrases inspired by (but never copying) Gabby's Dollhouse, Daniel Tiger, Sesame Street, and Bluey
- **Resilience-building through play**: Themes of persistence, growth mindset, and celebrating mistakes
- **Birthday gift**: Built for Waverly's 6th birthday in a single day with Claude Code

## Privacy

This game collects anonymous play data (balloon pops, session length, device type) to help improve the experience. **No personal information, IP addresses, or identifying data is ever collected or stored.** Each session gets a random anonymous ID.

## How to Play

- **Tap anywhere** to make Fruity fly
- **Tap balloons** (or fly into them) to pop them
- Popping balloons releases glitter that colors the world and candy for animals to eat
- Every ~30 seconds, Firey the dragon appears — tap him 3 times to transform him from shy to silly
- Listen for encouragement messages throughout play
- It's always raining, but Fruity never gives up

## Tech Stack

- **Frontend**: Single `index.html` file, no build step
- **Game engine**: Kaboom.js via CDN
- **Typography**: Google Fonts Fredoka
- **Backend**: Vercel Serverless Functions
- **Telemetry**: Vercel KV (or Postgres)
- **Deployment**: Vercel

## Local Development

```bash
# Simply open in browser
open index.html

# Or serve locally
npx http-server
```

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Deploy

### Setting up Vercel KV

1. Go to vercel.com → Storage → Create KV Database
2. Copy the REST API URL and token
3. Add to `.env` and deploy

### Connecting the Subdomain

1. In Vercel, set domain to `unicornland.chrispowell.ai`
2. Update DNS at your domain registrar to point to Vercel nameservers

## Credits

- **Game design**: Waverly Powell (age 6)
- **Development**: Chris Powell with Claude Code
- **Encouragement philosophy**: Inspired by Gabby's Dollhouse, Daniel Tiger's Neighborhood, Sesame Street, and Bluey

---

*Built with ❤️ and Claude Code for Waverly's birthday. 🦄🌧️🌈✨*
