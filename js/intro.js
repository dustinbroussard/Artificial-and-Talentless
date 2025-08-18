
        document.addEventListener('DOMContentLoaded', () => {
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

            const userNameSpan = document.getElementById('user-name');
            const storedUserName = localStorage.getItem('userName');

            // Display the stored user name
            if (userNameSpan && storedUserName) {
                userNameSpan.textContent = storedUserName;
            } else if (userNameSpan) {
                // Fallback if no name is found (shouldn't happen if previous page works)
                userNameSpan.textContent = 'Valued User';
            }

            const continueButton = document.getElementById('continue-button');
            const introTextElement = document.getElementById('intro-text'); // Correctly get element by ID

            const introLines = [
                "Let's get to know each other, so a therapist can get to know your money a lot better.",
                "Let's get to know each other so I can start the process of destroying you from the inside out.",
                "Time for a quick personality check—don't worry, no one gets out of here without a little roast.",
                "Let me gather some info so I can better insult your life choices in the most personalized way possible.",
                "Let's figure out what makes you tick, so I can break it down and put it back together wrong.",
                "I need to know everything about you... for completely healthy and non-suspicious reasons.",
                "Don't worry, this will only take a minute, and I promise not to make any life-altering judgments... yet.",
                "Here's a quick survey to help me turn all your quirks into finely crafted insults. You're welcome.",
                "I'm about to know you better than your best friend does. Brace yourself.",
                "Before we begin, I need to peer into the soft, writhing core of your personality. Don’t flinch.",
                "Answer honestly. I already know when you’re lying—I just want to see if you do.",
                "Let’s unlock your inner self. Then maybe lock it back up, depending on what we find.",
                "Time to spill your guts—figuratively, unless this app updates poorly.",
                "Let me map your flaws like constellations. Beautiful, tragic, avoidable.",
                "I just need some basic info before I decide whether you’re a misunderstood genius or just very online.",
                "Take a deep breath. This is the part where I psychoanalyze you with all the grace of a chainsaw.",
                "This short quiz will determine your love language, your deepest fear, and how close you are to a villain arc.",
                "Let’s learn what drives you—besides caffeine, trauma, and spite.",
                "You talk, I listen. Then I quietly judge and build a custom roast in the background.",
                "Let's do this quick—like ripping off a personality bandage.",
                "Think of this as foreplay for emotional vulnerability. But with less touching. Hopefully.",
                "I'm basically a fortune teller with Wi-Fi. Tell me everything.",
                "I need your data. Not for evil. Probably."
            ];

            const randomIndex = Math.floor(Math.random() * introLines.length);
            const selectedIntro = introLines[randomIndex];

            /**
             * Implements a typewriter effect for text elements.
             * @param {HTMLElement} element - The DOM element to type into.
             * @param {string} text - The full text to type.
             * @param {number} i - Current index for typing.
             * @param {function} [callback] - Function to call after typing is complete.
             */
            function typeWriter(element, text, i, callback) {
                if (i < text.length) {
                    if (element.innerHTML === '') element.style.visibility = 'visible';
                    element.innerHTML += text.charAt(i);
                    setTimeout(() => typeWriter(element, text, i + 1, callback), 30 + Math.random() * 70);
                } else if (callback) setTimeout(callback, 1500);
            }

            // Start typing the intro text after setting the username
            // We ensure introTextElement is available before calling typeWriter
            if (introTextElement) {
                typeWriter(introTextElement, selectedIntro, 0, () => {
                    // This callback now just enables the button, it doesn't navigate
                    // Navigation will happen on button click
                    continueButton.style.visibility = 'visible'; // Make button visible after text is typed
                });
            }


            // Event listener for the "Continue" button
            continueButton.addEventListener('click', () => {
                // Navigate to the next onboarding page (onboarding questions)
                window.location.href = 'questions.html'; // Placeholder for the next page
            });
        });
    
