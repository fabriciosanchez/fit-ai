
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AssessmentData, FitnessPlan, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const planSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy and motivational title for the fitness plan." },
        summary: { type: Type.STRING, description: "A brief, encouraging summary of the plan's approach." },
        workoutPlan: {
            type: Type.ARRAY,
            description: "A 7-day workout schedule.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                    focus: { type: Type.STRING, description: "The main focus of the day's workout (e.g., 'Full Body Strength', 'Cardio & Core', 'Rest')." },
                    exercises: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                sets: { type: Type.INTEGER },
                                reps: { type: Type.STRING, description: "Can be a range like '8-12' or time like '30s'." },
                                rest: { type: Type.STRING, description: "Rest time between sets, e.g., '60s'." }
                            },
                            required: ['name', 'sets', 'reps', 'rest']
                        }
                    },
                    notes: { type: Type.STRING, description: "Optional notes for the day, like warm-up or cool-down." }
                },
                required: ['day', 'focus', 'exercises']
            }
        },
        nutritionPlan: {
            type: Type.ARRAY,
            description: "A 7-day nutrition guide.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING },
                    totalCalories: { type: Type.INTEGER },
                    macronutrients: {
                        type: Type.OBJECT,
                        properties: {
                            protein: { type: Type.INTEGER, description: "in grams" },
                            carbs: { type: Type.INTEGER, description: "in grams" },
                            fats: { type: Type.INTEGER, description: "in grams" }
                        },
                        required: ['protein', 'carbs', 'fats']
                    },
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack'" },
                                description: { type: Type.STRING, description: "A sample meal suggestion." },
                                calories: { type: Type.INTEGER }
                            },
                            required: ['name', 'description', 'calories']
                        }
                    }
                },
                required: ['day', 'totalCalories', 'macronutrients', 'meals']
            }
        },
        lifestyleRecommendations: {
            type: Type.OBJECT,
            properties: {
                sleep: { type: Type.STRING, description: "Specific sleep advice." },
                hydration: { type: Type.STRING, description: "Specific hydration advice." },
                stressManagement: { type: Type.STRING, description: "Tips for managing stress." }
            },
            required: ['sleep', 'hydration', 'stressManagement']
        }
    },
    required: ['title', 'summary', 'workoutPlan', 'nutritionPlan', 'lifestyleRecommendations']
};


const createPlanPrompt = (data: AssessmentData): string => {
    return `
    As an expert fitness and nutrition coach, create a personalized 4-week starter fitness and nutrition plan for a user with the following details. The plan should be encouraging, realistic for a beginner, and highly detailed.

    User Profile:
    - Goal: ${data.goal.replace('_', ' ')}
    - Gender: ${data.gender}
    - Age: ${data.age} years
    - Height: ${data.height} cm
    - Weight: ${data.weight} kg
    - Activity Level: ${data.activityLevel.replace('_', ' ')}
    - Dietary Preference: ${data.dietaryPreference}
    - Current Sleep: ${data.sleepHours} hours per night
    - Current Water Intake: ${data.waterIntake} liters per day

    Generate a comprehensive plan in JSON format. The plan must cover a full 7 days for workouts and nutrition, which the user can repeat over 4 weeks. Be specific and provide clear instructions. The tone should be motivational and supportive.
    `;
};

export const generatePlan = async (data: AssessmentData): Promise<FitnessPlan> => {
    try {
        const prompt = createPlanPrompt(data);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating plan with Gemini:", error);
        throw new Error("Failed to generate your personalized plan. Please try again.");
    }
};


let chatInstance: Chat | null = null;

export const startChat = (plan: FitnessPlan): Chat => {
    const history: { role: 'user' | 'model', parts: { text: string }[] }[] = [];
    
    const systemInstruction = `You are FitBot, a friendly and knowledgeable AI fitness assistant. Your purpose is to help the user understand and follow their personalized fitness plan. Answer their questions about exercises, nutrition, and lifestyle recommendations based on the plan provided below. Be supportive and encouraging. If a question is outside the scope of fitness and this plan, politely decline to answer.

    THE USER'S PERSONALIZED PLAN:
    ${JSON.stringify(plan, null, 2)}
    `;

    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history,
    });
    return chatInstance;
};

export const sendMessageToChat = async (message: string): Promise<string> => {
    if (!chatInstance) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm having trouble connecting right now. Please try again in a moment.";
    }
};

