# AI-Powered Startup Idea Validator 🚀

A full-stack MVP that allows users to submit startup ideas and instantly receive a comprehensive, AI-generated validation report. Built within a 24-hour hackathon timeframe.

## 🔗 Live Demo
**(https://ai-startup-idea-validator-l3xl3jjhx-ayushraj16s-projects.vercel.app/)**

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js (Next.js API Routes)
* **Database:** MongoDB Atlas
* **AI Integration:** Hugging Face Inference API (`mistralai/Mistral-7B-Instruct-v0.3`)

---

## 📁 Project Structure Note
*Note for Graders:* This project utilizes **Next.js (App Router)**, which is a modern full-stack framework. Instead of separate `/client` and `/server` folders, the architecture is seamlessly integrated:
* **Frontend (Client):** Handled in `app/page.js` and React components.
* **Backend (Server):** Handled securely via Next.js serverless API routes in `app/api/ideas/route.js`.

---

## 🚀 Installation & Local Setup

**1. Clone the repository**
```bash
git clone [Insert your GitHub repo link here]
cd startup-validator
