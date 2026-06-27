// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
let supabaseClient = null;
let currentCards = [];

const DEFAULT_CARDS = [
    { exhibit: 'Exhibit A-1', badge: 'DOC', badge_class: 'badge-doc', title: 'Coinbase Crypto Wallet & Casino Invoices', description: 'Screenshots of unauthorized crypto wallet activities and casino platform invoices discovered on Mario\'s computer showing revenue share operations.', source: 'Mario Nalda Cadisal\'s Computer', date: 'May 2023', thumbs: ['💳 Wallet 1', '💳 Wallet 2', '📄 Invoice 1', '📄 Invoice 2'], tags: ['Para 16', 'Para 17', 'Para 18', 'Crypto', 'Casino'], mapping: 'Supports Para 16-18 - unauthorized casino operations and crypto wallet activities.', sort_order: 0 },
    { exhibit: 'Exhibit A-2', badge: 'SCREENSHOT', badge_class: 'badge-img', title: 'Telegram Financial Transactions', description: 'Screenshots of Telegram conversations where respondents funneled money from influencer cuts and platform commissions to conceal illegal activities.', source: 'Respondents\' Telegram Accounts', date: 'January 2024', thumbs: ['💬 Chat 1', '💬 Chat 2', '💬 Chat 3', '📊 Transactions'], tags: ['Para 18', 'Telegram', 'Financial', 'Concealment'], mapping: 'Directly supports Para 18 - Telegram used to conceal illegal financial transactions.', sort_order: 1 },
    { exhibit: 'Exhibit B-1', badge: 'PHYSICAL', badge_class: 'badge-phys', title: 'Rat Poison Evidence - Attempted Poisoning', description: 'Physical evidence of rat poison container found in Mario\'s possession, confirmed by laboratory analysis showing newly opened rat poison.', source: 'Mario\'s Work Area - Bootcamp', date: 'January 5, 2024', thumbs: ['🔍 Container', '🔍 Lab Report', '🔍 Location'], tags: ['Para 24', 'Para 25', 'Para 26', 'Para 27', 'Physical', 'Poison'], mapping: 'Supports Para 24-27 - discovery of rat poison and attempted poisoning after confrontation.', sort_order: 2 },
    { exhibit: 'Exhibit C-1', badge: 'CYBER', badge_class: 'badge-cyber', title: 'Evidence Tampering - Carl Justin Pagaspas', description: 'Documentation of deleted files, RSS file conversion, corrupted USB data, and laptop damage involving Carl Justin Pagaspas.', source: 'Multiple Devices: Laptop, USB, Computer Units', date: 'January 8-13, 2024', thumbs: ['💾 USB', '💻 Laptop', '📄 Report', '💾 Files'], tags: ['Para 30-47', 'Tampering', 'Corruption', 'AnyDesk'], mapping: 'Documents evidence tampering described in Para 30-47 - file conversion, corruption, obstruction.', sort_order: 3 },
    { exhibit: 'Exhibit D-1', badge: 'TESTIMONY', badge_class: 'badge-test', title: 'Insider Operations & Cybersecurity Cover-Up', description: 'Testimony regarding Mario and Lawrence as insiders, and Carl Justin Pagaspas as cybersecurity personnel bribed to delete evidence.', source: 'Affiant\'s Personal Knowledge', date: 'Post-January 2024', thumbs: ['💬 Statement', '📄 Evidence', '📄 Report'], tags: ['Para 50', 'Para 51', 'Para 52', 'Para 53', 'Insider', 'Cover-up'], mapping: 'Supports Para 50-53 - insider operations, identity theft, obstruction of legal remedies.', sort_order: 4 },
    { exhibit: 'Exhibit E-1', badge: 'TESTIMONY', badge_class: 'badge-test', title: 'IT Shadow / Business Mirror - Psychological Torture', description: 'Testimony regarding the "IT Shadow" or "Business Mirror" group, microchip implantation, brain reader technology, and "Baliktaran" reverse psychology torture.', source: 'Affiant\'s Personal Experience', date: '2024-2025', thumbs: ['💬 Testimony 1', '💬 Testimony 2', '📄 Evidence'], tags: ['Para 54-62', 'IT Shadow', 'Microchip', 'Torture', 'Surveillance'], mapping: 'Supports Para 54-62 - IT Shadow/Business Mirror operations, unauthorized experimentation, psychological torture strategies.', sort_order: 5 },
    { exhibit: 'Exhibit F-1', badge: 'LEGAL', badge_class: 'badge-legal', title: 'Legal Filing History & NBI/PNP Responses', description: 'Documentation of all legal filings: RACU Region 8 (Jan 5, 2024), Raffy Tulfo - NBI QC, NBI Cavite, NBI Bacoor (July 28, 2025).', source: 'Official Filing Records', date: '2024-2025', thumbs: ['📄 Filing 1', '📄 Filing 2', '📄 Filing 3', '📄 Filing 4'], tags: ['Para 82', 'Para 83', 'Para 84', 'Para 85', 'Para 86', 'Para 87', 'Legal', 'NBI', 'PNP'], mapping: 'Documents legal process in Para 82-87 - initial filing, referrals, lack of action.', sort_order: 6 },
    { exhibit: 'Exhibit G-1', badge: 'MEDICAL', badge_class: 'badge-med', title: 'Medical Records & Psychological Evaluation', description: 'Medical records documenting sleep deprivation, psychological trauma, paranoia, and ongoing mental health impacts from unauthorized experimentation.', source: 'Medical Professionals / Hospitals', date: '2024-2025', thumbs: ['📄 Med Report', '📄 Psych Eval', '📄 Prescriptions', '📄 Diagnosis'], tags: ['Para 63-81', 'Medical', 'Psychological', 'Trauma', 'Sleep Deprivation'], mapping: 'Supports Para 63-81 - threats on life, sleep deprivation, psychological torture, microchip effects.', sort_order: 7 }
];

// ============================================================
// INITIALIZE
// ============================================================
function initSupabase() {
    const url = localStorage.getItem('supabaseUrl');
    const key = localStorage.getItem('supabaseKey');
    if (url && key) {
        try {
            supabaseClient = supabase.createClient(url, key);
            return true;
        } catch (e) { return false; }
    }
    return false;
}

// ============================================================
// LOAD CARDS
// ============================================================
async function loadCards() {
    const grid = document.getElementById('galleryGrid');

    if (!supabaseClient) {
        grid.innerHTML = `<div class="loading"><p>⚠️ Supabase not configured. Go to Settings to configure.</p></div>`;
        return;
    }

    try {
        const { data: cards, error } = await supabaseClient
            .from('evidence_cards')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        if (cards && cards.length > 0) {
            currentCards = cards;
        } else {
            await seedDefaultCards();
            const { data: seeded } = await supabaseClient
                .from('evidence_cards')
                .select('*')
                .order('sort_order', { ascending: true });
            currentCards = seeded || [];
        }

        renderCards(currentCards);

    } catch (error) {
        console.error('Load error:', error);
        grid.innerHTML = `<div class="loading"><p>❌ Error: ${error.message}</p></div>`;
    }
}

async function seedDefaultCards() {
    if (!supabaseClient) return;
    const { count } = await supabaseClient.from('evidence_cards').select('*', { count: 'exact', head: true });
    if (count > 0) return;
    for (const card of DEFAULT_CARDS) {
        await supabaseClient.from('evidence_cards').insert([card]);
    }
}

// ============================================================
// RENDER CARDS
// ============================================================
function renderCards(cards) {
    const grid = document.getElementById('galleryGrid');
    const indexDiv = document.getElementById('evidenceIndex');

    if (!cards || cards.length === 0) {
        grid.innerHTML = `<div class="loading"><p>📭 No evidence cards yet. Add one!</p></div>`;
        if (indexDiv) indexDiv.innerHTML = '<p>No cards to index.</p>';
        return;
    }

    grid.innerHTML = '';
    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-card';
        div.draggable = true;
        div.dataset.id = card.id;
        div.dataset.index = index;

        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('dragenter', handleDragEnter);
        div.addEventListener('dragleave', handleDragLeave);
        div.addEventListener('drop', handleDrop);

        const thumbsHtml = card.thumbs && card.thumbs.length > 0
            ? card.thumbs.map(t => `<span class="thumb-item">📎 ${t}</span>`).join('')
            : '';

        const tagsHtml = card.tags && card.tags.length > 0
            ? card.tags.map(t => `<span class="tag ${t.includes('Para') ? 'tag-para' : ''}">● ${t}</span>`).join('')
            : '';

        const cardId = card.id || `card-${Date.now()}-${index}`;

        div.innerHTML = `
            <div class="card-header">
                <span class="exhibit">📄 ${card.exhibit || 'Exhibit'}</span>
                <span class="badge ${card.badge_class || 'badge-custom'}">${card.badge || 'CUSTOM'}</span>
            </div>
            <div class="card-body">
                <div class="title">${card.title || 'Untitled'}</div>
                <div class="desc">${card.description || 'No description.'}</div>
                <div class="meta"><strong>Source:</strong> ${card.source || 'Unknown'}</div>
                <div class="meta"><strong>Date:</strong> ${card.date || 'N/A'}</div>
                <div class="image-preview" id="images-${cardId}">
                    <span style="color:#888; font-size:0.8rem;">Loading images...</span>
                </div>
                ${thumbsHtml ? `<div class="thumb-row">${thumbsHtml}</div>` : ''}
                ${tagsHtml ? `<div class="tag-row">${tagsHtml}</div>` : ''}
                <div class="mapping"><strong>Mapping:</strong> ${card.mapping || 'No mapping set.'}</div>
                <div class="edit-controls">
                    <button class="btn btn-primary" onclick="editCard('${cardId}')">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteCard('${cardId}')">🗑️ Delete</button>
                    <button class="btn btn-warning" onclick="uploadImageForCard('${cardId}')">📤 Add Image</button>
                    <span class="drag-handle" title="Drag to reorder">⠿</span>
                </div>
            </div>
        `;
        grid.appendChild(div);
        loadImagesForCard(cardId);
    });

    // Update index
    if (indexDiv) {
        indexDiv.innerHTML = `<div class="evidence-index-grid">${cards.map(c =>
            `<div><strong>${c.exhibit || '??'}:</strong> ${(c.title || '').substring(0,30)}... → ${(c.tags || []).filter(t => t.includes('Para')).join(', ') || 'No para tags'}</div>`
        ).join('')}</div>`;
    }
}

// ============================================================
// IMAGE FUNCTIONS
// ============================================================
async function loadImagesForCard(cardId) {
    if (!supabaseClient) return;
    try {
        const { data: images, error } = await supabaseClient
            .from('evidence_images')
            .select('*')
            .eq('card_id', cardId);
        if (error) throw error;
        const container = document.getElementById(`images-${cardId}`);
        if (!container) return;
        if (images && images.length > 0) {
            container.innerHTML = images.map(img =>
                `<div style="position:relative; display:inline-block;">
                    <img src="${img.file_url}" alt="${img.file_name}" />
                    <button class="remove-img" onclick="removeImage('${img.id}', '${cardId}')">×</button>
                 </div>`
            ).join('');
        } else {
            container.innerHTML = `<span style="color:#888; font-size:0.8rem;">No images uploaded.</span>`;
        }
    } catch (e) { console.error('Load images error:', e); }
}

async function uploadImageForCard(cardId) {
    if (!supabaseClient) { showToast('Configure Supabase first!', 'error'); return; }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${cardId}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('evidence-images')
                .upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: urlData } = supabaseClient.storage
                .from('evidence-images')
                .getPublicUrl(fileName);
            const { error: dbError } = await supabaseClient
                .from('evidence_images')
                .insert([{ card_id: cardId, file_name: file.name, file_url: urlData.publicUrl, file_type: file.type }]);
            if (dbError) throw dbError;
            showToast('Image uploaded!', 'success');
            loadImagesForCard(cardId);
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Upload failed: ' + error.message, 'error');
        }
    };
    input.click();
}

async function removeImage(imageId, cardId) {
    if (!confirm('Remove this image?')) return;
    if (!supabaseClient) return;
    try {
        await supabaseClient.from('evidence_images').delete().eq('id', imageId);
        showToast('Image removed', 'info');
        loadImagesForCard(cardId);
    } catch (e) { showToast('Error removing image', 'error'); }
}

// ============================================================
// DRAG & DROP
// ============================================================
let dragId = null;

function handleDragStart(e) {
    dragId = this.dataset.id;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) { this.classList.remove('dragging'); document.querySelectorAll('.gallery-card').forEach(c => c.classList.remove('drag-over')); }
function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function handleDragEnter(e) { e.preventDefault(); this.classList.add('drag-over'); }
function handleDragLeave(e) { this.classList.remove('drag-over'); }

async function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const targetId = this.dataset.id;
    if (dragId && dragId !== targetId) {
        const dragIndex = currentCards.findIndex(c => c.id === dragId);
        const targetIndex = currentCards.findIndex(c => c.id === targetId);
        if (dragIndex !== -1 && targetIndex !== -1) {
            const [moved] = currentCards.splice(dragIndex, 1);
            currentCards.splice(targetIndex, 0, moved);
            for (let i = 0; i < currentCards.length; i++) {
                currentCards[i].sort_order = i;
                await supabaseClient.from('evidence_cards').update({ sort_order: i }).eq('id', currentCards[i].id);
            }
            showToast('Cards reordered!', 'success');
            renderCards(currentCards);
        }
    }
    dragId = null;
}

// ============================================================
// CARD CRUD
// ============================================================
async function addEvidenceCard() {
    if (!supabaseClient) { showToast('Configure Supabase first!', 'error'); return; }
    const newCard = {
        exhibit: `Exhibit ${String.fromCharCode(65 + currentCards.length)}-${Math.floor(Math.random()*9)+1}`,
        badge: 'CUSTOM', badge_class: 'badge-custom',
        title: 'New Evidence Card',
        description: 'Add your evidence description here.',
        source: 'Source information',
        date: new Date().toLocaleDateString(),
        thumbs: ['📎 Item 1', '📎 Item 2'],
        tags: ['New', 'Evidence'],
        mapping: 'Add mapping to affidavit paragraphs.',
        sort_order: currentCards.length
    };
    try {
        const { data, error } = await supabaseClient.from('evidence_cards').insert([newCard]).select();
        if (error) throw error;
        if (data && data[0]) { currentCards.push(data[0]); renderCards(currentCards); showToast('Card added!', 'success'); }
    } catch (error) { showToast('Error: ' + error.message, 'error'); }
}

async function editCard(cardId) {
    const card = currentCards.find(c => c.id === cardId);
    if (!card) return;
    const fields = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'source', label: 'Source' },
        { key: 'date', label: 'Date' },
        { key: 'mapping', label: 'Mapping' },
        { key: 'exhibit', label: 'Exhibit' },
        { key: 'badge', label: 'Badge (DOC, SCREENSHOT, etc.)' },
        { key: 'badge_class', label: 'Badge Class (badge-doc, badge-img, etc.)' },
        { key: 'tags', label: 'Tags (comma separated)' }
    ];
    let updated = { ...card };
    for (const field of fields) {
        const currentValue = field.key === 'tags' ? (card.tags || []).join(', ') : card[field.key] || '';
        const value = prompt(`Edit ${field.label}:`, currentValue);
        if (value === null) return;
        if (field.key === 'tags') { updated.tags = value.split(',').map(t => t.trim()).filter(t => t); }
        else { updated[field.key] = value; }
    }
    try {
        await supabaseClient.from('evidence_cards').update({
            title: updated.title, description: updated.description, source: updated.source,
            date: updated.date, mapping: updated.mapping, exhibit: updated.exhibit,
            badge: updated.badge, badge_class: updated.badge_class, tags: updated.tags,
            updated_at: new Date().toISOString()
        }).eq('id', cardId);
        const index = currentCards.findIndex(c => c.id === cardId);
        if (index !== -1) { currentCards[index] = { ...currentCards[index], ...updated }; }
        renderCards(currentCards);
        showToast('Card updated!', 'success');
    } catch (error) { showToast('Error: ' + error.message, 'error'); }
}

async function deleteCard(cardId) {
    if (!confirm('Delete this evidence card?')) return;
    if (!supabaseClient) return;
    try {
        await supabaseClient.from('evidence_cards').delete().eq('id', cardId);
        currentCards = currentCards.filter(c => c.id !== cardId);
        renderCards(currentCards);
        showToast('Card deleted', 'info');
    } catch (error) { showToast('Error: ' + error.message, 'error'); }
}

async function resetToDefault() {
    if (!confirm('Reset to default cards? This will overwrite all data!')) return;
    if (!supabaseClient) return;
    try {
        for (const card of currentCards) {
            await supabaseClient.from('evidence_images').delete().eq('card_id', card.id);
        }
        await supabaseClient.from('evidence_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        for (const card of DEFAULT_CARDS) {
            await supabaseClient.from('evidence_cards').insert([card]);
        }
        showToast('Reset to default!', 'success');
        loadCards();
    } catch (error) { showToast('Error: ' + error.message, 'error'); }
}

function refreshGallery() { loadCards(); showToast('Refreshed!', 'info'); }

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// SETTINGS
// ============================================================
function saveSupabaseConfig() {
    const url = document.getElementById('supabaseUrl').value.trim();
    const key = document.getElementById('supabaseKey').value.trim();
    if (!url || !key) { showToast('Please fill in both fields', 'error'); return; }
    localStorage.setItem('supabaseUrl', url);
    localStorage.setItem('supabaseKey', key);
    const init = initSupabase();
    if (init) { showToast('Configuration saved!', 'success'); testSupabaseConnection(); }
    else { showToast('Invalid configuration', 'error'); }
}

async function testSupabaseConnection() {
    const statusDiv = document.getElementById('connectionStatus');
    statusDiv.style.display = 'block';
    if (!supabaseClient) {
        const url = localStorage.getItem('supabaseUrl');
        const key = localStorage.getItem('supabaseKey');
        if (url && key) { supabaseClient = supabase.createClient(url, key); }
        else { statusDiv.innerHTML = '❌ No configuration found.'; statusDiv.style.background = '#f8d7da'; statusDiv.style.color = '#721c24'; return; }
    }
    try {
        await supabaseClient.from('evidence_cards').select('count', { count: 'exact', head: true });
        statusDiv.innerHTML = '✅ Connection successful! Connected to Supabase.';
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        showToast('Connected to Supabase!', 'success');
        loadCards();
    } catch (error) {
        statusDiv.innerHTML = '❌ Connection failed: ' + error.message;
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        showToast('Connection failed', 'error');
    }
}

function clearSupabaseConfig() {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    document.getElementById('supabaseUrl').value = '';
    document.getElementById('supabaseKey').value = '';
    document.getElementById('connectionStatus').style.display = 'none';
    supabaseClient = null;
    showToast('Configuration cleared', 'info');
}

// ============================================================
// UPLOAD AREA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Load saved config
    const savedUrl = localStorage.getItem('supabaseUrl');
    const savedKey = localStorage.getItem('supabaseKey');
    if (savedUrl) {
        const urlInput = document.getElementById('supabaseUrl');
        if (urlInput) urlInput.value = savedUrl;
    }
    if (savedKey) {
        const keyInput = document.getElementById('supabaseKey');
        if (keyInput) keyInput.value = savedKey;
    }

    const init = initSupabase();
    if (init) { loadCards(); }

    // Upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageInput');
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const cardId = prompt('Enter Card ID to attach images to:\nAvailable: ' + currentCards.map(c => c.id).join(', '));
                if (cardId) {
                    for (const file of files) {
                        const fakeEvent = { target: { files: [file] } };
                        uploadImageForCardWithFile(cardId, file);
                    }
                }
            }
        });
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                const cardId = prompt('Enter Card ID to attach images to:\nAvailable: ' + currentCards.map(c => c.id).join(', '));
                if (cardId) {
                    for (const file of files) {
                        uploadImageForCardWithFile(cardId, file);
                    }
                }
            }
            fileInput.value = '';
        });
    }
});

async function uploadImageForCardWithFile(cardId, file) {
    if (!supabaseClient) { showToast('Configure Supabase first!', 'error'); return; }
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${cardId}/${Date.now()}.${fileExt}`;
        await supabaseClient.storage.from('evidence-images').upload(fileName, file);
        const { data: urlData } = supabaseClient.storage.from('evidence-images').getPublicUrl(fileName);
        await supabaseClient.from('evidence_images').insert([{ card_id: cardId, file_name: file.name, file_url: urlData.publicUrl, file_type: file.type }]);
        showToast('Image uploaded!', 'success');
        loadImagesForCard(cardId);
    } catch (error) { showToast('Upload failed: ' + error.message, 'error'); }
}

// ============================================================
// EXPOSE TO GLOBAL
// ============================================================
window.addEvidenceCard = addEvidenceCard;
window.editCard = editCard;
window.deleteCard = deleteCard;
window.resetToDefault = resetToDefault;
window.refreshGallery = refreshGallery;
window.uploadImageForCard = uploadImageForCard;
window.removeImage = removeImage;
window.saveSupabaseConfig = saveSupabaseConfig;
window.testSupabaseConnection = testSupabaseConnection;
window.clearSupabaseConfig = clearSupabaseConfig;
window.loadCards = loadCards;
window.showToast = showToast;
window.uploadImageForCardWithFile = uploadImageForCardWithFile;
