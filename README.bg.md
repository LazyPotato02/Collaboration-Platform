<p align="right">
🇬🇧 <a href="README.md"><strong>Read in English</strong></a>
</p>

# 🧩 Task & Team Collaboration Platform

"Clone на Trello/Asana" за управление на задачи, екипи и проекти с фокус върху реално време, ролеви достъп и модерен full-stack стек. Проектът демонстрира умения в работа с frontend фреймуърк, Django backend, WebSocket комуникация и DevOps практики чрез Docker.

---

## ⚙️ Използвани технологии

| Слой             | Технологии                                           |
|------------------|------------------------------------------------------|
| **Frontend**     | Angular, WebSocket клиент, JWT, Drag & Drop UI       |
| **Backend**      | Django, Django REST Framework                        |
| **WebSocket**    | Node.js, Express, `ws` (native WebSocket сървър)     |
| **База данни**   | PostgreSQL                                           |
| **Auth**         | JWT (SimpleJWT)                                      |
| **DevOps**       | Docker, Docker Compose                               |

---

## 🧱 Архитектура на проекта

### 🔐 Authentication
- JWT базирана автентикация (SimpleJWT)
- Middleware и guard-и по роли
- Регистрация, логин, refresh токени

### 📁 Backend (Django + DRF)
- Управление на проекти, задачи, коментари и роля на потребители
- REST API, който при определени действия известява WebSocket сървъра
- RBAC – ролеви достъп по проект: `admin`, `member`

### 📡 WebSocket Сървър (Node.js)
- Отделен `ws` сървър, който групира клиенти по `projectId`
- Приема POST заявки от Django и излъчва събития към свързаните клиенти
- Поддържа събития като `task_created`, `task_updated`, `comment_added`

### 💬 Реално време
- Angular слуша WebSocket сървъра по `ws://localhost:8001/?project=ID`
- UI се обновява в реално време при нови задачи, коментари и промени

---

## 🔄 Основна функционалност (MVP)

- ✅ Регистрация и логин
- ✅ Създаване и редактиране на проекти
- ✅ Kanban борд с drag & drop задачи
- ✅ Коментари в задачите
- ✅ Роли в проектите (админ, член, viewer)
- ✅ WebSocket известия в реално време (нови задачи, коментари)
- ✅ Добавяне на потребители към проекти
- ✅ Визуализиране на членове в даден проект

---

## 📂 Структура

```
Colaboration-Platform/
├── backend/          # Django + DRF API
├── frontend/         # Angular app (ng serve)
├── ws-server/        # Node.js WebSocket сървър
├── docker-compose.yml
```

---

## 🐳 Docker Setup

Проектът е напълно dockerизиран – използвай `docker-compose` за стартиране:

### ▶️ Стартиране

```bash
docker-compose up --build
```

### 🧪 Достъп до приложенията:

| Компонент   | Адрес                 |
|-------------|------------------------|
| Frontend    | http://localhost:4200  |
| Backend API | http://localhost:8000  |
| WebSocket   | ws://localhost:8001    |
| Postgres    | port 5432 (вътрешно)   |

---

## 🧪 User Journey

1. Потребител се логва и получава JWT токен
2. Вижда списък с проекти, в които е участник
3. Създава нов проект или влиза в съществуващ
4. Kanban таблото показва задачите по статус
5. Може да:
   - мести задачи с drag & drop
   - редактира/трие/добавя коментари
   - вижда в реално време действията на останалите
6. WebSocket известия уведомяват всички в проекта
7. Може да кани други потребители в проекта

---

## 📎 Dev Notes

- Django settings използват `.env` променливи

---

## 🧪 Примерни подобрения

- PDF отчети за задачите
- File uploads (attachments)
- Dashboard с графики
- Таг система / филтри
- Activity логове
- PWA (Progressive Web App)
- Slack/Discord интеграция
- Известия по email за определени действия (Пример: Добавяне на потребител към проект)

---

## 🎯 Целева аудитория

- **Работодатели:** Full-stack showcase (Django + Angular + WebSocket)
- **Фрийланс клиенти:** готова система за управление на екипи
- **Обучителни цели:** демонстрира реално време, RBAC, Docker

---

## 🧩 Контакт

Проектът е демонстрационен и отворен за подобрения.

