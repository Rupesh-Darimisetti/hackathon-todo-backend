const express = require('express');
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors')

const dbPath = path.join(__dirname, 'simpleTodo.db')
const app = express()

app.use(express.json())
app.use(cors())

let db;

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(4000, () => {
            console.log('Server started on port 4000')
        })
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }
}
// setuo server abd DB
initializeDbAndServer();

app.get('/todos/', async (request, response) => {
    const getTodos = `SELECT * FROM todos;`
    const todos = await db.all(getTodos);
    response.send(todos)
})

app.delete('/todos/:id', async (request, response) => {
    const { id } = request.params;
    const deleteTodo = `DELETE FROM todos WHERE id=${id};`
    await db.run(deleteTodo)
    response.send('Todo Deleted')
})

app.post('/todos/', async (request, response) => {
    const { title } = request.body
    const postQuery = `INSERT INTO todos (title) VALUES ('${title}')`
    await db.run(postQuery);
    response.send('Todo Added Successfully')
})