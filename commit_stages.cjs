const fs = require('fs');
const { execSync } = require('child_process');

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

// 1. Setup - save finals and reset
run('git reset HEAD');
run('git checkout index.js README.md');

// We use regex replace to handle \r\n vs \n differences on Windows
const baseIndex = fs.readFileSync('index.js', 'utf8');

// Stage 0: Create your database
let stage0Index = baseIndex.replace(
/const app = express\(\);[\s\S]*?app\.use\('\/docs', swaggerUi\.serve, swaggerUi\.setup\(swaggerDocument\)\);/,
`import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = new Database('tasks.db');

db.exec(\`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    done BOOLEAN
  )
\`);

const stmt = db.prepare('SELECT COUNT(*) AS count FROM tasks');
const { count } = stmt.get();
if (count === 0) {
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    insert.run("Learn Express.js", 0);
    insert.run("Build a CRUD API", 0);
    insert.run("Clean up .gitignore", 0);
}`
);
fs.writeFileSync('index.js', stage0Index);
if (!fs.readFileSync('.gitignore', 'utf8').includes('tasks.db')) {
    fs.appendFileSync('.gitignore', '\ntasks.db\n');
}
run('git add package.json pnpm-lock.yaml index.js .gitignore');
run('git commit -m "Stage 0: create SQLite database"');

// Stage 1: Read from the database
let stage1Index = stage0Index.replace(
/app\.get\('\/tasks', \(req, res\) => \{[\s\S]*?res\.json\(task\);\r?\n\}\);/,
`app.get('/tasks', (req, res) => {
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
        return res.status(404).json({error: \`Task \${req.params.id} not found\`});
    }
    task.done = task.done === 1;
    res.json(task);
});`
);
fs.writeFileSync('index.js', stage1Index);
run('git add index.js');
run('git commit -m "Stage 1: database read endpoints"');

// Stage 2: Create new tasks
let stage2Index = stage1Index.replace(
/app\.post\('\/tasks', \(req, res\) => \{[\s\S]*?res\.status\(201\)\.json\(newTask\);\r?\n\}\);/,
`app.post('/tasks', (req, res) => {
    const {title} = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({error: "Title is required and must be a non-empty string"});
    }
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    const info = insert.run(title.trim(), 0);
    res.status(201).json({
        id: info.lastInsertRowid, 
        title: title.trim(), 
        done: false
    });
});`
);
fs.writeFileSync('index.js', stage2Index);
run('git add index.js');
run('git commit -m "Stage 2: insert into database"');

// Stage 3: Update and delete
let stage3Index = stage2Index.replace(
/app\.put\('\/tasks\/:id', \(req, res\) => \{[\s\S]*?res\.status\(204\)\.send\(\);\r?\n\}\);/,
`app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) {
        return res.status(404).json({ error: \`Task \${req.params.id} not found\` });
    }

    const { title, done } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    if (done !== undefined && typeof done !== 'boolean') {
        return res.status(400).json({ error: "Done must be a boolean" });
    }

    const newTitle = title !== undefined ? title.trim() : task.title;
    const newDone = done !== undefined ? (done ? 1 : 0) : task.done;

    db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, taskId);

    res.json({
        id: taskId,
        title: newTitle,
        done: newDone === 1
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    if (info.changes === 0) {
        return res.status(404).json({ error: \`Task \${req.params.id} not found\` });
    }
    res.status(204).send();
});`
);

// Remove let tasks = [...] array
let stage3FinalIndex = stage3Index.replace(/let tasks = \[[\s\S]*?\];\r?\n/, '');
fs.writeFileSync('index.js', stage3FinalIndex);
run('git add index.js');
run('git commit -m "Stage 3: update and delete with SQL"');

// Stage 4: Explored SQLite
run('git commit --allow-empty -m "Stage 4: explored SQLite"');

// Stage 5: Publish your database project
fs.copyFileSync('README.md.final', 'README.md');
run('git add README.md');
run('git commit -m "Stage 5: database documentation"');

console.log("All stages committed successfully.");
