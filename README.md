# 🎨 Cuemath Social Studio AI

An AI-powered studio that transforms rough ideas into polished, ready-to-post social media creatives for parents.

---

## 🌐 Live Demo
👉 https://cuemath-social-studio-eight.vercel.app/

---

## 🧠 Problem

Creating engaging educational social media content is slow, manual, and inconsistent.  
Teams struggle to convert rough ideas into structured, visually appealing posts across formats like carousels, stories, and posts.

---

## 💡 Solution

This project turns a simple idea into a **designed, multi-slide social media creative**.

Example input:
> "Carousel for parents about why kids forget what they learn and how spaced repetition helps"

Output:
- Structured carousel (hook → explanation → takeaway)
- Ready-to-use design
- Exportable content

---

## ✨ Features

- 🧠 AI-generated structured content (using Groq)
- 🎯 Multiple formats:
  - Instagram Post (1:1)
  - Story (9:16)
  - Carousel (multi-slide)
- 🎨 Clean and consistent design system
- 🔁 **Selective slide regeneration** (refine one slide only)
- 📦 Export as PNG / ZIP
- ⚡ Fast generation and smooth UI
- 🎭 Theme support (brand consistency)

---

## 🏗️ Architecture
User Idea
   ↓
Groq API (LLM)
   ↓
Structured Slides (Hook → Content → CTA)
   ↓
UI Rendering (Next.js + Tailwind)
   ↓
Export (PNG / ZIP)


---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript  
- **Styling:** Tailwind CSS  
- **AI:** Groq (LLM inference)  
- **Export:** html-to-image, JSZip, file-saver  
- **Deployment:** Vercel  

---

## ⚖️ Key Decisions & Tradeoffs

- Used **Groq** for fast and efficient text generation  
- Focused on **structured text + design** instead of full image generation for speed and reliability  
- Implemented **slide-level regeneration** to reduce redundant API calls  
- Prioritized **clean UX and iteration speed** over feature overload  

---

## 🔄 What I Would Improve

- Add AI-generated background images (multimodal support)  
- Introduce tone/style controls (funny, formal, storytelling)  
- Add caching for faster repeated generations  
- Improve export customization  

---

## ⚠️ Challenges Faced

- TypeScript issues with external libraries (file-saver) during deployment  
- Handling environment variables securely in production  
- Managing client-side rendering for export features  

### ✅ Solutions
- Added custom type declarations  
- Used environment variables properly in Vercel  
- Optimized component rendering and state handling  

---

## 🔐 Security

- API keys are stored securely in environment variables  
- No sensitive data is exposed in the frontend or repository  

---

## 🚀 Getting Started (Local Setup)

```bash
git clone https://github.com/Meet03-hub/cuemath-ai-studio
cd cuemath-ai-studio
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_api_key_here
```

## 📸 Screenshots

<img width="649" height="373" alt="image" src="https://github.com/user-attachments/assets/bca9125b-631e-4563-b75f-e90c8c017d92" />

<img width="433" height="386" alt="image" src="https://github.com/user-attachments/assets/a8a9c92e-de27-486c-9630-991f872d4a5e" /> <img width="209" height="386" alt="image" src="https://github.com/user-attachments/assets/eba94a8d-5e16-4201-b8d5-fea5beff3435" />


## 🙌 Final Thoughts

This project focuses on turning messy human input into structured, visually engaging content while maintaining speed, usability, and flexibility.

It is designed as a usable product, not just a content generator.

