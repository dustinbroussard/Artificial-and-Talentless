document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isOnboarded') === 'true') {
    window.location.href = 'generator.html';
    return;
  }

  const continueButton = document.getElementById('continue-button');
  const introTextElement = document.getElementById('intro-text');
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

  const selectedIntro = introLines[Math.floor(Math.random() * introLines.length)];

  function typeWriter(el, text, i, cb) {
    if (i < text.length) {
      if (i === 0) el.textContent = '';
      el.textContent += text.charAt(i);
      setTimeout(() => typeWriter(el, text, i + 1, cb), 30 + Math.random() * 70);
    } else if (cb) {
      setTimeout(cb, 1500);
    }
  }

  continueButton.disabled = true;
  typeWriter(introTextElement, selectedIntro, 0, () => {
    continueButton.disabled = false;
  });

  continueButton.addEventListener('click', () => {
    window.location.href = 'questions.html';
  });
});
