
// This is a MOCKED service that simulates calls to a Backend-for-Frontend (BFF)
// which would securely handle the Gemini API key and logic.

interface ParsedRefuelData {
    liters: number;
    cost?: number;
}

// Simulates calling /api/parse-refuel
export const parseRefuelText = (text: string): Promise<ParsedRefuelData> => {
    console.log(`[GeminiService] Parsing text: "${text}"`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock Gemini's structured JSON response
            const litersMatch = text.match(/(\d+(\.\d+)?)\s*l/i);
            const costMatch = text.match(/\$(\d+(\.\d+)?)/i);

            if (litersMatch) {
                const data: ParsedRefuelData = {
                    liters: parseFloat(litersMatch[1]),
                };
                if (costMatch) {
                    data.cost = parseFloat(costMatch[1]);
                }
                console.log('[GeminiService] Mock response:', data);
                resolve(data);
            } else {
                console.error('[GeminiService] Mock parsing failed.');
                reject(new Error("Couldn't understand the refuel details. Please be more specific, e.g., '10.5L for $20'."));
            }
        }, 1500); // Simulate network latency
    });
};


interface MaintenanceReminderParams {
    odometer: number;
    lastServiceOdometer: number;
}

interface MaintenanceReminderResponse {
    reminder: string;
}

// Simulates calling /api/generate-reminder
export const getMaintenanceReminder = (params: MaintenanceReminderParams): Promise<MaintenanceReminderResponse> => {
    console.log(`[GeminiService] Getting reminder for:`, params);
     return new Promise((resolve) => {
        setTimeout(() => {
            const kmSinceService = params.odometer - params.lastServiceOdometer;
            let reminder = "Everything looks good! Keep an eye on your tire pressure.";

            if (kmSinceService > 4500) {
                reminder = "You're approaching 5,000km since your last service. Consider checking your oil and chain tension soon.";
            }
            if (kmSinceService > 2500 && kmSinceService < 3000) {
                 reminder = "Your chain might need lubrication. A clean, well-lubed chain improves performance and longevity.";
            }
            
            console.log('[GeminiService] Mock reminder:', reminder);
            resolve({ reminder });
        }, 1000);
    });
}
