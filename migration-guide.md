# Project Migration Guide (Home Glow Interiors)

This guide covers how to migrate your entire project—including the frontend (HTML/CSS/JS) and the Sanity Studio—to a new machine, repository, or hosting provider. It also includes an AI Prompt if you want to migrate your vanilla HTML frontend to a modern framework like Next.js.

## 1. Migrating to a New Machine or Repository

If you are just moving this project to a new computer or pushing it to GitHub:

### Step 1: Initialize Git & Push (If not already on GitHub)
```bash
# In the root of your project
git init
git add .
git commit -m "Initial commit"
# Link to your new repository and push
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 2: Clone on the New Machine
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd "home glow interiors"
```

### Step 3: Install Sanity Studio Dependencies
Since the `studio` folder contains Node.js packages, you must install them before running Sanity.
```bash
cd studio
npm install
```

### Step 4: Environment Variables (Important)
Make sure you copy any `.env` or `.env.development` files from your old `studio` folder to the new one, as these are typically ignored by Git (in `.gitignore`).
- If you don't have them, you will need to re-login to Sanity:
```bash
npx sanity login
```

---

## 2. Migrating Sanity Content (Exporting/Importing Data)

If you are moving to a completely new Sanity Project ID (e.g., handing over to a client):

**Export Data from Old Project:**
```bash
cd studio
npx sanity dataset export <dataset-name> export.tar.gz
```
*(Default dataset is usually `production`)*

**Import Data to New Project:**
1. Update `sanity.config.js` and `sanity.cli.js` with the new `projectId`.
2. Import the data:
```bash
npx sanity dataset import export.tar.gz <new-dataset-name>
```

---

## 3. Deploying the Project

If you are migrating from local development to the live web (e.g., using Vercel or Netlify):

1. **Frontend (HTML files):** 
   - You can drag and drop your root folder into Netlify, or link your GitHub repo to Vercel. Both support static HTML sites out of the box.
2. **Sanity Studio:**
   - Run the deploy command inside the `studio` folder:
     ```bash
     cd studio
     npx sanity deploy
     ```
   - This will host your studio at a `*.sanity.studio` URL.

---

## 4. AI Prompt for Framework Migration (HTML to Next.js/React)

If you meant migrating your vanilla HTML/JS project into a modern React/Next.js application that tightly integrates with Sanity, copy and paste the prompt below to an AI assistant:

> **Copy the Prompt Below:**
> 
> "I have an existing web project for an interior design company called 'Home Glow Interiors'. Currently, it consists of static HTML/CSS/JS files and a separate Sanity Studio backend located in a `studio/` folder. 
> 
> I want to migrate the frontend from vanilla HTML to Next.js (App Router) with Tailwind CSS, while keeping the existing Sanity backend.
> 
> Here is what I need you to do:
> 1. Set up a new Next.js project in the root directory.
> 2. Create a plan to migrate my existing HTML structure (like `index.html`, `about.html`, `blog-spacesaving.html`) into reusable React components (Header, Footer, Layout) and Next.js routes (`/`, `/about`, `/blog/[slug]`).
> 3. Provide the steps to configure `next-sanity` to fetch data from my existing Sanity Studio (which contains schemas for blogs and transformations).
> 4. Tell me how to convert my existing `css/style.css` into Tailwind CSS utility classes or global CSS in the new Next.js app.
> 
> Please give me a step-by-step implementation plan."
