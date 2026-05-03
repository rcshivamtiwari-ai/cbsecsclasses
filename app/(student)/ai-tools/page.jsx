'use client'
import { Brain, ExternalLink, Camera, BarChart2, Layers, Cpu, Play } from 'lucide-react'

const AI_TOOLS = [
  {
    name: 'Teachable Machine',
    category: 'Machine Learning',
    emoji: '🤖',
    description: 'Build your own AI model — no code needed! Train it to recognise images, sounds, or poses.',
    url: 'https://teachablemachine.withgoogle.com/',
    color: 'from-orange-400 to-orange-600',
    topics: ['Supervised Learning', 'Classification', 'Model Training'],
    cbse: 'Class X — AI Unit 2',
  },
  {
    name: 'TensorFlow Playground',
    category: 'Neural Networks',
    emoji: '🧠',
    description: 'Visualise how a neural network learns. Change layers, neurons, and see training live.',
    url: 'https://playground.tensorflow.org/',
    color: 'from-blue-400 to-blue-600',
    topics: ['Neural Networks', 'ANN', 'Deep Learning'],
    cbse: 'Class X — Artificial Neural Networks',
  },
  {
    name: 'Orange Data Mining',
    category: 'Data Science',
    emoji: '🍊',
    description: 'Drag and drop data science tool. Load datasets, build models, and see results visually.',
    url: 'https://orangedatamining.com/',
    color: 'from-green-400 to-green-600',
    topics: ['Data Science', 'No-Code AI', 'Model Evaluation'],
    cbse: 'Class X — No Code AI Tool',
  },
  {
    name: 'Emoji Scavenger Hunt',
    category: 'Computer Vision',
    emoji: '🔍',
    description: 'Find real objects that look like emojis using your camera. See CV in action!',
    url: 'https://emojiscavengerhunt.withgoogle.com/',
    color: 'from-yellow-400 to-yellow-600',
    topics: ['Computer Vision', 'Object Detection', 'CNN'],
    cbse: 'Class X — Computer Vision',
  },
  {
    name: 'Image Kernels (Convolution)',
    category: 'Computer Vision',
    emoji: '🖼️',
    description: 'See how convolution filters work on images. Understand CNN step-by-step visually.',
    url: 'http://setosa.io/ev/image-kernels/',
    color: 'from-purple-400 to-purple-600',
    topics: ['CNN', 'Convolution Operator', 'Feature Extraction'],
    cbse: 'Class X — Image Features & CNN',
  },
  {
    name: 'Piskel — Pixel Art',
    category: 'Computer Vision',
    emoji: '🎨',
    description: 'Create pixel art. Understand how images are made of pixels and how resolution works.',
    url: 'https://www.piskelapp.com/',
    color: 'from-pink-400 to-pink-600',
    topics: ['Pixels', 'Resolution', 'Image Representation'],
    cbse: 'Class X — Basics of Images',
  },
  {
    name: 'RGB Calculator',
    category: 'Computer Vision',
    emoji: '🌈',
    description: 'Experiment with RGB values. Understand how colors are formed from Red, Green, Blue.',
    url: 'https://www.w3schools.com/colors/colors_rgb.asp',
    color: 'from-red-400 to-red-600',
    topics: ['RGB Images', 'Grayscale', 'Pixel Values'],
    cbse: 'Class X — RGB and Grayscale Images',
  },
  {
    name: 'Google Drum Machine',
    category: 'Machine Learning',
    emoji: '🥁',
    description: 'AI-powered drum machine that learns from your input. Demonstrates unsupervised learning.',
    url: 'https://experiments.withgoogle.com/ai/drum-machine/view/',
    color: 'from-teal-400 to-teal-600',
    topics: ['Unsupervised Learning', 'Pattern Recognition'],
    cbse: 'Class X — Unsupervised Learning',
  },
  {
    name: 'My Goodness — Ethical AI',
    category: 'AI Ethics',
    emoji: '⚖️',
    description: 'Explore ethical decision making. Understand AI ethics through interactive scenarios.',
    url: 'https://www.my-goodness.net/',
    color: 'from-slate-400 to-slate-600',
    topics: ['AI Ethics', 'Ethical Frameworks', 'Bias'],
    cbse: 'Class X — Ethical Frameworks of AI',
  },
]

const CATEGORIES = ['All', 'Machine Learning', 'Neural Networks', 'Computer Vision', 'Data Science', 'AI Ethics']

export default function AIToolsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Brain className="w-6 h-6 text-orange-500" /> Free AI Tools
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          CBSE-aligned free tools for Class X AI curriculum • No account needed, works in browser
        </p>
      </div>

      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
        <p className="text-orange-800 text-sm">
          🎯 <strong>For Class X Students:</strong> These tools are directly from your CBSE syllabus.
          Use them to understand AI practically before your exams. All tools are <strong>100% free</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_TOOLS.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover group block"
          >
            <div className={`bg-gradient-to-r ${tool.color} p-4 flex items-center justify-between`}>
              <span className="text-3xl">{tool.emoji}</span>
              <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                {tool.category}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                  {tool.name}
                </h3>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 ml-2 transition-colors" />
              </div>
              <p className="text-slate-500 text-sm mb-3">{tool.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {tool.topics.map(t => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-xs text-orange-600 font-medium">📚 {tool.cbse}</p>
            </div>
          </a>
        ))}
      </div>

      {/* AI Learning roadmap for Class X */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" /> Class X AI Syllabus Roadmap
        </h2>
        <div className="space-y-3">
          {[
            { unit: 'Unit 1', topic: 'AI Project Cycle + Domains', tools: ['My Goodness'], done: false },
            { unit: 'Unit 2', topic: 'AI, ML, DL Concepts', tools: ['TensorFlow Playground', 'Teachable Machine'], done: false },
            { unit: 'Unit 3', topic: 'Neural Networks & Decisions', tools: ['TensorFlow Playground'], done: false },
            { unit: 'Unit 4', topic: 'Model Evaluation & Accuracy', tools: ['Orange Data Mining'], done: false },
            { unit: 'Unit 5', topic: 'No-Code AI & Statistics', tools: ['Orange Data Mining'], done: false },
            { unit: 'Unit 6', topic: 'Computer Vision & CNN', tools: ['Emoji Scavenger Hunt', 'Image Kernels', 'Piskel', 'RGB Calculator'], done: false },
          ].map(item => (
            <div key={item.unit} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-1 rounded-lg w-16 text-center flex-shrink-0">
                {item.unit}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.topic}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {item.tools.map(t => (
                    <span key={t} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
