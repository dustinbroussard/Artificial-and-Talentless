document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isOnboarded') === 'true') {
    window.location.href = 'generator.html';
    return;
  }

  const nameInput = document.getElementById('name-input');
  const continueButton = document.getElementById('continue-button');

  function update() {
    continueButton.disabled = !nameInput.value.trim();
  }

  nameInput.addEventListener('input', update);
  update();

  continueButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;
    localStorage.setItem('userName', name);
    window.location.href = 'intro.html';
  });

  nameInput.focus();
});
