import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FiSend,
  FiMessageCircle,
  FiX,
  FiMinimize2,
  FiMaximize2,
  FiUser,
  FiCpu,
  FiLoader,
} from 'react-icons/fi';

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';

/**
 * ChatBot — floating AI chat widget.
 *
 * Sends user messages to a FastAPI ML backend at:
 *   POST {FASTAPI_URL}/chat
 *   Body: { message: string, user_id?: string, role?: string }
 *   Response: { response: string }
 *
 * Can be used as a floating widget (default) or embedded in a page.
 */
export default function ChatBot({ embedded = false }) {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(embedded);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi there! 👋 I'm Servify AI. How can I help you today? Ask me anything about our services, bookings, or troubleshooting.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${FASTAPI_URL}/chat`, {
        message: trimmed,
        user_id: user?.id || user?.email || 'anonymous',
        role: role || 'guest',
      });

      const botText = res.data?.response || res.data?.message || res.data?.reply || 'Sorry, I didn\'t get a response.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: botText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Sorry, I\'m having trouble connecting right now. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: `⚠️ ${errorMsg}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    'What services do you offer?',
    'How do I book a pro?',
    'Track my booking',
    'I need help with pricing',
  ];

  // ── Floating Button (when closed) ──
  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
      >
        <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {/* Notification pulse */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  const chatWidth = embedded
    ? 'w-full h-full'
    : isExpanded
    ? 'w-[500px] h-[700px]'
    : 'w-[380px] h-[550px]';

  return (
    <div
      className={`${
        embedded
          ? 'relative w-full h-full'
          : 'fixed bottom-6 right-6 z-50'
      }`}
    >
      <div
        className={`${chatWidth} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
          embedded ? '' : 'animate-in'
        }`}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Servify AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!embedded && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                {isExpanded ? (
                  <FiMinimize2 className="w-4 h-4" />
                ) : (
                  <FiMaximize2 className="w-4 h-4" />
                )}
              </button>
            )}
            {!embedded && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[85%] ${
                  msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.type === 'user'
                      ? 'bg-blue-500'
                      : msg.isError
                      ? 'bg-red-100'
                      : 'bg-orange-100'
                  }`}
                >
                  {msg.type === 'user' ? (
                    <FiUser className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <FiCpu
                      className={`w-3.5 h-3.5 ${
                        msg.isError ? 'text-red-500' : 'text-orange-500'
                      }`}
                    />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiCpu className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Actions (show when few messages) ── */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-white flex gap-2 overflow-x-auto shrink-0">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => {
                  setInput(action);
                  setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} };
                    setInput(action);
                    // We'll let the user click send or press Enter
                  }, 0);
                }}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full whitespace-nowrap transition-colors border border-orange-100"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <form
          onSubmit={sendMessage}
          className="px-4 py-3 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all placeholder:text-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
          >
            {isTyping ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
