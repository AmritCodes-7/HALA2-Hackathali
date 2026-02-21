import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { sendChatPrompt } from '../api/users'
import styles from './ChatbotPage.module.css'

export default function ChatbotPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m the Servify AI assistant. Ask me anything about our services or how I can help you.' }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const res = await sendChatPrompt({ username: user?.username, message: msg })
      const reply = res.data?.message?.response || res.data?.message || 'No response'
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not connect to the AI service right now.' }])
    } finally {
      setLoading(false)
    }
  }

  const SUGGESTIONS = [
    'What services are available?',
    'How do I find a plumber near me?',
    'How does staff validation work?',
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.botAvatar}>✦</div>
        <div>
          <h1 className={styles.title}>AI Assistant</h1>
          <p className={styles.sub}>Powered by Servify Intelligence</p>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={[styles.msg, m.role === 'user' ? styles.msgUser : styles.msgBot].join(' ')}>
            {m.role === 'bot' && <div className={styles.msgAvatar}>✦</div>}
            <div className={styles.msgBubble}>{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className={[styles.msg, styles.msgBot].join(' ')}>
            <div className={styles.msgAvatar}>✦</div>
            <div className={styles.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className={styles.suggestion} onClick={() => { setInput(s); }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Ask anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? <span className={styles.spinner} /> : '➤'}
        </button>
      </div>
    </div>
  )
}
