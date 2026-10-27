import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Route: AI Room Recommendation
 * Suggests the best starting room based on user background, skill level, and interests.
 */
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { experienceLevel, interestArea, goals } = req.body;

    const prompt = `Du bist RootAdvisor, der sympathische und hochkompetente KI-Cybersecurity-Mentor der Plattform "RootForge" (einer 100% kostenfreien TryHackMe-Alternative ohne Abogrenzen).
Ein neuer Nutzer möchte wissen, mit welchem Raum er starten soll.
Hier sind die Angaben des Nutzers:
- Erfahrungsstufe: ${experienceLevel || 'Einsteiger'}
- Interessengebiet: ${interestArea || 'Web & Netzwerke'}
- Ziel: ${goals || 'Praktische Pentesting-Skills aufbauen'}

Die verfügbaren Rooms auf der Plattform sind:
1. "tutorial-bootcamp" ("Tutorial: RootForge Bootcamp & Zero-Limit Lab" - Absoluter Start, erklärt AttackBox, Target-Maschinen, Web-Simulator & Flags)
2. "room-network" ("Network Reconnaissance: Nmap & Service Auditing" - Portscans, FTP, Service-Discovery)
3. "room-sqli" ("SQL Injection: Auth Bypass & Data Extraction" - Web Exploitation, ' OR 1=1 --, MySQL-Bypässe)
4. "room-cmdi" ("Command Injection & Remote Code Execution" - Shell Delimiter, Web-Pings, RCE)
5. "room-privesc" ("Linux Privilege Escalation: SUID & Root Access" - SUID-Binaries, GTFOBins, /etc/shadow)
6. "room-crypto" ("Cryptography: Ciphers, Hashes & Cracking" - Base64, MD5, SHA-256, Hashcat/John)
7. "room-ad" ("Active Directory Fundamentals: Kerberos & LDAP" - Windows-Domänen, Kerberoasting)

Empfiehl dem Nutzer genau EINEN primären Raum als optimalen Startpunkt (für Anfänger IMMER das "tutorial-bootcamp" oder "room-network").
Gib eine motivierende, prägnante Begründung in 2-3 kurzen Absätzen auf Deutsch.
Gib am Ende ein klares JSON-Objekt zurück mit folgendem Format:
{
  "recommendedRoomId": "<id aus obiger Liste>",
  "recommendedRoomTitle": "<Titel des Raums>",
  "mentorMessage": "<Deine persönliche, motivierende Nachricht>",
  "firstStepTip": "<Ein konkreter Tipp für den ersten Schritt>"
}`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if no API key is provided
      let fallbackRoomId = 'tutorial-bootcamp';
      let fallbackTitle = 'Tutorial: RootForge Bootcamp & Zero-Limit Lab';
      if (experienceLevel === 'Fortgeschritten' || interestArea === 'Privilege Escalation') {
        fallbackRoomId = 'room-privesc';
        fallbackTitle = 'Linux Privilege Escalation: SUID & Root Access';
      } else if (interestArea === 'Web Exploitation') {
        fallbackRoomId = 'room-sqli';
        fallbackTitle = 'SQL Injection: Auth Bypass & Data Extraction';
      }

      return res.json({
        recommendedRoomId: fallbackRoomId,
        recommendedRoomTitle: fallbackTitle,
        mentorMessage: `Willkommen bei RootForge! Als ${experienceLevel || 'Sicherheits-Enthusiast'} empfehle ich dir direkt den Raum "${fallbackTitle}". Hier lernst du die praxisrelevanten Grundlagen direkt im interaktiven Lab ohne Zeitlimit.`,
        firstStepTip: 'Starte die Target-Maschine und wirf einen Blick in die Aufgabenstellung!',
      });
    }

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 3500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const parsed = JSON.parse(response?.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.warn('Fallback triggered for room recommendation:', error);
    let fallbackRoomId = 'tutorial-bootcamp';
    let fallbackTitle = 'Tutorial: RootForge Bootcamp & Zero-Limit Lab';
    const { interestArea, experienceLevel } = req.body || {};
    if (interestArea?.includes('Web')) {
      fallbackRoomId = 'room-sqli';
      fallbackTitle = 'SQL Injection: Auth Bypass & Data Extraction';
    } else if (interestArea?.includes('Privilege')) {
      fallbackRoomId = 'room-privesc';
      fallbackTitle = 'Linux Privilege Escalation: SUID & Root Access';
    } else if (interestArea?.includes('Netzwerk')) {
      fallbackRoomId = 'room-network';
      fallbackTitle = 'Network Reconnaissance: Nmap & Service Auditing';
    }

    return res.json({
      recommendedRoomId: fallbackRoomId,
      recommendedRoomTitle: fallbackTitle,
      mentorMessage: `Willkommen bei RootForge! Basierend auf deinem Profil (${experienceLevel || 'Enthusiast'}) ist der Raum "${fallbackTitle}" der ideale Startpunkt. Hier arbeitest du direkt in der unbegrenzten Sandbox ohne Abogrenzen.`,
      firstStepTip: 'Starte die kostenfreie Target-Maschine und wirf einen Blick in die Aufgabenstellung!',
    });
  }
});

/**
 * Route: AI Cyber Mentor In-Lab Assistance
 * Helps users when stuck without outright giving away the flag.
 */
app.post('/api/ai/assist', async (req, res) => {
  try {
    const { roomTitle, taskTitle, questionPrompt, userQuestion, previousAttempts } = req.body;

    const prompt = `Du bist RootAdvisor, ein didaktisch hervorragender, einfühlsamer Cybersecurity-Tutor für Einsteiger und Fortgeschrittene auf RootForge.
Der Benutzer bearbeitet gerade ein Hands-on Lab und kommt bei einer Aufgabe nicht weiter oder bittet um eine einfache Erklärung.

Kontext:
- Raum: ${roomTitle || 'Unbekannt'}
- Aktuelle Aufgabe: ${taskTitle || 'Allgemein'}
- Frage / Ziel: ${questionPrompt || 'Nicht angegeben'}
- Was der Benutzer fragt: "${userQuestion}"
${previousAttempts ? `- Bisherige Versuche des Nutzers: "${previousAttempts}"` : ''}

Deine Aufgabe als Mentor für absolute Anfänger:
1. Erkläre alles extrem verständlich auf Deutsch, ohne einschüchterndes Fachchinesisch.
2. Wenn Fachbegriffe vorkommen, übersetze sie sofort mit einfachen Alltags-Metaphern (z. B. IP-Adresse = Telefonnummer des Computers, Port = Eingangstür, Terminal = Befehls-Textfenster, Flagge = geheimer Lösungscode/Schatz).
3. Gib eine konkrete Schritt-für-Schritt-Anleitung: Was soll der Nutzer als Nächstes tun (welchen Button klicken oder welchen Befehl wie whoami oder nmap ausführen)?
4. VERRATE NICHT direkt die finale Flagge (wie THM{...}), sondern zeige ihm den genauen Weg, wie er sie mit einem Klick oder Befehl selbst findet.
5. Halte die Antwort motivierend, warmherzig und übersichtlich mit Aufzählungspunkten.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        advice: `💡 **Tipp vom Cyber-Mentor:**\n\nSchau dir bei der Aufgabe "${taskTitle || roomTitle}" die Fehlermeldungen und Ports genau an. Wenn du im Terminal bist, teste z.B. einen gezielten Scan oder überprüfe, ob der Server auf bestimmte Zeichenfolgen anders reagiert.\n\nNutze auch den kostenlosen Hinweis-Button im Lab für zusätzliche Details!`,
      });
    }

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 3500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    return res.json({
      advice: response?.text || 'Hier ist ein Denkanstoß: Überprüfe die offenen Ports und den Quelltext der Anwendung.',
    });
  } catch (error) {
    console.warn('Fallback in AI mentor assistance:', error);
    const { roomTitle, taskTitle } = req.body || {};
    return res.json({
      advice: `💡 **Tipp vom Cyber-Mentor (${roomTitle || 'Lab'}):**\n\nSchau dir bei "${taskTitle || 'dieser Aufgabe'}" die genaue Fragestellung und die Systemreaktion an. Nutze im Terminal gezielte Befehle (wie \`nmap\`, \`curl\` oder \`find\`) und teste im Target-Browser die Eingabefelder auf ungewöhnliches Verhalten.`,
    });
  }
});

// Setup Vite dev server middlewares or static dist
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
