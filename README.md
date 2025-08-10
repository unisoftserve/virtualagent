# Virtual Agent Demo (GitHub Pages project site)

This starter is designed for **GitHub Pages** at a URL like:
`https://<your-username>.github.io/<repo>/`

## Quick start
1. Create (or open) your public repo `virtualagent`.
2. Upload all files from this starter into the repo root (index.html, assets/, etc.).
3. GitHub → **Settings → Pages** → Source: `main` branch, folder: `/ (root)` → **Save**.
4. Your site will be live at `https://<your-username>.github.io/virtualagent/` (give it 1–2 minutes).

## Add your chat widget
Open `index.html` and paste your provider’s `<script>` where you see **BOT WIDGET PLACEHOLDER**.

### Example (Botpress Webchat)
```html
<script src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
<script>
  window.botpressWebChat.init({
    "botId": "YOUR_BOT_ID",
    "clientId": "YOUR_CLIENT_ID",
    "composerPlaceholder": "Type your question..."
  });
</script>
```
