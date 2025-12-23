# CarouselAI - LinkedIn Carousel Generator

An AI-powered tool to create professional LinkedIn carousels in minutes. Generate 10-slide carousels from a simple topic, edit them in real-time, and export as high-quality PDFs.

## Features

- **AI-Powered Generation**: Enter a topic and let AI create compelling carousel content
- **Multiple Templates**: Choose from Breakdown, Case Study, Tips, or Strategy frameworks
- **Real-Time Preview**: See your carousel as it's being generated
- **Easy Editing**: Click any slide to edit text, bullets, and stats
- **PDF Export**: Download high-quality PDFs ready for LinkedIn (1080x1080px)
- **Carousel Management**: Save and manage all your created carousels

## Setup

### 1. Add Your Anthropic API Key

To enable AI generation, you need an Anthropic API key:

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to your `.env` file:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm run dev
```

## How to Use

1. **Create a Carousel**: Click "New Carousel" from the dashboard
2. **Enter Details**:
   - Subject (e.g., "Duolingo", "Notion", "ChatGPT")
   - Choose carousel type (Breakdown, Case Study, Tips, Strategy)
   - Select number of slides (8, 10, or 12)
3. **Generate**: Click "Generate with AI" and watch it create your carousel
4. **Preview & Edit**: Navigate through slides, edit any content you want
5. **Export**: Download your carousel as a PDF ready for LinkedIn

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI**: Anthropic Claude
- **PDF Export**: jsPDF + html2canvas
- **Routing**: React Router

## Features Overview

### Dashboard
- View all your created carousels
- Quick actions: View, Download, Delete
- Empty state for new users

### Generation Screen
- Simple form with topic, type, and slide count
- Real-time validation
- Progress tracking during generation

### Preview & Edit
- Full slide preview with navigation
- Keyboard shortcuts (arrow keys)
- Inline editing modal
- Edit badges on modified slides

### PDF Export
- High-quality 1080x1080px slides
- Optimized file size (<5MB)
- Automatic download
- LinkedIn-ready format

## Database Structure

### Carousels Table
- title, subject, type, status
- slide_count, hashtags, pdf_url
- Timestamps

### Slides Table
- slide_number, type (cover/content/cta)
- title, subtitle, bullets, stats
- is_edited flag
- Foreign key to carousel

## AI Integration

The app uses Anthropic's Claude to generate carousel content. Without an API key, it will fall back to placeholder content. To get the full AI experience:

1. Sign up at [Anthropic](https://console.anthropic.com/)
2. Add your API key to `.env`
3. The AI will generate contextual, insightful carousel content

## Customization

### Slide Design
Edit `src/components/SlideRenderer.tsx` to customize:
- Colors (currently #FF6B35 orange theme)
- Fonts (currently Montserrat)
- Layout and spacing
- Logo and branding

### Carousel Types
Add more types in `src/pages/Generate.tsx` and update prompts in `src/services/ai.ts`.

## Troubleshooting

**"Generation failed"**: Check your Anthropic API key in `.env`

**Slow generation**: AI generation typically takes 10-20 seconds depending on slide count

**PDF not downloading**: Ensure pop-ups are not blocked in your browser

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT
