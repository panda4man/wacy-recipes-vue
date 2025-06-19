# Wacy Recipes

A full-stack Laravel + Vue app for managing and browsing recipes. Built with Laravel Sail and Docker for a fast local development experience.

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📦 Backend Setup (Laravel + Sail)

### 1. Clone the Repository

```bash
git clone git@github.com:panda4man/wacy-recipes-vue.git
cd wacy-recipes-vue
```

### 2. Install Dependencies

```bash
docker run --rm \
    --pull=always \
    -v "$(pwd)":/opt \
    -w /opt \
    laravelsail/php82-composer:latest \
    bash -c "composer install"
```

### 3. Configure Environment & Start Stack

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
```

---

## 🎨 Frontend Setup (Vue)

### 1. Install Frontend Dependencies

```bash
./vendor/bin/sail npm install --prefix frontend
```

### 2. Start Frontend Dev Server

```bash
./vendor/bin/sail npm run dev --prefix frontend
```

---

## ✅ Confirm Your Application

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend: [http://localhost:8888](http://localhost:8888)

---

## 🛢️ Database Access

To access MySQL from your terminal:

```bash
docker exec -it wacy-recipes-vue-mysql-1 bash -c "mysql -uroot -ppassword"
```

Or connect with a GUI client:

- **Host**: `127.0.0.1`
- **Port**: `3333`
- **User**: `root`
- **Password**: `password`

Create test database `skeleton_app_test` and give sail access:

```bash
CREATE DATABASE IF NOT EXISTS skeleton_app_test;
GRANT ALL PRIVILEGES ON skeleton_app_test.* TO 'sail'@'%';
FLUSH PRIVILEGES;
```

---

## 🧪 Running Tests

### Backend (Laravel + Pest)

```bash
./vendor/bin/sail php vendor/bin/pest
```

### Frontend (Vue + Vitest)

```bash
./vendor/bin/sail npm run test:unit --prefix frontend
```

---

## 🍳 Recipes: Demo Data

You can generate sample recipes using either a seeder or an artisan command:

### Option 1: Seeder

Recommended for generating 200 recipes at once.

```bash
./vendor/bin/sail artisan migrate:fresh
./vendor/bin/sail artisan db:seed --class=DemoSeeder
```

### Option 2: Artisan Command

Creates one recipe interactively.

```bash
./vendor/bin/sail artisan recipe:create
```

---

## 🛠️ Developer Tips

- Bring down the Docker stack:

  ```bash
  ./vendor/bin/sail down
  ```

---
