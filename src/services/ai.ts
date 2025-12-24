import { Carousel, Slide } from '../types/carousel';

interface GeneratedContent {
  title: string;
  slides: Omit<Slide, 'id' | 'carousel_id' | 'created_at' | 'updated_at'>[];
  hashtags: string[];
}

const CAROUSEL_PROMPT = `You are a marketing growth expert analyzing apps, products, and strategies. Create a compelling LinkedIn carousel about {subject} with a STRONG FOCUS on marketing strategies and growth tactics.

MARKETING FOCUS AREAS:
- Growth hacking tactics and viral loops
- Customer acquisition strategies and channels
- Marketing campaigns and their impact
- Branding and positioning strategies
- Content marketing and social media approach
- Referral programs and incentives
- Paid advertising strategies (Facebook, Google, TikTok, etc.)
- Influencer marketing and partnerships
- Retention marketing and lifecycle campaigns
- A/B testing and conversion optimization
- Performance metrics (CTR, CPA, ROAS, LTV/CAC)
- Scaling strategies and frameworks

Structure:
- Slide 1 (cover): Catchy title about the subject
- Slides 2-{n-2} (content): Deep dive into strategies, tactics, insights, and growth techniques
- Slide {n-1} (cta): Key takeaways and actionable insights
- Slide {n} (subscribe): Engagement slide (will be auto-generated)

Each content slide should have:
- A punchy, focused title (max 6 words)
- 3-5 bullet points explaining tactics or insights (max 80 chars each)
- Include growth metrics, data points, or specific examples when possible
- MAXIMUM 2 SENTENCES per bullet point or paragraph
- After each sentence, add 2 line breaks for clear visual spacing

Make it marketing-centric, data-driven, and focused on GROWTH TACTICS that entrepreneurs and marketers can learn from.`;

const LANGUAGE_INSTRUCTIONS = {
  fr: 'IMPORTANT: Write ALL content in FRENCH (français). All titles, subtitles, bullets, and text must be in French.',
  en: 'IMPORTANT: Write ALL content in ENGLISH. All titles, subtitles, bullets, and text must be in English.'
};

function createPrompt(subject: string, slideCount: number, language: string, contentFormat: string, contentLength: string, sources?: string, isAutoMode?: boolean): string {
  let prompt = CAROUSEL_PROMPT
    .replace('{subject}', subject)
    .replace('{n}', slideCount.toString())
    .replace('{n-1}', (slideCount - 1).toString())
    .replace('{n-2}', (slideCount - 2).toString());

  const languageInstruction = LANGUAGE_INSTRUCTIONS[language as keyof typeof LANGUAGE_INSTRUCTIONS] || LANGUAGE_INSTRUCTIONS.fr;
  prompt = `${languageInstruction}\n\n${prompt}`;

  // Add content length instructions
  const lengthInstructions = {
    short: 'Keep content concise and punchy. Paragraphs: 2-3 lines max. Bullets: 2-3 items, very brief.',
    medium: 'Balanced content length. Paragraphs: 3-4 lines. Bullets: 3-4 items with moderate detail.',
    long: 'Detailed and comprehensive content. Paragraphs: 4-6 lines. Bullets: 4-5 items with full explanations.',
    auto: 'Choose the optimal content length based on the complexity of each point.'
  };

  prompt += `\n\nCONTENT LENGTH: ${lengthInstructions[contentLength as keyof typeof lengthInstructions] || lengthInstructions.auto}`;

  // Add content format instructions
  if (contentFormat === 'paragraph') {
    prompt += `\n\nCONTENT FORMAT - PARAGRAPH:
For content slides, use the "content" field (not "bullets") to write fluid prose text.
Write in a natural, conversational style. Make content digestible and well-spaced.
Use **bold** for important words or key terms (use markdown bold syntax).
NEVER use apostrophes or quotation marks around words.
CRITICAL: MAXIMUM 2 SENTENCES per paragraph. After EACH sentence, add 2 line breaks (\\n\\n) for clear visual spacing.
Example:
{
  "slide_number": 2,
  "type": "content",
  "title": "Growth Strategy",
  "stats": "500M users in 5 years",
  "content": "Their **viral loop** was genius.\\n\\nEvery user invited 3 friends on average, creating exponential growth."
}`;
  } else {
    prompt += `\n\nCONTENT FORMAT - BULLETS:
For content slides, use the "bullets" array field (not "content") with bullet points.
Make content digestible and well-spaced.
Use **bold** for important words or key terms (use markdown bold syntax).
NEVER use apostrophes or quotation marks around words.
CRITICAL: MAXIMUM 2 SENTENCES per bullet point. If a bullet has 2 sentences, separate them with 2 line breaks (\\n\\n) for clear visual spacing.
Example:
{
  "slide_number": 2,
  "type": "content",
  "title": "Growth Strategy",
  "stats": "500M users in 5 years",
  "bullets": [
    "**Viral loop**: avg 3 friend invites per user.\\n\\nCreated exponential growth.",
    "**Gamification**: 30+ min daily engagement.\\n\\nKept users coming back.",
    "**Social sharing** amplified reach 10x"
  ]
}`;
  }

  if (isAutoMode) {
    prompt += `\n\nAUTO MODE: You can generate between 5 and 12 slides total (including cover, subscribe, and CTA). Choose the optimal number based on the content depth and complexity. Quality over quantity - use as many slides as needed to properly cover the topic without being redundant.`;
  }

  if (sources && sources.trim()) {
    prompt += `\n\nIMPORTANT DATA & SOURCES:\n${sources}\n\nUse these data points and stats in your content where relevant. Make the carousel data-driven and credible.`;
  }

  return prompt;
}

export async function generateCarouselContent(
  subject: string,
  slideCount: number,
  language: string,
  contentFormat: string,
  contentLength: string,
  contentStyle: string,
  sources?: string,
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> {
  onProgress?.(10, 'Analyzing subject...');

  await new Promise(resolve => setTimeout(resolve, 1000));

  onProgress?.(30, 'Researching insights...');

  await new Promise(resolve => setTimeout(resolve, 1500));

  onProgress?.(50, 'Structuring content...');

  const prompt = createPrompt(subject, slideCount, language, contentFormat, contentLength, sources, false);

  const systemPrompt = `You are an expert LinkedIn content creator. Generate carousel content in valid JSON format only.

Return a JSON object with this exact structure:
{
  "title": "Main carousel title (max 60 chars)",
  "slides": [
    {
      "slide_number": 1,
      "type": "cover",
      "title": "Main title",
      "subtitle": "Subtitle or tagline",
      "is_edited": false
    },
    {
      "slide_number": 2,
      "type": "content",
      "title": "Slide title",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
      "stats": "Optional stat or number",
      "is_edited": false
    },
    OR for paragraph format:
    {
      "slide_number": 2,
      "type": "content",
      "title": "Slide title",
      "content": "Fluid prose text of 4-5 lines in natural, conversational style",
      "stats": "Optional stat or number",
      "is_edited": false
    }
  ],
  "hashtags": ["#Hashtag1", "#Hashtag2"]
}

IMPORTANT: Content slides should have EITHER "bullets" (array) OR "content" (string), not both.
IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.`;

  try {
    onProgress?.(70, 'Generating slides...');

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-carousel`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt: prompt,
        subject,
        slideCount
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Edge function error:', response.status, errorData);
      throw new Error(`AI generation failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('AI error from edge function:', data.error);
      throw new Error(data.error);
    }

    const content = data.content;

    if (!content) {
      console.error('No content in response:', data);
      throw new Error('Empty response from AI');
    }

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = content;
    const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }

    const result = JSON.parse(jsonStr);

    // Validate response structure
    if (!result.title || !Array.isArray(result.slides) || !Array.isArray(result.hashtags)) {
      console.error('Invalid response structure:', result);
      throw new Error('Invalid response structure from AI');
    }

    // Validate slides
    if (result.slides.length !== slideCount - 1) {
      console.warn(`Expected ${slideCount - 1} slides, got ${result.slides.length}`);
    }

    // Transform slides if split style is selected
    if (contentStyle === 'split') {
      const transformedSlides: any[] = [];
      let slideNumber = 1;

      for (const slide of result.slides) {
        if (slide.type === 'content') {
          transformedSlides.push({
            slide_number: slideNumber++,
            type: 'title' as any,
            title: slide.title,
            stats: slide.stats,
            is_edited: false
          });

          transformedSlides.push({
            slide_number: slideNumber++,
            type: 'content',
            content: slide.content || slide.bullets?.join('\n\n') || '',
            is_edited: false
          });
        } else {
          transformedSlides.push({
            ...slide,
            slide_number: slideNumber++
          });
        }
      }

      result.slides = transformedSlides;
    }

    // Add subscribe slide at the end
    const finalSlideNumber = result.slides.length + 1;
    result.slides.push({
      slide_number: finalSlideNumber,
      type: 'subscribe' as any,
      title: 'Found this useful?',
      is_edited: false
    });

    onProgress?.(90, 'Creating visuals...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    onProgress?.(100, 'Complete!');

    return result;

  } catch (error) {
    console.error('Generation error:', error);
    return generateFallbackContent(subject, slideCount, language, contentFormat, contentLength, contentStyle, sources);
  }
}

function generateFallbackContent(
  subject: string,
  slideCount: number,
  language: string,
  contentFormat: string,
  contentLength: string,
  contentStyle: string,
  sources?: string
): GeneratedContent {
  const slides: Omit<Slide, 'id' | 'carousel_id' | 'created_at' | 'updated_at'>[] = [
    {
      slide_number: 1,
      type: 'cover',
      title: `How ${subject}`,
      subtitle: 'Built a Winning Strategy',
      is_edited: false
    }
  ];

  for (let i = 2; i < slideCount - 1; i++) {
    slides.push({
      slide_number: i,
      type: 'content',
      title: `Key Insight ${i - 1}`,
      bullets: [
        `Important point about ${subject}`,
        'Strategic approach that worked',
        'Results and impact achieved'
      ],
      stats: i === 2 ? 'Founded in 2010' : undefined,
      is_edited: false
    });
  }

  slides.push({
    slide_number: slideCount - 1,
    type: 'cta',
    title: 'Key Takeaway',
    bullets: [
      'Apply these insights to your strategy',
      'Follow for more content like this',
      'What did you learn from this?'
    ],
    is_edited: false
  });

  slides.push({
    slide_number: slideCount,
    type: 'subscribe' as any,
    title: 'Found this useful?',
    is_edited: false
  });

  return {
    title: `How ${subject} Built a Winning Strategy`,
    slides,
    hashtags: ['#Strategy', '#Business', '#Growth']
  };
}

export async function regenerateSlide(
  carousel: Carousel,
  slide: Slide,
  totalSlides: number,
  userGuidance?: string
): Promise<Partial<Slide>> {
  const languageInstruction = LANGUAGE_INSTRUCTIONS[carousel.language as keyof typeof LANGUAGE_INSTRUCTIONS] || LANGUAGE_INSTRUCTIONS.fr;

  const lengthInstructions = {
    short: 'Keep content concise and punchy. Paragraphs: 2-3 lines max. Bullets: 2-3 items, very brief.',
    medium: 'Balanced content length. Paragraphs: 3-4 lines. Bullets: 3-4 items with moderate detail.',
    long: 'Detailed and comprehensive content. Paragraphs: 4-6 lines. Bullets: 4-5 items with full explanations.',
    auto: 'Choose the optimal content length based on the complexity of each point.'
  };

  let prompt = `${languageInstruction}

You are regenerating slide ${slide.slide_number} of a ${totalSlides}-slide LinkedIn carousel about: ${carousel.subject}

This is a CONTENT slide focused on marketing and growth strategies.

CONTENT LENGTH: ${lengthInstructions[carousel.content_length as keyof typeof lengthInstructions] || lengthInstructions.auto}

Current slide title: "${slide.title}"

Generate a NEW version of this slide with DIFFERENT content but maintaining the marketing and growth focus. Make it fresh and insightful.`;

  if (userGuidance && userGuidance.trim()) {
    prompt += `\n\nUSER GUIDANCE: ${userGuidance}\n\nIMPORTANT: Follow the user's guidance above when regenerating the content.`;
  }

  if (carousel.content_format === 'paragraph') {
    prompt += `\n\nCONTENT FORMAT - PARAGRAPH:
Use the "content" field (not "bullets") to write fluid prose text.
Write in a natural, conversational style. Make content digestible and well-spaced.
Use **bold** for important words or key terms (use markdown bold syntax).
NEVER use apostrophes or quotation marks around words.
CRITICAL: MAXIMUM 2 SENTENCES per paragraph. After EACH sentence, add 2 line breaks (\\n\\n) for clear visual spacing.`;
  } else {
    prompt += `\n\nCONTENT FORMAT - BULLETS:
Use the "bullets" array field (not "content") with bullet points.
Make content digestible and well-spaced.
Use **bold** for important words or key terms (use markdown bold syntax).
NEVER use apostrophes or quotation marks around words.
CRITICAL: MAXIMUM 2 SENTENCES per bullet point. If a bullet has 2 sentences, separate them with 2 line breaks (\\n\\n) for clear visual spacing.`;
  }

  if (carousel.sources && carousel.sources.trim()) {
    prompt += `\n\nIMPORTANT DATA & SOURCES:\n${carousel.sources}\n\nUse these data points and stats in your content where relevant.`;
  }

  const systemPrompt = `You are an expert LinkedIn content creator. Generate a single slide in valid JSON format only.

Return a JSON object with this exact structure:
{
  "title": "Slide title (max 6 words)",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "stats": "Optional stat or number"
}

OR for paragraph format:
{
  "title": "Slide title (max 6 words)",
  "content": "Fluid prose text of 4-5 lines",
  "stats": "Optional stat or number"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.`;

  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-carousel`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt: prompt,
        subject: carousel.subject,
        slideCount: 1
      })
    });

    if (!response.ok) {
      throw new Error('Failed to regenerate slide');
    }

    const data = await response.json();
    const content = data.content;

    let jsonStr = content;
    const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }

    const result = JSON.parse(jsonStr);

    return {
      title: result.title,
      subtitle: result.subtitle,
      bullets: result.bullets,
      stats: result.stats
    };
  } catch (error) {
    console.error('Regeneration error:', error);
    throw error;
  }
}
