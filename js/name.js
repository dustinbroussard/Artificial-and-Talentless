
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

            const nameInput = document.getElementById('name-input');
            const continueButton = document.getElementById('continue-button');

            /**
             * Checks if the name input field has text and enables/disables the continue button.
             */
            const checkNameInput = () => {
                continueButton.disabled = !nameInput.value.trim();
            };

            // Add event listener for input changes
            nameInput.addEventListener('input', checkNameInput);
            // Initial check on page load to set button state
            checkNameInput();

            // Event listener for the "Continue" button
            continueButton.addEventListener('click', () => {
                const name = nameInput.value.trim();
                if (name) {
                    localStorage.setItem('userName', name);
                    // Navigate to the next onboarding page
                    window.location.href = 'intro.html';
                }
            });

            // Set focus to the input field on load for better UX
            nameInput.focus();
        });
    
