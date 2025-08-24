
document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('isOnboarded') === 'true') {
                window.location.href = 'generator.html';
                return;
            }

            // Get all question containers
            const questionContainers = Array.from(document.querySelectorAll('.question-container'));
            // Get all option buttons (for multiple choice questions)
            const optionButtons = document.querySelectorAll('.option-button');
            // Get all open-ended text areas
            const openEndedTextareas = document.querySelectorAll('.open-ended-container textarea');

            // Get global navigation buttons
            const prevButton = document.getElementById('prev-button');
            const nextButton = document.getElementById('next-button');

            let currentQuestionIndex = 0;
            const userProfileData = {}; // Stores user's answers

            // Helper function to show only the current question and update button states
            function showQuestion(index) {
                questionContainers.forEach((container, i) => {
                    container.style.display = i === index ? 'flex' : 'none';
                });

                // Update 'Previous' button visibility
                prevButton.style.display = index === 0 ? 'none' : 'block';

                // Update 'Next' button text based on whether it's the last question
                if (index === questionContainers.length - 1) {
                    nextButton.textContent = 'Submit'; // Changed to 'Submit'
                } else {
                    nextButton.textContent = 'Next';
                }

                // Restore selected state for option buttons and textarea content
                const currentQuestionContainer = questionContainers[currentQuestionIndex];
                const questionId = currentQuestionContainer.id.replace('question-', '');

                // Restore multiple choice selection
                if (currentQuestionContainer.querySelector('.options-container')) {
                    const selectedAnswer = userProfileData[questionId];
                    const optionsForThisQuestion = currentQuestionContainer.querySelectorAll('.option-button');
                    optionsForThisQuestion.forEach(opt => {
                        opt.classList.remove('selected');
                        opt.setAttribute('aria-checked','false');
                        opt.tabIndex = -1;
                        if (opt.getAttribute('data-answer') === selectedAnswer) {
                            opt.classList.add('selected');
                            opt.setAttribute('aria-checked','true');
                            opt.tabIndex = 0;
                        }
                    });
                    if (!selectedAnswer && optionsForThisQuestion[0]) optionsForThisQuestion[0].tabIndex = 0;
                }
                // Restore open-ended text
                else if (currentQuestionContainer.querySelector('textarea')) {
                    const textareaId = currentQuestionContainer.querySelector('textarea').id;
                    currentQuestionContainer.querySelector('textarea').value = userProfileData[textareaId] || '';
                }


                // Enable/disable 'Next' button based on current question's answer status
                updateNextButtonState();
            }

            // Helper to update the state of the 'Next' button (enabled/disabled)
            function updateNextButtonState() {
                const currentQuestionContainer = questionContainers[currentQuestionIndex];
                const questionIdentifier = currentQuestionContainer.id.replace('question-', ''); // e.g., 'humor', 'interests'

                let isAnswered = false;
                if (currentQuestionContainer.querySelector('.options-container')) {
                    // It's a multiple-choice question, check if data-question-id has an answer
                    isAnswered = userProfileData[questionIdentifier] !== undefined;
                } else if (currentQuestionContainer.querySelector('textarea')) {
                    // It's an open-ended question, check textarea content
                    const textareaId = currentQuestionContainer.querySelector('textarea').id;
                    isAnswered = userProfileData[textareaId] && userProfileData[textareaId].trim() !== '';
                }
                nextButton.disabled = !isAnswered;
            }

            // Event listeners for option buttons (multiple choice)
            optionButtons.forEach(button => {
                button.setAttribute('role','radio');
                button.setAttribute('aria-checked','false');
                button.tabIndex = -1;
                button.addEventListener('click', function() {
                    const questionId = this.getAttribute('data-question-id');
                    const answer = this.getAttribute('data-answer');
                    const container = this.closest('.options-container');
                    const optionsForThisQuestion = container.querySelectorAll('.option-button');
                    optionsForThisQuestion.forEach(opt => {
                        opt.classList.remove('selected');
                        opt.setAttribute('aria-checked','false');
                        opt.tabIndex = -1;
                    });
                    this.classList.add('selected');
                    this.setAttribute('aria-checked','true');
                    this.tabIndex = 0;
                    userProfileData[questionId] = answer;
                    updateNextButtonState();
                });
                button.addEventListener('keydown', (e) => {
                    const container = button.closest('.options-container');
                    const options = Array.from(container.querySelectorAll('.option-button'));
                    let index = options.indexOf(button);
                    if (['ArrowRight','ArrowDown'].includes(e.key)) {
                        e.preventDefault();
                        index = (index + 1) % options.length;
                        options[index].focus();
                    } else if (['ArrowLeft','ArrowUp'].includes(e.key)) {
                        e.preventDefault();
                        index = (index - 1 + options.length) % options.length;
                        options[index].focus();
                    } else if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        button.click();
                    }
                });
            });

            document.querySelectorAll('.options-container').forEach(container => {
                container.setAttribute('role','radiogroup');
                const first = container.querySelector('.option-button');
                if (first) first.tabIndex = 0;
            });

            // Event listeners for open-ended text areas
            openEndedTextareas.forEach(textarea => {
                textarea.addEventListener('input', function() { // Use 'input' for real-time validation
                    userProfileData[this.id] = this.value;
                    updateNextButtonState(); // Update button state as user types
                });
                // Also save on blur, to catch cases where user might just paste and click away
                textarea.addEventListener('blur', function() {
                    userProfileData[this.id] = this.value.trim(); // Trim whitespace on blur
                    updateNextButtonState();
                });
            });

            // Global 'Next' button click handler
            nextButton.addEventListener('click', () => {
                const currentQuestionContainer = questionContainers[currentQuestionIndex];
                const questionIdentifier = currentQuestionContainer.id.replace('question-', ''); // e.g., 'humor', 'interests'

                // --- Validation for current question ---
                let isValid = true;
                if (currentQuestionContainer.querySelector('.options-container')) {
                    // Multiple choice validation
                    if (userProfileData[questionIdentifier] === undefined) { // Check for undefined, not just falsy
                        // Using a custom modal/message box instead of alert()
                        showMessage("Please select an option before proceeding.", "warning");
                        isValid = false;
                    }
                } else if (currentQuestionContainer.querySelector('textarea')) {
                    // Open-ended validation
                    const textareaId = currentQuestionContainer.querySelector('textarea').id;
                    if (!userProfileData[textareaId] || userProfileData[textareaId].trim() === '') {
                        showMessage("Please fill out this field before proceeding.", "warning");
                        isValid = false;
                    }
                }

                if (!isValid) {
                    return; // Stop if current question isn't answered
                }

                // --- Navigation Logic ---
                if (currentQuestionIndex < questionContainers.length - 1) {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                } else {
                    // This is the last question, so submit the profile
                    const userName = localStorage.getItem('userName') || 'Unknown User';
                    const fullUserProfile = { userName, ...userProfileData };
                    localStorage.setItem('userProfile', JSON.stringify(fullUserProfile));
                    // Do NOT set isOnboarded yet; finish setup in Settings
                    window.location.href = 'settings.html';
                }
            });

            // Global 'Previous' button click handler
            prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                }
            });

            // Initial display of the first question
            showQuestion(currentQuestionIndex);
        });
    
