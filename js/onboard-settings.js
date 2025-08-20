document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isOnboarded') === 'true') {
    window.location.href = 'generator.html';
    return;
  }

  const apiKeyInput = document.getElementById('openrouter-api-key');
  const modelSelect = document.getElementById('openrouter-model-select');
  const filterFree = document.getElementById('filter-free-models');
  const spinner = document.getElementById('model-loading-spinner');
  const contentTypeSelect = document.getElementById('content-type-select');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  let allModels = [];
  let lastKey = '';
  const debounce = (fn, delay = 400) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); }; };

  async function fetchModels() {
    const key = apiKeyInput.value.trim();
    if (!key || key === lastKey) return;
    lastKey = key;
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
      nextButton.disabled = true;
      nextButton.title = filterFree.checked ? 'No free models available' : '';
      if (filterFree.checked) showMessage('No free models available with this key.', 'info');
    } else {
      models.sort((a, b) => a.name.localeCompare(b.name));
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        modelSelect.appendChild(opt);
      });
      nextButton.title = '';
    }
    const stored = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (stored.selectedModel) modelSelect.value = stored.selectedModel;
    updateState();
  }

  function updateState() {
    const ok = apiKeyInput.value.trim() && modelSelect.value && contentTypeSelect.value;
    nextButton.disabled = !ok;
  }

  apiKeyInput.addEventListener('input', () => { updateState(); debouncedFetch(); });
  modelSelect.addEventListener('change', () => {
    updateState();
    const appSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    appSettings.selectedModel = modelSelect.value;
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  });
  contentTypeSelect.addEventListener('change', () => {
    updateState();
    const appSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    appSettings.contentType = contentTypeSelect.value;
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  });
  filterFree.addEventListener('change', populateModels);

  prevButton.addEventListener('click', () => { window.location.href = 'questions.html'; });
  nextButton.addEventListener('click', () => {
    const appSettings = { apiKey: apiKeyInput.value.trim(), selectedModel: modelSelect.value, contentType: contentTypeSelect.value };
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    localStorage.setItem('isOnboarded', 'true');
    window.location.href = 'generator.html';
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
