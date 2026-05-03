// scripts/seed-notes.js
// Run AFTER seed.js — adds sample notes for Class XII Python
// Usage: MONGODB_URI=your_uri node scripts/seed-notes.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('Set MONGODB_URI env'); process.exit(1); }

const NoteSchema = new mongoose.Schema({
  title: String, subject: String, class: String, unit: String,
  topic: String, content: String, keyPoints: [String],
  syntax: String, commonMistakes: [String], tips: [String],
  difficulty: String, tags: [String], order: Number, isPublished: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const SAMPLE_NOTES = [
  {
    title: 'Functions in Python — Complete Guide',
    subject: 'Python', class: 'XII', unit: 'Unit 1',
    topic: 'User Defined Functions',
    difficulty: 'Basic', order: 1, isPublished: true,
    content: `## What is a Function?

A **function** is a reusable block of code that performs a specific task. Instead of writing the same code again and again, you write it once and call it when needed.

## Types of Functions in Python

1. **Built-in Functions** — Already available: \`print()\`, \`len()\`, \`input()\`, \`range()\`
2. **Functions in Modules** — From libraries: \`math.sqrt()\`, \`random.randint()\`
3. **User Defined Functions** — Created by you using \`def\`

## Why Use Functions?

- **Reduces repetition** — Write once, use many times
- **Organises code** — Easier to read and manage
- **Easier debugging** — Find errors in one place
- **Reusability** — Use in other programs too

## Parameters and Arguments

- **Parameter** — Variable in the function definition
- **Argument** — Actual value passed when calling

## Scope of Variables

- **Local Scope** — Variable inside a function (only available inside)
- **Global Scope** — Variable outside function (available everywhere)
- Use \`global\` keyword to modify a global variable inside a function`,
    syntax: `# Basic function
def greet(name):
    message = "Hello, " + name + "!"
    return message

# Calling the function
result = greet("Rahul")
print(result)  # Output: Hello, Rahul!

# Default parameter
def power(base, exp=2):
    return base ** exp

print(power(3))    # Output: 9 (uses default exp=2)
print(power(3, 3)) # Output: 27

# Multiple return values
def minmax(numbers):
    return min(numbers), max(numbers)

low, high = minmax([3, 1, 7, 2, 9])
print(low, high)  # Output: 1 9

# Global variable
count = 0

def increment():
    global count
    count += 1

increment()
print(count)  # Output: 1`,
    keyPoints: [
      'Use def keyword to define a function',
      'Parameters are local to the function',
      'return sends a value back to the caller',
      'Default parameters have a preset value',
      'A function can return multiple values as a tuple',
      'global keyword needed to modify global variables inside function',
    ],
    tips: [
      'Name your function clearly — add_two_numbers is better than func1',
      'A function should do ONE thing only',
      'Use return None or just return if no value to return',
      'Parameters with default values must come AFTER required parameters',
    ],
    commonMistakes: [
      'Calling function before defining it',
      'Forgetting to use return — function returns None by default',
      'Modifying global variable without global keyword',
      'Confusing parameter (definition) with argument (call)',
    ],
    tags: ['functions', 'def', 'return', 'scope'],
  },
  {
    title: 'Exception Handling — try, except, finally',
    subject: 'Python', class: 'XII', unit: 'Unit 1',
    topic: 'Exception Handling',
    difficulty: 'Intermediate', order: 2, isPublished: true,
    content: `## What is an Exception?

When Python encounters an **error during runtime**, it raises an exception. If not handled, the program **crashes**.

## Why Handle Exceptions?

- Prevents program from crashing
- Shows friendly error messages to users
- Allows recovery from errors

## Types of Common Exceptions

| Exception | When it occurs |
|-----------|---------------|
| ZeroDivisionError | Dividing by zero |
| FileNotFoundError | File doesn't exist |
| ValueError | Wrong type of value |
| TypeError | Wrong data type |
| IndexError | List index out of range |
| KeyError | Dictionary key not found |

## The try-except-finally Block

\`\`\`
try:
    risky code here
except ExceptionType:
    handle the error
finally:
    this ALWAYS runs
\`\`\`

The **finally** block always runs whether exception happened or not — good for closing files.`,
    syntax: `# Basic exception handling
try:
    num = int(input("Enter a number: "))
    result = 100 / num
    print("Result:", result)
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")
except ValueError:
    print("Error: Please enter a valid number!")
finally:
    print("Program completed.")

# Multiple exceptions
try:
    marks = [85, 92, 78]
    print(marks[5])  # IndexError!
except (IndexError, TypeError) as e:
    print("Error occurred:", e)

# Catching all exceptions
try:
    # risky code
    pass
except Exception as e:
    print("Unexpected error:", e)`,
    keyPoints: [
      'try block contains risky code that might fail',
      'except block handles the specific exception',
      'finally block ALWAYS runs — use for cleanup',
      'Can have multiple except blocks for different errors',
      'Use "as e" to get the error message',
      'Exception is the base class for all exceptions',
    ],
    tips: [
      'Always catch specific exceptions, not just Exception',
      'Use finally to close files or database connections',
      'Do not use bare except: — too broad, hides bugs',
      'You can raise your own exceptions using raise keyword',
    ],
    commonMistakes: [
      'Writing except before try — syntax error',
      'Catching too broad (Exception) hides real bugs',
      'Forgetting that finally runs even after return',
      'Not logging or printing the error message',
    ],
    tags: ['exceptions', 'try', 'except', 'finally', 'error handling'],
  },
  {
    title: 'File Handling in Python — Text Files',
    subject: 'Python', class: 'XII', unit: 'Unit 1',
    topic: 'Text File Handling',
    difficulty: 'Intermediate', order: 3, isPublished: true,
    content: `## What is a File?

A **file** stores data permanently on the disk. Without files, data is lost when the program ends.

## Types of Files

1. **Text File** — Stores text (.txt, .csv, .py)
2. **Binary File** — Stores binary data (.jpg, .mp3, .exe)
3. **CSV File** — Comma Separated Values (.csv)

## File Opening Modes

| Mode | Meaning |
|------|---------|
| r | Read (default). File must exist |
| w | Write. Creates new or overwrites existing |
| a | Append. Adds to end of file |
| r+ | Read and Write |
| w+ | Write and Read (creates new) |
| a+ | Append and Read |

## Important Methods

- **write(str)** — Writes a string
- **writelines(list)** — Writes a list of strings
- **read()** — Reads entire file as string
- **readline()** — Reads one line
- **readlines()** — Reads all lines as list
- **seek(n)** — Move to position n in file
- **tell()** — Returns current position

## The with Statement

Using \`with\` is the **best practice** — it automatically closes the file even if an error occurs.`,
    syntax: `# Writing to a file
with open("students.txt", "w") as f:
    f.write("Rahul Sharma\\n")
    f.write("Priya Singh\\n")

# Appending to a file
with open("students.txt", "a") as f:
    f.write("Amit Kumar\\n")

# Reading entire file
with open("students.txt", "r") as f:
    content = f.read()
    print(content)

# Reading line by line
with open("students.txt", "r") as f:
    for line in f:
        print(line.strip())  # strip removes \\n

# Reading all lines as list
with open("students.txt", "r") as f:
    lines = f.readlines()
    print(lines)  # ['Rahul Sharma\\n', ...]

# seek and tell
with open("students.txt", "r") as f:
    f.seek(5)         # move to 5th byte
    print(f.tell())   # prints 5
    data = f.read(10) # read 10 characters

# Count vowels in file
with open("students.txt", "r") as f:
    content = f.read()
    vowels = sum(1 for c in content if c.lower() in 'aeiou')
    print("Vowels:", vowels)`,
    keyPoints: [
      'Always close files after use — use with statement',
      'w mode deletes existing content, a mode adds to it',
      'readline() reads one line including \\n',
      'readlines() returns a LIST of all lines',
      'seek(0) goes back to start of file',
      'strip() removes leading/trailing whitespace including \\n',
    ],
    tips: [
      'Always use with open() — never forget to close',
      'Use "r" mode first to test file reading',
      'strip() each line to remove the \\n character',
      'Use os.path.exists() to check if file exists before reading',
    ],
    commonMistakes: [
      'Using w mode when you want a mode — deletes old data!',
      'Forgetting to add \\n when writing — all data on one line',
      'Not stripping \\n from readline() output',
      'Opening in r mode when file does not exist — FileNotFoundError',
    ],
    tags: ['files', 'read', 'write', 'open', 'with', 'text file'],
  },
  {
    title: 'Stack Data Structure — Push and Pop',
    subject: 'Python', class: 'XII', unit: 'Unit 1',
    topic: 'Stack using List',
    difficulty: 'Intermediate', order: 5, isPublished: true,
    content: `## What is a Stack?

A **Stack** is a linear data structure that follows **LIFO** principle.
**LIFO = Last In, First Out** — The last element added is the first one removed.

Think of a stack of plates — you add on top and remove from top!

## Real Life Examples

- Browser Back button (pages visited)
- Undo feature in text editors
- Plates stacked in a cafeteria

## Operations on Stack

| Operation | Description |
|-----------|-------------|
| **push(item)** | Add item to top of stack |
| **pop()** | Remove and return top item |
| **peek()** | View top item without removing |
| **isEmpty()** | Check if stack is empty |
| **size()** | Return number of items |

## Python List as Stack

Python's \`list\` can be used as a stack:
- **push** → \`append()\`
- **pop** → \`pop()\`

## Stack Overflow and Underflow

- **Overflow** — Pushing to a full stack (with size limit)
- **Underflow** — Popping from an empty stack`,
    syntax: `# Stack implementation using list

class Stack:
    def __init__(self):
        self.items = []   # empty list

    def push(self, item):
        self.items.append(item)   # add to top

    def pop(self):
        if self.is_empty():
            print("Stack Underflow!")
            return None
        return self.items.pop()   # remove from top

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]     # view top without removing

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def display(self):
        print("Stack (top to bottom):", self.items[::-1])


# Using the stack
s = Stack()
s.push(10)
s.push(20)
s.push(30)
s.display()           # [30, 20, 10]

print(s.peek())       # 30
print(s.pop())        # 30
print(s.pop())        # 20
s.display()           # [10]
print(s.is_empty())   # False`,
    keyPoints: [
      'Stack follows LIFO — Last In First Out',
      'Python list append() is used for push operation',
      'Python list pop() is used for pop operation',
      'Always check is_empty() before pop to avoid underflow',
      'Top of stack is the last element (index -1)',
      'items[-1] gives the top element without removing',
    ],
    tips: [
      'Draw a diagram when solving stack problems in exam',
      'Trace through push and pop step by step',
      'Stack is used in recursion, expression evaluation, DFS',
      'Remember: append adds to RIGHT end, pop removes from RIGHT end',
    ],
    commonMistakes: [
      'Popping from empty stack — check is_empty() first',
      'Confusing LIFO with FIFO (Queue is FIFO)',
      'Using insert(0, item) for push — wrong! Use append()',
      'Forgetting to return value from pop()',
    ],
    tags: ['stack', 'LIFO', 'push', 'pop', 'data structures', 'list'],
  },
]

async function seedNotes() {
  console.log('📚 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema)

  for (const note of SAMPLE_NOTES) {
    const exists = await Note.findOne({ title: note.title })
    if (exists) { console.log(`⏭️  Already exists: ${note.title}`); continue }
    await Note.create(note)
    console.log(`✅ Created: ${note.title}`)
  }

  console.log('\n🎉 Sample notes added successfully!')
  console.log('Students can now read these notes in the Notes section.')
  await mongoose.disconnect()
  process.exit(0)
}

seedNotes().catch(e => { console.error('❌ Failed:', e); process.exit(1) })
