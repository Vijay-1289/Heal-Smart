import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyC9wyYxNZAEVSdpLZNkHFJddCnm5sX1oCI';

export const generateResponse = async (prompt) => {
    try {
        console.log('Initializing Google Generative AI...');
        const genAI = new GoogleGenerativeAI(API_KEY);
        console.log('Getting generative model...');
        
        // Try different model names
        const modelNames = ["gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        let model = null;
        let lastError = null;

        for (const modelName of modelNames) {
            try {
                console.log(`Trying model: ${modelName}`);
                model = genAI.getGenerativeModel({ model: modelName });
                // Test the model
                const testResult = await model.generateContent("Test");
                if (testResult) {
                    console.log(`Successfully connected to model: ${modelName}`);
                    break;
                }
            } catch (error) {
                console.log(`Model ${modelName} failed:`, error.message);
                lastError = error;
            }
        }

        if (!model) {
            throw new Error(`No valid model found. Last error: ${lastError?.message}`);
        }

        let attempts = 0;
        let responseText = '';
        
        while (attempts < 3) {
            try {
                console.log(`Attempt ${attempts + 1}: Generating response with prompt:`, prompt);
                const result = await model.generateContent(prompt);
                console.log('Got result:', result);
                const response = await result.response;
                console.log('Got response:', response);
                responseText = response.text();
                console.log('Extracted text:', responseText);
                
                if (responseText) {
                    console.log('Successfully generated response');
                    break;
                }
            } catch (retryError) {
                console.error(`Attempt ${attempts + 1} failed with error:`, retryError);
                console.error('Error details:', {
                    name: retryError.name,
                    message: retryError.message,
                    stack: retryError.stack
                });
                lastError = retryError;
                attempts++;
                
                if (attempts === 3) {
                    console.error('All attempts failed. Last error:', lastError);
                    throw new Error(`API request failed after ${attempts} attempts: ${lastError.message}`);
                }
                
                console.log(`Waiting 1 second before retry ${attempts + 1}...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        if (!responseText) {
            throw new Error('Failed to get valid response after multiple attempts');
        }

        return responseText;
    } catch (error) {
        console.error('API Error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Provide more specific error messages
        if (error.message.includes('API key')) {
            throw new Error('API key is invalid or not configured properly. Please check your API key.');
        } else if (error.message.includes('quota')) {
            throw new Error('API quota exceeded. Please check your Google Cloud Console for quota limits.');
        } else if (error.message.includes('network')) {
            throw new Error('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('model')) {
            throw new Error('No valid model found. Please check your API configuration and try again.');
        } else {
            throw new Error(`Service temporarily unavailable: ${error.message}`);
        }
    }
}; 