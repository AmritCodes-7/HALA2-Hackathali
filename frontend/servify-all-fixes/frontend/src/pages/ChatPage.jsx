import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { getAllUsers } from '../api/users'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const { token, user }  = useAuth()
  const { messages, privateMessages, connected, sendPublic, sendPrivate } = useWebSocket(token, user?.username)

  const [tab, setTab]              = useState('public')
  const [input, setInput]          = useState('')
  const [privateTarget, setTarget] = useState('')
  const [users, setUsers]          = useState([])
  const bottomRef                  = useRef(null)

  useEffect(() => {
    getAllUsers()
      .then(r => {
        const all = r.data?.message || []
        setUsers(all.filter(u => u.username !== user?.username))
      })
      .catch(() => {})
  }, [user?.username])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, privateMessages])

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    if (tab === 'public') {
      sendPublic(msg)
    } else {
      if (!privateTarget) return
      sendPrivate(privateTarget, msg)
    }
    setInput('')
  }

  // Filter private messages: show conversation between me and the selected user
  const filteredPrivate = privateMessages.filter(m =>
    (m.sender === user?.username && m.receiver === privateTarget) ||
    (m.sender === privateTarget && m.receiver === user?.username) ||
    // Handle messages that came in from subscription (receiver may not be set on inbound)
    (m.sender === privateTarget && !m.receiver)
  )

  return (
    <div className={styles.page}>
      {/* Contacts sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <h2 className={styles.title}>Messages</h2>
          <div className={[styles.dot, connected ? styles.dotGreen : styles.dotRed].join(' ')} />
        </div>
        <p className={styles.connLabel}>{connected ? 'Connected' : 'Disconnected'}</p>

        <div
          className={[styles.channelItem, tab === 'public' ? styles.channelActive : ''].join(' ')}
          onClick={() => setTab('public')}
        >
          <span className={styles.channelIcon}>⊞</span>
          <div>
            <p className={styles.channelName}>Public Chat</p>
            <p className={styles.channelDesc}>Everyone</p>
          </div>
          {messages.length > 0 && <span className={styles.badge}>{messages.length}</span>}
        </div>

        <p className={styles.sectionLabel}>Direct Messages</p>
        {users.map(u => {
          // Count unread messages from this user
          const unread = privateMessages.filter(m => m.sender === u.username && m.receiver === user?.username).length
          return (
            <div
              key={u.username}
              className={[styles.channelItem, tab === 'private' && privateTarget === u.username ? styles.channelActive : ''].join(' ')}
              onClick={() => { setTab('private'); setTarget(u.username) }}
            >
              <div className={styles.dmAvatar}>{u.username?.charAt(0)?.toUpperCase()}</div>
              <div>
                <p className={styles.channelName}>{u.username}</p>
                <p className={styles.channelDesc}>{(u.role || '').replace('ROLE_', '')}</p>
              </div>
              {unread > 0 && <span className={styles.badge}>{unread}</span>}
            </div>
          )
        })}
      </div>

      {/* Chat area */}
      <div className={styles.chat}>
        <div className={styles.chatHeader}>
          <p className={styles.chatTitle}>
            {tab === 'public' ? '# Public Channel' : `@ ${privateTarget || '…'}`}
          </p>
          <p className={styles.chatSub}>
            {tab === 'public' ? 'Broadcast to all connected users' : 'Private conversation'}
          </p>
        </div>

        <div className={styles.messages}>
          {tab === 'public' && messages.length === 0 && (
            <div className={styles.empty}><p>No messages yet. Say hello! 👋</p></div>
          )}
          {tab === 'public' && messages.map((m, i) => (
            <MessageBubble key={i} msg={m} self={m.sender === user?.username} />
          ))}

          {tab === 'private' && !privateTarget && (
            <div className={styles.empty}><p>Select a user to start chatting</p></div>
          )}
          {tab === 'private' && privateTarget && filteredPrivate.length === 0 && (
            <div className={styles.empty}><p>No messages yet. Start the conversation!</p></div>
          )}
          {tab === 'private' && filteredPrivate.map((m, i) => (
            <MessageBubble key={i} msg={m} self={m.sender === user?.username} />
          ))}

          <div ref={bottomRef} />
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder={tab === 'public' ? 'Message everyone…' : `Message ${privateTarget || '…'}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={!connected || (tab === 'private' && !privateTarget)}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!connected || !input.trim() || (tab === 'private' && !privateTarget)}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg, self }) {
  return (
    <div className={[styles.bubble, self ? styles.bubbleSelf : styles.bubbleOther].join(' ')}>
      {!self && <div className={styles.bubbleAvatar}>{msg.sender?.charAt(0)?.toUpperCase()}</div>}
      <div className={styles.bubbleBody}>
        {!self && <p className={styles.bubbleSender}>{msg.sender}</p>}
        <div className={styles.bubbleContent}>{msg.content}</div>
      </div>
    </div>
  )
}
