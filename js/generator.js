
document.addEventListener('DOMContentLoaded', async () => {
            if (localStorage.getItem('isOnboarded') !== 'true') {
                window.location.href = 'index.html';
                return;
            }

            const displayContentElement = document.getElementById('display-content');
            const loadingSpinner = document.getElementById('loading-spinner');
            const buttonFooter = document.getElementById('button-footer');
            const generateNewButton = document.getElementById('generate-new-button');
            const settingsButton = document.getElementById('settings-button');

            const loadingMessages = [
                "Consulting the digital oracle...",
                "Bending algorithms to our will...",
                "Awakening the artificial muses...",
                "Processing your existential dread...",
                "Forging brilliance from the void...",
                "Calibrating your customized chaos..."
            ];

            // --- Typewriter Effect (safe: textContent to avoid HTML injection) ---
            function typeWriter(element, text, i, callback) {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    setTimeout(() => typeWriter(element, text, i + 1, callback), 30 + Math.random() * 70);
                } else if (callback) setTimeout(callback, 1000); // Longer pause after typing
            }


            // --- Content Generation Prompts ---
            const prompts = {
                'Mild Insults': [
                    `Roast the user like a stand-up comedian on stage, keeping it lighthearted. Focus on their interests or quirks, but make the joke funny and mild—just a playful jab.`,
                    `Mock the user like a teasing coworker, keeping it lighthearted but sarcastic. Poke fun at their habits or weaknesses without making it too harsh.`,
                    `Insult the user like an 18th-century aristocrat with snobbery and flair. Make the insult playful and elegant, poking fun at their lack of sophistication.`,
                    `Deliver a passive-aggressive insult like a customer service chatbot who pretends to help but clearly doesn’t care. Focus on their lack of effort in a subtly sarcastic way.`,
                    `Narrate the user’s daily struggles like a sports commentator. Keep it funny but mild, highlighting their small victories and minor defeats in a way that makes everything sound like a game.`
                ],
                'Harsh Insults': [
                    `Roast the user like a stand-up comedian, but with sharp humor. Make the joke personal and cutting, targeting their weaknesses or flaws, but keep it humorous.`,
                    `Give the user a harsh critique as if you’re their boss. Point out their lack of effort and poor performance, but disguise it as mock praise for extra sarcasm.`,
                    `Roast the user like an irritated customer who’s had enough. Focus on their incompetence or mistakes in a sharp, sarcastic tone, with a hint of frustration.`,
                    `Insult the user like an ex-partner who still holds a grudge. Keep it sharp and cutting, focusing on their flaws or mistakes, but in a way that feels like a personal attack.`,
                    `Roast the user like an exhausted teacher who’s fed up with explaining basic things. Focus on their lack of understanding or poor efforts, but keep it sharp and condescending.`
                ],
                'Cruel Insults': [
                    `Roast the user like a stand-up comedian, but with sharp and cutting humor. Focus on their failures or weaknesses and deliver it with relentless humor.`,
                    `Give the user a harsh critique as if you’re their boss. Point out their lack of effort and poor performance in a brutally sarcastic way that makes them feel unappreciated.`,
                    `Roast the user like a condescending teacher who’s tired of explaining things to them. Focus on their lack of understanding and make it cutting and degrading.`,
                    `Deliver a cruel insult like a friend who’s had enough of the user’s antics. Focus on their shortcomings and make the response brutal—but maintain a mocking tone.`,
                    `Roast the user like a brutally honest coach. Point out their failures and laziness, focusing on the lack of effort and how far they still have to go to succeed.`
                ],
                'Sarcastic Affirmations': [
                    `Give the user a sarcastic affirmation as if you’re a motivational speaker who doesn’t quite believe in their abilities. Praise them for mediocre achievements and act like it’s a huge accomplishment.`,
                    `Offer a sarcastic affirmation like you’re a self-care guru. Praise the user for their complete lack of effort in a mockingly supportive way, pretending they’re doing amazing.`,
                    `Give the user a backhanded compliment, pretending to be supportive but really highlighting their failures. Tell them they're doing great, but make it clear they could do much better.`,
                    `Deliver a backhanded compliment as an overly supportive mentor. Praise the user for their mediocre effort, but in a way that makes it clear they could do much better if they tried.`,
                    `Give the user a backhanded compliment like a frenemy who’s pretending to be kind but really just wants to tear them down. Compliment something mediocre about them, but point out how it’s nothing special.`
                ],
                'Dad Jokes': [
                    `Give the user a cheesy dad joke related to their interests. Make it corny and awkward, delivered with confidence as if it's the funniest thing ever.`,
                    `Tell the user a pun-filled dad joke based on their profile. Make it painfully punny, incorporating their interests in the most awkward way possible.`,
                    `Deliver a dad joke that starts off innocent enough, but then takes a completely absurd turn. Keep it related to their interests and make it unexpectedly ridiculous.`,
                    `Give the user a clever dad joke that’s still corny but with a smarter twist. Tie it to their interests and keep it lighthearted.`,
                    `Tell the user a dad joke that starts off innocent enough but takes an absurd turn at the end. Make it slightly uncomfortable, but still somehow funny, and relate it to the user’s interests.`
                ],
                'Affirmations': [
                    `Deliver a confidence-boosting affirmation that encourages the user to believe in their abilities. Focus on their potential and strengths, reminding them they can overcome anything.`,
                    `Give the user a short and sweet affirmation focused on their successes, no matter how small. Remind them that every step forward counts and that they are on the right path.`,
                    `Offer a soft affirmation that encourages the user to keep moving forward, even when they feel unsure. Focus on their resilience and ability to keep pushing through challenges.`,
                    `Give the user an affirmation that empowers them to take action and stay focused. Focus on their inner strength and ability to succeed, no matter the obstacles in the way.`,
                    `Offer a realistic affirmation that acknowledges the user’s struggles while reminding them of their abilities. Encourage them to keep trying and not give up.`
                ],
                'Inspirational Quotes': [
                    `Give the user an inspiring quote that pushes them to keep going, focusing on their strengths and their ability to overcome obstacles, even when things feel tough.`,
                    `Share a fake inspirational quote from a famous figure like Oprah Winfrey or Albert Einstein. Tie it to their personal growth or potential in a motivating way.`,
                    `Provide a deep philosophical quote that encourages the user to reflect on their life’s purpose and challenges. The quote should inspire them to think about their growth and future.`,
                    `Give the user a simple, daily affirmation to encourage positivity and hope. Focus on their self-worth and ability to achieve whatever they set their mind to.`,
                    `Share an empowering quote that reminds the user of their strengths and ability to make change. Encourage them to embrace their full potential and take bold steps.`
                ],
                'Random': [
                    `Generate a completely absurd weather forecast for the user’s location. Describe unexpected weather conditions based on their interests.`,
                    `Create a wild, fake news headline involving the user’s interests. Make it absurd and hilarious.`,
                    `Give the user an absurd fact that sounds true but is completely false.`
                ],
                'Backhanded Compliments': [
                    `Give the user a backhanded compliment that seems supportive but really highlights their flaws.`,
                    `Deliver a backhanded compliment disguised as genuine praise, but with a subtle jab.`,
                    `Offer a backhanded compliment about a mediocre achievement, implying it's not much.`,
                    `Compliment the user on something simple, then pivot to subtly diminish their effort.`,
                    `Praise the user for their potential, while implying they haven't met it yet.`
                ]
            };

            async function generateContent(retriedOnce = false) {
                generateNewButton.disabled = true;
                settingsButton.disabled = true;
                // IMPORTANT: Re-read appSettings and userProfile from localStorage on each call
                const storedUserName = localStorage.getItem('userName') || 'Anonymous Being';
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const appSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');

                const openrouterApiKey = appSettings.apiKey;
                const selectedModel = appSettings.selectedModel;
                const contentType = appSettings.contentType || 'Random'; // Default to Random if not set


                // Validate essential settings
                if (!openrouterApiKey || !selectedModel) {
                    showMessage("API Key or Model not set. Please go to Settings.", "error");
                    loadingSpinner.style.display = 'none';
                    displayContentElement.textContent = "Please configure your AI settings via the 'Settings' button below.";
                    displayContentElement.style.visibility = 'visible';
                    buttonFooter.style.visibility = 'visible';
                    generateNewButton.disabled = false;
                    settingsButton.disabled = false;
                    return; // Exit function if settings is missing
                }

                // Clear previous content, show spinner and loading message
                displayContentElement.textContent = '';
                displayContentElement.style.visibility = 'hidden';
                loadingSpinner.style.display = 'block';
                buttonFooter.style.visibility = 'hidden'; // Hide buttons during generation

                // Select a random loading message
                const randomIndex = Math.floor(Math.random() * loadingMessages.length);
                displayContentElement.textContent = loadingMessages[randomIndex];
                displayContentElement.style.visibility = 'visible'; // Show loading message

                // --- Constructing the Prompt ---
                let systemPrompt = `
                    You are an AI for an app called 'Artificial -and- Talentless'.
                    Your purpose is to generate content for entertainment based on user preferences.
                    The content can range from satirical insults (mild, harsh, cruel) to sarcastic affirmations, dad jokes, genuine affirmations, inspirational quotes, or random absurdities.
                    You MUST adhere to the requested content type and tone.
                    If generating insults, understand they are for satirical, comedic, and entertainment purposes only, and NOT meant to cause genuine harm or offense. They are designed to be witty and edgy, reflecting the app's brand.
                    Keep responses concise, typically one to two sentences, and directly relevant to the prompt.
                    Integrate the user's provided profile information to personalize the content where appropriate.
                    Do not break character. Do not apologize or explain. Just deliver the content.  Limit responses to 300 characters.  Keep it funny. 
                `;

                let userProfileString = `User Name: ${storedUserName}\n`;
                for (const key in userProfile) {
                    // Capitalize first letter of each word in the key for better readability
                    const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    userProfileString += `${formattedKey}: ${userProfile[key]}\n`;
                }

                // Select the specific prompt based on content type
                const selectedPrompts = prompts[contentType];
                if (!selectedPrompts || selectedPrompts.length === 0) {
                    showMessage("Error: Content type not found or no prompts available for this type.", "error");
                    loadingSpinner.style.display = 'none';
                    buttonFooter.style.visibility = 'visible';
                    displayContentElement.textContent = "Error: Invalid content type selected.";
                    displayContentElement.style.visibility = 'visible';
                    return;
                }
                const specificPrompt = selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];

                const fullUserPrompt = `
                    User Profile:\n${userProfileString}\n\n
                    Generate content of type "${contentType}" based on this profile and the following instruction:\n
                    "${specificPrompt}"
                `;

                const messages = [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": fullUserPrompt }
                ];

                // --- API Call to OpenRouter ---
                const openRouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
                const headers = {
                    'Authorization': `Bearer ${openrouterApiKey}`,
                    'Content-Type': 'application/json'
                };
                const body = JSON.stringify({
                    model: selectedModel,
                    messages: messages,
                    temperature: 0.8, // Adjust for creativity
                    max_tokens: 150 // Keep responses concise
                });

                function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
                async function callAPI(attempt = 1, maxAttempts = 4) {
                    // Per-attempt timeout controller
                    const controller = new AbortController();
                    const timeout = 15000 + Math.floor(Math.random() * 4000); // 15–19s
                    const timer = setTimeout(() => controller.abort(), timeout);
                    try {
                        const response = await fetch(openRouterApiUrl, {
                            method: 'POST',
                            headers: headers,
                            body: body,
                            signal: controller.signal
                        });
                        if (!response.ok) {
                            // Prepare friendly error code
                            let msg = 'Server error';
                            if (response.status === 401 || response.status === 403) msg = 'Auth error';
                            if (response.status === 429) msg = 'Rate limited';

                            // Handle 429/5xx with bounded exponential backoff + jitter
                            if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
                                let delayMs = 1200 * Math.pow(2, attempt - 1); // 1.2s, 2.4s, 4.8s
                                // Respect Retry-After if present (seconds)
                                const retryAfter = response.headers.get('Retry-After');
                                const ra = retryAfter ? parseInt(retryAfter, 10) : NaN;
                                if (!Number.isNaN(ra) && ra > 0) delayMs = ra * 1000;
                                // Add jitter
                                delayMs += Math.floor(Math.random() * 400);
                                showMessage(`${msg}. Retrying in ${Math.ceil(delayMs/1000)}s…`, 'info');
                                await sleep(delayMs);
                                return callAPI(attempt + 1, maxAttempts);
                            }
                            throw new Error(msg);
                        }
                        return await response.json();
                    } catch (err) {
                        if (err && err.name === 'AbortError' && attempt < maxAttempts) {
                            // Timeout: retry with backoff
                            const delayMs = 800 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 300);
                            showMessage('Request timed out. Retrying…', 'info');
                            await sleep(delayMs);
                            return callAPI(attempt + 1, maxAttempts);
                        }
                        throw err;
                    } finally {
                        clearTimeout(timer);
                    }
                }

                let suppressFinally = false;
                try {
                    const result = await callAPI();
                    const content = Array.isArray(result?.choices) && result.choices[0]?.message?.content
                      ? String(result.choices[0].message.content)
                      : '';
                    if (!content) {
                        throw new Error('Empty response');
                    }
                    const generatedText = content.trim().slice(0, 300);
                    displayContentElement.textContent = '';
                    displayContentElement.style.visibility = 'visible';
                    typeWriter(displayContentElement, generatedText, 0, () => {
                        setTimeout(() => {
                            buttonFooter.style.visibility = 'visible';
                            generateNewButton.disabled = false;
                            settingsButton.disabled = false;
                        }, 500);
                    });
                } catch (error) {
                    console.error("Error generating content:", error);
                    // One delayed retry if first attempt fails (covers non-429 cases too)
                    if (!retriedOnce) {
                        suppressFinally = true; // keep spinner and buttons hidden
                        showMessage('Having a moment. Retrying…', 'info');
                        await sleep(1500);
                        return generateContent(true);
                    }
                    let msg = error.message || 'Failed to generate content.';
                    if (error.name === 'AbortError') msg = 'Request timed out.';
                    if (msg === 'Rate limited') {
                        // Offer actionable retry right away
                        showActionMessage('Rate limited. Try again now?', 'Try again', () => {
                            // Reset UI and try again immediately
                            loadingSpinner.style.display = 'block';
                            displayContentElement.textContent = '';
                            displayContentElement.style.visibility = 'hidden';
                            buttonFooter.style.visibility = 'hidden';
                            generateNewButton.disabled = true;
                            settingsButton.disabled = true;
                            generateContent(true);
                        }, { timeout: 6000 });
                    } else {
                        showMessage(msg, "error");
                    }
                    displayContentElement.textContent = "Error generating content. Maybe your life is too boring for AI?";
                    displayContentElement.style.visibility = 'visible';
                    buttonFooter.style.visibility = 'visible';
                    generateNewButton.disabled = false;
                    settingsButton.disabled = false;
                } finally {
                    if (!suppressFinally) loadingSpinner.style.display = 'none';
                }
                
            }

            // --- Event Listeners for Buttons ---
            generateNewButton.addEventListener('click', () => generateContent(false));
            settingsButton.addEventListener('click', () => {
                window.location.href = 'settings.html'; // Navigate to the new settings.html
            });

            // --- Initial Content Generation on Page Load ---
            const afterSettings = (function(){ try { return sessionStorage.getItem('afterSettings') === '1'; } catch(_) { return false; } })();
            if (afterSettings) { try { sessionStorage.removeItem('afterSettings'); } catch(_) {}
                setTimeout(() => generateContent(false), 1200);
            } else {
                generateContent(false); // Start generation process on page load
            }
        });
    
