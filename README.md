# InvataLabs Backend API Specifications
## https://invatalabs.herokuapp.com/
InvatLabs is a Workshop platform, which provides professionals from different areas an esacpe from their daily routine. Invata Labs will provide small courses in simple arts e.g. origami, sketching etc. This courses are not modeled to have mastery over the art but just escape from daily routine. One will have something to show after each course.
Workshops can either be totally online or offline.
This repo is a node backend to this platform which provides many of the must services for the platform.

### Workshops: Each Workshop will be about a particular art.
- List all Workshops in the database
   * Filtering, Sorting , Selecting only certain fields 
   * A seperate middleware was used so the functionality can be used with coures too.
   * Pagination 
- Search Workshops by radius
  * Used mapquest to map all workshops within radius of a particular zipcode.
- Get single workshop
- Create new workshop
  * Authenticated users only
  * Must have the role "publisher" or "admin" ( Role based authentication ) 
  * A publisher can add only one workshop (admins can create more)
- Upload a photo for workshop
  * Owner only
  * Photo will be uploaded to local filesystem as of now , Might consider AWS later.
- Update Workshops
  * Owner only
- Delete workshop
  * Owner only
- Average cost and raring of all courses for a workshop

### Courses
- Get all courses for workshop
- Get all courses in general
  * Pagination, Filtering, Sorting , Selecting only certain fields 
- Get single course
- Create new course
  * Must be "publisher" or "admin"
  * Publishers can create multiple courses
- Update course
  * Owner only
- Delete course
  * Owner only
  
### Reviews
- Get all reviews for a workshop
- Get all reviews in general
  * Pagination, Filtering, Sorting , Selecting only certain fields 
- Get a single review
- Create a review
  * Must have the role "user" or "admin" (publisher can not add review on their any workshop)
- Update review
  * Owner only
- Delete review
  * Owner only

### Users & Authentication
- JWT cookie based Authentication
- User registration
  * User can have three roles "user", "publisher" or "admin" but while registering it can only choose from publisher and user
  * To make any user admin it has to be done directly in the Database.
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords are encrypted before storing
  * Email will be sent with activation link.
- User login
  * Account must have been activated using activation link
  * User can login with email and password
  * Upon loggin in, a JWT token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get user
  * Get the currently logged in user ()
- Password reset
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address (As of now mailtrap is used for testing so if you try running it you will not get the email. Its easy to change this but i kept it.)
  * To reset password, Make a put request to URL in mail
  * The token will expire after 10 minutes
  * Nodemailer was used for this functionality.
- Update user info
  * Authenticated user only
  * Separate route to update password
- User CRUD
  * Admin only
- Users can only be made admin by updating the database field manually

## Security
- Password Encryption
- Security majors are taken to avoid:
    * XSS 
    * NoSQL injection 
    * HTTP Param pollution
- Rate limiting (100 requests per hour)

## Documentation
- Postman was used to test the API and then the JSON file it generated was fed to docGen to generate the index file as seen on the deployment site.

## Deployment (Heroku) 
- Node app is deployed on heroku, find it here (https://invatalabs.herokuapp.com/)
- If app is taking some time to load please be patient. If heroku app is not visited for some time it is loaded off the server and it takes some time to load it back. 

## Code Practices
- Code is well organized in routes , controllers, middleware , utils folders.
- DRY principle is acheived as much possible.
- Error handling middleware
- Use of third party libraries is kept to minimal. 


## DATABASE
 - MongoDB is used for database
 - DB is hosted on atlas 
