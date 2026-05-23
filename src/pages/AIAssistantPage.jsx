import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'
import aiService from '@/services/aiService'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/index'
import { cn } from '@/utils/index'

const SUGGESTIONS = [
  { icon: '💻', text: 'How to start learning DSA from scratch?' },
  { icon: '🗺️', text: 'Recommend a frontend roadmap for 2024' },
  { icon: '🎯', text: 'How to crack campus placements in 6 months?' },
  { icon: '📚', text: 'Best resources to learn System Design' },
  { icon: '🔥', text: 'Tips to improve coding consistency' },
  { icon: '⚡', text: 'Top patterns for LeetCode Medium problems' },
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 bg-gray-400 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}>
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold',
        isUser ? 'bg-gradient-to-br from-gray-600 to-gray-800' : 'bg-gradient-to-br from-primary-500 to-accent-500')}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={cn('max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isUser
          ? 'bg-primary-600 text-white rounded-br-sm'
          : 'bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm')}>
        <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        }} />
        <p className={cn('text-[10px] mt-1.5', isUser ? 'text-primary-200' : 'text-gray-400')}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

export default function AIAssistantPage() {
  const user = useAuthStore(s => s.user)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI learning assistant. I can help you with:\n\n• **DSA** problem-solving strategies\n• **Roadmap** planning and guidance\n• **Placement** preparation tips\n• **Study** plans and consistency\n\nWhat would you like to learn today?`,
      timestamp: new Date().toISOString(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    try {
      const { reply } = await aiService.sendMessage(msg)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, timestamp: new Date().toISOString() }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Sorry, I ran into an issue. Please try again!', timestamp: new Date().toISOString() }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }, [input, isTyping])

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const clearChat = () => setMessages(prev => [prev[0]])

  return (
    <div className="page-wrapper max-w-4xl flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">AI Learning Assistant</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />Online • Ready to help
            </p>
          </div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Clear chat
        </button>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-5 pb-3">
            <p className="text-xs text-gray-400 mb-2 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                  <span>{s.icon}</span>{s.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask me anything about DSA, roadmaps, placements..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none transition-all"
              style={{ maxHeight: 120 }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 self-end transition-colors shadow-glow-primary"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">AI responses are mock data. Replace aiService.js with your AI API for real responses.</p>
        </div>
      </Card>
    </div>
  )
}
