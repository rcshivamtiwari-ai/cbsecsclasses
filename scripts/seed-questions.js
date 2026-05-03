// scripts/seed-questions.js
// Seeds sample MCQ questions for Class XII tests
// Usage: MONGODB_URI=your_uri node scripts/seed-questions.js

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('Set MONGODB_URI env'); process.exit(1) }

const QuestionSchema = new mongoose.Schema({
  class: String, subject: String, topic: String,
  type: String, question: String, options: [String],
  correctAnswer: String, hint: String, explanation: String,
  marks: Number, difficulty: String, isActive: Boolean,
})

const QUESTIONS = [
  // Python Functions
  { class:'XII', subject:'Python', topic:'Functions', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which keyword is used to define a function in Python?',
    options:['fun','function','def','define'], correctAnswer:'def',
    hint:'It is a 3-letter keyword', explanation:'Python uses "def" to define functions' },

  { class:'XII', subject:'Python', topic:'Functions', type:'MCQ', difficulty:'Easy', marks:1,
    question:'What does a function return if no return statement is given?',
    options:['0','""','None','Error'], correctAnswer:'None',
    hint:'Python returns a special value when nothing is returned',
    explanation:'All Python functions return None by default if no return statement exists' },

  { class:'XII', subject:'Python', topic:'Functions', type:'TrueFalse', difficulty:'Easy', marks:1,
    question:'A function can return multiple values in Python.',
    options:['True','False'], correctAnswer:'True',
    hint:'Think about tuples', explanation:'Python can return multiple values as a tuple: return a, b' },

  { class:'XII', subject:'Python', topic:'Functions', type:'MCQ', difficulty:'Medium', marks:2,
    question:'What is the output of: def f(x=5): return x*2 — then calling f()?',
    options:['5','10','Error','None'], correctAnswer:'10',
    hint:'What is the default value of x?', explanation:'Default parameter x=5, so f() uses x=5, returns 5*2=10' },

  // Exception Handling
  { class:'XII', subject:'Python', topic:'Exception Handling', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which block ALWAYS executes in try-except-finally?',
    options:['try','except','finally','All of above'], correctAnswer:'finally',
    hint:'One block is guaranteed to run', explanation:'finally always runs regardless of exception' },

  { class:'XII', subject:'Python', topic:'Exception Handling', type:'MCQ', difficulty:'Easy', marks:1,
    question:'What exception is raised when dividing by zero?',
    options:['ValueError','TypeError','ZeroDivisionError','MathError'], correctAnswer:'ZeroDivisionError',
    hint:'The name describes the error type', explanation:'Python raises ZeroDivisionError for division by zero' },

  { class:'XII', subject:'Python', topic:'Exception Handling', type:'TrueFalse', difficulty:'Medium', marks:1,
    question:'The finally block runs only if an exception occurs.',
    options:['True','False'], correctAnswer:'False',
    hint:'Think about what "finally" means', explanation:'finally always runs — with or without exception' },

  // File Handling
  { class:'XII', subject:'Python', topic:'File Handling', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which mode is used to open a file for reading in Python?',
    options:['"w"','"r"','"a"','"rb"'], correctAnswer:'"r"',
    hint:'r stands for read', explanation:'Mode "r" opens file for reading. File must exist.' },

  { class:'XII', subject:'Python', topic:'File Handling', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which file mode will DELETE existing content and create a new file?',
    options:['"r"','"a"','"w"','"r+"'], correctAnswer:'"w"',
    hint:'This mode can be dangerous with existing files',
    explanation:'"w" (write) mode erases all existing content and creates a new file' },

  { class:'XII', subject:'Python', topic:'File Handling', type:'MCQ', difficulty:'Medium', marks:2,
    question:'Which method reads ALL lines of a file and returns them as a LIST?',
    options:['read()','readline()','readlines()','readall()'], correctAnswer:'readlines()',
    hint:'The plural form of readline', explanation:'readlines() returns a list where each element is one line' },

  // Stack
  { class:'XII', subject:'Python', topic:'Stack', type:'MCQ', difficulty:'Easy', marks:1,
    question:'What does LIFO stand for?',
    options:['Last In First Out','Last In First Order','Linear In First Out','List In File Out'], correctAnswer:'Last In First Out',
    hint:'Stack works like plates — last placed is first taken', explanation:'LIFO = Last In First Out is the principle of Stack' },

  { class:'XII', subject:'Python', topic:'Stack', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which Python list method is used for PUSH operation in Stack?',
    options:['insert()','add()','append()','push()'], correctAnswer:'append()',
    hint:'It adds element to the end of the list', explanation:'append() adds to end of list which represents the top of stack' },

  { class:'XII', subject:'Python', topic:'Stack', type:'MCQ', difficulty:'Medium', marks:2,
    question:'If stack has [10, 20, 30] (30 on top), what is result after pop()?',
    options:['10','20','30','[10,20]'], correctAnswer:'30',
    hint:'LIFO — last element is removed first', explanation:'pop() removes and returns the top element (30)' },

  // SQL/Database — Class XII
  { class:'XII', subject:'Database', topic:'SQL Basics', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which SQL command is used to retrieve data from a table?',
    options:['GET','FETCH','SELECT','RETRIEVE'], correctAnswer:'SELECT',
    hint:'It starts with S', explanation:'SELECT is the SQL command to retrieve data from tables' },

  { class:'XII', subject:'Database', topic:'SQL Basics', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which clause is used to filter rows in SQL?',
    options:['FILTER','HAVING','WHERE','LIMIT'], correctAnswer:'WHERE',
    hint:'It comes after FROM in a SELECT statement', explanation:'WHERE clause filters rows based on condition' },

  { class:'XII', subject:'Database', topic:'SQL Basics', type:'MCQ', difficulty:'Medium', marks:2,
    question:'Which aggregate function counts the total number of rows?',
    options:['SUM()','AVG()','COUNT()','TOTAL()'], correctAnswer:'COUNT()',
    hint:'The name tells you what it does', explanation:'COUNT() returns the number of rows matching the condition' },

  { class:'XII', subject:'Database', topic:'Keys', type:'MCQ', difficulty:'Easy', marks:1,
    question:'A PRIMARY KEY uniquely identifies each row in a table. True or False?',
    options:['True','False'], correctAnswer:'True',
    hint:'Primary key is the main identifier', explanation:'PRIMARY KEY ensures each row is uniquely identifiable' },

  // Networks
  { class:'XII', subject:'Networks', topic:'Network Devices', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which device connects two different networks?',
    options:['Hub','Switch','Router','Repeater'], correctAnswer:'Router',
    hint:'It routes packets between networks', explanation:'Router connects different networks and routes data packets' },

  { class:'XII', subject:'Networks', topic:'Protocols', type:'MCQ', difficulty:'Easy', marks:1,
    question:'What does HTTP stand for?',
    options:['HyperText Transfer Protocol','High Transfer Text Protocol','HyperText Transport Program','Home Text Transfer Protocol'],
    correctAnswer:'HyperText Transfer Protocol',
    hint:'HyperText = web pages, Transfer = sending', explanation:'HTTP - HyperText Transfer Protocol is used for web communication' },

  // Class X AI
  { class:'X', subject:'AI', topic:'Machine Learning', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which type of ML uses labeled training data?',
    options:['Unsupervised Learning','Reinforcement Learning','Supervised Learning','Deep Learning'],
    correctAnswer:'Supervised Learning',
    hint:'Labeled = we supervise/guide the learning',
    explanation:'Supervised Learning uses labeled examples to train models' },

  { class:'X', subject:'AI', topic:'Neural Networks', type:'MCQ', difficulty:'Easy', marks:1,
    question:'Which layer of a CNN extracts features from an image?',
    options:['Fully Connected Layer','Pooling Layer','Convolutional Layer','Output Layer'],
    correctAnswer:'Convolutional Layer',
    hint:'The name of CNN describes this layer', explanation:'Convolutional Layer applies filters to extract features' },
]

async function seedQuestions() {
  console.log('❓ Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema)

  let added = 0
  for (const q of QUESTIONS) {
    const exists = await Question.findOne({ question: q.question })
    if (exists) { continue }
    await Question.create({ ...q, isActive: true })
    added++
  }

  console.log(`✅ Added ${added} questions!`)
  console.log('Go to Admin → Tests → Create Test to use these questions.')
  await mongoose.disconnect()
  process.exit(0)
}

seedQuestions().catch(e => { console.error('❌ Failed:', e); process.exit(1) })
