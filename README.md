# 🥗 MealMind

MealMind is a calorie-tracking web app built with **FastAPI** and **Next.js**. It uses the USDA FoodData Central API to fetch nutritional data, enhanced by fuzzy search for flexible dish name matching. The app features secure JWT-based authentication with PostgreSQL and a responsive UI with light/dark theme support.

---

## 🚀 Features

- 🍎 **Calorie Lookup**: Search foods with fuzzy search for typo-tolerant dish matching (e.g., "aple" → "apple").
- 🔐 **User Authentication**: Secure registration and login with JWT access and refresh tokens.
- 🌗 **Theme Toggle**: Switch between light and dark modes (hidden on homepage).
- 🛡️ **Rate Limiting**: Protects endpoints (`/login`, `/register`, `/getcalories`) from abuse.
- 📱 **Responsive Design**: Optimized for desktop and mobile devices.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/meal-mind.git
cd meal-mind
```

### 2️⃣ Backend Setup
- **Navigate to Backend**:
  ```bash
  cd backend
  ```
- **Create Virtual Environment**:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  ```
- **Install Dependencies**:
  ```bash
  pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv slowapi fuzzywuzzy
  ```
- **Set Up PostgreSQL**:
  - Install PostgreSQL and ensure it’s running.
  - Create the `calorie_auth` database:
    ```sql
    CREATE DATABASE calorie_auth;
    ```
- **Configure Environment Variables**:
  - Create a `.env` file in the `backend` directory:
    ```env
    USDA_API_KEY=your-usda-api-key
    DATABASE_URL=postgresql://postgres:your-password@localhost:5432/calorie_auth
    JWT_SECRET=your-secret-key
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    REFRESH_TOKEN_EXPIRE_DAYS=7
    ```
  - Obtain a USDA API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html).
  - Replace `your-password` with your PostgreSQL password and `your-secret-key` with a secure JWT secret.
  - **Note**: Do not commit `.env` to version control.
- **Run the Backend**:
  ```bash
  uvicorn server:app --reload
  ```
  - API runs at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 3️⃣ Frontend Setup
- **Navigate to Frontend**:
  ```bash
  cd ../frontend
  ```
- **Install Dependencies**:
  ```bash
  npm install
  ```
  or
  ```bash
  yarn install
  ```
- **Run the Frontend**:
  ```bash
  npm run dev
  ```
  or
  ```bash
  yarn dev
  ```
  - App runs at `http://localhost:3000`.

---

## 🛠️ Usage

- **Homepage (`/`)**: Landing page without theme toggle, redirects to `/login` or `/register`.
- **Register (`/register`)**: Create an account with first name, last name, email, and password.
- **Login (`/login`)**: Sign in to access calorie tracking.
- **Calorie Tracking**: Use `/meal` to search foods and view calorie data.
- **Theme Toggle**: Switch themes on `/register`, `/login`, and other pages.

---

## 🌐 API Endpoints

- **POST `/register`**: Create a new user (Rate Limit: 3/minute)
  - Body: `{ "first_name": string, "last_name": string, "email": string, "password": string }`
- **POST `/login`**: Authenticate and get JWT tokens (Rate Limit: 5/minute)
  - Body: `{ "email": string, "password": string }`
- **POST `/get-calories`**: Get calorie info for a dish (Rate Limit: 10/minute)
  - Body: `{ "dish_name": string, "servings": number }`
- **POST `/refresh`**: Refresh access token
  - Body: `{ "refreshToken": string }`

---

## 🔧 Environment Variables

- **Backend (.env)**:
  | Variable                     | Description                              | Example Value                              |
  |------------------------------|------------------------------------------|--------------------------------------------|
  | `USDA_API_KEY`              | USDA API key                            | Obtain from [USDA](https://fdc.nal.usda.gov/api-key-signup.html) |
  | `DATABASE_URL`              | PostgreSQL connection string            | `postgresql://postgres:admin@localhost:5432/calorie_auth` |
  | `JWT_SECRET`                | JWT signing key                         | `your-secret-key`                          |
  | `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiry (minutes)         | `30`                                       |
  | `REFRESH_TOKEN_EXPIRE_DAYS`  | Refresh token expiry (days)            | `7`                                        |

- **Frontend**: No `.env` required. API calls target `http://localhost:8000`.

---

## 📝 Notes

- **Fuzzy Search**: Uses `fuzzywuzzy` to match dish names, enabling robust searches despite typos.
- **Database**: Users must manually create the `calorie_auth` database and `users` table.
- **Security**: Use a strong `JWT_SECRET` in production. Keep `.env` private.
- **Dark Mode**: Tailwind’s `dark:` classes ensure UI adapts to light/dark themes.

---

## 🐛 Troubleshooting

- **Backend**:
  - **Database Issues**: Verify PostgreSQL is running and `DATABASE_URL` is correct.
  - **USDA API Errors**: Ensure `USDA_API_KEY` is valid.
  - **429 Errors**: Rate limit exceeded; wait or adjust limits in `server.py`.
- **Frontend**:
  - Ensure backend is running at `http://localhost:8000`.
  - Check CORS in `server.py` if API calls fail.
  - Verify dark mode styling with `dark:` classes.

---

## 🤝 Contributing

Fork the repo, create a feature branch, and submit a pull request.

---
