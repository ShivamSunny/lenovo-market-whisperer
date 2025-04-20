
import { create } from 'zustand';

// Store for managing the API key
interface PerplexityStore {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const usePerplexityStore = create<PerplexityStore>((set) => ({
  apiKey: localStorage.getItem('perplexityApiKey') || '',
  setApiKey: (key: string) => {
    localStorage.setItem('perplexityApiKey', key);
    set({ apiKey: key });
  },
}));

// Market share data
export const marketShareData = {
  brands: ["Lenovo", "HP Inc.", "Dell Technologies", "Apple", "Acer", "ASUS", "Others"],
  shares: [25.9, 21.6, 16.3, 10.1, 6.5, 6.3, 13.3],
  growth: [9.6, 5.9, -2.4, 2.0, 1.9, 9.1, 3.5], // YoY growth rates in percentage
  previousYearShares: [24.8, 21.4, 16.7, 9.9, 6.7, 6.1, 14.4]
};

// Function to query Perplexity API
export async function queryPerplexity(question: string, context?: string) {
  const apiKey = usePerplexityStore.getState().apiKey;
  
  if (!apiKey) {
    return { 
      error: "No API key provided. Please enter your Perplexity API key in settings."
    };
  }

  const prompt = `
  Context: You are analyzing PC market share data for a dashboard presented to Lenovo's CMO.
  The current market share data (Q1 2025) is as follows:
  ${JSON.stringify(marketShareData, null, 2)}
  
  Based on this data, please ${question}
  
  Additional context: ${context || "None provided"}
  
  Format your response as JSON with analysis, key_points, and visualization_suggestions keys.
  `;
  
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "You are a data analysis assistant specializing in market share analysis and visualization." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to query Perplexity API');
    }
    
    const data = await response.json();
    
    try {
      // Try to parse the content as JSON
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (e) {
      // If parsing fails, return the raw content
      return {
        analysis: data.choices[0].message.content,
        key_points: [],
        visualization_suggestions: "Could not parse structured data from response."
      };
    }
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

// Example analysis questions
export const sampleQuestions = [
  "explain Lenovo's competitive position against HP and Dell",
  "identify potential threats to Lenovo's market leadership",
  "recommend strategies to increase market share in the premium segment dominated by Apple",
  "analyze the growth trends of smaller competitors like ASUS and Acer",
  "predict market share changes for the next quarter based on current growth rates",
  "suggest dashboard visualizations that would highlight Lenovo's market leadership",
  "compare Lenovo's performance in different market segments (consumer, commercial, education)",
  "explain the factors behind Lenovo's 9.6% year-over-year growth"
];
