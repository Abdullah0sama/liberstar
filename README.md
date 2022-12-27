# liberstar
A book review REST API to review books, kind of similar to goodreads.

## Details
  - Components User, Books, Reviews (YET)
  - CRUD operations
  - Input validation
  - SQL based
  - Authentication 
  - Role Based Authorization
  - Swagger (TODO)


## Example
book resouce
  ```
  - GET /books
  - GET /books/:id
  - POST /books/
  - PATCH /books/:id
  - DELETE /books 
  
  Listing endpoints accepts query parameters as:
  /books?select=title&select=id&sort_by=release_data&order_by=desc
  ```
## Get started

Run inside project directory
  ```console
  docker-compose up -d
  npm run migrate:latest
  npm run start
  ```
  
  Run tests
  ```console
  npm run test
  ```
