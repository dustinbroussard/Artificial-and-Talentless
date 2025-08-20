document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isOnboarded') === 'true') {
    window.location.href = 'generator.html';
    return;
  }

  const button = document.getElementById('get-started-button');
  const tagline = document.querySelector('.tagline');
  const subTagline = document.querySelector('.sub-tagline');
  const taglineText = 'An AI-powered minimalist typewriter generates personalized insults just for you.';
  const subTaglineText = "Enjoy. Or don't. Whatever.";

  function typeWriter(el, text, i, cb) {
    if (i < text.length) {
      if (i === 0) el.textContent = '';
      el.textContent += text.charAt(i);
      setTimeout(() => typeWriter(el, text, i + 1, cb), 50 + Math.random() * 50);
    } else if (cb) {
      setTimeout(cb, 500);
    }
  }

  button.disabled = true;
  setTimeout(() => {
    typeWriter(tagline, taglineText, 0, () => {
      typeWriter(subTagline, subTaglineText, 0, () => {
        button.disabled = false;
      });
    });
  }, 1000);

  button.addEventListener('click', () => {
    window.location.href = 'name.html';
  });
});
