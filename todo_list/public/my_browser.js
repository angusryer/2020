function taskTemplate(task) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text font-italic font-weight-bold">${task.reminder}</span>
    <div>
    <!-- each edit button has a unique id -->
    <button data-id="${task._id}" class="edit-me btn btn-warning btn-sm mr-1">Edit</button>
    <!-- each delete button has a unique id -->
    <button data-id="${task._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`
}

// initial page load render
let appHTML = tasks.map(function(task) {
    // return a string of text
    return taskTemplate(task)
}).join('') 
    // adding html text to the empty unordered list
document.getElementById("task-list").insertAdjacentHTML("beforeend", appHTML)

// create feature
let newField = document.getElementById('new-field')

document.getElementById("new-form").addEventListener("submit", function(e) {
    // prevent default behavior of the browser by not having a tradition res sent to the browser
    e.preventDefault()
    // sending asychynous post req to the new-task url; data sent to server is object listed below
    axios.post('/new-task', {task: newField.value}).then(function(response) {
        // create new task
        document.getElementById("task-list").insertAdjacentHTML("beforeend", taskTemplate(response.data))
        newField.value = "" // box is empty after user submits task
        newField.focus() // clears the contents of the box once task is submitted
    }).catch( function() {
        console.log("Error")
    }) // catch invoked when a problem arises     
})

// e - event, contains all sorts of information that the event took place
document.addEventListener("click", function(e) { // runs everytime a user clicks on an 'edit' button
    // delete feature
    if (e.target.classList.contains("delete-me")) {
       if(confirm("Would you like to remove this item?")) {
            // send req to delete task to node server
            axios.post('/delete-task', {id: e.target.getAttribute("data-id")}).then( function() {
                // delete task
                e.target.parentElement.parentElement.remove()
            }).catch( function() {
                console.log("Error")
            }) // catch invoked when a problem arises        
       } 
    }

    // update feature    
    // target - html element that got clicked on contains the class of "edit-me"
    if (e.target.classList.contains("edit-me")) {
        // allows user to type in new task
        let editTaskInput = prompt("Edit task", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (editTaskInput) { // if the user clicks "cancel"
            // send data to node server
            axios.post('/update-task', {reminder: editTaskInput, id: e.target.getAttribute("data-id")}).then( function() {
                // update user interface with edited version of task
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = editTaskInput
            }).catch( function() {
                console.log("Error")
            }) // catch invoked when a problem arises
        }        
    }
})