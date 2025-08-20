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
      box.innerHTML = `<p style="margin-bottom:10px;">${text}</p>`+
        '<div style="display:flex;gap:10px;justify-content:center;">'+
        '<button id="confirm-yes" class="nav-button" style="flex:0 0 auto;">Yes</button>'+ 
        '<button id="confirm-no" class="nav-button" style="flex:0 0 auto;">No</button>'+ 
        '</div>';
      document.body.appendChild(box);
      box.querySelector('#confirm-yes').addEventListener('click', () => { box.remove(); resolve(true); });
      box.querySelector('#confirm-no').addEventListener('click', () => { box.remove(); resolve(false); });
    });
  }

  window.showMessage = showMessage;
  window.showConfirm = showConfirm;
})();
