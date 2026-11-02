# ChinaMaster 中文大师

Free HSK 1 (HSK 2.0) learning site. React + TypeScript + Vite + Tailwind. No backend, no accounts; progress is saved in localStorage.

**Status:** Part 4 of 6 done (24-topic grammar course, scaffold, i18n, storage, home, 150-word dataset, lesson pages with matching and quiz, vocabulary page with search, flashcards, favorites). Listening, characters, exercises, exam and dashboard arrive in Parts 5–6.

Vocabulary notes: headwords are in dictionary form (e.g. 不客气 `bú kèqi`); example sentences show tone sandhi (e.g. 一个 `yí ge`). The dataset is checked at startup by `validateVocabulary()` (150 unique words, 10 per lesson).

## Run locally
    npm install
    npm run dev

## Build
    npm run build

## Deploy to GitHub Pages
1. Create a new repository on github.com (any name; nothing needs configuring in the code, because `vite.config.ts` uses a relative base `./` and the app uses hash routing `/#/...`).
2. Upload this project (`git init`, `git add .`, `git commit`, `git remote add origin <url>`, `git push -u origin main`).
3. In the repository: Settings → Pages → Source: **GitHub Actions**.
4. Push to `main` (or run the workflow from the Actions tab). When it finishes, the URL is `https://<your-username>.github.io/<repository-name>/` and is also shown in the workflow's deploy step.

## Limitations
Speech uses the browser's Web Speech API; availability of Chinese (zh-CN) voices depends on the device.
