# StayHub 🏨

StayHub is a full-stack hotel and property listing platform built using Node.js, Express, MongoDB, and EJS.  
Users can browse available stays, filter by categories, view details, and authenticated users can create, update, and delete listings.  
This project follows MVC architecture with authentication, file uploads, routing, and middleware — suitable as an Project.

---

## Features

- User Authentication (Register / Login / Logout)
- CRUD Operations for Listings
- Image Upload Support
- Category-Based Filtering
- Review System
- Error Handling and Validation
- Responsive UI with EJS Templates
- Multer-based file uploads
- MVC project structure

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | EJS, HTML, CSS, Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | Passport.js, express-session, bcrypt |
| File Upload | Multer |
| Environment | dotenv |

---

## Folder Structure

```bash
StayHub/
├── app.js
├── schema.js
├── package.json
├── .env
│
├── controller/
│   ├── listings.js
│   ├── review.js
│   └── user.js
│
├── init/
│   └── index.js
│
├── Middleware/
│   ├── isAuthenticated.js
│   ├── isLoggedIn.js
│   ├── isOwner.js
│   └── saveRedirectUrl.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── routes/
│   ├── listings.js
│   ├── review.js
│   └── user.js
│
├── uploads/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
└── views/
    ├── includes/
    │   ├── footer.ejs
    │   └── navbar.ejs
    ├── layouts/
    │   └── boilerplate.ejs
    ├── listings/
    │   ├── index.ejs
    │   ├── new.ejs
    │   ├── edit.ejs
    │   └── show.ejs
    ├── user/
    │   ├── login.ejs
    │   └── register.ejs
    └── review/
        └── review.ejs
