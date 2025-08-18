
        document.addEventListener('DOMContentLoaded', async () => {
        // 🔁 data-dark-src swap logic
        document.querySelectorAll("img[data-dark-src]").forEach(img => {
          if (document.body.classList.contains("dark-mode")) {
            img.src = img.dataset.darkSrc;
          }
        });
            // Apply theme based on localStorage
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            }

            const openrouterApiKeyInput = document.getElementById('openrouter-api-key');
            const openrouterModelSelect = document.getElementById('openrouter-model-select');
            const filterFreeModelsCheckbox = document.getElementById('filter-free-models');
            const modelLoadingSpinner = document.getElementById('model-loading-spinner');
            const contentTypeSelect = document.getElementById('content-type-select');

            const prevButton = document.getElementById('prev-button');
            const nextButton = document.getElementById('next-button');

            let allOpenRouterModels = []; // To store all fetched models

            // --- API Call to OpenRouter Models ---
            async function fetchOpenRouterModels() {
                modelLoadingSpinner.style.display = 'block'; // Show spinner
                openrouterModelSelect.innerHTML = '<option value="">Loading models...</option>'; // Show loading text
                openrouterModelSelect.disabled = true; // Disable select during load

                try {
                    const response = await fetch('https://openrouter.ai/api/v1/models', {
                        headers: {
                            'Authorization': `Bearer ${openrouterApiKeyInput.value.trim()}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to fetch models: ${response.status} - ${errorData.message || response.statusText}`);
                    }

                    const data = await response.json();
                    // Filter and map models from OpenRouter API response
                    allOpenRouterModels = data.data.map(model => ({
                        id: model.id,
                        name: model.name,
                        // OpenRouter provides 'pricing' object; check if it has a 'free' property or equivalent
                        free: model.pricing && model.pricing.prompt && model.pricing.prompt === 0 && model.pricing.completion && model.pricing.completion === 0
                    }));

                } catch (error) {
                    console.error("Error fetching OpenRouter models:", error);
                    // Display an error message to the user
                    displayMessage(`Failed to load models: ${error.message}. Check your API Key or network.`, "error");
                    openrouterModelSelect.innerHTML = '<option value="">Error loading models</option>';
                    allOpenRouterModels = []; // Clear models on error
                } finally {
                    modelLoadingSpinner.style.display = 'none'; // Hide spinner
                    openrouterModelSelect.disabled = false; // Enable select
                    populateModelDropdown(); // Populate dropdown with fetched (or error) models
                }
            }

            // --- Populate Model Dropdown ---
            function populateModelDropdown() {
                openrouterModelSelect.innerHTML = ''; // Clear previous options
                let modelsToDisplay = allOpenRouterModels;

                if (filterFreeModelsCheckbox.checked) {
                    modelsToDisplay = allOpenRouterModels.filter(model => model.free);
                }

                if (modelsToDisplay.length === 0) {
                    openrouterModelSelect.innerHTML = '<option value="">No models found with current filter.</option>';
                    nextButton.disabled = true; // Disable next if no models available
                    return;
                }

                // Sort models alphabetically by name
                modelsToDisplay.sort((a, b) => a.name.localeCompare(b.name));

                modelsToDisplay.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.name;
                    openrouterModelSelect.appendChild(option);
                });

                // Set previously selected model if available
                const storedSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
                openrouterModelSelect.value = storedSettings.selectedModel || '';

                // Update next button state after populating
                updateNextButtonState();
            }

            // --- Update Next Button State (Validation) ---
            function updateNextButtonState() {
                const isApiKeyEntered = openrouterApiKeyInput.value.trim() !== '';
                const isModelSelected = openrouterModelSelect.value !== '';
                const isContentTypeSelected = contentTypeSelect.value !== '';

                nextButton.disabled = !(isApiKeyEntered && isModelSelected && isContentTypeSelected);
            }

            // --- Event Listeners ---
            openrouterApiKeyInput.addEventListener('input', () => {
                updateNextButtonState();
                // Re-fetch models if API key changes (optional, but useful)
                // Debounce this in a real app to prevent too many calls
                if (openrouterApiKeyInput.value.trim().length > 10) { // Simple heuristic
                    fetchOpenRouterModels();
                }
            });
            openrouterModelSelect.addEventListener('change', updateNextButtonState);
            contentTypeSelect.addEventListener('change', updateNextButtonState);
            filterFreeModelsCheckbox.addEventListener('change', () => {
                populateModelDropdown(); // Re-populate when filter changes
            });

            prevButton.addEventListener('click', () => {
                // Navigate back to the last onboarding question (improve)
                window.location.href = 'questions.html'; // Corrected navigation
            });

            nextButton.addEventListener('click', () => {
                // Save settings to localStorage
                const appSettings = {
                    apiKey: openrouterApiKeyInput.value.trim(),
                    selectedModel: openrouterModelSelect.value,
                    contentType: contentTypeSelect.value
                };
                localStorage.setItem('appSettings', JSON.stringify(appSettings));
                localStorage.setItem('isOnboarded', 'true'); // Mark onboarding as complete

                // Navigate to the main generator page
                window.location.href = 'generator.html';
            });

            // Custom message box function (reused from onboarding)
            function displayMessage(message, type = "info") {
                const messageBox = document.createElement('div');
                messageBox.classList.add('message-box', type);
                messageBox.textContent = message;
                document.body.appendChild(messageBox);

                messageBox.style.opacity = 0; // Start invisible for transition
                if (document.body.classList.contains('dark-mode')) {
                    messageBox.style.backgroundColor = '#F7F7D3';
                    messageBox.style.color = '#000000';
                }

                setTimeout(() => { messageBox.style.opacity = 1; }, 10);
                setTimeout(() => {
                    messageBox.style.opacity = 0;
                    messageBox.addEventListener('transitionend', () => messageBox.remove());
                }, 3000);
            }

            // --- Initial Load ---
            // Load existing settings if they exist
            const storedSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
            if (storedSettings.apiKey) {
                openrouterApiKeyInput.value = storedSettings.apiKey;
            }
            if (storedSettings.selectedModel) {
                // Model will be set after fetchOpenRouterModels completes
            }
            if (storedSettings.contentType) {
                contentTypeSelect.value = storedSettings.contentType;
            }

            // Fetch models on page load if an API key is present
            // Or if the API key input is empty, don't auto-fetch, wait for user input
            if (openrouterApiKeyInput.value.trim() !== '') {
                fetchOpenRouterModels();
            } else {
                 openrouterModelSelect.innerHTML = '<option value="">Enter API Key to load models</option>';
                 openrouterModelSelect.disabled = true;
                 updateNextButtonState(); // Ensure button is disabled if API key is missing
            }
        });
    
