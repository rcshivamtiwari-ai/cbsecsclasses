import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Note from '@/models/Note';

// ONE-TIME FULL SETUP ROUTE
// Visit: https://your-site.vercel.app/api/setup-all
// Creates admin account + ALL notes for Class X & XII syllabus
// Safe to run multiple times — skips already existing data

const ALL_NOTES = [

  // ============================================================
  // CLASS XII — UNIT 1: PYTHON
  // ============================================================
  {
    title: 'Functions in Python — Types & Complete Guide',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python Revision',
    topic: 'Functions', difficulty: 'Basic', order: 1, isPublished: true,
    content: `## What is a Function?
A **function** is a named block of code that performs a specific task. You define it once and call it whenever needed — no need to rewrite the same code.

## Types of Functions in Python

### 1. Built-in Functions
Already available in Python. No import needed.
Examples: \`print()\`, \`len()\`, \`input()\`, \`range()\`, \`type()\`, \`int()\`, \`str()\`

### 2. Functions in Modules
Available inside imported libraries.
Examples: \`math.sqrt()\`, \`random.randint()\`, \`os.path.exists()\`

### 3. User Defined Functions
Created by you using the \`def\` keyword.

## Parameters vs Arguments
- **Parameter** — variable name in function definition → \`def greet(name):\` — here \`name\` is parameter
- **Argument** — actual value you pass when calling → \`greet("Rahul")\` — here "Rahul" is argument

## Default Parameters
Give a parameter a default value. If caller doesn't pass it, default is used.

## Scope of Variables
- **Local Scope** — Variable created inside a function. Only available inside that function.
- **Global Scope** — Variable created outside all functions. Available everywhere.
- Use \`global\` keyword inside function to modify a global variable.

## Flow of Execution
1. Program starts from top
2. When function is called, control jumps to function body
3. Function executes
4. Control returns to where it was called`,
    syntax: `# Built-in function example
print(len("Hello"))  # Output: 5

# Module function
import math
print(math.sqrt(16))  # Output: 4.0

# Simple user defined function
def greet(name):
    message = "Hello, " + name + "!"
    return message

print(greet("Rahul"))  # Output: Hello, Rahul!

# Default parameter
def power(base, exp=2):
    return base ** exp

print(power(3))     # Output: 9  (exp uses default = 2)
print(power(3, 3))  # Output: 27 (exp = 3)

# Positional parameters
def student_info(name, cls, roll):
    print(f"Name: {name}, Class: {cls}, Roll: {roll}")

student_info("Priya", "XII", 5)

# Function returning multiple values
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 7, 2, 9])
print(low, high)  # Output: 1 9

# Global variable
count = 0

def increment():
    global count   # must declare global to modify
    count += 1

increment()
increment()
print(count)  # Output: 2`,
    keyPoints: [
      'def keyword is used to define a function in Python',
      'Parameters are in definition, Arguments are in the function call',
      'Default parameters must come AFTER required parameters',
      'return sends value back. Without return, function returns None',
      'Local variables exist only inside the function',
      'Use global keyword to modify a global variable inside a function',
      'A function can return multiple values as a tuple',
    ],
    tips: [
      'Name functions using lowercase with underscores: calculate_area() not CalculateArea()',
      'One function should do ONE thing only',
      'Always test your function with different inputs',
      'If function is too long (>20 lines), break it into smaller functions',
    ],
    commonMistakes: [
      'Calling a function before defining it causes NameError',
      'Forgetting return — function returns None by default',
      'Modifying global variable without global keyword',
      'Default parameter before required parameter causes SyntaxError',
    ],
    tags: ['functions', 'def', 'return', 'scope', 'parameters'],
  },

  {
    title: 'Exception Handling — try, except, finally',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python',
    topic: 'Exception Handling', difficulty: 'Intermediate', order: 2, isPublished: true,
    content: `## What is an Exception?
An **exception** is an error that occurs during program execution (runtime). When Python encounters it, it **raises** an exception. If you don't handle it, your program **crashes**.

## Why Handle Exceptions?
- Prevents program from crashing unexpectedly
- Shows friendly error messages to users
- Allows the program to recover and continue

## Common Exception Types

| Exception | When It Occurs |
|-----------|----------------|
| ZeroDivisionError | Division by zero |
| FileNotFoundError | File does not exist |
| ValueError | Wrong type of value (e.g. int("abc")) |
| TypeError | Wrong data type in operation |
| IndexError | List index out of range |
| KeyError | Dictionary key not found |
| NameError | Variable not defined |

## Syntax of try-except-finally
\`\`\`
try:
    # code that might cause error
except ExceptionName:
    # runs only if that exception occurs
else:
    # runs only if NO exception occurred
finally:
    # ALWAYS runs — with or without exception
\`\`\`

## The finally Block
- Always executes whether exception happens or not
- Used for **cleanup** — closing files, closing database connections`,
    syntax: `# Basic example
try:
    num = int(input("Enter number: "))
    result = 100 / num
    print("Result:", result)
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Please enter a valid number!")
finally:
    print("Program finished.")  # always runs

# Catching multiple exceptions together
try:
    data = [1, 2, 3]
    print(data[10])  # IndexError
except (IndexError, TypeError) as e:
    print("Error:", e)

# Using else — runs only if no exception
try:
    x = int("42")
except ValueError:
    print("Not a number")
else:
    print("Converted successfully:", x)  # runs here

# Get error message with 'as'
try:
    open("missing_file.txt", "r")
except FileNotFoundError as e:
    print("File error:", e)

# Catching ALL exceptions (use carefully)
try:
    risky_code = 10 / 0
except Exception as e:
    print("Unexpected error:", type(e).__name__, e)`,
    keyPoints: [
      'try block contains the risky code',
      'except block handles specific exceptions',
      'finally block ALWAYS runs — perfect for cleanup',
      'else block runs ONLY when no exception occurred',
      'Use "as e" to capture the error message',
      'You can have multiple except blocks for different errors',
    ],
    tips: [
      'Always catch specific exceptions, not just bare except:',
      'Use finally to close files or connections',
      'Never use empty except: — it hides all bugs',
      'Print the exception message to understand what went wrong',
    ],
    commonMistakes: [
      'Writing except before try — SyntaxError',
      'Using bare except: catches everything including keyboard interrupt',
      'Forgetting that finally runs even after a return statement',
      'Not printing the error — makes debugging very hard',
    ],
    tags: ['exception', 'try', 'except', 'finally', 'error handling'],
  },

  {
    title: 'Text File Handling — open, read, write',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python',
    topic: 'Text File Handling', difficulty: 'Intermediate', order: 3, isPublished: true,
    content: `## What is File Handling?
Files store data **permanently** on disk. Without files, all data is lost when program ends.

## Types of Files
1. **Text File** — Stores text data (.txt, .csv, .py)
2. **Binary File** — Stores binary data (.jpg, .mp3, .pkl)
3. **CSV File** — Comma Separated Values (.csv)

## File Opening Modes

| Mode | Full Form | Behavior |
|------|-----------|----------|
| r | Read | Default. File must exist. Read only. |
| w | Write | Creates new OR overwrites existing. Write only. |
| a | Append | Adds to end. Creates if not exists. |
| r+ | Read+Write | File must exist. Both read and write. |
| w+ | Write+Read | Creates/overwrites. Both read and write. |
| a+ | Append+Read | Append and read. |

## Key Methods

| Method | What it does |
|--------|-------------|
| write(str) | Writes a string to file |
| writelines(list) | Writes a list of strings |
| read() | Reads entire file as one string |
| readline() | Reads exactly one line |
| readlines() | Reads all lines, returns list |
| seek(n) | Move file pointer to position n |
| tell() | Returns current pointer position |
| close() | Closes the file |

## with Statement (Best Practice)
Using \`with open()\` automatically closes file even if error occurs.`,
    syntax: `# Writing to a file
with open("notes.txt", "w") as f:
    f.write("Python is fun\\n")
    f.write("File handling is easy\\n")

# Appending to a file
with open("notes.txt", "a") as f:
    f.write("Exception handling is important\\n")

# Read entire file at once
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Read one line at a time
with open("notes.txt", "r") as f:
    line1 = f.readline()   # first line
    line2 = f.readline()   # second line
    print(line1.strip())   # strip removes \\n

# Read all lines as a list
with open("notes.txt", "r") as f:
    lines = f.readlines()
    for line in lines:
        print(line.strip())

# Loop through file directly (best for large files)
with open("notes.txt", "r") as f:
    for line in f:
        words = line.strip().split()
        print("#".join(words))  # words separated by #

# seek and tell
with open("notes.txt", "r") as f:
    print(f.tell())    # 0 (at beginning)
    f.seek(7)          # move to position 7
    print(f.tell())    # 7
    print(f.read(6))   # read 6 characters from pos 7

# Count vowels/consonants
with open("notes.txt", "r") as f:
    content = f.read().lower()
    vowels = sum(1 for c in content if c in 'aeiou')
    consonants = sum(1 for c in content if c.isalpha() and c not in 'aeiou')
    print("Vowels:", vowels, "Consonants:", consonants)

# writelines — write a list
lines = ["Rahul Sharma\\n", "Priya Singh\\n", "Amit Kumar\\n"]
with open("students.txt", "w") as f:
    f.writelines(lines)`,
    keyPoints: [
      '"w" mode deletes all existing content — be careful!',
      '"a" mode safely adds to end without deleting',
      'Always use with open() — it auto-closes the file',
      'readline() includes \\n — use .strip() to remove it',
      'readlines() returns a list — each element is one line with \\n',
      'seek(0) moves pointer back to start of file',
    ],
    tips: [
      'Use "r" mode first to test before writing',
      'Always strip() each line to remove trailing \\n',
      'Use "a" mode when adding data to existing file',
      'Check if file exists before reading using os.path.exists()',
    ],
    commonMistakes: [
      'Using "w" instead of "a" — accidentally deletes all data!',
      'Forgetting \\n in write() — all text on same line',
      'Not stripping \\n from readline() output',
      'Opening file in "r" mode when it does not exist — FileNotFoundError',
    ],
    tags: ['files', 'read', 'write', 'open', 'readline', 'seek', 'tell'],
  },

  {
    title: 'Binary File Handling — pickle module',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python',
    topic: 'Binary File Handling', difficulty: 'Intermediate', order: 4, isPublished: true,
    content: `## What is a Binary File?
A binary file stores data in **binary format** (0s and 1s) — not human readable. Used to store Python objects like dictionaries, lists, class objects.

## Why Binary Files?
- Store complex Python objects directly
- Faster to read/write than text files
- Preserves data types (int stays int, list stays list)

## The pickle Module
Python's \`pickle\` module converts Python objects to binary and back.

| Function | What it does |
|----------|-------------|
| pickle.dump(obj, file) | **Write** object to binary file |
| pickle.load(file) | **Read** object from binary file |

## Binary File Modes
| Mode | Use |
|------|-----|
| wb | Write binary (create/overwrite) |
| rb | Read binary |
| ab | Append binary |
| rb+ | Read and write binary |
| wb+ | Write and read binary |

## How it Works
- \`dump()\` → **serializes** (converts object → binary bytes) → writes to file
- \`load()\` → reads bytes from file → **deserializes** (converts back to Python object)`,
    syntax: `import pickle

# Writing (storing) data to binary file
students = [
    {"roll": 1, "name": "Rahul", "marks": 85},
    {"roll": 2, "name": "Priya", "marks": 92},
    {"roll": 3, "name": "Amit", "marks": 78},
]

with open("students.dat", "wb") as f:
    pickle.dump(students, f)
print("Data saved!")

# Reading (loading) data from binary file
with open("students.dat", "rb") as f:
    data = pickle.load(f)
    print(data)

# Search for a roll number
def search_student(roll_no):
    with open("students.dat", "rb") as f:
        records = pickle.load(f)
    for student in records:
        if student["roll"] == roll_no:
            print("Found:", student["name"], "Marks:", student["marks"])
            return
    print("Roll number not found!")

search_student(2)  # Found: Priya Marks: 92

# Update marks for a roll number
def update_marks(roll_no, new_marks):
    with open("students.dat", "rb") as f:
        records = pickle.load(f)
    for student in records:
        if student["roll"] == roll_no:
            student["marks"] = new_marks
    with open("students.dat", "wb") as f:
        pickle.dump(records, f)
    print("Marks updated!")

update_marks(1, 90)

# Append a new record
def add_student(new_student):
    with open("students.dat", "rb") as f:
        records = pickle.load(f)
    records.append(new_student)
    with open("students.dat", "wb") as f:
        pickle.dump(records, f)

add_student({"roll": 4, "name": "Sneha", "marks": 88})`,
    keyPoints: [
      'import pickle is required before using dump() or load()',
      'dump() writes Python object to binary file',
      'load() reads and returns the Python object from binary file',
      'File must be opened in binary mode: "wb" or "rb"',
      'To update: load all → modify → dump all back',
      'Binary files are NOT human readable — cannot open in Notepad',
    ],
    tips: [
      'Use .dat or .bin extension for binary files by convention',
      'Always read first, modify in memory, then write back',
      'Use try-except for EOFError when reading — file might be empty',
      'pickle can store any Python object — dict, list, class instance',
    ],
    commonMistakes: [
      'Opening binary file in text mode ("r" instead of "rb")',
      'Forgetting to import pickle',
      'Using append mode "ab" incorrectly with pickle — use load+dump instead',
      'Trying to open binary file in Notepad to check data',
    ],
    tags: ['binary files', 'pickle', 'dump', 'load', 'serialization'],
  },

  {
    title: 'CSV File Handling — csv module',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python',
    topic: 'CSV File Handling', difficulty: 'Intermediate', order: 5, isPublished: true,
    content: `## What is CSV?
CSV stands for **Comma Separated Values**. Data is stored as plain text where each value is separated by a comma. Excel files can be saved as CSV.

Example of CSV file content:
\`\`\`
rollno,name,marks,city
1,Rahul Sharma,85,Unchahar
2,Priya Singh,92,Raebareli
\`\`\`

## The csv Module

| Function | Use |
|----------|-----|
| csv.writer(file) | Creates a writer object |
| writer.writerow(list) | Writes ONE row |
| writer.writerows(list_of_lists) | Writes MULTIPLE rows |
| csv.reader(file) | Creates a reader object |

## Steps to Write CSV
1. Open file with open() in write mode
2. Create writer using csv.writer()
3. Write header row with writerow()
4. Write data rows

## Steps to Read CSV
1. Open file with open() in read mode
2. Create reader using csv.reader()
3. Loop through reader to get each row as a list`,
    syntax: `import csv

# Writing to CSV file
with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    # Write header
    writer.writerow(["rollno", "name", "marks", "city"])
    # Write one row
    writer.writerow([1, "Rahul Sharma", 85, "Unchahar"])
    writer.writerow([2, "Priya Singh", 92, "Raebareli"])

# writerows — write multiple rows at once
data = [
    [3, "Amit Kumar", 78, "Lucknow"],
    [4, "Sneha Gupta", 88, "Allahabad"],
    [5, "Rohit Verma", 65, "Varanasi"],
]
with open("students.csv", "a", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

# Reading CSV file
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # each row is a list

# Skip header row while reading
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    next(reader)  # skip header
    for row in reader:
        print("Name:", row[1], "Marks:", row[2])

# Search for a user-id (practical program)
def search_password(user_id):
    with open("users.csv", "r") as f:
        reader = csv.reader(f)
        for row in reader:
            if row[0] == user_id:
                print("Password found:", row[1])
                return
    print("User ID not found!")`,
    keyPoints: [
      'import csv is required',
      'Use newline="" in open() when writing to avoid blank lines',
      'writerow() takes a list as argument',
      'reader() returns each row as a list of strings',
      'Use next(reader) to skip the header row',
      'CSV is a text file — can be opened in Excel or Notepad',
    ],
    tips: [
      'Always add newline="" in open() for writing or you get extra blank lines',
      'Use "a" mode to add more data without losing existing data',
      'CSV data is always strings — convert with int() or float() if needed',
      'Use DictReader/DictWriter for column-name access',
    ],
    commonMistakes: [
      'Forgetting newline="" — creates extra blank rows in CSV',
      'Not importing csv module',
      'Treating CSV numbers as integers — they are strings by default',
      'Using write mode "w" when you want to append — loses all data!',
    ],
    tags: ['csv', 'csv module', 'writerow', 'reader', 'writer'],
  },

  {
    title: 'Stack Data Structure — Push, Pop, Implementation',
    subject: 'Python', class: 'XII', unit: 'Unit 1: Python',
    topic: 'Stack using List', difficulty: 'Intermediate', order: 6, isPublished: true,
    content: `## What is a Stack?
A **stack** is a linear data structure that works on **LIFO** principle.

**LIFO = Last In, First Out**
The last element inserted is the first one to be removed.

## Real Life Examples
- Stack of plates in a cafeteria
- Browser back button (pages visited)
- Undo feature in MS Word (Ctrl+Z)
- Function call stack in programs

## Operations on Stack

| Operation | Description |
|-----------|-------------|
| PUSH | Add element to TOP of stack |
| POP | Remove and return element from TOP |
| PEEK/TOP | View top element without removing |
| isEmpty | Returns True if stack is empty |
| size | Returns number of elements |

## Stack using Python List
- PUSH → append()
- POP → pop()

## Overflow and Underflow
- **Stack Overflow** — Trying to push into a FULL stack
- **Stack Underflow** — Trying to pop from an EMPTY stack — always check isEmpty() first!`,
    syntax: `# Stack implementation using Python list

class Stack:
    def __init__(self):
        self.items = []        # empty list = empty stack

    def push(self, item):
        self.items.append(item)  # add to top

    def pop(self):
        if self.is_empty():
            print("Stack Underflow! Stack is empty.")
            return None
        return self.items.pop()  # remove from top and return

    def peek(self):              # also called top()
        if self.is_empty():
            return None
        return self.items[-1]    # see top without removing

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def display(self):
        if self.is_empty():
            print("Stack is empty")
        else:
            print("Stack (top-->bottom):", self.items[::-1])


# --- Using the Stack ---
s = Stack()

# Push elements
s.push(10)
s.push(20)
s.push(30)
s.push(40)
s.display()           # Stack: [40, 30, 20, 10]

print("Top:", s.peek())    # 40
print("Size:", s.size())   # 4

print("Popped:", s.pop())  # 40
print("Popped:", s.pop())  # 30

s.display()           # Stack: [20, 10]
print("Empty?", s.is_empty())  # False

# Trace through exam question:
# Push 5, Push 3, Pop, Push 8, Pop, Pop
# Step 1: Push 5 → [5]
# Step 2: Push 3 → [5, 3]   (3 is on top)
# Step 3: Pop    → returns 3, stack = [5]
# Step 4: Push 8 → [5, 8]   (8 is on top)
# Step 5: Pop    → returns 8, stack = [5]
# Step 6: Pop    → returns 5, stack = []`,
    keyPoints: [
      'Stack follows LIFO — Last In First Out',
      'Python list append() → PUSH operation',
      'Python list pop() → POP operation',
      'items[-1] → PEEK (top element) without removing',
      'Always check is_empty() before pop to avoid underflow',
      'Stack is used in: recursion, undo operations, expression evaluation',
    ],
    tips: [
      'Draw a stack diagram in exams — easy to trace step by step',
      'Remember: right end of list = top of stack',
      'Practice tracing through push/pop sequences on paper',
      'In board exam, always check underflow condition before pop',
    ],
    commonMistakes: [
      'Popping from empty stack — always check is_empty() first',
      'Confusing LIFO (Stack) with FIFO (Queue)',
      'Using insert(0, item) for push — wrong! Use append()',
      'Forgetting to return value in pop() method',
    ],
    tags: ['stack', 'LIFO', 'push', 'pop', 'peek', 'data structure'],
  },

  // ============================================================
  // CLASS XII — UNIT 2: COMPUTER NETWORKS
  // ============================================================
  {
    title: 'Computer Networks — Evolution & Introduction',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Evolution of Networking', difficulty: 'Basic', order: 10, isPublished: true,
    content: `## What is a Computer Network?
A **computer network** is a group of computers and devices connected together to **share data and resources**.

## Why Networks?
- Share files and data
- Share hardware (printers, scanners)
- Communication (email, chat, video calls)
- Share internet connection

## Evolution of Networking

### ARPANET (1969)
- First computer network
- Created by US Department of Defense (DARPA)
- Connected 4 universities initially
- Used **packet switching** for the first time
- Full form: Advanced Research Projects Agency NETwork

### NSFNET (1986)
- National Science Foundation NETwork
- Replaced ARPANET
- Connected universities and research centers across USA
- Backbone speed: 56 Kbps initially → upgraded to T3 (45 Mbps)

### INTERNET (1991 onwards)
- Global network of networks
- Tim Berners-Lee invented WWW (World Wide Web) in 1991
- Open to public
- Uses TCP/IP protocols
- Billions of devices connected today

## Data Communication Components
1. **Sender** — The device sending data
2. **Receiver** — The device receiving data
3. **Message** — The data being sent
4. **Communication Media** — The path (cable/wireless)
5. **Protocols** — Rules for communication`,
    syntax: `# Python example: Simple network concept
# IP Address — unique address of every device on network

import socket

# Get your own IP address
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
print("Hostname:", hostname)
print("IP Address:", ip_address)

# Bandwidth and Data Transfer Rate
# Bandwidth = Maximum capacity of channel (bps, Kbps, Mbps, Gbps)
# Data Transfer Rate = Actual speed achieved

# Switching Techniques:
# Circuit Switching — dedicated path (telephone)
# Packet Switching — data split into packets (internet)`,
    keyPoints: [
      'ARPANET (1969) was first network — by US Defense',
      'NSFNET (1986) connected academic institutions',
      'Internet became public in 1991 — WWW by Tim Berners-Lee',
      '5 components of data communication: Sender, Receiver, Message, Media, Protocols',
      'Bandwidth = capacity of channel (Kbps, Mbps, Gbps)',
      'Packet Switching — internet uses this — data split into packets',
      'Circuit Switching — telephone uses this — dedicated path',
    ],
    tips: [
      'Remember order: ARPANET → NSFNET → INTERNET',
      'Packet switching is used by internet — packets can take different routes',
      'Circuit switching — whole path reserved — wasteful if no data flowing',
      'IP address is like house address for a computer on network',
    ],
    commonMistakes: [
      'Confusing ARPANET year (1969) with NSFNET (1986)',
      'Saying internet was invented by USA government — WWW was by Tim Berners-Lee',
      'Confusing bandwidth (capacity) with speed (actual transfer rate)',
    ],
    tags: ['networks', 'ARPANET', 'internet', 'NSFNET', 'packet switching'],
  },

  {
    title: 'Transmission Media — Wired & Wireless',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Transmission Media', difficulty: 'Basic', order: 11, isPublished: true,
    content: `## What is Transmission Media?
The **physical path** through which data travels from sender to receiver is called transmission media.

## Types of Transmission Media

### A. Wired (Guided) Media

#### 1. Twisted Pair Cable
- Two copper wires twisted together
- **UTP** (Unshielded Twisted Pair) — most common, used in offices
- **STP** (Shielded Twisted Pair) — has protective shield
- Speed: 10 Mbps to 1 Gbps
- Distance: up to 100 metres
- Cheapest option
- Used in: LAN (Ethernet), telephone lines

#### 2. Coaxial Cable
- Central copper conductor + insulator + metal shield + outer cover
- Better shielding than twisted pair
- Speed: up to 10 Gbps
- Distance: up to 500 metres
- Used in: Cable TV, older ethernet networks

#### 3. Fiber Optic Cable
- Uses **light pulses** to transmit data (not electricity)
- **Fastest** transmission media
- Not affected by electromagnetic interference
- Very expensive
- Speed: up to 100 Gbps
- Used in: Internet backbone, long distance communication, hospitals

### B. Wireless (Unguided) Media

#### 1. Radio Waves
- Frequency: 3 KHz to 1 GHz
- Can travel through walls
- Used in: WiFi, AM/FM radio, Bluetooth

#### 2. Microwaves
- Frequency: 1 GHz to 300 GHz
- Line of sight transmission (needs clear path)
- Used in: Satellite communication, mobile networks, radar

#### 3. Infrared Waves
- Short range, line of sight
- Cannot pass through walls
- Used in: TV remote, wireless mouse/keyboard`,
    syntax: `# Memory trick for Twisted Pair, Coaxial, Fiber Optic:
# TCF — "Twisted Coax Fiber"
# T = Twisted pair  → Telephone, LAN, cheapest
# C = Coaxial       → Cable TV, medium speed
# F = Fiber Optic   → Fastest, most expensive, uses LIGHT

# Wireless: Radio → Microwave → Infrared
# R = Radio     → Long range, through walls, WiFi
# M = Microwave → Line of sight, satellite
# I = Infrared  → Short range, remote controls`,
    keyPoints: [
      'Twisted Pair — cheapest — used in LAN and telephone',
      'Coaxial Cable — better shielding — used in Cable TV',
      'Fiber Optic — fastest — uses light pulses — most expensive',
      'Radio Waves — WiFi, Bluetooth, AM/FM radio',
      'Microwaves — need line of sight — satellite communication',
      'Infrared — very short range — TV remotes',
      'Fiber optic is NOT affected by electromagnetic interference',
    ],
    tips: [
      'Remember: Fiber = Fastest = Light = Most Expensive',
      'Twisted pair = cheapest, most common in schools and offices',
      'Infrared needs direct line of sight — that is why TV remote must face TV',
      'Microwave towers on buildings — line of sight communication',
    ],
    commonMistakes: [
      'Saying fiber optic uses electricity — it uses LIGHT pulses',
      'Confusing infrared with radio waves — infrared cannot pass through walls',
      'Forgetting that coaxial uses copper conductor inside',
    ],
    tags: ['transmission media', 'twisted pair', 'coaxial', 'fiber optic', 'wireless'],
  },

  {
    title: 'Network Devices — Hub, Switch, Router, etc.',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Network Devices', difficulty: 'Basic', order: 12, isPublished: true,
    content: `## Network Devices

### 1. Modem
- **MOdulator DEModulator**
- Converts digital signal ↔ analog signal
- Used to connect to internet via telephone line
- Every home internet connection uses a modem

### 2. Ethernet Card (NIC)
- **Network Interface Card**
- Hardware inside computer that connects it to network
- Has a unique **MAC address**
- Required for wired internet connection

### 3. RJ45 Connector
- The rectangular plug at end of ethernet cable
- Like a wider version of telephone plug
- Connects twisted pair cable to computer

### 4. Repeater
- Receives weak signal, **amplifies and retransmits** it
- Extends network range
- Works at Physical layer
- Just amplifies — does NOT filter or process data

### 5. Hub
- Connects multiple computers in a network
- **Broadcasts** data to ALL connected devices (even if not the target)
- Dumb device — no intelligence
- Being replaced by switches

### 6. Switch
- Smarter than hub
- Sends data **only to the target device** using MAC address
- Reduces traffic, more efficient
- Used in modern LANs

### 7. Router
- Connects **two different networks** (e.g., your home to internet)
- Finds the **best path** for data packets
- Uses **IP addresses** for routing
- Every home has a WiFi router

### 8. Gateway
- Connects networks with **different protocols**
- Acts as translator between incompatible networks

### 9. WiFi Card
- Wireless NIC
- Connects computer to wireless network
- Built into modern laptops`,
    syntax: `# Key differences to remember:

# Hub vs Switch:
# Hub  → broadcasts to ALL → wastes bandwidth → old technology
# Switch → sends to TARGET only → efficient → modern LANs

# Switch vs Router:
# Switch → connects devices within SAME network (MAC address)
# Router → connects DIFFERENT networks (IP address)

# Repeater vs Hub:
# Repeater → 2 ports → extends cable range
# Hub     → multiple ports → connects multiple computers

# Remember: "RHNSMRGW" (Repeater, Hub, NIC, Switch, Modem, Router, Gateway, WiFi)`,
    keyPoints: [
      'Modem — converts digital to analog — needed for internet via phone line',
      'NIC/Ethernet Card — has unique MAC address — needed for network connection',
      'Repeater — boosts weak signal — extends network range',
      'Hub — broadcasts to all devices — no intelligence — old',
      'Switch — sends only to target device using MAC address — smart',
      'Router — connects different networks — uses IP address — finds best path',
      'Gateway — connects networks with different protocols',
    ],
    tips: [
      'Hub=dumb (sends everywhere), Switch=smart (sends to target)',
      'Router is what you have at home for internet',
      'Every device has a unique MAC address (hardware address)',
      'IP address can change, MAC address is permanent (hardware)',
    ],
    commonMistakes: [
      'Confusing Hub (broadcasts) with Switch (targeted)',
      'Saying router uses MAC address — it uses IP address',
      'Confusing Repeater (signal booster) with Router (network connector)',
    ],
    tags: ['hub', 'switch', 'router', 'modem', 'repeater', 'gateway', 'NIC'],
  },

  {
    title: 'Network Topologies & Types (LAN, WAN, MAN)',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Network Topologies', difficulty: 'Basic', order: 13, isPublished: true,
    content: `## Types of Networks

### PAN (Personal Area Network)
- Range: few metres (upto 10m)
- Devices: phone, laptop, Bluetooth devices
- Example: Bluetooth file sharing, connecting phone to earphones

### LAN (Local Area Network)
- Range: building or campus (upto 1 km)
- High speed: 10 Mbps to 1 Gbps
- Example: School computer lab, office network

### MAN (Metropolitan Area Network)
- Range: city or town (upto 100 km)
- Example: Cable TV network across a city, city-wide WiFi

### WAN (Wide Area Network)
- Range: countries or worldwide
- Slowest but largest range
- Example: **Internet** is the largest WAN

## Network Topologies
A **topology** is the **physical or logical arrangement** of computers in a network.

### 1. Bus Topology
- All computers connected to a **single cable** (backbone)
- Data travels in both directions on the bus
- **Advantages:** Simple, cheap, easy to install
- **Disadvantages:** If backbone fails, entire network fails; slow with many computers

### 2. Star Topology
- All computers connected to a **central hub or switch**
- Most popular topology today
- **Advantages:** If one computer fails, others work; easy to add/remove
- **Disadvantages:** If hub/switch fails, entire network fails; more cable needed

### 3. Tree Topology
- Combination of Bus and Star
- Hierarchical structure
- Used in large organisations
- **Advantages:** Scalable, easy to manage
- **Disadvantages:** If root fails, whole network fails`,
    syntax: `# Memory tricks:

# Network types by range:
# PAN < LAN < MAN < WAN
# Personal < Local < Metropolitan < Wide

# Topology comparison:
# Bus   = one long cable, all connected to it, cheap but fragile
# Star  = all connect to center hub/switch, most common today
# Tree  = star of stars, hierarchical, used in schools/colleges

# Bus failure: single cable breaks → whole network down
# Star failure: hub/switch breaks → whole network down, but one PC failing = OK
# Tree failure: root node fails → whole section fails`,
    keyPoints: [
      'PAN < LAN < MAN < WAN — ordered by range',
      'Internet is the largest example of WAN',
      'Bus — single backbone cable — cheap but single point of failure',
      'Star — central hub/switch — most popular — if one PC fails, rest work',
      'Tree — hierarchical combination of bus and star',
      'LAN is in one building, MAN in a city, WAN across countries',
    ],
    tips: [
      'School computer lab = LAN example (best example to give in exam)',
      'Star topology is MOST COMMON in real life',
      'Bus = simple but one break = whole network fails',
      'Tree topology = used in large organisations with departments',
    ],
    commonMistakes: [
      'Confusing MAN range with LAN range',
      'Saying internet is LAN — internet is WAN',
      'In star topology, saying one computer failure stops network — it does NOT',
    ],
    tags: ['LAN', 'WAN', 'MAN', 'PAN', 'bus', 'star', 'tree', 'topology'],
  },

  {
    title: 'Network Protocols — HTTP, FTP, TCP/IP and more',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Network Protocols', difficulty: 'Basic', order: 14, isPublished: true,
    content: `## What is a Protocol?
A **protocol** is a set of rules that computers follow to communicate with each other. Like grammar rules for language — both sides must follow the same rules.

## Important Protocols

| Protocol | Full Form | Use |
|----------|-----------|-----|
| HTTP | HyperText Transfer Protocol | Web pages — loading websites |
| HTTPS | HTTP Secure | Secure web pages — banking, shopping |
| FTP | File Transfer Protocol | Upload/download files between computers |
| SMTP | Simple Mail Transfer Protocol | **Sending** emails |
| POP3 | Post Office Protocol v3 | **Receiving/downloading** emails |
| TCP/IP | Transmission Control Protocol/Internet Protocol | Foundation of internet — all data transfer |
| PPP | Point to Point Protocol | Dial-up internet connection |
| TELNET | TELetype NETwork | Remote login to another computer (not secure) |
| VoIP | Voice over Internet Protocol | Voice calls over internet (WhatsApp calls) |

## TCP vs UDP
- **TCP** — Reliable, checks every packet arrives — used for web, email
- **UDP** — Fast but unreliable — used for video streaming, gaming

## WWW vs Internet
- **Internet** — Physical network of computers worldwide
- **WWW** — Service running ON the internet — web pages and links`,
    syntax: `# Protocol examples in Python

# HTTP/HTTPS — fetching a web page
import urllib.request
# response = urllib.request.urlopen("https://www.google.com")

# SMTP — sending email (concept)
# import smtplib
# server = smtplib.SMTP('smtp.gmail.com', 587)

# Socket programming uses TCP/IP
import socket
# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # TCP
# s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)   # UDP

# Remember protocols by use:
# Browsing  → HTTP/HTTPS
# Files     → FTP
# Send mail → SMTP
# Get mail  → POP3
# All data  → TCP/IP
# Voice     → VoIP
# Remote    → TELNET`,
    keyPoints: [
      'HTTP — web pages. HTTPS — secure web pages (has SSL encryption)',
      'FTP — file transfer between computers',
      'SMTP — sending email. POP3 — receiving/downloading email',
      'TCP/IP — foundation of internet — every data uses this',
      'VoIP — voice over internet — WhatsApp calls, Zoom',
      'TELNET — remote login — not secure (replaced by SSH)',
      'PPP — point to point — dial up connection',
    ],
    tips: [
      'HTTPS = HTTP + SSL (Secure Socket Layer) = has padlock in browser',
      'SMTP = Simple Mail Transfer Protocol = Sending (S for Send)',
      'POP3 = Post Office Protocol = downloading mail to local device',
      'VoIP = Voice over IP = Internet calling',
    ],
    commonMistakes: [
      'Confusing SMTP (send) with POP3 (receive)',
      'Saying HTTP and HTTPS are different protocols — HTTPS is HTTP with encryption',
      'Confusing internet (network) with WWW (service on internet)',
    ],
    tags: ['HTTP', 'FTP', 'SMTP', 'TCP/IP', 'protocols', 'VoIP', 'POP3'],
  },

  {
    title: 'Web Services — WWW, HTML, URL, Web Hosting',
    subject: 'Networks', class: 'XII', unit: 'Unit 2: Computer Networks',
    topic: 'Web Services', difficulty: 'Basic', order: 15, isPublished: true,
    content: `## World Wide Web (WWW)
- Created by **Tim Berners-Lee** in 1991 at CERN
- Collection of web pages connected by hyperlinks
- Web pages written in **HTML**
- Accessed using a **web browser**

## Key Terms

### HTML (HyperText Markup Language)
- Language used to create web pages
- Uses tags like \`<html>\`, \`<body>\`, \`<p>\`
- Static content

### XML (eXtensible Markup Language)
- Used to store and transport data
- Tags are user-defined (unlike HTML)
- Used in web services and data exchange

### URL (Uniform Resource Locator)
Complete address of a web page.
Structure: \`protocol://domain-name/path\`
Example: \`https://www.cbse.gov.in/results/index.html\`
- Protocol: https
- Domain: www.cbse.gov.in
- Path: /results/index.html

### Domain Name
Human-readable address of a website.
- **.com** → commercial
- **.edu** → educational
- **.gov** → government
- **.in** → India
- **.org** → organisation

### Web Browser
Software to access web pages.
Examples: Chrome, Firefox, Edge, Safari

### Web Server
Computer that stores web pages and sends them when requested.

### Web Hosting
Service of renting space on a web server to publish your website.

### HTTP vs HTTPS
- HTTP → No encryption → Not safe
- HTTPS → With SSL encryption → Safe (padlock shown in browser)`,
    syntax: `# Basic HTML structure (for understanding)
"""
<!DOCTYPE html>
<html>
  <head>
    <title>Chinmaya Vidyalaya</title>
  </head>
  <body>
    <h1>Welcome Students!</h1>
    <p>Class X and XII Computer Science</p>
    <a href="https://cbse.gov.in">Visit CBSE</a>
  </body>
</html>
"""

# URL breakdown example:
url = "https://www.google.com/search?q=python"
# Protocol:   https
# Sub-domain: www
# Domain:     google.com
# Path:       /search
# Query:      ?q=python`,
    keyPoints: [
      'WWW created by Tim Berners-Lee in 1991',
      'HTML — creates web pages. XML — stores/transports data',
      'URL = complete address of a web page',
      'Domain name = human readable address (.com, .in, .edu, .gov)',
      'Web server = stores and serves web pages',
      'Web hosting = renting space on web server',
      'HTTPS = HTTP + SSL encryption = secure (padlock in browser)',
    ],
    tips: [
      'URL has 3 parts: protocol + domain + path',
      'WWW is a service ON the internet — not the internet itself',
      'Web browser requests page → web server responds with HTML',
      'Remember: Tim Berners-Lee invented WWW (not internet)',
    ],
    commonMistakes: [
      'Saying WWW and internet are same — they are different',
      'Confusing HTML (web pages) with HTTP (protocol to transfer them)',
      'Forgetting domain name extensions: .in = India, .gov = government',
    ],
    tags: ['WWW', 'HTML', 'URL', 'domain', 'web server', 'web browser', 'hosting'],
  },

  // ============================================================
  // CLASS XII — UNIT 3: DATABASE MANAGEMENT
  // ============================================================
  {
    title: 'Database Concepts & Relational Model',
    subject: 'Database', class: 'XII', unit: 'Unit 3: Database Management',
    topic: 'Database Concepts & Keys', difficulty: 'Basic', order: 20, isPublished: true,
    content: `## What is a Database?
A **database** is an organised collection of related data stored in a structured format so it can be easily accessed, managed, and updated.

## Why Use a Database?
- No data repetition (redundancy)
- Easy to search and retrieve data
- Multiple users can access simultaneously
- Data security and integrity

## DBMS
**Database Management System** — software that manages a database.
Examples: MySQL, Oracle, MS Access, SQLite

## Relational Data Model
Data is stored in **tables** (called relations).

## Important Terminology

| Term | Meaning | Example |
|------|---------|---------|
| **Relation/Table** | A table with rows and columns | Students table |
| **Attribute** | Column (a property) | name, rollno, marks |
| **Tuple** | Row (one record) | (1, Rahul, 85) |
| **Domain** | Set of allowed values for an attribute | marks: 0-100 |
| **Degree** | Number of **columns** in a table | Students has 4 cols → degree 4 |
| **Cardinality** | Number of **rows** in a table | Students has 30 rows → cardinality 30 |

## Keys

### Candidate Key
- Attribute(s) that can uniquely identify each row
- Minimal — no extra attributes
- A table can have multiple candidate keys

### Primary Key
- The **chosen** candidate key
- Uniquely identifies each row
- Cannot be NULL
- Only ONE primary key per table

### Alternate Key
- Candidate keys that were NOT chosen as primary key

### Foreign Key
- Attribute in one table that refers to **Primary Key** of another table
- Creates relationship between tables`,
    syntax: `-- Example Table: Students
-- rollno | name          | marks | city
-- -------|---------------|-------|----------
-- 1      | Rahul Sharma  | 85    | Unchahar
-- 2      | Priya Singh   | 92    | Raebareli
-- 3      | Amit Kumar    | 78    | Lucknow

-- rollno: PRIMARY KEY (uniquely identifies each student)
-- name: could be candidate key if all names unique
-- Degree = 4 (4 columns: rollno, name, marks, city)
-- Cardinality = 3 (3 rows/tuples)

-- Foreign Key example:
-- Marks table
-- rollno | subject | score
-- rollno here is FOREIGN KEY → refers to rollno in Students table

# Python equivalent concepts:
students = [
    {"rollno": 1, "name": "Rahul", "marks": 85},  # tuple/row
    {"rollno": 2, "name": "Priya", "marks": 92},
]
# "rollno" acts as primary key — unique for each student
# Each dictionary = one tuple/row
# Keys of dictionary = attributes/columns`,
    keyPoints: [
      'Relation = Table, Attribute = Column, Tuple = Row',
      'Degree = number of columns, Cardinality = number of rows',
      'Primary Key — uniquely identifies each row — cannot be NULL',
      'Candidate Key — all keys that CAN be primary key',
      'Alternate Key — candidate keys NOT chosen as primary key',
      'Foreign Key — links two tables together — refers to primary key of other table',
    ],
    tips: [
      'Degree = columns (think "degree of columns"), Cardinality = rows (count of rows)',
      'Primary Key never repeats and never NULL',
      'Foreign Key can repeat and can be NULL',
      'Rollno is always the best example of primary key in school context',
    ],
    commonMistakes: [
      'Confusing Degree (columns) with Cardinality (rows)',
      'Saying Primary Key can have NULL values — it cannot',
      'Confusing Candidate Key with Primary Key',
      'Forgetting that a table can have only ONE primary key',
    ],
    tags: ['database', 'DBMS', 'primary key', 'foreign key', 'relation', 'tuple'],
  },

  {
    title: 'SQL — Complete Reference for Class XII',
    subject: 'Database', class: 'XII', unit: 'Unit 3: Database Management',
    topic: 'SQL Commands', difficulty: 'Intermediate', order: 21, isPublished: true,
    content: `## What is SQL?
**Structured Query Language** — used to communicate with databases.

## Categories of SQL Commands

### DDL — Data Definition Language
Creates/modifies structure of tables.
Commands: CREATE, ALTER, DROP

### DML — Data Manipulation Language
Works with data inside tables.
Commands: INSERT, SELECT, UPDATE, DELETE

## Data Types in SQL

| Type | Use | Example |
|------|-----|---------|
| CHAR(n) | Fixed length text | CHAR(10) for state code |
| VARCHAR(n) | Variable length text | VARCHAR(50) for name |
| INT | Whole numbers | marks, rollno |
| FLOAT | Decimal numbers | percentage, salary |
| DATE | Date values | date of birth |

## Constraints
Rules applied to columns:
- **NOT NULL** — column cannot be empty
- **UNIQUE** — all values must be different
- **PRIMARY KEY** — NOT NULL + UNIQUE

## Important Clauses
- **WHERE** — filter rows
- **ORDER BY** — sort results (ASC default, DESC for reverse)
- **DISTINCT** — remove duplicate values
- **LIKE** — pattern matching (% = any chars, _ = one char)
- **IN** — match from a list of values
- **BETWEEN** — range of values
- **IS NULL / IS NOT NULL** — check for null values
- **GROUP BY** — group rows for aggregate functions
- **HAVING** — filter groups (like WHERE but for groups)

## Aggregate Functions
- **COUNT()** — count rows
- **SUM()** — total of values
- **AVG()** — average
- **MAX()** — highest value
- **MIN()** — lowest value

## Joins
- **Cartesian Product** — every row × every row (no condition)
- **Equi-Join** — join using = condition
- **Natural Join** — join on common column name (auto)`,
    syntax: `-- CREATE database and table
CREATE DATABASE school;
USE school;

CREATE TABLE students (
    rollno INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    class VARCHAR(5),
    marks INT,
    city VARCHAR(30)
);

-- INSERT data
INSERT INTO students VALUES (1, 'Rahul Sharma', 'XII', 85, 'Unchahar');
INSERT INTO students VALUES (2, 'Priya Singh', 'XII', 92, 'Raebareli');
INSERT INTO students VALUES (3, 'Amit Kumar', 'X', 78, 'Unchahar');
INSERT INTO students VALUES (4, 'Sneha Gupta', 'X', 88, 'Lucknow');
INSERT INTO students VALUES (5, 'Rohit Verma', 'XII', 65, 'Allahabad');

-- SELECT all rows
SELECT * FROM students;

-- WHERE clause
SELECT name, marks FROM students WHERE marks > 80;

-- ORDER BY
SELECT * FROM students ORDER BY marks DESC;
SELECT * FROM students ORDER BY name ASC;

-- DISTINCT
SELECT DISTINCT city FROM students;

-- LIKE (% = multiple chars, _ = single char)
SELECT * FROM students WHERE name LIKE 'R%';    -- starts with R
SELECT * FROM students WHERE name LIKE '%ma';   -- ends with ma
SELECT * FROM students WHERE name LIKE '_a%';   -- 2nd char is a

-- IN and BETWEEN
SELECT * FROM students WHERE city IN ('Unchahar', 'Lucknow');
SELECT * FROM students WHERE marks BETWEEN 70 AND 90;

-- IS NULL
SELECT * FROM students WHERE city IS NULL;

-- Aggregate functions
SELECT COUNT(*) FROM students;
SELECT AVG(marks) FROM students;
SELECT MAX(marks), MIN(marks) FROM students;
SELECT SUM(marks) FROM students WHERE class = 'XII';

-- GROUP BY with aggregate
SELECT class, COUNT(*) AS total, AVG(marks) AS average
FROM students
GROUP BY class;

-- HAVING (filter after grouping)
SELECT class, AVG(marks) AS avg_marks
FROM students
GROUP BY class
HAVING AVG(marks) > 80;

-- UPDATE
UPDATE students SET marks = 95 WHERE rollno = 2;

-- DELETE
DELETE FROM students WHERE rollno = 5;

-- ALTER TABLE
ALTER TABLE students ADD COLUMN phone VARCHAR(15);
ALTER TABLE students DROP COLUMN phone;
ALTER TABLE students MODIFY marks FLOAT;

-- DROP TABLE
DROP TABLE students;

-- JOINS
-- Assume: subjects(rollno, subject, score)
-- Cartesian Product:
SELECT * FROM students, subjects;

-- Equi-Join:
SELECT students.name, subjects.subject, subjects.score
FROM students, subjects
WHERE students.rollno = subjects.rollno;

-- Natural Join:
SELECT * FROM students NATURAL JOIN subjects;`,
    keyPoints: [
      'DDL: CREATE, ALTER, DROP — change structure',
      'DML: INSERT, SELECT, UPDATE, DELETE — change data',
      'WHERE filters rows, HAVING filters groups after GROUP BY',
      'ORDER BY ASC (default) or DESC',
      'LIKE: % matches any characters, _ matches exactly one character',
      'COUNT(*) counts all rows including NULL, COUNT(col) skips NULL',
      'Aggregate functions: COUNT, SUM, AVG, MAX, MIN',
      'Natural join auto-joins on common column names',
    ],
    tips: [
      'WHERE vs HAVING: WHERE is before GROUP BY, HAVING is after',
      'BETWEEN is inclusive — BETWEEN 70 AND 90 includes 70 and 90',
      'Always use WHERE with UPDATE and DELETE — otherwise ALL rows affected!',
      'SELECT DISTINCT removes duplicate rows from result',
    ],
    commonMistakes: [
      'Using HAVING without GROUP BY — not correct usage',
      'Forgetting WHERE in UPDATE/DELETE — updates/deletes ALL rows!',
      'Using = NULL instead of IS NULL — SQL uses IS NULL',
      'Confusing CHAR (fixed) with VARCHAR (variable) length',
    ],
    tags: ['SQL', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP BY', 'WHERE'],
  },

  {
    title: 'Python-MySQL Connectivity',
    subject: 'Database', class: 'XII', unit: 'Unit 3: Database Management',
    topic: 'Python SQL Connectivity', difficulty: 'Advanced', order: 22, isPublished: true,
    content: `## Connecting Python with MySQL
Python can connect to MySQL database and run SQL queries using the **mysql-connector-python** library.

## Steps for Database Connectivity
1. **Import** the module
2. **Create connection** using connect()
3. **Create cursor** using cursor()
4. **Execute query** using execute()
5. **Fetch results** using fetchone() / fetchall()
6. **Commit** changes using commit() (for INSERT/UPDATE/DELETE)
7. **Close** connection

## Important Functions

| Function | Use |
|----------|-----|
| connect() | Create connection to MySQL server |
| cursor() | Create cursor object to execute queries |
| execute(query) | Run a SQL query |
| fetchone() | Get ONE row from result |
| fetchall() | Get ALL rows from result |
| rowcount | Number of rows affected |
| commit() | Save changes permanently |
| close() | Close connection |

## %s Format Specifier
Use %s as placeholder in queries instead of putting values directly.
Safer — prevents SQL injection.`,
    syntax: `import mysql.connector

# Step 1: Create connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="school"
)

# Step 2: Create cursor
cursor = conn.cursor()

# Step 3: SELECT query
cursor.execute("SELECT * FROM students")
rows = cursor.fetchall()
for row in rows:
    print(row)

# fetchone() — get one row at a time
cursor.execute("SELECT * FROM students")
row = cursor.fetchone()
print(row)  # first row
row = cursor.fetchone()
print(row)  # second row

# Using %s format specifier (safe way)
rollno = int(input("Enter roll number: "))
cursor.execute("SELECT name, marks FROM students WHERE rollno = %s", (rollno,))
result = cursor.fetchone()
if result:
    print("Name:", result[0], "Marks:", result[1])
else:
    print("Not found")

# INSERT with %s
name = input("Name: ")
marks = int(input("Marks: "))
cursor.execute("INSERT INTO students (name, marks) VALUES (%s, %s)", (name, marks))
conn.commit()  # MUST commit after INSERT/UPDATE/DELETE
print("Rows inserted:", cursor.rowcount)

# UPDATE with %s
new_marks = int(input("New marks: "))
roll = int(input("Roll no: "))
cursor.execute("UPDATE students SET marks = %s WHERE rollno = %s", (new_marks, roll))
conn.commit()
print("Rows updated:", cursor.rowcount)

# DELETE with %s
roll = int(input("Roll to delete: "))
cursor.execute("DELETE FROM students WHERE rollno = %s", (roll,))
conn.commit()
print("Rows deleted:", cursor.rowcount)

# Step 7: Close
cursor.close()
conn.close()`,
    keyPoints: [
      'Import mysql.connector to connect Python with MySQL',
      'connect() needs: host, user, password, database',
      'cursor() creates object to execute SQL queries',
      'execute() runs the SQL query',
      'fetchone() returns one row, fetchall() returns all rows as list of tuples',
      'commit() is MANDATORY after INSERT, UPDATE, DELETE',
      'rowcount gives number of rows affected by last query',
      'Use %s placeholder for safe parameterized queries',
    ],
    tips: [
      'Always commit() after modifying data or changes are lost',
      'fetchall() returns list of tuples — each tuple is one row',
      'rowcount after SELECT gives -1 in some drivers — use len(fetchall()) instead',
      'Always close() cursor and connection when done',
    ],
    commonMistakes: [
      'Forgetting commit() after INSERT/UPDATE/DELETE',
      'Forgetting to pass values as tuple in execute() with %s',
      'Not importing mysql.connector',
      'Connecting to wrong database name',
    ],
    tags: ['python mysql', 'connectivity', 'cursor', 'execute', 'fetchall', 'commit'],
  },

  // ============================================================
  // CLASS X — AI SYLLABUS
  // ============================================================
  {
    title: 'AI Project Cycle — 5 Stages',
    subject: 'AI', class: 'X', unit: 'Unit 1: AI Foundations',
    topic: 'AI Project Cycle', difficulty: 'Basic', order: 30, isPublished: true,
    content: `## What is the AI Project Cycle?
The AI Project Cycle is a systematic process followed to build any AI project. It has **5 stages**.

## The 5 Stages

### Stage 1: Problem Scoping
- Define the problem clearly
- Identify who is affected
- Define goals and success criteria
- Ask: **What problem are we solving?**

### Stage 2: Data Acquisition
- Collect relevant data for the problem
- Data can be: images, text, numbers, audio
- More good quality data = better AI model
- Ask: **What data do we need?**

### Stage 3: Data Exploration
- Understand the data collected
- Look for patterns, outliers, missing values
- Visualise data using charts/graphs
- Ask: **What does the data tell us?**

### Stage 4: Modelling
- Choose appropriate ML algorithm
- Train the model on collected data
- The model learns patterns from data
- Ask: **Which model fits best?**

### Stage 5: Evaluation
- Test model with new unseen data
- Check accuracy and performance
- If not good enough → go back and improve
- Ask: **How good is our model?**

## The Three Domains of AI
1. **Computer Vision** — AI that sees and understands images
2. **Natural Language Processing (NLP)** — AI that understands text and speech
3. **Data Science** — AI that finds patterns in data`,
    syntax: `# The AI Project Cycle — easy to remember:
# P D E M E
# Problem Scoping
# Data Acquisition
# Data Exploration
# Modelling
# Evaluation

# Real Example — Detecting diseased plants:
# Stage 1 (Problem): Identify if a leaf is healthy or diseased
# Stage 2 (Data): Collect 1000s of leaf photos (healthy + diseased)
# Stage 3 (Explore): Check image quality, count per class, find patterns
# Stage 4 (Model): Train CNN (image classification model) on photos
# Stage 5 (Evaluate): Test on new photos, check accuracy %

# Three Domains:
# Computer Vision  → face recognition, self-driving cars, medical scans
# NLP             → Google Translate, Alexa, chatbots, spam filter
# Data Science    → stock prediction, recommendation systems, fraud detection`,
    keyPoints: [
      '5 stages: Problem Scoping → Data Acquisition → Data Exploration → Modelling → Evaluation',
      'Problem Scoping: Define the problem clearly before anything else',
      'Data Acquisition: Collect relevant, quality data',
      'Data Exploration: Understand, visualize, clean the data',
      'Modelling: Choose algorithm and train the model',
      'Evaluation: Test with new data and measure accuracy',
      'Three AI domains: Computer Vision, NLP, Data Science',
    ],
    tips: [
      'Remember: P-D-E-M-E (Problem, Data, Explore, Model, Evaluate)',
      'If evaluation is bad, go back to data or modelling stage',
      'More data = generally better model (but quality matters more)',
      'Problem scoping is most important — wrong problem = wasted effort',
    ],
    commonMistakes: [
      'Starting with modelling before proper data collection',
      'Skipping data exploration — leads to bad model',
      'Not going back to improve when evaluation is poor',
      'Confusing Data Acquisition (collecting) with Data Exploration (analyzing)',
    ],
    tags: ['AI project cycle', 'problem scoping', 'data acquisition', 'modelling', 'evaluation'],
  },

  {
    title: 'AI vs ML vs DL — Key Differences',
    subject: 'AI', class: 'X', unit: 'Unit 1: AI Foundations',
    topic: 'AI ML DL Differences', difficulty: 'Basic', order: 31, isPublished: true,
    content: `## The Big Picture

AI ⊃ ML ⊃ DL

AI is the broadest concept. ML is a subset of AI. DL is a subset of ML.

Think of it like:
- **AI** = the whole universe of making machines smart
- **ML** = one way to do AI (by learning from data)
- **DL** = one way to do ML (using neural networks)

## Artificial Intelligence (AI)
- Making computers perform tasks that normally require human intelligence
- Includes: problem solving, decision making, recognising speech, images
- Can be **rule-based** (no learning) or **learning-based**
- Examples: Chess engine, face unlock on phone, Google Maps routing

## Machine Learning (ML)
- AI that **learns from data** without being explicitly programmed
- Algorithm finds patterns in training data and improves over time
- No need to write rules manually — model learns them
- Examples: Spam filter, movie recommendations, price prediction

## Deep Learning (DL)
- ML using **Artificial Neural Networks** (inspired by human brain)
- Works best with large amounts of data
- Automatically extracts features from raw data (images, audio, text)
- Examples: Voice assistants (Alexa), self-driving cars, image recognition

## Key Terminology

| Term | Meaning |
|------|---------|
| **Training Data** | Data used to teach the model |
| **Testing Data** | New data to check model performance |
| **Label** | The correct answer/category in training data |
| **Feature** | Input variable used for prediction |
| **Model** | The learned pattern/algorithm |`,
    syntax: `# AI vs ML vs DL — easy analogy:

# AI = Teaching a child to identify animals
# ML = Child learns by seeing many examples of each animal
# DL = Child's brain builds layers of understanding:
#      Layer 1: spots edges/lines
#      Layer 2: recognizes shapes
#      Layer 3: identifies features (ears, tail)
#      Layer 4: classifies animal

# Rule-based AI (old way):
def is_spam(email):
    if "free money" in email or "click here" in email:
        return True
    return False

# Machine Learning way:
# Model trained on 10,000 spam/non-spam emails
# Learns patterns automatically
# No manual rules needed

# Deep Learning way:
# Neural network with many layers
# Processes raw text → extracts features → classifies
# Much more powerful than simple ML for complex tasks`,
    keyPoints: [
      'AI > ML > DL — DL is inside ML, ML is inside AI',
      'AI: making machines smart (rules OR learning)',
      'ML: AI that learns from data automatically',
      'DL: ML using neural networks with many layers',
      'Rule-based AI: manually coded rules (no learning)',
      'Learning-based AI: learns patterns from data (ML/DL)',
      'DL needs more data than ML but handles complex tasks better',
    ],
    tips: [
      'Draw the three nested circles in exam — AI > ML > DL',
      'Simple tasks: use ML. Complex tasks (images, speech): use DL',
      'DL is inspired by human brain neuron connections',
      'More layers in DL = can learn more complex patterns',
    ],
    commonMistakes: [
      'Saying ML and AI are same — ML is a subset of AI',
      'Saying DL is a separate concept — DL is a type of ML',
      'Confusing features (inputs) with labels (outputs/answers)',
    ],
    tags: ['AI', 'ML', 'DL', 'machine learning', 'deep learning', 'neural networks'],
  },

  {
    title: 'Types of Machine Learning — Supervised, Unsupervised, Reinforcement',
    subject: 'AI', class: 'X', unit: 'Unit 2: Machine Learning',
    topic: 'Types of ML Models', difficulty: 'Intermediate', order: 32, isPublished: true,
    content: `## Types of Machine Learning

### 1. Supervised Learning
- Model trained on **labeled data** (data with correct answers)
- Like a student studying with answer key
- Model learns to map input → output

**Subcategories:**
- **Classification** — Output is a category
  - Example: Email is spam/not spam, image is cat/dog
  - Tool to try: Teachable Machine
- **Regression** — Output is a number
  - Example: Predict house price, predict marks

### 2. Unsupervised Learning
- Model trained on **unlabeled data** (no correct answers given)
- Model finds hidden patterns on its own
- Like sorting objects by similarity

**Subcategories:**
- **Clustering** — Groups similar data together
  - Example: Group customers by buying habits
- **Association** — Finds relationships between items
  - Example: "People who buy X also buy Y" (Amazon suggestions)

### 3. Reinforcement Learning
- Model learns by **trial and error** with rewards/penalties
- Like training a pet — reward for correct action, penalty for wrong
- Agent takes actions in environment → gets reward → learns
- Example: AI playing chess, self-driving cars learning to drive

## Comparison Table

| Feature | Supervised | Unsupervised | Reinforcement |
|---------|-----------|--------------|---------------|
| Data | Labeled | Unlabeled | No fixed dataset |
| Output | Prediction | Groups/Patterns | Actions |
| Example | Spam filter | Customer grouping | Game playing AI |`,
    syntax: `# Supervised Learning — Classification example concept:
# Training data (labeled):
training_data = [
    {"marks": 85, "attendance": 90, "result": "Pass"},
    {"marks": 35, "attendance": 40, "result": "Fail"},
    {"marks": 72, "attendance": 80, "result": "Pass"},
]
# Model learns: high marks + attendance → Pass

# Supervised Learning — Regression example:
# Predict marks based on study hours
# Input (features): study_hours, sleep_hours
# Output (label): expected_marks

# Unsupervised — Clustering concept:
students = [
    {"marks": 90, "city": "Unchahar"},
    {"marks": 88, "city": "Unchahar"},  # similar → same cluster
    {"marks": 45, "city": "Lucknow"},
    {"marks": 42, "city": "Lucknow"},  # similar → same cluster
]
# Model groups students by similarity automatically

# Reinforcement Learning — Chess AI:
# Action: Move piece
# Environment: Chess board
# Reward: +1 for winning, -1 for losing
# Model learns which moves lead to winning`,
    keyPoints: [
      'Supervised: labeled data → learns to predict correct output',
      'Classification: output is a category (spam/not spam, pass/fail)',
      'Regression: output is a number (price, marks, temperature)',
      'Unsupervised: unlabeled data → finds hidden patterns',
      'Clustering: groups similar data points together',
      'Association: finds "bought together" type relationships',
      'Reinforcement: learns by trial-error with rewards',
    ],
    tips: [
      'Supervised = teacher gives answers, Unsupervised = no answers given',
      'Classification = categories, Regression = numbers',
      'Clustering = grouping similar things (K-Means is common algorithm)',
      'Reinforcement = game learning — reward for good moves',
    ],
    commonMistakes: [
      'Confusing Regression (numbers) with Classification (categories)',
      'Saying Unsupervised learning has labeled data — it does NOT',
      'Confusing Clustering (grouping) with Classification (predicting group)',
    ],
    tags: ['supervised learning', 'unsupervised', 'reinforcement', 'classification', 'regression', 'clustering'],
  },

  {
    title: 'Neural Networks — How AI Makes Decisions',
    subject: 'AI', class: 'X', unit: 'Unit 2: Neural Networks',
    topic: 'Artificial Neural Networks', difficulty: 'Intermediate', order: 33, isPublished: true,
    content: `## What is a Neural Network?
A **neural network** is a computing system inspired by the human brain. It consists of artificial neurons connected in layers.

## Human Brain vs ANN
| Human Brain | Artificial Neural Network |
|-------------|--------------------------|
| Neurons | Artificial neurons (nodes) |
| Synapses | Weights/connections |
| Learning experience | Training on data |
| Brain regions | Layers |

## Structure of a Neural Network

### Layer 1: Input Layer
- Receives raw data
- One neuron per input feature
- Example: For image → each pixel = one input neuron

### Layer 2: Hidden Layer(s)
- Processes and extracts patterns
- Can have multiple hidden layers
- More hidden layers = Deep Learning

### Layer 3: Output Layer
- Gives the final result/prediction
- One neuron per output class
- Example: Cat/Dog classifier → 2 output neurons

## How a Neuron Works
1. Receives inputs (numbers)
2. Multiplies each input by its **weight** (importance)
3. Adds a **bias** value
4. Passes through **activation function**
5. Outputs a number

## How AI Makes a Decision
1. Input data enters input layer
2. Data flows through hidden layers
3. Each layer extracts higher-level features
4. Output layer gives final decision/prediction
5. **Backpropagation** — error fed back to adjust weights
6. Repeat thousands of times — model improves

## Weights
- Numbers that represent strength of connection
- High weight = important connection
- During training, weights are adjusted to reduce error`,
    syntax: `# Neural Network — simple concept in Python
# (Real neural networks use libraries like TensorFlow)

# A single neuron calculation:
def neuron(inputs, weights, bias):
    # Weighted sum
    total = sum(i * w for i, w in zip(inputs, weights)) + bias
    # Activation function (ReLU — simple one)
    return max(0, total)  # ReLU: output 0 if negative

# Example: Is student likely to pass?
# Inputs: [marks, attendance, study_hours]
inputs = [75, 85, 6]
weights = [0.4, 0.3, 0.3]  # marks most important (0.4)
bias = -0.5

output = neuron(inputs, weights, bias)
print("Output:", output)  # > 0 means likely to pass

# Try TensorFlow Playground yourself:
# https://playground.tensorflow.org
# See how layers and neurons work visually!

# Deep Learning vs Shallow:
# Shallow: 1 hidden layer  → simple patterns
# Deep:    5+ hidden layers → complex patterns (faces, speech)`,
    keyPoints: [
      'Neural network inspired by human brain neurons',
      'Three layers: Input → Hidden → Output',
      'Each neuron: multiplies inputs × weights + bias → activation function',
      'Weights represent importance of each connection',
      'Training adjusts weights to reduce prediction error',
      'More hidden layers = Deep Learning = handles complex data',
      'Backpropagation: error flows backward to update weights',
    ],
    tips: [
      'Try TensorFlow Playground: playground.tensorflow.org — see it live!',
      'More neurons and layers = more powerful but needs more data',
      'Activation function decides if neuron "fires" or not',
      'Training = repeatedly adjusting weights until predictions are good',
    ],
    commonMistakes: [
      'Confusing layers with neurons — layers contain neurons',
      'Saying neural network = human brain — it is only INSPIRED by it',
      'Forgetting that weights are learned during training',
    ],
    tags: ['neural network', 'ANN', 'layers', 'weights', 'deep learning', 'backpropagation'],
  },

  {
    title: 'Model Evaluation — Accuracy, Precision, Recall, F1 Score',
    subject: 'AI', class: 'X', unit: 'Unit 3: Model Evaluation',
    topic: 'Evaluation Metrics', difficulty: 'Intermediate', order: 34, isPublished: true,
    content: `## Why Evaluate a Model?
Building a model is not enough — we must check how well it performs on **new, unseen data**.

## Confusion Matrix
For classification models — a table showing prediction results.

|  | Predicted: YES | Predicted: NO |
|--|----------------|---------------|
| **Actual: YES** | TP (True Positive) | FN (False Negative) |
| **Actual: NO** | FP (False Positive) | TN (True Negative) |

- **TP** — Predicted YES, Actually YES ✅
- **TN** — Predicted NO, Actually NO ✅
- **FP** — Predicted YES, Actually NO ❌ (False Alarm)
- **FN** — Predicted NO, Actually YES ❌ (Missed!)

## Evaluation Metrics

### Accuracy
Percentage of correct predictions out of all predictions.

**Accuracy = (TP + TN) / (TP + TN + FP + FN) × 100**

### Precision
Out of all predicted YES, how many were actually YES?
**Precision = TP / (TP + FP)**
Use when False Positives are costly (e.g., spam filter — important email marked spam)

### Recall (Sensitivity)
Out of all actual YES, how many did we correctly predict as YES?
**Recall = TP / (TP + FN)**
Use when False Negatives are costly (e.g., disease detection — missing a sick patient)

### F1 Score
Balance between Precision and Recall.
**F1 = 2 × (Precision × Recall) / (Precision + Recall)**
Use when you need balance of both.

## Bias in AI
- Model performs differently for different groups
- Example: Face recognition that works for one skin colour better
- Caused by biased training data
- Must be checked and corrected`,
    syntax: `# Confusion Matrix example
# Medical test: Detecting COVID
# 100 patients tested

# Results:
TP = 40  # Had COVID, correctly detected
TN = 50  # No COVID, correctly said No
FP = 5   # No COVID, wrongly said Has COVID
FN = 5   # Had COVID, wrongly said No COVID

total = TP + TN + FP + FN  # 100

# Accuracy
accuracy = (TP + TN) / total * 100
print(f"Accuracy: {accuracy}%")  # 90%

# Precision
precision = TP / (TP + FP)
print(f"Precision: {precision:.2f}")  # 0.89 = 89%

# Recall
recall = TP / (TP + FN)
print(f"Recall: {recall:.2f}")  # 0.89 = 89%

# F1 Score
f1 = 2 * (precision * recall) / (precision + recall)
print(f"F1 Score: {f1:.2f}")  # 0.89

# When to use which metric:
# Spam filter     → high Precision (don't want real email in spam)
# Cancer detection → high Recall (don't miss any cancer patient)
# General use     → Accuracy or F1 Score`,
    keyPoints: [
      'Confusion Matrix: TP, TN, FP, FN — 4 outcomes of classification',
      'Accuracy = (TP+TN)/Total — overall correct predictions',
      'Precision = TP/(TP+FP) — of predicted positives, how many correct',
      'Recall = TP/(TP+FN) — of actual positives, how many found',
      'F1 Score = harmonic mean of Precision and Recall',
      'High FP = False Alarm. High FN = Missed detection',
      'Bias = model treats different groups unfairly due to biased training data',
    ],
    tips: [
      'Disease detection → Recall is more important (never miss sick person)',
      'Spam filter → Precision is more important (never miss real email)',
      'When in doubt → use F1 Score (balances both)',
      'High accuracy can be misleading — check confusion matrix too',
    ],
    commonMistakes: [
      'Confusing FP (wrong positive) with FN (wrong negative)',
      'Using accuracy only — misleading when data is imbalanced',
      'Confusing Precision and Recall formulas',
    ],
    tags: ['evaluation', 'accuracy', 'precision', 'recall', 'F1 score', 'confusion matrix', 'bias'],
  },

  {
    title: 'Computer Vision — Concepts & Applications',
    subject: 'AI', class: 'X', unit: 'Unit 4: Computer Vision',
    topic: 'Computer Vision Basics', difficulty: 'Intermediate', order: 35, isPublished: true,
    content: `## What is Computer Vision?
**Computer Vision** is the field of AI that enables computers to **see, understand, and interpret** visual information — images and videos — just like humans do.

## Applications of Computer Vision
- Face recognition (phone unlock, attendance systems)
- Medical imaging (detecting tumours in X-rays, MRI)
- Self-driving cars (detecting roads, signs, pedestrians)
- Quality control in factories (finding defective products)
- Google Lens (identifying objects from photos)
- Security surveillance (CCTV analysis)

## Basics of Images

### Pixel
- Smallest unit of a digital image
- An image is made of thousands/millions of pixels
- Each pixel has a colour value

### Resolution
- Number of pixels in an image (Width × Height)
- Higher resolution = more pixels = clearer image
- Example: 1920×1080 = Full HD

### Pixel Value
- **Grayscale image**: Each pixel has ONE value (0 to 255)
  - 0 = Black, 255 = White, 128 = Gray
- **RGB image**: Each pixel has THREE values (R, G, B)
  - Each channel: 0 to 255
  - Red(255, 0, 0) = Pure Red
  - Green(0, 255, 0) = Pure Green
  - White = (255, 255, 255), Black = (0, 0, 0)

## Computer Vision Tasks
1. **Image Classification** — What is in this image?
2. **Object Detection** — Where is the object in the image?
3. **Image Segmentation** — Which pixels belong to which object?
4. **Feature Extraction** — What unique features does image have?

## Feature Extraction
- Finding unique characteristics in an image
- Edges, corners, colours, textures
- CNN does this automatically through training`,
    syntax: `# Image as a grid of numbers
# A tiny 3x3 grayscale image:
image = [
    [0,   128, 255],  # row 1: black, gray, white
    [64,  100, 200],  # row 2
    [150, 50,  10],   # row 3
]
# Each value 0-255 represents brightness

# RGB image pixel:
# red, green, blue values
pixel_red = (255, 0, 0)    # pure red
pixel_green = (0, 255, 0)  # pure green
pixel_white = (255, 255, 255)  # white
pixel_black = (0, 0, 0)    # black
pixel_yellow = (255, 255, 0)   # yellow = R+G

# Image dimensions:
width = 1920
height = 1080
channels = 3  # RGB
total_pixels = width * height  # 2,073,600 pixels!
data_size = total_pixels * channels  # each pixel has 3 values

print(f"Total pixels: {total_pixels:,}")
print(f"Total values: {data_size:,}")

# Try these tools to see pixels:
# Piskel: piskelapp.com — create pixel art
# RGB Calculator: w3schools.com/colors/colors_rgb.asp`,
    keyPoints: [
      'Computer Vision = AI that understands images and video',
      'Pixel = smallest unit of image',
      'Resolution = total pixels (width × height)',
      'Grayscale: each pixel = one value (0-255)',
      'RGB: each pixel = three values (R, G, B) each 0-255',
      'Black = (0,0,0), White = (255,255,255)',
      'Computer Vision tasks: Classification, Detection, Segmentation',
    ],
    tips: [
      'RGB(255,0,0) = Red, RGB(0,255,0) = Green, RGB(0,0,255) = Blue',
      'Higher resolution = more pixels = more data = slower to process',
      'Grayscale images are simpler (1 channel) vs RGB (3 channels)',
      'Try Emoji Scavenger Hunt to see Computer Vision in action',
    ],
    commonMistakes: [
      'Confusing resolution (pixel count) with image quality',
      'Thinking RGB values go 0-100 — they go 0-255',
      'Saying all images are RGB — grayscale images have only 1 channel',
    ],
    tags: ['computer vision', 'pixels', 'RGB', 'grayscale', 'resolution', 'image processing'],
  },

  {
    title: 'Convolutional Neural Networks (CNN)',
    subject: 'AI', class: 'X', unit: 'Unit 4: Computer Vision',
    topic: 'CNN Architecture', difficulty: 'Advanced', order: 36, isPublished: true,
    content: `## What is a CNN?
A **Convolutional Neural Network** is a special type of neural network designed for processing **image data**. It automatically learns to extract features from images.

## Why CNN for Images?
- Regular neural networks treat each pixel separately → too many connections
- CNN uses **local connections** — each neuron looks at a small region
- Much more efficient for images
- Automatically learns features: edges → shapes → objects

## Architecture of CNN

### 1. Convolutional Layer
- Applies **filters (kernels)** to input image
- Each filter detects one feature (edge, curve, color)
- Output is called a **Feature Map**
- Formula: Output = Input × Filter (element-wise multiplication + sum)

### 2. Pooling Layer (Subsampling)
- **Reduces size** of feature maps
- Keeps important information, removes detail
- **Max Pooling** — takes maximum value from each region (most common)
- Makes model faster and reduces overfitting

### 3. Fully Connected Layer
- Takes flattened feature maps as input
- Regular neural network layer
- Makes final classification decision

### 4. Output Layer
- Final predictions
- Number of neurons = number of classes

## Convolution Operation
A **kernel/filter** is a small matrix (e.g., 3×3).
It slides over the image and performs element-wise multiplication at each position.
The result is summed to give one number in the feature map.

## Kernel (Filter)
- Small matrix that detects specific features
- Edge detection kernel, blur kernel, sharpen kernel
- CNN learns the best kernel values during training`,
    syntax: `# Convolution operation — manual example
# Image (5x5) and Filter (3x3)

image_patch = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Edge detection filter (kernel)
kernel = [
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
]

# Convolution: multiply element-wise, then sum
result = 0
for i in range(3):
    for j in range(3):
        result += image_patch[i][j] * kernel[i][j]

print("Convolution result:", result)

# CNN Layer structure (conceptual):
# Input Image (e.g., 64x64x3 RGB)
#     ↓
# Conv Layer 1: 32 filters of 3x3 → detects edges
#     ↓
# Max Pooling: reduces to 32x32
#     ↓
# Conv Layer 2: 64 filters → detects shapes
#     ↓
# Max Pooling: reduces to 16x16
#     ↓
# Flatten: convert to 1D vector
#     ↓
# Fully Connected Layer
#     ↓
# Output: [Cat, Dog, Bird] probabilities

# Try this interactive tool:
# http://setosa.io/ev/image-kernels/  (see kernels live)
# https://teachablemachine.withgoogle.com/ (build image classifier)`,
    keyPoints: [
      'CNN designed specifically for image data',
      'Convolutional Layer: applies filters to detect features',
      'Filter/Kernel: small matrix that slides over image',
      'Feature Map: output of applying filter to image',
      'Pooling Layer: reduces size while keeping important features',
      'Max Pooling: takes maximum value from each region',
      'Fully Connected Layer: makes final classification',
      'CNN automatically learns what features to extract',
    ],
    tips: [
      'Think of CNN as: edges → shapes → parts → whole object',
      'More conv layers = can detect more complex features',
      'Pooling reduces size → faster computation → less overfitting',
      'Try setosa.io/ev/image-kernels/ to see kernel effects live',
    ],
    commonMistakes: [
      'Confusing Kernel/Filter with layer — kernel is inside conv layer',
      'Thinking CNN is only for classification — also used for detection, segmentation',
      'Forgetting that pooling reduces dimensions',
      'Confusing Feature Map (output) with Kernel (filter)',
    ],
    tags: ['CNN', 'convolutional', 'kernel', 'filter', 'pooling', 'feature map', 'deep learning'],
  },

  {
    title: 'Ethical Frameworks of AI — Bias, Transparency, Fairness',
    subject: 'AI', class: 'X', unit: 'Unit 1: AI Ethics',
    topic: 'AI Ethics', difficulty: 'Basic', order: 37, isPublished: true,
    content: `## What is AI Ethics?
AI Ethics is a set of **moral principles and guidelines** that ensure AI systems are built and used responsibly, fairly, and safely.

## Why Ethics in AI?
- AI makes decisions that affect people's lives
- Wrong decisions can cause harm
- Must be fair to everyone regardless of gender, religion, caste, race

## Key Ethical Concerns

### 1. Bias
- AI model **treats different groups unfairly**
- Caused by biased training data
- Example: Hiring AI trained on past data may discriminate against women
- Example: Facial recognition works better for some skin colors
- Solution: Use diverse, balanced training data

### 2. Transparency
- People should understand **how AI makes decisions**
- "Black box" AI is a problem — can't explain decisions
- Important when AI affects jobs, loans, health
- Solution: Explainable AI (XAI)

### 3. Privacy
- AI collects and uses personal data
- Must protect user privacy
- Example: Social media AI tracks your behavior

### 4. Accuracy
- AI must be accurate enough before deployment
- Medical AI must be very accurate — lives at stake
- Solution: Thorough testing and evaluation

### 5. Accountability
- Who is responsible when AI makes a mistake?
- Developer? Company? User?
- Need clear laws and regulations

## Bioethics — AI in Healthcare
- Special ethical framework for healthcare AI
- Principles: Do Good, Avoid Harm, Patient Autonomy, Fairness
- Example: AI diagnosing cancer — must be very accurate
- Patient data privacy is critical

## Ethical Frameworks
Guidelines for making ethical decisions:
1. **Consequentialism** — Focus on outcomes/results
2. **Deontology** — Follow rules and duties
3. **Virtue Ethics** — Act with good character
4. **Bioethics** — Specifically for medical/biological contexts`,
    syntax: `# Ethical Concerns — Practical Examples

# BIAS Example:
# Face recognition trained mostly on light-skinned faces
# Works well for some, poorly for others → BIASED

# How to check for bias:
def check_accuracy_by_group(predictions, actual, groups):
    for group in set(groups):
        indices = [i for i, g in enumerate(groups) if g == group]
        group_acc = sum(1 for i in indices if predictions[i] == actual[i])
        print(f"Group {group}: {group_acc/len(indices)*100:.1f}% accuracy")

# TRANSPARENCY Example:
# Bad (Black box):
# "AI says: Loan REJECTED" — no reason given

# Good (Transparent/Explainable):
# "AI says: Loan REJECTED because:
#   - Monthly income too low (40%)
#   - No credit history (35%)
#   - High existing debt (25%)"

# PRIVACY Example:
# AI should NOT store sensitive personal data unnecessarily
# Use anonymized data for training when possible

# Key ethical principle to remember:
# AI should benefit ALL people fairly, not just some`,
    keyPoints: [
      'Bias: AI treating different groups unfairly — caused by biased training data',
      'Transparency: people should understand how AI makes decisions',
      'Privacy: AI must protect personal data',
      'Accuracy: AI must be tested thoroughly before real use',
      'Accountability: clear responsibility when AI makes mistakes',
      'Bioethics: special ethical framework for medical AI',
      'Diverse training data reduces bias in AI models',
    ],
    tips: [
      'Bias comes from data — garbage in, garbage out',
      'CBSE loves questions on AI bias examples — prepare a few real examples',
      'Transparency is about explainability — can we explain AI decisions?',
      'Bioethics principles: Beneficence, Non-maleficence, Autonomy, Justice',
    ],
    commonMistakes: [
      'Confusing bias (unfair treatment) with accuracy (wrong predictions)',
      'Thinking transparency means showing the code — it means explaining decisions',
      'Forgetting that bias can exist even in high accuracy models',
    ],
    tags: ['AI ethics', 'bias', 'transparency', 'privacy', 'bioethics', 'fairness'],
  },
]

export async function GET(request) {
  try {
    await connectDB()

    const results = {
      admin: { status: '', email: '' },
      notes: { added: 0, skipped: 0 },
    }

    // ---- Create Admin if not exists ----
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      results.admin = { status: 'already_exists', email: existingAdmin.email }
    } else {
      const hashed = await bcrypt.hash('Admin@Vidyalaya123', 12)
      const admin = await User.create({
        name: 'Shivam Tiwari',
        email: 'shivam@vidyalaya.edu',
        password: hashed,
        role: 'admin',
        class: 'XII',
        rollNumber: 'ADMIN001',
        isActive: true,
        createdAt: new Date(),
      })
      results.admin = { status: 'created', email: admin.email }
    }

    // ---- Seed all notes ----
    for (const note of ALL_NOTES) {
      const exists = await Note.findOne({ title: note.title })
      if (exists) {
        results.notes.skipped++
      } else {
        await Note.create(note)
        results.notes.added++
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ Setup complete!',
      admin: results.admin,
      notes: results.notes,
      total_notes: ALL_NOTES.length,
      login: {
        url: '/login',
        email: results.admin.email || 'shivam@vidyalaya.edu',
        password: results.admin.status === 'created' ? 'Admin@Vidyalaya123' : '(your existing password)',
      },
      next_steps: [
        '1. Go to /login and sign in',
        '2. Change your password immediately',
        '3. Add students from Admin → Students',
        '4. Notes are now visible under Notes & Topics',
        '5. Delete this setup file from GitHub after use',
      ],
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Check that MONGODB_URI is correctly set in Vercel environment variables',
    }, { status: 500 })
  }
}
