document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isOnboarded') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const apiKeyInput = document.getElementById('openrouter-api-key');
  const modelSelect = document.getElementById('openrouter-model-select');
  const filterFree = document.getElementById('filter-free-models');
  const spinner = document.getElementById('model-loading-spinner');
  const contentTypeSelect = document.getElementById('content-type-select');
  const deleteBtn = document.getElementById('delete-data-button');
  const backBtn = document.getElementById('back-to-generator-button');
  const saveBtn = document.getElementById('save-settings-button');

  let allModels = [];
  const debounce = (fn, delay = 500) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); }; };

  async function fetchModels() {
    const key = apiKeyInput.value.trim();
    if (!key) return;
    spinner.style.display = 'block';
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    try {
      const resp = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
      });
      if (!resp.ok) throw new Error(resp.statusText);
      const data = await resp.json();
      allModels = data.data.map(m => ({ id: m.id, name: m.name, free: m.pricing?.prompt === 0 && m.pricing?.completion === 0 }));
    } catch (e) {
      showMessage(`Failed to load models: ${e.message}`, 'error');
      allModels = [];
    } finally {
      spinner.style.display = 'none';
      modelSelect.disabled = false;
      populateModels();
    }
  }

  const debouncedFetch = debounce(fetchModels);

  function populateModels() {
    modelSelect.innerHTML = '';
    let models = allModels;
    if (filterFree.checked) models = models.filter(m => m.free);
    if (models.length === 0) {
      modelSelect.innerHTML = '<option value="">No models found</option>';
    } else {
      models.sort((a, b) => a.name.localeCompare(b.name));
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        modelSelect.appendChild(opt);
      });
    }
    const stored = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (stored.selectedModel) modelSelect.value = stored.selectedModel;
    updateState();
  }

  function updateState() {
    const ok = apiKeyInput.value.trim() && modelSelect.value && contentTypeSelect.value;
    saveBtn.disabled = !ok;
  }

  apiKeyInput.addEventListener('input', () => { updateState(); debouncedFetch(); });
  modelSelect.addEventListener('change', updateState);
  contentTypeSelect.addEventListener('change', updateState);
  filterFree.addEventListener('change', populateModels);

  backBtn.addEventListener('click', () => { window.location.href = 'generator.html'; });
  saveBtn.addEventListener('click', () => {
    const appSettings = { apiKey: apiKeyInput.value.trim(), selectedModel: modelSelect.value, contentType: contentTypeSelect.value };
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    showMessage('Settings saved', 'info');
  });

  deleteBtn.addEventListener('click', async () => {
    const ok = await showConfirm('Delete all data and restart?');
    if (ok) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  });

  const stored = JSON.parse(localStorage.getItem('appSettings') || '{}');
  if (stored.apiKey) apiKeyInput.value = stored.apiKey;
  if (stored.contentType) contentTypeSelect.value = stored.contentType;
  if (apiKeyInput.value.trim()) fetchModels();
  else {
    modelSelect.innerHTML = '<option value="">Enter API Key to load models</option>';
    modelSelect.disabled = true;
    updateState();
  }
});
