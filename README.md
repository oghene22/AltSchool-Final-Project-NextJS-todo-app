# AltSchool-Final-Project-nextjs-todo-app
# Next.js Todo App (Full-Stack)

This is a full-stack todo application built with Next.js (App Router), MUI (Material-UI), and Supabase. It allows users to sign up, log in, and manage a persistent, personal todo list.

## Features

* **Authentication:** Full user authentication (Sign Up, Log In, Log Out) provided by Supabase Auth.
* **Database:** All todos are saved to a persistent Postgres database via Supabase.
* **Full CRUD:** Users can **C**reate, **R**ead, **U**pdate (edit text, mark as complete), and **D**elete their own todos.
* **Filtering & Search:** Todos can be filtered by "All", "Completed", and "Incomplete" status, as well as searched in real-time.
* **Security:** The database is secured with Row Level Security (RLS), ensuring users can *only* access their own todo items.

## Tech Stack

* **Framework:** [Next.js 14+](https://nextjs.org/) (with App Router)
* **Frontend Library:** [React.js](https://react.dev/)
* **UI Library:** [MUI (Material-UI)](https://mui.com/)
* **Backend (BaaS):** [Supabase](https://supabase.com/)
    * **Authentication:** Supabase Auth
    * **Database:** Supabase Postgres DB
* **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or newer)
* [npm](https://www.npmjs.com/)
* A free [Supabase](https://supabase.com/) account

### Installation & Setup

**1. Clone the repository:**
```bash
git clone [https://github.com/oghene22/AltSchool-Final-Project-NextJS-todo-app.git](https://github.com/oghene22/AltSchool-Final-Project-NextJS-todo-app.git)
cd YourRepoName
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up your Supabase Database:**
* Log in to your Supabase account and create a new project.
* Go to the **Table Editor** and create a new table named `todos`.
* Add the following columns:
    * `id` (int8, primary key, generated)
    * `created_at` (timestamptz, default: `now()`)
    * `text` (type: `text`)
    * `completed` (type: `bool`, default: `false`)
    * `user_id` (type: `uuid`, links to `auth.users` via foreign key)
* Go to **Authentication** > **Providers** and turn **OFF** the "Confirm email" toggle.
* Go to **Authentication** > **Policies** and **Enable Row Level Security (RLS)** for the `todos` table.
* Create new policies (from a template or manually) for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` to allow authenticated users to perform these actions on their own data (e.g., `auth.uid() = user_id`).

**4. Set up Environment Variables:**
* Create a new file in the root of the project named `.env.local`
* Go to your Supabase project's **Settings** > **API**.
* Copy your **Project URL** and **`anon` `public` key**.
* Paste them into your `.env.local` file with the `NEXT_PUBLIC_` prefix:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**5. Run the development server:**
```bash
npm run dev
```

Your app should now be running locally at `http://localhost:3000/`.
