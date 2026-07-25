import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    done BOOLEAN
  )
`);

const stmt = db.prepare('SELECT COUNT(*) AS count FROM tasks');
const { count } = stmt.get();
if (count === 0) {
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    insert.run("Learn Express.js", 0);
    insert.run("Build a CRUD API", 0);
    insert.run("Clean up .gitignore", 0);
}
let tasks = [
    {id: 1, title: "Learn Express.js", done: false},
    {id: 2, title: "Build a CRUD API", done: false},
    {id: 3, title: "Clean up .gitignore", done: false}
];
app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});
app.get('/health', (req, res) => {
    res.json({status: "ok"});
});
app.get('/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    const formattedTasks = tasks.map(t => ({
        ...t,
        done: t.done === 1
    }));
    res.json(formattedTasks);
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) {
        return res.status(404).json({error: `Task ${req.params.id} not found`});
    }
    task.done = task.done === 1;
    res.json(task);
});
app.post('/tasks', (req, res) => {
    const {title} = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({error: "Title is required and must be a non-empty string"});
    }
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = {
        id: newId, 
        title: title.trim(), 
        done: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }

    const { title, done } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    if (done !== undefined && typeof done !== 'boolean') {
        return res.status(400).json({ error: "Done must be a boolean" });
    }

    if (title !== undefined) task.title = title.trim();
    if (done !== undefined) task.done = done;

    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
        return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    tasks.splice(index, 1);
    res.status(204).send();
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});