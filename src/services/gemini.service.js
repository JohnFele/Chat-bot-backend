import axios from 'axios';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

class GeminiService {
  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1'; // ✅ correct API version
    this.model = 'models/gemini-2.0-flash'; // ✅ working model
    this.conversations = new Map();
  }

  getConversationHistory(sessionId) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful and friendly AI assistant. Keep your responses concise but informative."
            }
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! How can I assist you today?"
            }
          ],
        },
      ]);
    }
    return this.conversations.get(sessionId);
  }

  async sendMessage(message, sessionId = 'default') {
    try {
      const conversationHistory = this.getConversationHistory(sessionId);

      conversationHistory.push({
        role: "user",
        parts: [{ text: message }],
      });

      const requestData = {
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      const candidates = response.data?.candidates;
      const mimeType = response.data?.candidates?.[0]?.content?.mimeType || 'text/plain';
      if (candidates && candidates.length > 0) {
        const botMessage = candidates[0]?.content?.parts?.[0]?.text || "No response text.";

        conversationHistory.push({
          role: "model",
          parts: [{ text: botMessage }],
        });

        // Keep history manageable
        if (conversationHistory.length > 20) {
          conversationHistory.splice(2, conversationHistory.length - 20);
        }

        return {
          text: botMessage,
          mimeType,
          timestamp: new Date(),
          sessionId,
        };
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);

      const status = error.response?.status;
      if (status === 429) throw new Error('API quota exceeded');
      if (status === 400) throw new Error('Message blocked or invalid request');
      if (status === 401) throw new Error('Invalid Gemini API key');
      if (status === 403) throw new Error('Access denied');
      if (status === 404) throw new Error('Model not found or unsupported for generateContent');

      throw new Error(error.response?.data?.error?.message || 'Failed to get response from AI service');
    }
  }

  clearConversation(sessionId) {
    this.conversations.delete(sessionId);
    return { success: true, message: `Session ${sessionId} cleared` };
  }

  getStats() {
    return {
      activeSessions: this.conversations.size,
    };
  }
}

export default new GeminiService();
