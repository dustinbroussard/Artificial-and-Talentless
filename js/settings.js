
        document.addEventListener('DOMContentLoaded', async () => {
            const body = document.body;
            const openrouterApiKeyInput = document.getElementById('openrouter-api-key');
            const openrouterModelSelect = document.getElementById('openrouter-model-select');
            const filterFreeModelsCheckbox = document.getElementById('filter-free-models');
            const modelLoadingSpinner = document.getElementById('model-loading-spinner');
            const contentTypeSelect = document.getElementById('content-type-select');
            const deleteDataButton = document.getElementById('delete-data-button');
            const backToGeneratorButton = document.getElementById('back-to-generator-button');
            const saveSettingsButton = document.getElementById('save-settings-button');
            const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');

            let allOpenRouterModels = []; // To store all fetched models

            // --- Custom Message Box (reused) ---
            function displayMessage(message, type = "info") {
                if (type === "confirm") {
                    return new Promise((resolve) => {
                        const confirmBox = document.createElement('div');
                        confirmBox.classList.add('message-box', 'confirm');
                        confirmBox.innerHTML = `
                            <p>${message}</p>
                            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                                <button id="confirm-yes" class="nav-button" style="flex-grow: 0; padding: 8px 15px;">Yes</button>
                                <button id="confirm-no" class="nav-button" style="flex-grow: 0; padding: 8px 15px;">No</button>
                            </div>
                        `;
                        document.body.appendChild(confirmBox);

                        // Apply correct button styles based on theme
                        const confirmYesBtn = confirmBox.querySelector('#confirm-yes');
                        const confirmNoBtn = confirmBox.querySelector('#confirm-no');
                        confirmYesBtn.style.backgroundColor = '#9E001C'; // Yes button is always red

                        if (body.classList.contains('dark-mode')) {
                           confirmNoBtn.style.backgroundColor = '#FFFFE3';
                           confirmNoBtn.style.color = '#000000';
                        } else {
                           confirmNoBtn.style.backgroundColor = '#000000';
                           confirmNoBtn.style.color = '#FFFFE3';
                        }

                        confirmBox.style.opacity = 0;
                        setTimeout(() => { confirmBox.style.opacity = 1; }, 10);

                        confirmYesBtn.addEventListener('click', () => { confirmBox.remove(); resolve(true); });
                        confirmNoBtn.addEventListener('click', () => { confirmBox.remove(); resolve(false); });
                    });
                } else {
                    // Standard message box (info, success, error)
                    const messageBox = document.createElement('div');
                    messageBox.classList.add('message-box', type);
                    messageBox.textContent = message;
                    document.body.appendChild(messageBox);

                    messageBox.style.opacity = 0;
                    if (body.classList.contains('dark-mode')) {
                        messageBox.style.backgroundColor = '#FFFFE3';
                        messageBox.style.color = '#000000';
                    }

                    setTimeout(() => { messageBox.style.opacity = 1; }, 10);
                    setTimeout(() => {
                        messageBox.style.opacity = 0;
                        messageBox.addEventListener('transitionend', () => messageBox.remove());
                    }, 3000);
                }
            }

            // --- Theme Handling ---
            function applyTheme(theme) {
                const lightIcon = document.getElementById('light-icon');
                const darkIcon = document.getElementById('dark-icon');
                
                if (!body) return;
                
                if (theme === 'dark') {
                    body.classList.add('dark-mode');
                    if (lightIcon) lightIcon.style.display = 'none';
                    if (darkIcon) darkIcon.style.display = 'inline-block';
                } else {
                    body.classList.remove('dark-mode');
                    if (lightIcon) lightIcon.style.display = 'inline-block';
                    if (darkIcon) darkIcon.style.display = 'none';
                }
                localStorage.setItem('theme', theme);
            }

            // --- API Call to OpenRouter Models ---
            async function fetchOpenRouterModels() {
                modelLoadingSpinner.style.display = 'block';
                openrouterModelSelect.innerHTML = '<option value="">Loading models...</option>';
                openrouterModelSelect.disabled = true;

                const currentApiKey = openrouterApiKeyInput.value.trim();
                console.log("Attempting to fetch OpenRouter models with API Key:", currentApiKey ? "Key present" : "Key missing"); // Diagnostic log

                if (!currentApiKey) {
                    displayMessage("Please enter an OpenRouter API Key to load models.", "warning");
                    openrouterModelSelect.innerHTML = '<option value="">Enter API Key</option>';
                    modelLoadingSpinner.style.display = 'none';
                    openrouterModelSelect.disabled = true;
                    return;
                }

                try {
                    const response = await fetch('https://openrouter.ai/api/v1/models', {
                        headers: {
                            'Authorization': `Bearer ${currentApiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to fetch models: ${response.status} - ${errorData.message || response.statusText}`);
                    }

                    const data = await response.json();
                    allOpenRouterModels = data.data.map(model => ({
                        id: model.id,
                        name: model.name,
                        free: model.pricing && model.pricing.prompt && model.pricing.prompt === 0 && model.pricing.completion && model.pricing.completion === 0
                    }));
                    console.log("Models fetched successfully:", allOpenRouterModels.length); // Diagnostic log

                } catch (error) {
                    console.error("Error fetching OpenRouter models:", error); // Detailed error log
                    displayMessage(`Failed to load models: ${error.message}. Check your API Key or network.`, "error");
                    openrouterModelSelect.innerHTML = '<option value="">Error loading models</option>';
                    allOpenRouterModels = [];
                } finally {
                    modelLoadingSpinner.style.display = 'none';
                    openrouterModelSelect.disabled = false;
                    populateModelDropdown();
                }
            }

            // --- Populate Model Dropdown ---
            function populateModelDropdown() {
                openrouterModelSelect.innerHTML = '';
                let modelsToDisplay = allOpenRouterModels;

                if (filterFreeModelsCheckbox.checked) {
                    modelsToDisplay = allOpenRouterModels.filter(model => model.free);
                }

                if (modelsToDisplay.length === 0) {
                    openrouterModelSelect.innerHTML = '<option value="">No models found with current filter.</option>';
                } else {
                    modelsToDisplay.sort((a, b) => a.name.localeCompare(b.name));

                    modelsToDisplay.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.id;
                        option.textContent = model.name;
                        openrouterModelSelect.appendChild(option);
                    });
                }
                const storedSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
                openrouterModelSelect.value = storedSettings.selectedModel || '';

                updateSaveButtonState();
            }

            // --- Update Save Button State (Validation) ---
            function updateSaveButtonState() {
                const isApiKeyEntered = openrouterApiKeyInput.value.trim() !== '';
                const isModelSelected = openrouterModelSelect.value !== '';
                const isContentTypeSelected = contentTypeSelect.value !== '';

                saveSettingsButton.disabled = !(isApiKeyEntered && isModelSelected && isContentTypeSelected);
            }

            // --- Load Settings on Init ---
            const initialSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
            if (initialSettings.apiKey) {
                openrouterApiKeyInput.value = initialSettings.apiKey;
            }
            if (initialSettings.contentType) {
                contentTypeSelect.value = initialSettings.contentType;
            }
            // IMPORTANT: Call applyTheme before fetchOpenRouterModels to ensure checkbox state is correct
            applyTheme(localStorage.getItem('theme') || 'light');

            if (openrouterApiKeyInput.value.trim() !== '') {
                await fetchOpenRouterModels();
            } else {
                openrouterModelSelect.innerHTML = '<option value="">Enter API Key to load models</option>';
                openrouterModelSelect.disabled = true;
            }
            updateSaveButtonState();

            // --- Event Listeners ---
            openrouterApiKeyInput.addEventListener('input', updateSaveButtonState);
            openrouterApiKeyInput.addEventListener('blur', () => {
                const currentVal = openrouterApiKeyInput.value.trim();
                // Only fetch if key actually changed OR if it was previously empty and now has content
                // Also check if currentVal is different from the currently displayed input value
                if (currentVal !== initialSettings.apiKey || (initialSettings.apiKey === undefined && currentVal !== '')) {
                     // Adding a small debounce for re-fetching on blur to avoid too many calls
                    setTimeout(() => fetchOpenRouterModels(), 300);
                }
            });

            openrouterModelSelect.addEventListener('change', updateSaveButtonState);
            filterFreeModelsCheckbox.addEventListener('change', populateModelDropdown);
            contentTypeSelect.addEventListener('change', updateSaveButtonState);

            // Theme toggle via the new icons
            document.getElementById('theme-toggle-icons').addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                applyTheme(newTheme);
            });

            // --- Data Deletion ---
            deleteDataButton.addEventListener('click', async () => {
                const confirmed = await displayMessage("Are you sure you want to delete all your data? This action cannot be undone.", "confirm");
                if (confirmed) {
                    localStorage.clear();
                    displayMessage("All data has been deleted. Redirecting to start.", "info");
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Redirect to start page
                    }, 1000);
                }
            });

            // --- Navigation Buttons ---
            backToGeneratorButton.addEventListener('click', () => {
                window.location.href = 'index.html'; // Go back to the generator
            });

            saveSettingsButton.addEventListener('click', () => {
                const appSettings = {
                    apiKey: openrouterApiKeyInput.value.trim(),
                    selectedModel: openrouterModelSelect.value,
                    contentType: contentTypeSelect.value
                };
                localStorage.setItem('appSettings', JSON.stringify(appSettings));
                displayMessage("Settings saved successfully!", "info");
            });
        });
    
