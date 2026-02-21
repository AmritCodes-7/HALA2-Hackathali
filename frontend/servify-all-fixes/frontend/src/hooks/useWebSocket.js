import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

export function useWebSocket(token, username) {
  const [messages, setMessages]       = useState([])
  const [privateMessages, setPrivate] = useState([])
  const [connected, setConnected]     = useState(false)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!token || !username) return

    const SockJS = window.SockJS

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)

        // Public broadcast channel
        client.subscribe('/public/all', (msg) => {
          try {
            const body = JSON.parse(msg.body)
            setMessages(prev => [...prev, body])
          } catch {}
        })

        // Private channel — Spring's convertAndSendToUser sends to /user/queue/specific
        // The actual destination with SockJS is just /user/queue/specific (Spring resolves the user)
        client.subscribe('/user/queue/specific', (msg) => {
          try {
            const body = JSON.parse(msg.body)
            setPrivate(prev => [...prev, body])
          } catch {}
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('STOMP error', frame)
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [token, username])

  const sendPublic = (content) => {
    if (!clientRef.current?.connected) return
    clientRef.current.publish({
      destination: '/app/chat',
      body: JSON.stringify({ sender: username, receiver: null, content })
    })
  }

  const sendPrivate = (receiver, content) => {
    if (!clientRef.current?.connected) return

    const message = { sender: username, receiver, content }

    clientRef.current.publish({
      destination: '/app/private',
      body: JSON.stringify(message)
    })

    // Add sent message locally — backend only delivers to receiver, not sender
    setPrivate(prev => [...prev, message])
  }

  return { messages, privateMessages, connected, sendPublic, sendPrivate }
}
