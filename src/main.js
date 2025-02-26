import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// Get DOM elements
const labResultsTextarea = document.getElementById('labResults');
const analyzeButton = document.getElementById('analyzeBtn');
const analysisResult = document.getElementById('analysisResult');

// Function to analyze lab results
async function analyzeLaboratoryResults(results) {
    try {
        // Show loading state
        analysisResult.innerHTML = '<p class="loading">Analizando resultados...</p>';
        analyzeButton.disabled = true;

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create the prompt
        const prompt = `Analiza los siguientes resultados de laboratorio bioquímico y proporciona una interpretación detallada, incluyendo posibles anomalías y recomendaciones:\n\n${results}`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Display the results
        analysisResult.innerHTML = `<div>${text.replace(/\n/g, '<br>')}</div>`;
    } catch (error) {
        // Handle errors
        analysisResult.innerHTML = `
            <div class="error">
                Error al analizar los resultados: ${error.message}
                <br>Por favor, verifica tu conexión a internet y la clave API.
            </div>`;
    } finally {
        // Re-enable the button
        analyzeButton.disabled = false;
    }
}

// Add click event listener
analyzeButton.addEventListener('click', () => {
    const results = labResultsTextarea.value.trim();
    if (results) {
        analyzeLaboratoryResults(results);
    } else {
        analysisResult.innerHTML = `
            <div class="error">
                Por favor, ingrese los resultados del laboratorio antes de analizar.
            </div>`;
    }
});