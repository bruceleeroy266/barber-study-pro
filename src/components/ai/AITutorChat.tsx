'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AIMessage, AITutorContext, AIQuickAction } from '@/types/ai'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import QuickActions from './QuickActions'
import ChatHeader from './ChatHeader'

interface AITutorChatProps {
  initialContext?: AITutorContext
  currentChapter?: number
  onClose?: () => void
  className?: string
}

export default function AITutorChat({ 
  initialContext, 
  currentChapter,
  onClose,
  className = '' 
}: AITutorChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [context, setContext] = useState<AITutorContext | null>(initialContext || null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [quickActions, setQuickActions] = useState<AIQuickAction[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const hasGreetedRef = useRef(false)
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])
  
  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0 && context && !hasGreetedRef.current) {
      hasGreetedRef.current = true
      const greeting: AIMessage = {
        id: 'greeting',
        conversationId: 'new',
        role: 'assistant',
        content: `Hello ${context.studentName}! I'm your ASCYN PRO AI Tutor. I'm here to help you prepare for your state board exam.\n\nI can see you're currently at ${context.readiness.score}% readiness. ${context.weakAreas.length > 0 ? `I notice you might want to focus on ${context.weakAreas[0].name}.` : 'You\'re making great progress!'}\n\nWhat would you like to work on today?`,
        timestamp: new Date().toISOString(),
      }
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setMessages([greeting])
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [context, messages.length])
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    
    setError(null)
    
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      conversationId: conversationId || 'new',
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
          currentChapter,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const data = await response.json()
      
      // Add AI response
      const aiMessage: AIMessage = {
        id: data.messageId,
        conversationId: data.conversationId,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, aiMessage])
      setConversationId(data.conversationId)
      
      if (data.suggestedActions) {
        setQuickActions(data.suggestedActions)
      }
      
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.')
      console.error('AI Tutor error:', err)
    } finally {
      setIsTyping(false)
    }
  }, [conversationId, currentChapter])
  
  const handleQuickAction = useCallback((action: AIQuickAction) => {
    sendMessage(action.prompt)
  }, [sendMessage])
  
  return (
    <div className={`flex flex-col bg-black border border-graphite rounded-xl overflow-hidden ${className}`}>
      <ChatHeader context={context} onClose={onClose} />
      
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-charcoal/30 border border-silver/50 text-silver text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Actions */}
      {quickActions.length > 0 && !isTyping && (
        <div className="px-4 pb-2">
          <QuickActions 
            actions={quickActions} 
            onAction={handleQuickAction}
            disabled={isTyping}
          />
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-4 border-t border-graphite">
        <ChatInput 
          onSend={sendMessage} 
          disabled={isTyping}
          placeholder="Ask about barbering concepts, study strategies, or exam prep..."
        />
      </div>
    </div>
  )
}
