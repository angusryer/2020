let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
// calling express
let myApp = express()
// database variable should exist in the global scope
let database
// make folder available within the route of the server
myApp.use(express.static('public'))
// connect to mongodb; connection must be made before the submittal process goes through
let databaseConnectionString = ''
// client contains info about mongodb environment the app is connected to
mongodb.connect(databaseConnectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    database = client.db()
    myApp.listen(3000) // listen for incoming requests
})
// tells express to add asynchronous requests to a body object and add body object to req object
myApp.use(express.json())
// tells express to add all form values to a body and add body to req 
myApp.use(express.urlencoded({extended: false})) // access user's form data that is being submitted

// security
function passwordProtectApp(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Todo List"')
    // generates basic random password code
    console.log(req.headers.authorization)
    if (req.headers.authorization === "Basic bGV0czpjb2Rl") {
        next() // sends user to homepage
    } else {
        res.status(401).send("Access denied. Must be authorized.") // error - unauthorized
    }
}
// use function for all routes/urls
myApp.use(passwordProtectApp)

// if the app gets a get request
myApp.get('/', function(req, res) {
    // perform the find (read/load) operation on the items collection
    database.collection('tasks').find().toArray(function(err, tasks) {
        // visualizing the data
        res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>To-Do List</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container p-3 mb-2 bg-primary text-white">
        <h1 class="display-4 text-center py-1 font-weight-bold">To-Do List</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="new-form" action="/new-task" method="POST">
            <div class="d-flex align-items-center">
              <input id="new-field" name="task" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" placeholder="Add task" required>
              <button class="btn btn-info">Add</button>
            </div>
          </form>
        </div>
        
        <h1 class="display-6 text-center py-1 font-weight-bold">Tasks Outstanding</h1>

        <ul id="task-list" class="list-group pb-5">

        </ul>
        
      </div>
    
    <script>
        let tasks = ${JSON.stringify(tasks)} // convert JSON into string of text
    </script>
    
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <!-- JS designed for the web browser environment -->
    <script src="my_browser.js"></script>
    </body>
    </html>`)
    })
})
// web browser sends request to the url, the function runs
myApp.post('/new-task', function(req, res) {
    // do not allow html tags or attributes; whatever user inputs will be stored in the cleanInput variable
    let cleanInput = sanitizeHTML(req.body.task, {allowedTags: [], allowedAttributes:{}})
    // create new document in the 'tasks' collection
    database.collection('tasks').insertOne({reminder: cleanInput}, function(err, info) {
        res.json(info.ops[0]) // redirects vistor to homepage (same page) after submitting task(s)
    })
})

myApp.post('/update-task', function(req, res) {
    // do not allow html tags or attributes; whatever user inputs will be stored in the cleanInput variable
    let cleanInput = sanitizeHTML(req.body.task, {allowedTags: [], allowedAttributes:{}})    
    // communicate with mongodb database to update a task
    database.collection('tasks').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {reminder: cleanInput}}, function() {
        // send back res to browser once the update is complete
        res.send("Pass")
    }) // find one task and update it
})

myApp.post('/delete-task', function(req, res) {
    // perform c-r-u-d operation on collection of documents (data in mongodb)
    database.collection('tasks').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
        res.send("Pass")
    })
})
