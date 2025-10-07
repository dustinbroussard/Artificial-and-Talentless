(function () {
  function showMessage(text, type = 'info') {
    const box = document.createElement('div');
    box.className = `message-box ${type}`;
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--text)',
      color: 'var(--bg)',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px var(--shadow)',
      zIndex: '1000',
      opacity: '0',
      transition: 'opacity .3s ease'
    });
    box.textContent = text;
    document.body.appendChild(box);
    requestAnimationFrame(() => {
      box.style.opacity = '1';
    });
    setTimeout(() => {
      box.style.opacity = '0';
      box.addEventListener('transitionend', () => box.remove());
    }, 3000);
  }

  function showActionMessage(text, actionLabel, onAction, { timeout = 5000 } = {}) {
    const box = document.createElement('div');
    box.className = 'message-box action';
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--text)',
      color: 'var(--bg)',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px var(--shadow)',
      zIndex: '1000',
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    });
    const p = document.createElement('span');
    p.textContent = text;
    const btn = document.createElement('button');
    btn.className = 'nav-button';
    btn.style.flex = '0 0 auto';
    btn.textContent = actionLabel || 'OK';
    btn.addEventListener('click', () => {
      try { onAction && onAction(); } finally { box.remove(); }
    });
    box.appendChild(p);
    box.appendChild(btn);
    document.body.appendChild(box);
    if (timeout > 0) {
      setTimeout(() => { if (box.isConnected) box.remove(); }, timeout);
    }
    return box;
  }

  function showConfirm(text) {
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'message-box confirm';
      Object.assign(box.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--text)',
        color: 'var(--bg)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px var(--shadow)',
        zIndex: '1000'
      });

      const p = document.createElement('p');
      p.style.marginBottom = '10px';
      p.textContent = text;

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '10px';
      actions.style.justifyContent = 'center';

      const yesBtn = document.createElement('button');
      yesBtn.id = 'confirm-yes';
      yesBtn.className = 'nav-button';
      yesBtn.style.flex = '0 0 auto';
      yesBtn.textContent = 'Yes';

      const noBtn = document.createElement('button');
      noBtn.id = 'confirm-no';
      noBtn.className = 'nav-button';
      noBtn.style.flex = '0 0 auto';
      noBtn.textContent = 'No';

      actions.appendChild(yesBtn);
      actions.appendChild(noBtn);
      box.appendChild(p);
      box.appendChild(actions);
      document.body.appendChild(box);

      yesBtn.addEventListener('click', () => { box.remove(); resolve(true); });
      noBtn.addEventListener('click', () => { box.remove(); resolve(false); });
    });
  }

  window.showMessage = showMessage;
  window.showActionMessage = showActionMessage;
  window.showConfirm = showConfirm;
})();
