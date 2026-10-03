# Overview

This project is a modular RESTful Book and Author Management API developed using Node.js, Express, and MongoDB. It provides endpoints to manage literary catalogs and author records while performing data aggregation and structural hierarchy traversal.

I wrote this software to demonstrate practical JavaScript backend architecture, recursive data parsing, and functional data manipulation using modern ES6 features. The application parses nested category taxonomies from database records, aggregates catalog statistics, and provides interactive API documentation.

[Software Demo Video]([(https://www.loom.com/share/30ecc625d7ba4d9fb93aaac8c76c17b4))

# Development Environment

* **Development Tools:** Visual Studio Code, Git, GitHub
* **Runtime & Framework:** Node.js (ES Modules), Express.js
* **Database:** MongoDB Atlas (native `mongodb` driver)
* **API Documentation & Testing:** Swagger UI (`swagger-ui-express`, `swagger-jsdoc`), Thunder Client, cURL
* **Code Quality:** ESLint

# Useful Websites

* [MDN Web Docs - Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
* [MDN Web Docs - Working with Object Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
* [Express.js Routing Documentation](https://expressjs.com/en/guide/routing.html)
* [MongoDB Node.js Driver Guide](https://www.mongodb.com/docs/drivers/node/current/)

# Future Work

* Implement JWT-based authentication and role-based access control for mutating endpoints.
* Integrate server-side input schema validation using Zod.
* Implement pagination and sort query parameters on the book catalog endpoints.
* Add automated unit and integration tests using Jest or Supertest.
