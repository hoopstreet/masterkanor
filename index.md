---
layout: default
title: Official Affidavit & Evidence Gallery
---

# BACKUP OFFICIAL AFFIDAVIT STATEMENT OF CHARLES TANAUAN
## CASE PRESENTATION 2025

---

### 📄 AFFIDAVIT

<iframe src="{{ '/affidavit-only.html' | relative_url }}" style="width:100%; height:600px; border:1px solid #ddd; border-radius:8px;"></iframe>

---

### ⚠️ EVIDENCE GALLERY

<div class="evidence-statement">
    <strong>AKO AY BIKTIMA NG CYBERCRIME, HINDI AWTORISADONG EKSPERIMENTASYON,</strong><br />
    <strong>AT NG GRUPONG IT SHADOW, BUSINESS MIRROR,</strong><br />
    <strong>AT MANIPULASYONG MAY KINALAMAN SA CYBERSECURITY SCHEME.</strong>
</div>

<div class="upload-area" id="uploadArea">
    <span class="icon-big">📤</span>
    <p><strong>Drop images here</strong> or click to upload</p>
    <p style="font-size:0.8rem; color:#888;">Images stored in Supabase</p>
    <input type="file" id="imageInput" accept="image/*" multiple />
</div>

<div class="controls">
    <button class="btn btn-success" onclick="addEvidenceCard()">➕ Add Card</button>
    <button class="btn btn-primary" onclick="refreshGallery()">🔄 Refresh</button>
    <button class="btn btn-warning" onclick="resetToDefault()">🔄 Reset Default</button>
</div>

<div id="galleryGrid" class="gallery-grid">
    <div class="loading"><div class="spinner"></div><p>Loading evidence...</p></div>
</div>

<div class="evidence-index">
    <h3>📑 Evidence Index Summary</h3>
    <div id="evidenceIndex"></div>
</div>

---

### 📓 EDIT ON NOTION

<a href="https://gabby-door-ab3.notion.site/BACKUP-OFFICIAL-AFFIDAVIT-STATEMENT-OF-CHARLES-TANAUAN-CASE-PRESENTATION-2025-1-3811958629d6800bb97dfd57d76b1a41" target="_blank" class="btn btn-primary">🚀 Open in Notion</a>

<iframe src="https://gabby-door-ab3.notion.site/BACKUP-OFFICIAL-AFFIDAVIT-STATEMENT-OF-CHARLES-TANAUAN-CASE-PRESENTATION-2025-1-3811958629d6800bb97dfd57d76b1a41" style="width:100%; height:600px; border:1px solid #ddd; border-radius:8px; margin-top:1rem;"></iframe>

---

### ⚙️ SUPABASE SETTINGS

<div class="settings-box">
    <div class="form-group">
        <label>Project URL</label>
        <input type="text" id="supabaseUrl" placeholder="https://xxxxx.supabase.co" />
    </div>
    <div class="form-group">
        <label>Anon Public Key</label>
        <input type="text" id="supabaseKey" placeholder="eyJhbGciOiJIUzI1NiIs..." />
    </div>
    <div class="controls">
        <button class="btn btn-success" onclick="saveSupabaseConfig()">💾 Save</button>
        <button class="btn btn-primary" onclick="testSupabaseConnection()">🔗 Test</button>
        <button class="btn btn-danger" onclick="clearSupabaseConfig()">🗑️ Clear</button>
    </div>
    <div id="connectionStatus" style="margin-top:1rem; padding:0.8rem; border-radius:6px; display:none;"></div>
</div>

<hr />

<p style="text-align:center; color:#666; font-size:0.85rem;">
    Subscribed and sworn to this 20th day of October 2025 in Imus, Cavite.<br />
    Notary Public &bull; Doc. No. ___ &bull; Page No. ___ &bull; Book No. ___ &bull; Series of 2025
</p>
