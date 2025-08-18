
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

            const getStartedButton = document.getElementById('get-started-button');
            const tagline = document.querySelector('.tagline');
            const subTagline = document.querySelector('.sub-tagline');

            // Your original tagline texts
            const taglineText = "An AI-powered minimalist typewriter generates personalized insults just for you.";
            const subTaglineText = "Enjoy. Or don't. Whatever.";

            // Check if user has already onboarded
            const isOnboarded = localStorage.getItem('isOnboarded') === 'true';
            if (isOnboarded) {
                // Redirect if already onboarded (assuming 'generator.html' is the next page)
                window.location.href = 'generator.html';
                return; // Stop further execution on this page
            }

            /**
             * Implements a typewriter effect for text elements.
             * @param {HTMLElement} element - The DOM element to type into.
             * @param {string} text - The full text to type.
             * @param {number} i - Current index for typing.
             * @param {function} [callback] - Function to call after typing is complete.
             */
            function typeWriter(element, text, i, callback) {
                if (i < text.length) {
                    if (i === 0) {
                        element.style.visibility = 'visible'; // Make element visible when typing starts
                        element.innerHTML = ''; // Clear content before typing
                    }
                    element.innerHTML += text.charAt(i);
                    // Random delay for a more natural typewriter feel
                    setTimeout(() => typeWriter(element, text, i + 1, callback), 50 + Math.random() * 50);
                } else if (callback) {
                    setTimeout(callback, 500); // Small delay before calling next function
                }
            }

            // Start the typewriter effect after a short delay
            setTimeout(() => {
                typeWriter(tagline, taglineText, 0, () => {
                    typeWriter(subTagline, subTaglineText, 0, () => {
                        // Make the button visible after both taglines are typed
                        getStartedButton.style.visibility = 'visible';
                    });
                });
            }, 1000); // Initial delay before typing starts

            // Event listener for the "Get Started" button
            getStartedButton.addEventListener('click', () => {
                // Set onboarding status to true and navigate to the next page
                window.location.href = 'name.html'; // Assuming 'onboarding-name.html' is the next page
            });
        });
    
