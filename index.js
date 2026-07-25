import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { taskRepository } from './taskRepository.js';

const app = express();
const PORT = 3000;
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskRepository.getAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = await taskRepository.getById(taskId);
        if (!task) {
            return res.status(404).json({error: `Task ${req.params.id} not found`});
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const {title} = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({error: "Title is required and must be a non-empty string"});
        }
        const newTask = await taskRepository.create(title.trim());
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const task = await taskRepository.getById(taskId);
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

        const newTitle = title !== undefined ? title.trim() : task.title;
        const newDone = done !== undefined ? done : task.done;

        const updatedTask = await taskRepository.update(taskId, newTitle, newDone);
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const deleted = await taskRepository.delete(taskId);
        if (!deleted) {
            return res.status(404).json({ error: `Task ${req.params.id} not found` });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});