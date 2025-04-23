
import { create } from 'zustand';

// Store for managing the API key (UI/State, but not used for API calls anymore)
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

// Additional market data for more comprehensive analysis
export const additionalMarketData = {
  regions: {
    "North America": { 
      leaders: ["Apple", "HP Inc.", "Lenovo"],
      growth: 3.2
    },
    "Europe": { 
      leaders: ["Lenovo", "HP Inc.", "Dell Technologies"],
      growth: 1.8
    },
    "Asia Pacific": { 
      leaders: ["Lenovo", "ASUS", "HP Inc."],
      growth: 7.5
    }
  },
  segments: {
    "Consumer": { 
      leaders: ["Apple", "HP Inc.", "ASUS"],
      growth: 2.4
    },
    "Business": { 
      leaders: ["Lenovo", "Dell Technologies", "HP Inc."],
      growth: 5.7
    },
    "Gaming": { 
      leaders: ["ASUS", "Lenovo", "Acer"],
      growth: 11.2
    }
  },
  pricing: {
    "Entry Level": {
      avgPrice: "$450",
      leaders: ["Acer", "ASUS", "HP Inc."]
    },
    "Mid-Range": {
      avgPrice: "$850",
      leaders: ["Lenovo", "Dell Technologies", "HP Inc."]
    },
    "Premium": {
      avgPrice: "$1500+",
      leaders: ["Apple", "Dell Technologies", "Lenovo"]
    }
  }
};

// Function to query Perplexity API
export async function queryPerplexity(question: string, context?: string) {
  // Use the provided Perplexity API key, always
  const apiKey = "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";
  
  const prompt = `
  Context: You are a strategic data analyst for Lenovo's executive team analyzing PC market share data. You need to provide insights that are specific, actionable, and data-driven.
  
  The current market share data (Q1 2025) is as follows:
  ${JSON.stringify(marketShareData, null, 2)}
  
  Additional market data:
  ${JSON.stringify(additionalMarketData, null, 2)}
  
  Question: ${question}
  
  Additional context provided by user: ${context || "None provided"}
  
  Important instructions:
  1. Provide a thorough analysis that directly answers the question.
  2. Include specific numeric insights when relevant.
  3. Structure your response with clear, actionable insights.
  4. Suggest 2-3 specific visualization types that would best represent this data (like bar charts, pie charts, line graphs, etc.) with what should be on each axis.
  5. Format your analysis to be easily understood by executives.
  
  Format your response as JSON with the following structure:
  {
    "analysis": "Your detailed analysis text here...",
    "key_points": ["Key point 1", "Key point 2", "Key point 3", ...],
    "visualization_suggestions": "Detailed suggestions for charts and visualizations that would effectively present this data...",
    "chart_data": {
      "type": "bar|pie|line|scatter",
      "title": "Suggested chart title",
      "labels": ["Label1", "Label2", ...],
      "datasets": [
        {
          "label": "Dataset name",
          "data": [value1, value2, ...]
        }
      ]
    }
  }
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
          { role: "system", content: "You are a strategic market analyst who specializes in PC market competitive analysis. You always respond with valid JSON containing analysis, key_points, visualization_suggestions, and chart_data fields. Your analysis is always data-driven, strategic, and actionable for executives." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500
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
      const parsedContent = JSON.parse(content);
      
      // Ensure the required fields exist
      return {
        analysis: parsedContent.analysis || "No analysis provided",
        key_points: Array.isArray(parsedContent.key_points) ? parsedContent.key_points : ["No key points provided"],
        visualization_suggestions: parsedContent.visualization_suggestions || "No visualization suggestions provided",
        chart_data: parsedContent.chart_data || null
      };
    } catch (e) {
      // If parsing fails, return the raw content in a structured format
      console.error("Error parsing JSON from Perplexity:", e);
      return {
        analysis: data.choices[0].message.content,
        key_points: ["Could not parse structured response"],
        visualization_suggestions: "Could not parse structured data from response.",
        chart_data: null
      };
    }
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      analysis: "An error occurred while processing your request.",
      key_points: ["Error connecting to analysis service"],
      visualization_suggestions: "Not available due to error",
      chart_data: null
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
  "compare regional performance differences for Lenovo in North America vs Asia Pacific",
  "explain how consumer vs business segment performance affects Lenovo's strategy",
  "what pricing segments offer the best growth opportunities for Lenovo"
];

