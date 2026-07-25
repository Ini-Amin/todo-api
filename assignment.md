
# W2 · A1 — Build your first CRUD API
💡 New words are marked in bold the first time they appear. Every bold word is explained in the Glossary at the bottom. If a sentence confuses you, check the glossary first — it's probably one word, not the whole idea.

Goal
Build a small API that manages a to-do list: you can create tasks, read them, update them, and delete them — the four CRUD operations. You will see and test your API in a visual page called Swagger UI, and publish everything to GitHub.

Purpose
In the lecture you watched the request → response loop from the outside. Now you build the server side of it yourself. CRUD is the heartbeat of almost every backend in the world — a social network CRUDs posts, a shop CRUDs orders, FlyRank CRUDs SEO reports. Once you've built CRUD once, every backend you ever meet will feel familiar.

Two habits start here: your data lives only in memory (no database yet — that's next week, and losing your data on restart is a lesson, not a bug), and everything is submitted through GitHub (that's how all work in this program is shared).

Beginners usually overthink this. The whole thing is under 100 lines of code, built in small stages. You never write more than ~15 lines before you can test again.

The big idea in 60 seconds
Your API is a server — a program that waits for requests and sends back responses. It offers several endpoints. An endpoint is one "door" into your server, defined by two things:

a path — where the door is, like /tasks or /tasks/3

an HTTP method — what kind of knock it answers to: GET (give me), POST (create this), PUT (replace this), DELETE (remove this)

So GET /tasks ("give me all tasks") and POST /tasks ("create a task") are two different endpoints, even though the path is the same. The four CRUD operations map onto the methods like this:

| CRUD operation | HTTP method | Example endpoint | Meaning |

|---|---|---|---|

| Create | POST | POST /tasks | Add a new task |

| Read | GET | GET /tasks · GET /tasks/3 | List all tasks / get task 3 |

| Update | PUT | PUT /tasks/3 | Change task 3 |

| Delete | DELETE | DELETE /tasks/3 | Remove task 3 |

That table is the assignment. Everything below just builds it, one row at a time.

Tools — pick ONE lane
Both lanes build exactly the same API. Pick the language you want to stick with; don't switch mid-assignment.

| | 🟨 JavaScript lane | 🐍 Python lane |

|---|---|---|

| Language | Node.js (free, nodejs.org(opens in a new tab)) | Python 3.10+ (free, python.org(opens in a new tab)) |

| Framework | Express — Hello world(opens in a new tab) | FastAPI — First steps(opens in a new tab) |

| Swagger UI | Add with swagger-ui-express(opens in a new tab) (Stage 5) | Built in at /docs — zero setup |

| Testing your API | curl + browser + Hoppscotch(opens in a new tab) (all free) | same |

| Publishing | Git + a free GitHub(opens in a new tab) account | same |

Not sure? If you liked the JS 101 session, take the JavaScript lane. If Python feels friendlier, take the Python lane — you'll get Swagger for free, which is a nice reward.

The task — six stages (+ one bonus)
Work stage by stage, in order. Each stage ends with a checkpoint: a command you run to prove it works. Commit to Git after every stage (that's your ≥6 commits, honestly earned). If you only finish Stage 3, submit anyway — a working half is worth more than a broken whole.

Stage 0 — Hello, server (~30 min)
The scene: before a restaurant serves food, the doors have to open.

Install your lane's tools (Node or Python — see the W2 resources, section 6).

Follow your framework's official hello-world page (linked in the table above) to start a server on localhost — Express on port 3000, FastAPI on port 8000.

Visit it in your browser. You should see your hello message.

Checkpoint: curl -i http://localhost:3000/ (or :8000/) returns status code 200 and your message.

Commit: Stage 0: hello server

Stage 1 — Your first real endpoint (~45 min)
Every API needs a front door that says what it is.

Add the endpoint GET / returning JSON that describes your API:
{ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] }

Add GET /health returning { "status": "ok" } . Real companies use exactly this endpoint to check a server is alive — you've just built your first professional habit.
Checkpoint: both URLs return JSON in the browser and via curl.

Commit: Stage 1: root and health endpoints

Stage 2 — Read: list and single task (~1 h)
Now the shelves. Your "database" is just a list in your code.

Near the top of your file, create an in-memory list of task objects, pre-filled with 3 example tasks. Each task has: id (number), title (text), done (true/false).

Add GET /tasks — returns the whole list.

Add GET /tasks/:id (Express) / GET /tasks/{id} (FastAPI) — returns one task. The id part is a path parameter : a piece of the URL that changes.

If no task has that id, return status 404 with a JSON error: { "error": "Task 99 not found" } . Never return an empty 200 for something that doesn't exist — status codes are how machines read your answers.

Checkpoint: curl -i http://localhost:3000/tasks/1 → 200 + one task · curl -i http://localhost:3000/tasks/99 → 404 + error JSON.

Commit: Stage 2: read endpoints with 404

Stage 3 — Create: POST a new task (~1 h)
A customer walks in with a new order.

Add POST /tasks . The client sends the new task as JSON in the request body :
{ "title": "Buy milk" }

Your server: gives it the next free id , sets done to false , adds it to the list, and returns the created task with status 201 ("Created" — the polite way to say "done, here's your receipt").

Validate the input: if title is missing or empty, return 400 ("Bad Request") with a JSON error saying what's wrong. This is your first business rule — the server never trusts the client.

Checkpoint:

curl -i -X POST [http://localhost:3000/tasks](http://localhost:3000/tasks) -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

returns 201 + the new task, and a second GET /tasks shows it in the list. Posting {} returns 400.

Commit: Stage 3: create with validation

Stage 4 — Update & Delete (~1 h)
Orders change, orders get cancelled.

Add PUT /tasks/:id — replaces a task's title and/or done with what's in the request body. Returns the updated task. Unknown id → 404 . Empty/invalid body → 400 .

Add DELETE /tasks/:id — removes the task. Return status 204 ("No Content" — success, nothing to say) with an empty body. Unknown id → 404 .

🎉 Stop and notice: you have built a complete CRUD API. Every backend you'll ever work on is this, wearing more clothes.

Checkpoint: create a task, update it, mark it done, delete it, and confirm with GET /tasks — all via curl, all with the right status codes (201, 200, 204, 404).

Commit: Stage 4: full CRUD

Stage 5 — See it: Swagger UI (~1–1.5 h)
So far you've imagined your API. Now look at it.

Swagger UI is a web page that reads a description of your API (an OpenAPI file) and turns it into interactive documentation: every endpoint listed, with a Try it out button that sends real requests — curl with a friendly face.

🐍 Python lane: open http://localhost:8000/docs . It's already there — FastAPI generates it from your code. Add a one-line description to each endpoint (see First steps(opens in a new tab) ) and watch the page improve.

🟨 JavaScript lane: install swagger-ui-express , write a small openapi.json describing your five task endpoints (the package README(opens in a new tab) shows the wiring; OpenAPI basic structure(opens in a new tab) explains the file). Serve it at /docs . Describing endpoints you already built teaches you more than building them did.

Then, in Swagger UI, without curl: create a task, list tasks, update it, delete it.

Checkpoint: /docs shows all your endpoints; "Try it out" works for the full CRUD cycle. Take a screenshot for your README.

Commit: Stage 5: Swagger UI

Stage 6 — Publish to GitHub (~1 h)
Your work only counts when someone else can run it.

Create a public GitHub repo and push your code (your ≥6 stage commits come with it).

Write a README with: what this is, how to install & run it (one documented command), a table of all endpoints, one pasted curl -i output, and your Swagger screenshot.

🗓️ New to Git? The basics are all you need here: init → add → commit → push — see the W2 resources, §9. And don't worry: next week's live session covers Git & GitHub properly — branches, pull requests, and how teams review work.

Checkpoint: a stranger with your README could run your API in under 5 minutes.

Commit: Stage 6: publish and docs — then push everything.

★ Make it yours — optional extras
No database yet — so let's have fun with what memory can do.

None of these are required. Pick whatever sounds fun (creative alternatives welcome):

Filtering with query parameters: GET /tasks?done=true returns only finished tasks. A query parameter is the part after ? — filters, not addresses.

Search: GET /tasks?search=milk returns tasks whose title contains the word.

A stats endpoint: GET /stats → { "total": 7, "done": 3, "open": 4 } — your first taste of the server computing something instead of just storing it.

Seed & reset: POST /reset restores the 3 example tasks. Handy for demos — and for the next point.

The mortality experiment: create a few tasks, restart your server, GET /tasks . Write two sentences in your README about what happened and why. This observation is the entire reason Week 3 exists.

Commit (if you build any): Extras: <what you added>

Stage 7 — Bonus: the AI rematch (~1 h, optional — and the most fun)
You built this API by hand, line by line. Now hire the fastest junior developer on Earth — and review their work.

You did Stages 0–6 by hand for a reason: you now know exactly what "correct" looks like. That knowledge is what turns this stage from a magic show into a code review.

Write the prompt yourself — this is the real exercise. Without copying text from this document, write your own prompt asking an AI assistant (Claude, ChatGPT, Gemini — any) to build the same API. From memory, try to specify everything that matters: language and framework, the five endpoints, status codes, validation rules, in-memory storage, Swagger UI. Describing a system precisely is a core backend skill — you'll meet it again in Week 7's spec-first build.

Generate in quarantine. Put the AI's code in a separate folder ( ai-version/ ) or a branch. Your Stages 0–6 code stays untouched — that is your hand-built submission, and it must stay hand-built.

Run it. Does it start on the first try? Fire your Stage 4 checkpoint curls at it. Which pass? Which fail?

Diff it. Compare the AI's code with yours side by side ( git diff --no-index your-file ai-file works on any two files). Then answer three questions in a short "AI vs me" section of your README:

What did the AI do better — and do you understand its version well enough to explain it?

What did it get wrong or quietly ignore from your prompt? (A missing 400 ? A wrong status code? A database you never asked for?)

What did your prompt forget to specify — and what did the AI silently decide for you?

One rematch. Improve your prompt with what you learned, regenerate, and note in one sentence what changed.
The lesson hiding in this stage: an AI's output is exactly as good as your specification — and you could only judge it because you had built the thing yourself first. Both halves of that sentence are your career from now on.

Checkpoint: your README has an "AI vs me" section containing your full prompt and at least three concrete differences you found.

Commit: Stage 7: AI vs me (AI code stays in its own folder/branch).

Requirements
Done = every box ticked. Each one is checkable in under a minute.

 Server starts with one documented command on localhost.

 GET /tasks , GET /tasks/:id , POST /tasks , PUT /tasks/:id , DELETE /tasks/:id all work — full CRUD on an in-memory list (no database, no files).

 Correct status codes: 200 reads, 201 create, 204 delete, 400 invalid body, 404 unknown id — each error with a JSON error message.

 POST and PUT validate input (missing/empty title → 400 ).

 Swagger UI at /docs lists every endpoint, and the full CRUD cycle works via "Try it out".

 Public GitHub repo , ≥6 meaningful commits (one per stage), README with run instructions, endpoint table, one curl -i output, and the Swagger screenshot.

Stretch (optional)
 🟨 Express lane: generate your OpenAPI spec from code comments with swagger-jsdoc ( LogRocket tutorial(opens in a new tab) ) instead of a hand-written file.

 Add pagination: GET /tasks?limit=2&offset=2 — and explain in the README why real APIs never return "everything".

 Stage 7 — the AI rematch (see above): prompt an AI to build the same API, run it, diff it, and write your "AI vs me" section.

Resources — bridge the gap
Everything is collected in W2 — Curated resources. The critical ones per stage:

Stage 0–1: your lane's official quickstart (resources §6) + Terminal guide.

Stage 2–4: MDN HTTP methods(opens in a new tab) · CRUD ↔ REST explained (Treblle)(opens in a new tab) · the build-along tutorials (resources §6b) · http.cat(opens in a new tab) when a status code confuses you.

Stage 5: resources §7 (Swagger/OpenAPI) — pick your lane's row.

Stage 6: resources §9 (Git & GitHub) + Git & GitHub guide — init → add → commit → push. Next week's live session covers Git & GitHub in depth.

Done means
The full CRUD cycle works twice: once via curl -i (right status codes visible), once via Swagger UI "Try it out".

Your repo is public, the README works on a clean machine, and git log shows one honest commit per stage.

Glossary
Plain-language definitions of every bold word above. No definition depends on another — read them in any order.

| Word | What it means |

|---|---|

| API | A set of doors a program offers so other programs can talk to it. Your to-do API lets any client create and read tasks by sending requests. |

| Endpoint | One specific door: a path plus a method. GET /tasks and POST /tasks are two different endpoints. |

| Path | The part of the URL after the domain: in http://localhost:3000/tasks/3, the path is /tasks/3. |

| HTTP method | The type of action a request asks for: GET (give me), POST (create), PUT (replace), PATCH (change part), DELETE (remove). Also called an HTTP "verb". |

| CRUD | Create, Read, Update, Delete — the four things almost every app does with its data. |

| Server | A program that runs and waits for requests, then answers them. (The word also means the machine it runs on.) |

| Client | Whatever sends the request: a browser, curl, Swagger UI, a mobile app. |

| Request | A message from client to server: "method + path + maybe a body". |

| Response | The server's answer: "status code + headers + usually a body". |

| Request body | The data a client sends inside a request — e.g. the JSON of a new task in a POST. |

| Status code | A 3-digit number in every response saying how it went. 2xx = worked (200 OK, 201 Created, 204 No Content) · 4xx = the client goofed (400 Bad Request, 404 Not Found) · 5xx = the server goofed. |

| JSON | The text format APIs use for data: { "title": "Buy milk", "done": false }. Easy for humans to read, easy for machines to parse. |

| localhost | Your own computer's address. http://localhost:3000 = "the server running on this machine, port 3000". Nobody else can see it. |

| Port | A numbered doorway on a machine, so many programs can listen at once. Express commonly uses 3000, FastAPI 8000. |

| In-memory | Data kept in your program's variables (a list in the code). Fast and simple — but gone when the program stops. Databases exist to fix exactly this. |

| Path parameter | A changing piece of the path: the 3 in /tasks/3. Written :id (Express) or {id} (FastAPI) in your code. |

| Query parameter | Extra options after ? in the URL: /tasks?done=true&search=milk. Used for filtering and searching, not for identifying a resource. |

| Validate / validation | Checking incoming data before trusting it (is title there? is it text?). The server never assumes the client behaved. |

| Framework | A box of pre-solved problems (routing, JSON parsing, responses) so you only write your own logic. Express and FastAPI are frameworks. |

| Swagger UI | A web page that displays your API as interactive documentation, with a "Try it out" button that sends real requests. |

| OpenAPI | The standard file format (JSON or YAML) that describes an API — its endpoints, inputs and responses. Swagger UI reads this file. FastAPI writes it for you; in Express you write it yourself. |

| curl | A terminal program that sends HTTP requests. curl -i URL shows the status code and headers too. |

| Git / GitHub / repo / commit | Git tracks versions of your code in a repository; a commit is one saved step with a message; GitHub hosts your repo online so others can see it. |

| README | The front page of a repo: what this is, how to run it, how to use it. |

| Route | Another word for an endpoint definition in your code — frameworks call the code that answers an endpoint a "route" or "route handler". |

| Prompt | The instructions you give an AI assistant. In Stage 7 your prompt is a mini-specification: the more precisely it names endpoints, status codes and rules, the closer the output lands to your API. |

| Diff | A line-by-line comparison of two versions of code, showing what was added, removed or changed. git diff produces one; reading diffs is how professionals review each other's work. |

Details
The details of the assignment are also provided in the PDF file that is attached to this assignment.
Here's a Week 2 – Part 2 assignment that naturally continues from the first one. Instead of using an in-memory array, you will replace it with a real database while keeping exactly the same API. This reinforces the idea that persistence is an implementation detail behind the API, not a change to the API itself.

# W3 · A2 — Connecting your CRUD to the database
## Goal
Take the CRUD API you built in Assignment 1 and replace the in-memory task list with a real SQLite database. Your API endpoints should continue to behave exactly the same, but now your data survives when the server restarts.

## Purpose
Last assignment, your tasks disappeared every time you restarted the server. That wasn't a bug, it was the limitation of storing data in memory.

Real applications store their data in databases. Instead of keeping a list of tasks inside your code, your server will now save them in SQLite, a lightweight database stored in a single file on your computer.

The exciting part is that almost none of your API changes. Clients still send the same requests to the same endpoints. Only the storage layer changes.

This is one of the biggest ideas in backend development:

APIs describe what your application does. Databases describe where your application stores its data.

The big idea in 60 seconds
So far your architecture looked like this:

Client -> API -> Array in memory

Now it becomes:

Client -> API -> SQL Database

The client doesn't know the difference.

GET /tasks still returns tasks.

POST /tasksstill creates tasks.

PUT still updates.

DELETE still deletes.

The only difference is that restarting your server no longer deletes everything.

Tools — pick ONE lane
🟨 JavaScript lane

Database: SQL Lite
Library: better-sqlite3 (recommended)
Database file: tasks.db
🐍 Python lane

Database: SQL Lite
Library: SQLModel or sqlite3
Database file: tasks.db
SQLite requires no installation or server.

The first time your application runs, it will automatically create the database file.

## The task — six stages
Stage 0 — Create your database (~30 min)
Instead of creating an array of tasks, create a SQLite database called:

tasks.db

Create a table named:

tasks

with these columns:

id (integer primary key)
title (text)
done (boolean)
When your application starts:

create the table if it doesn't already exist
insert three example tasks only if the table is empty
Checkpoint:

Restart your application several times.

The example tasks should only appear once.

Commit:

Stage 0: create SQLite database

Stage 1 — Read from the database (~45 min)
Replace the code that reads from your in-memory array.

GET /tasks should now execute a SQL query that returns every task.

GET /tasks/{id} should return one task from the database.

Unknown ids still return:

404{ "error": "Task not found"}

Nothing about your API should change.

Checkpoint:

GET /tasks

returns the database contents.

Commit:

Stage 1: database read endpoints

Stage 2 — Create new tasks (~45 min)
POST /tasks should now insert a new row into the database instead of pushing into an array.

The same validation rules still apply.

Missing title:

400

Successful request:

201

Checkpoint:

Create several tasks.

Restart the server.

Run GET /tasks again.

The tasks should still exist.

This is the first time your data survives a restart.

Commit:

Stage 2: insert into database

Stage 3 — Update and delete (~45 min)
Replace your update and delete logic with SQL.

PUT should update a row.

DELETE should remove a row.

The API behaviour should remain identical.

Checkpoint:

Create a task.

Update it.

Delete it.

Confirm every operation using GET /tasks.

Commit:

Stage 3: update and delete with SQL

Stage 4 — Learn your first SQL (~45 min)
Open the database using any SQLite viewer (DB Browser for SQLite is recommended).

Run these queries manually:

List every task:

SELECT * FROM tasks;

Show only completed tasks:

SELECT * FROM tasks WHERE done = 1;

Count all tasks:

SELECT COUNT(*) FROM tasks;

Mark every task as completed:

UPDATE tasks SET done = 1;

Delete all completed tasks:

DELETE FROM tasks WHERE done = 1;

Notice how the API immediately reflects your database changes.

Checkpoint:

Modify the database manually and verify the changes through your API.

Commit:

Stage 4: explored SQLite

Stage 5 — Publish your database project (~30 min)
Update your README.

Add:

why SQLite was chosen
where the database file is stored
how to start the project
a screenshot of your database viewer
one example SQL query you executed
Checkpoint:

Someone cloning your repository can run the project and automatically create the database.

Commit:

Stage 5: database documentation

★ Optional extras
Choose any that sound interesting.

Search using SQL:
GET /tasks?search=milk using SQL's LIKE operator.

Filter completed tasks:
GET /tasks?done=trueusing a SQL WHERE clause.

Sort alphabetically
Return tasks ordered by title.

Return statistics
GET /statsusing SQL's COUNT()

instead of counting in JavaScript/Python.

Add timestamps
Store:

created_at
updated_at
for every task.

Requirements
Done means every box is ticked.

The API still exposes the same CRUD endpoints as Assignment 1.
Tasks are stored in SQLite instead of memory.
Data survives server restarts.
The database is automatically created if missing.
The tasks table is automatically created if missing.
Three example tasks are inserted only on the first run.
CRUD operations use SQL queries.
Unknown ids return 404.
Invalid requests return 400.
Public GitHub repository updated with README and database screenshot.
What you should notice
By the end of this assignment, the API should feel almost identical to Assignment 1.

The URLs didn't change.

The request bodies didn't change.

The responses didn't change.

Only the implementation changed.

This separation between the API layer and the data layer is one of the foundations of backend engineering. Once you understand it, moving from SQLite to PostgreSQL, MySQL, SQL Server, or another database later becomes much easier.

# W3 · A3 Containerize Your Stack
## Goal
Run Postgres in Docker, connect your A2 service to it (swapping the in-memory store for a real repository), and start app + database together with one command.

## Purpose
This is the survival kit applied in one real task: Docker, SQL, .env, and the payoff of A2's layering — proving that "switch storage" really does change only one file. Data that survives a restart is the moment your project stops being a demo. Every later week (jobs, caching, RAG) assumes this local stack.

## The task
Start Postgres in Docker with a volume so data persists (the Docker guide has the exact command).
Put the connection string in .env — gitignored, with a committed .env.example .
Create your table with one SQL file (or a tiny init script)
Write a Postgres repository implementing the same interface as your in-memory one, and swap it in. Your service and routes must not change — that's the architecture proving itself.
docker-compose.yml : app + database together; docker compose up runs the whole stack.
Prove persistence: create rows → restart app and container → rows still there.
## Requirements
Postgres runs in Docker with a volume ; the whole stack starts with docker compose up .
Connection string from .env (gitignored; .env.example committed).
A Postgres repository replaced the in-memory one — service and routes unchanged (say so in the README, honestly).
Persistence proven across an app + container restart (how you checked goes in the README).
Stretch (optional)
Add Redis to the compose file (you'll want it in W4) and ping it from the app.
Add one index and show EXPLAIN ANALYZE before/after on a seeded table.