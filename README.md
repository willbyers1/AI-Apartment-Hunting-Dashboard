<div align="center">

# 🏠 AptHunter AI

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge) ![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)

</div>

> An AI-powered apartment hunting dashboard with interactive split-view mapping, dynamic compatibility scoring, side-by-side listing comparison, and automated hidden red-flag detection.

---

## 🚀 Features

- 🎛️ **Priority Weighting Control Panel**: Fine-tune budget sliders, commute duration limits, neighborhood selections, and custom importance weightings (e.g., Budget: Critical, Commute: High).
- 🗺️ **Synchronized Split-View Dashboard**: Dual-pane layout featuring interactive Google Maps synchronization with listing cards, dynamic map markers, and auto-scroll highlighting.
- ⚖️ **Side-by-Side Comparison Engine**: Compare up to 4 listings simultaneously across key metrics like $/sqft, deposit ratios, and commute times with emerald/rose delta badge highlights.
- 🚩 **Automated AI Audit & Red Flag Detector**: Leverages OpenAI `gpt-4o` structured outputs to uncover strict lease terms, unrealistic deposits, hidden maintenance costs, and noise risks.
- 📊 **Dynamic Match Scoring**: Server-driven compatibility engine generating 0–100% fit scores, custom pros/cons lists, and concise executive recommendations.
- 📱 **Adaptive Desktop & Mobile Layout**: Responsive split screen that collapses gracefully into interactive tabbed views for seamless mobile browsing.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Maps Integration**: [Google Maps JavaScript API](https://developers.google.com/maps) & [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- **AI Engine**: [OpenAI SDK](https://github.com/openai/openai-node) (`gpt-4o` / `gpt-4o-mini` with Zod Structured Outputs)
- **State & Form Management**: [Zustand](https://zustand-demo.pmnd.rs/), [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

---

## ⚡ Quick Start & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/apthunter-ai.git
   cd apthunter-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure your credentials (see section below).
   ```bash
   cp .env.example .env
   ```

4. **Database setup and seeding**:
   Generate Prisma client, push database migrations, and run the seed script:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables & Setup

Create a `.env` file in the root directory with the following keys:

```env
# Database Connection (PostgreSQL / Supabase / Neon)
DATABASE_URL="postgresql://user:password@localhost:5432/apthunter?schema=public"

# OpenAI API Configuration
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyYourGoogleMapsApiKey"
```

> 🔒 **Security Note**: Never expose your `OPENAI_API_KEY` or database credentials in client-side bundles. The `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` should be restricted by HTTP referrer in your Google Cloud Console.

---

## 🔄 How It Works

1. **Input Preferences**: Set target monthly budget, preferred neighborhoods, minimum square footage, and commute addresses.
2. **Weight Priorities**: Assign relative importance (Critical, High, Medium, Low) to budget, commute, and amenities to customize AI scoring.
3. **Explore Dashboard**: Browse color-coded map pins alongside matching listing cards. Hover over listings to automatically highlight corresponding map locations.
4. **Run AI Audit**: Trigger an automated server-side audit on any listing. The AI analyzes lease terms, descriptions, and pricing structures for hidden red flags.
5. **Compare Properties**: Queue up to 4 listings into the side-by-side comparison drawer to inspect spec differentials and financial breakdowns.

---

## 📦 Building for Production

To build the application for production deployment:

```bash
npm run build
npm run start
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Created By Mert Batu BULBUL**
* 🎓 AI Engineering & Full Stack Developer * 💻 React *

**Don't forget to star ⭐ this repo if you found it useful!**

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page. PRs are highly encouraged.
