# GH.ai — Asaan alfaaz mein: ye kaam kese hota hai?

Ye file **non-technical** logon ke liye hai: user website par kya kare ga, aur system andar se kya samajhta hai — **bohot seedha** lafzon mein.

---

## Ye project kya hai?

**GH.ai** ek **web app** hai jo **sales teams** ko help karta hai: leads (mumkin customers), pipeline (stage wise progress), campaigns (email waghera), aur **AI** se draft text — sab **ek jagah** pe.

- **Website (jo log dekhte hain):** Next.js — URL example: [production frontend](https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/)  
- **Andar wala hissa (data / logic):** FastAPI + database — ye user ko seedha nazar nahi aata, lekin sign-up, login, leads save, sab yehi handle karta hai.

---

## User pehli dafa kahan se ayega?

1. Browser mein **GH.ai ka link** khole ga (marketing site).  
2. Upar **Features**, **Pricing**, **About**, **Blog**, **Contact** — ye sab **bina login** dekh sakta hai (normal visitor).  
3. Agar use **andar wala dashboard** chahiye (apna data), to **Register** / **Login** karna pare ga.

---

## Sign up (naya account) kaise?

1. Home ya nav se **Register** / **Get started** dabaye.  
2. Form mein **email, password** (aur jo fields hon) bhar kar account banaye.  
3. System **backend** par user save karta hai (database mein).  
4. Us ke baad user **login** karke dashboard use kar sakta hai.

**Seedha jawab:** Register = naya user banana taake tumhari company ke andar tumhara hisaab alag ho.

---

## Login kaise?

1. **Login** page par email + password.  
2. Sahi hone par system **cookie / token** set karta hai — matlab next pages par wo **logged in** rehta hai.  
3. **Dashboard** sirf tab khulta hai jab login ho — warna **Login** par wapas bhej deta hai (security).

---

## Dashboard par user kya kare ga? (short list)

| Section | Asaan matlab |
|--------|----------------|
| **Leads** | Jin logon se baat karni hai — naam, email, company waghera list |
| **Pipeline** | Lead “kis stage” par hai — naya, meeting, reply, waghera |
| **Campaigns** | Email sequence / rules jis se follow-up automate ho |
| **AI Agent** | AI se draft likhwana (tone / topic de kar) — phir team edit kar sakti hai |
| **Settings / API keys** | integrations ke liye keys (advanced users) |

**Seedha jawab:** Dashboard = apna **CRM-lite** + **automation** + **AI drafts**.

---

## Contact / Waitlist — user company se kaise rabta kare?

1. **Contact** page: form bhar kar message bhejta hai — tumhari team ko **email / log** ke zariye pata chal sakta hai (backend par handle).  
2. **Waitlist** page: jo early access chahte hon, email chhor dete hon — list database mein save hoti hai taake baad mein unhe notify kiya jaye.

**Seedha jawab:** Contact = “hamen message bhejo”; Waitlist = “launch par mujhe yad karna”.

---

## “Mails” / email is system mein kahan se ati hain?

- **Marketing / product emails** (notifications, password reset, waghera) — ye tumhari **email provider setup** par depend karte hain (code mein Gmail / SMTP type integrations ho sakti hain).  
- **Campaign emails** (outreach) — **Campaigns** feature ke through plan hoti hain; asal bhejna **Gmail / connected account** aur **background workers (Celery)** par depend karta hai jab wo production mein configure hon.

**Seedha jawab:** User app se “campaign” banata hai; **bhejna** tab chale ga jab **Gmail (OAuth)** waghera sahi connect ho aur server par **Redis + Celery** chal raha ho.

---

## Calendly se faida — asaan alfaaz

- User **Calendly** apne account se connect karta hai (token / OAuth flow — setup admin/engineer karta hai).  
- Jab lead **meeting book** kare, system **webhook** se update pakar sakta hai taake **pipeline** mein stage badal jaye ya record update ho.  
- Is se **manual copy-paste** kam ho jata hai: “meeting book ho gayi” ka pata app ko khud mil jata hai.

**Seedha jawab:** Calendly = **meeting link** + **automatic update** tumhari pipeline mein.

---

## Tum (owner / admin) ko kya dhyan rakhna hai?

1. **Database (PostgreSQL)** hamesha chalna chahiye — warna login / leads save nahi honge.  
2. **Backend URL** frontend (Vercel) par **`BACKEND_INTERNAL_URL`** se set hon — taake website API tak pohanche.  
3. **Redis + Celery** agar email / background jobs chahiye hon to alag se chalana parta hai (Docker ya cloud).

---

## Aur detail?

- **Technical deploy steps:** [`DEPLOY.md`](../DEPLOY.md)  
- **Poori technical report (English, IEEE style):** [`IEEE-GH-AI-Project-Report.md`](./IEEE-GH-AI-Project-Report.md)

---

*GH Pvt Ltd — GH.ai — asaan user / team guide*
