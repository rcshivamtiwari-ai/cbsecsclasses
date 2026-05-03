# 🏫 Chinmaya Vidyalaya LMS — Complete Deployment Guide
## For Shivam Tiwari Sir — Zero Coding Experience Required

---

## 📋 What You Will Have After This

A fully working website like this:
- `https://vidyalaya.vercel.app` (your custom URL after deployment)
- Students login → Read notes → Practice code → Take tests → Join live classes
- You monitor everything from the admin panel

**Total Cost: ₹0 (100% Free)**
**Time to deploy: ~45 minutes**

---

## 🧰 What You Need

- A computer with internet connection
- Email address (for creating accounts)
- That's it! No technical knowledge needed.

---

## PHASE 1: Create Free Accounts (15 minutes)

### Step 1 — GitHub Account (stores your code)

1. Open browser, go to: **https://github.com**
2. Click **Sign up**
3. Enter email, password, username
4. Verify your email
5. ✅ Done

### Step 2 — MongoDB Atlas Account (free database)

1. Go to: **https://cloud.mongodb.com**
2. Click **Try Free**
3. Sign up with your email
4. After login:
   - Click **Build a Database**
   - Choose **M0 FREE** (the free tier — 512MB, enough for years)
   - Provider: **AWS**, Region: **Mumbai (ap-south-1)** (closest to Unchahar)
   - Cluster name: `vidyalaya` → Click **Create**
5. Security:
   - Username: `vidyalaya_admin` (write this down!)
   - Password: Create a strong one (write this down!)
   - Click **Create User**
6. Network Access:
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Click **Confirm**
7. Get your connection string:
   - Click **Connect** on your cluster
   - Choose **Drivers**
   - Copy the string — it looks like:
     `mongodb+srv://vidyalaya_admin:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - **Replace `<password>` with your actual password**
   - Add `vidyalaya?retryWrites=true&w=majority` at the end
   - Final string: `mongodb+srv://vidyalaya_admin:YOUR_PASS@cluster0.xxxxx.mongodb.net/vidyalaya?retryWrites=true&w=majority`
8. ✅ Done — Save this connection string!

### Step 3 — Vercel Account (free hosting)

1. Go to: **https://vercel.com**
2. Click **Sign up** → **Continue with GitHub**
3. Allow all permissions
4. ✅ Done

---

## PHASE 2: Upload Code to GitHub (10 minutes)

### Step 4 — Download the project code

1. You received a ZIP file of the project
2. Extract it to a folder on your desktop

### Step 5 — Upload to GitHub

**Option A: Using GitHub Website (Easier)**

1. Go to **https://github.com** → Click **+** → **New repository**
2. Name: `chinmaya-vidyalaya-lms`
3. Make it **Private**
4. Click **Create repository**
5. Click **Upload an existing file**
6. Drag and drop ALL files from the extracted folder
7. Click **Commit changes**

**Option B: Using GitHub Desktop App**

1. Download GitHub Desktop: **https://desktop.github.com**
2. Install and sign in
3. Click **File → Add Local Repository**
4. Choose your extracted folder
5. Click **Publish repository**

---

## PHASE 3: Deploy to Vercel (10 minutes)

### Step 6 — Deploy the website

1. Go to **https://vercel.com** → Click **Add New → Project**
2. Click **Import** next to your `chinmaya-vidyalaya-lms` repository
3. Keep all default settings
4. Click **Environment Variables** → Add these one by one:

```
Variable Name              Value
─────────────────────────────────────────────────────────
MONGODB_URI               [Paste your MongoDB string here]
NEXTAUTH_SECRET           [Generate: go to passwordsgenerator.net, 32 chars]
NEXTAUTH_URL              https://YOUR-PROJECT.vercel.app
```

5. Click **Deploy**
6. Wait 2-3 minutes (Vercel builds your site)
7. Your site is LIVE! Copy your URL (e.g., `https://vidyalaya.vercel.app`)
8. **Update NEXTAUTH_URL** in Vercel settings to match your URL

---

## PHASE 4: Create Your Admin Account (5 minutes)

### Step 7 — Create the teacher (admin) account

1. Go to your Vercel project dashboard
2. Click **Functions** tab (or use the Vercel CLI)

**OR use this easier method:**

1. In your GitHub repository, find `scripts/seed.js`
2. Edit the MONGODB_URI line to put your actual MongoDB connection string
3. On your computer, open Command Prompt/Terminal
4. Type these commands:
```
npm install mongoose bcryptjs
node scripts/seed.js
```

This creates:
- **Email:** shivam.tiwari@chinmayavidyalaya.edu
- **Password:** Admin@Vidyalaya123

5. ⚠️ **CHANGE THIS PASSWORD** after first login!

---

## PHASE 5: First Login & Setup (5 minutes)

### Step 8 — Login as Admin

1. Go to your website URL
2. Login with:
   - Email: `shivam.tiwari@chinmayavidyalaya.edu`
   - Password: `Admin@Vidyalaya123`
3. You will see the **Admin Dashboard**

---

## PHASE 6: Add Your Students (10 minutes)

### Step 9 — Add students one by one OR bulk upload

**Bulk Upload (for many students):**

1. Go to **Admin → Students → Bulk Upload**
2. Download the template (CSV file)
3. Open it in Excel/Google Sheets
4. Fill in all student details:
   ```
   name, email, class, rollNumber, section, fatherName, phone, village, distanceFromSchool
   Rahul Sharma, rahul.sharma@student.cv.edu, XII, 001, A, Ramesh Sharma, 9876543210, Unchahar, 5
   ```
5. Save as CSV
6. Paste the content in the bulk upload box
7. Click Upload

**Default Password for bulk-added students:**
Each student's password = `RollNumber@Vidyalaya`
Example: Roll 001 → Password is `001@Vidyalaya`

---

## PHASE 7: Add Study Notes

### Step 10 — Add your first note

1. Go to **Admin → Notes & Topics**
2. Click **Add Note**
3. Fill in:
   - **Title**: e.g., "Functions in Python - Complete Guide"
   - **Subject**: Python
   - **Class**: XII
   - **Topic**: User Defined Functions
   - **Content**: Write in simple format:
     ```
     ## What is a Function?
     A function is a block of code that runs when called.
     
     ## Why Use Functions?
     - Reduces repetition
     - Makes code organized
     - Easy to debug
     ```
   - **Syntax Example**: Write the code example
   - **Key Points**: One per line (these appear as bullet points)
   - **Tips**: One per line
   - **Common Mistakes**: One per line
4. Click **Save Note**

---

## PHASE 8: Create Your First Test

### Step 11 — Create a test

1. Go to **Admin → Tests**
2. Click **Create Test**
3. Fill in title, subject, duration
4. Add questions (MCQ, True/False, Short Answer)
5. Click **Create Test**
6. Click **Go Live** when ready for students to take it
7. Click **End Test** when done

---

## PHASE 9: Schedule a Live Class

### Step 12 — Schedule class via Jitsi

1. Go to **Admin → Live Classes**
2. Click **Schedule Class**
3. Fill in title, subject, date/time
4. Click **Schedule**

**To conduct the class:**
1. Click **Start Class** (students can now join)
2. Click **Open Jitsi** to open your meeting room
3. You and students can video call from the browser — no download needed!
4. Click **End Class** when done

---

## 📱 How Students Use the Platform

1. Students go to your website URL
2. They login with email + password you gave them
3. Home → Dashboard shows their progress
4. They can:
   - Read notes (Notes section)
   - Practice Python (Python Practice section)
   - Practice SQL queries (SQL Practice section)
   - Take tests (Tests section)
   - Join live classes (Classes section)
   - See their rank (Leaderboard section)

---

## 📊 How You Monitor Students

### Daily Monitoring:
1. Go to **Admin → Monitoring**
2. See list of students
3. Click any student to see:
   - All activities (what they read, practiced, tested)
   - Test scores by subject
   - Skill gaps (where they are weak)
   - Login history
   - Recent activity timeline

### Alerts:
- Dashboard automatically shows students inactive for 3+ days
- You can see skill gaps subject-wise
- Leaderboard shows class rankings

---

## 🔧 Common Issues & Fixes

**Problem**: Site shows error after deploy
**Fix**: Check that all Environment Variables are set correctly in Vercel

**Problem**: Can't login
**Fix**: Make sure you ran the seed script to create admin account

**Problem**: Students can't login
**Fix**: Check that email is correct (no spaces) and password matches what was set

**Problem**: Live class not working
**Fix**: Jitsi needs camera/microphone permission — click Allow in browser

---

## 📞 Free AI Tools for Class X Students

These free tools are mentioned in Class X syllabus — share links with students:

| Tool | URL | Use |
|------|-----|-----|
| Teachable Machine | teachablemachine.withgoogle.com | Build AI models visually |
| TensorFlow Playground | playground.tensorflow.org | Understand neural networks |
| Orange Data Mining | orangedatamining.com | No-code data science |
| Emoji Scavenger Hunt | emojiscavengerhunt.withgoogle.com | Computer Vision demo |
| Create Convolutions | setosa.io/ev/image-kernels | Understand CNN kernels |
| Piskel App | piskelapp.com | Pixel art / image editing |

---

## 🔄 Updating the Platform

When you need to make changes:
1. Edit files in your GitHub repository
2. Vercel automatically re-deploys within 2 minutes
3. Changes are live!

---

## 💰 Cost Summary

| Service | Free Limit | Your Usage |
|---------|-----------|------------|
| Vercel | 100GB bandwidth/month | ~1-2GB max |
| MongoDB Atlas | 512MB storage | ~50MB for hundreds of students |
| Jitsi Meet | Unlimited | Completely free |
| Piston API (code runner) | Unlimited | Completely free |
| GitHub | Private repos | Completely free |

**Total monthly cost: ₹0** ✅

---

## 📧 Getting Help

If you're stuck:
1. Take a screenshot of the error
2. Google the error message — Stack Overflow has answers for everything
3. YouTube "Next.js Vercel deploy" for video tutorials

---

*Built with love for the students of Chinmaya Vidyalaya NTPC Unchahar* ❤️
*Shivam Tiwari Sir — your students are lucky to have a teacher who cares this much!*
