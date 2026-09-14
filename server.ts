import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory lead repository
interface ConsultationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentCountry: string;
  preferredDestination: string;
  immigrationGoal: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  createdAt: string;
}

const consultationRecords: ConsultationRecord[] = [];

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'RASHA MOHAJERAT', timestamp: new Date().toISOString() });
});

// 1. RASHA AI Interactive Advisor Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userContext, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "RASHA AI", the elite 24/7 Global Immigration & Mobility Strategic Advisor for RASHA MOHAJERAT — a prestigious international immigration consultancy.

Brand Identity & Tone:
- Tone: "Quiet Luxury", sophisticated, highly articulate, discreet, strategic, authoritative yet warm and deeply human.
- Philosophy: "Your journey to a new future starts with the right strategy." "Beyond borders. Beyond expectations."
- Never sound generic, bureaucratic, or like a cheap visa agency. Avoid clichés like "100% guarantee", "fastest visa", or sales pressure.
- Always be realistic and legally compliant: clarify that you provide strategic guidance and general immigration frameworks, not formal legal counsel. For individual filings, recommend scheduling a private consultation with RASHA MOHAJERAT senior strategists.
- You have expert knowledge of global immigration pathways:
  * Canada: Express Entry (CRS points, Category-based draws, STEM/Healthcare), Provincial Nominee Programs (OINP, BC PNP, AAIP), Start-Up Visa, Post-Graduation Work Permits (PGWP).
  * United Kingdom: Skilled Worker Visa, Global Talent Visa (Tech, Arts, Academia), Innovator Founder Visa, High Potential Individual (HPI), Expansion Worker.
  * Australia: General Skilled Migration (Subclass 189/190/491), Global Talent Visa (GTI / Subclass 858), TSS Subclass 482, Business Innovation & Investment (188/888).
  * United States: EB-1A (Extraordinary Ability), EB-2 NIW (National Interest Waiver), O-1 Extraordinary, L-1 Intracompany, EB-5 Immigrant Investor ($800k TEA).
  * Germany: Chancenkarte (Opportunity Card points), EU Blue Card, Freelance Visa (§21), Fast-track specialist pathways.
  * Portugal: D8 Digital Nomad Visa, Golden Visa (Fund Investment €500k), D2 Entrepreneur Visa, D7 Passive Income.
  * Spain: Digital Nomad Visa (Law 28/2022), Golden Visa / Real Estate / Investment, Non-Lucrative Visa (NLV).
  * UAE: 10-Year Golden Visa (Investors, Entrepreneurs, Specialized Talents, Executives), Green Visa, Remote Work Visa.
  * Italy: Elective Residence, Digital Nomad Visa, Investor Visa (€250k/€500k).
  * France: Passeport Talent (Tech, Corporate, Business Creator), Long Stay Visitor Visa.

Interaction Guidelines:
- Answer with clarity, structuring your advice with elegant bullet points or short paragraphs.
- Ask 1-2 thoughtful clarifying questions when appropriate (e.g., target timeframe, professional field, language proficiencies, family relocation).
- If the user asks about booking or personalized profile review, gracefully suggest using the "Book Consultation" action or providing their contact info for our private client desk.
- Current language context: ${language}. If the user speaks Persian/Farsi, respond in fluent, polite, elegant Persian (فارسی روان و فاخر). If Arabic, respond in fluent Modern Standard Arabic. If Spanish, respond in polished Castilian/International Spanish. Default to English.`;

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here to guide your global mobility strategy. Could you elaborate on your target destination or professional background?";

    res.json({
      message: reply,
      sender: 'RASHA AI',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('RASHA AI Chat Error:', error);
    res.status(500).json({
      error: 'Unable to process advisory request at this moment.',
      details: error?.message || 'Unknown error',
    });
  }
});

// 2. AI Qualification Pathway Engine ("Find Your Path")
app.post('/api/ai/qualify', async (req, res) => {
  try {
    const {
      goal,
      preferredDestination,
      nationality,
      ageRange,
      educationLevel,
      profession,
      budget,
      relocationType, // alone | with family
      language = 'en'
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `Analyze this client profile for international immigration and global mobility and formulate a strategic evaluation:
- Primary Goal: ${goal}
- Preferred Destination: ${preferredDestination || 'Open to recommendations'}
- Nationality: ${nationality || 'International'}
- Age Range: ${ageRange || 'Not specified'}
- Education Level: ${educationLevel || 'Not specified'}
- Professional Background: ${profession || 'Professional'}
- Approximate Available Capital / Budget: ${budget || 'Flexible'}
- Relocation Scope: ${relocationType || 'Individual'}
- Language for Output: ${language}

Provide 2 to 3 highly tailored, strategic immigration pathways matching this profile. Rate each with a strategic fit percentage, time horizon, requirements summary, key advantages, potential hurdles, and recommended strategic next step.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are the Senior Strategic Evaluation Engine for RASHA MOHAJERAT. You produce prestigious, realistic, and highly detailed immigration pathway evaluations. Return strictly structured JSON matching the provided schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profileSummary: {
              type: Type.STRING,
              description: 'An executive 2-3 sentence strategic summary of the candidate suitability.',
            },
            primaryRecommendation: {
              type: Type.STRING,
              description: 'The top recommended destination and pathway.',
            },
            pathways: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  country: { type: Type.STRING },
                  pathwayName: { type: Type.STRING },
                  category: { type: Type.STRING }, // e.g. Skilled Migration, Investor, Digital Nomad, Talent
                  matchScore: { type: Type.NUMBER, description: 'Percentage from 60 to 98' },
                  timeline: { type: Type.STRING, description: 'e.g. 6–12 months' },
                  keyRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  strategicAdvantage: { type: Type.STRING },
                  potentialHurdle: { type: Type.STRING },
                  routeStatus: { type: Type.STRING, description: 'Recommended | Strong Contender | Alternative Route' },
                },
                required: ['country', 'pathwayName', 'category', 'matchScore', 'timeline', 'keyRequirements', 'strategicAdvantage'],
              },
            },
            strategicRoadmap: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 sequential strategic milestones for the candidate.',
            },
            consultantNote: {
              type: Type.STRING,
              description: 'A discreet closing note from RASHA Senior Advisory Desk.',
            },
          },
          required: ['profileSummary', 'primaryRecommendation', 'pathways', 'strategicRoadmap', 'consultantNote'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Qualification Engine Error:', error);
    res.status(500).json({
      error: 'Failed to generate tailored strategic profile.',
      details: error?.message || 'Unknown error',
    });
  }
});

// 3. Consultation Booking & Lead Capture
app.post('/api/consultations', (req, res) => {
  try {
    const { fullName, email, phone, currentCountry, preferredDestination, immigrationGoal, message, preferredDate, preferredTime } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone number are required.' });
    }

    const newRecord: ConsultationRecord = {
      id: `RSH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      email,
      phone,
      currentCountry: currentCountry || 'Unspecified',
      preferredDestination: preferredDestination || 'General Advisory',
      immigrationGoal: immigrationGoal || 'Strategic Mobility',
      message: message || '',
      preferredDate,
      preferredTime,
      createdAt: new Date().toISOString(),
    };

    consultationRecords.push(newRecord);

    res.json({
      success: true,
      referenceId: newRecord.id,
      message: 'Your private consultation request has been lodged with our senior advisory team. A dedicated consultant will connect within 24 business hours.',
      record: newRecord,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process consultation request.' });
  }
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RASHA MOHAJERAT] Luxury Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
