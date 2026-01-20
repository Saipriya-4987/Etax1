'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, XCircle, MessageCircle, Send, Paperclip, ChevronLeft } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { useAuth } from '@/contexts'

interface Ticket {
  id: string
  subject: string
  category: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastReply: string
  messages: Message[]
}

interface Message {
  id: string
  sender: 'user' | 'support'
  message: string
  timestamp: string
}

export default function TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      subject: 'Issue with ITR filing submission',
      category: 'ITR Filing',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00',
      lastReply: '2024-01-15T14:20:00',
      messages: [
        { id: '1', sender: 'user', message: 'I am unable to submit my ITR filing. Getting an error.', timestamp: '2024-01-15T10:30:00' },
        { id: '2', sender: 'support', message: 'We are looking into this issue. Can you please share the error screenshot?', timestamp: '2024-01-15T14:20:00' },
      ],
    },
    {
      id: 'TKT-002',
      subject: 'Need help with GST calculation',
      category: 'GST Filing',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-10T09:15:00',
      lastReply: '2024-01-11T16:45:00',
      messages: [
        { id: '1', sender: 'user', message: 'How do I calculate CGST and SGST?', timestamp: '2024-01-10T09:15:00' },
        { id: '2', sender: 'support', message: 'CGST and SGST are each 50% of the total GST rate. For example, if GST is 18%, then CGST = 9% and SGST = 9%.', timestamp: '2024-01-11T16:45:00' },
      ],
    },
  ])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'General',
    priority: 'medium',
    message: '',
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      closed: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    const icons = {
      open: <Clock className="w-3 h-3" />,
      'in-progress': <MessageCircle className="w-3 h-3" />,
      resolved: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />,
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    }
    return colors[priority as keyof typeof colors]
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
    }

    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicket.id
          ? { ...t, messages: [...t.messages, message], lastReply: message.timestamp }
          : t
      )
    )

    setSelectedTicket(prev =>
      prev ? { ...prev, messages: [...prev.messages, message] } : null
    )

    setNewMessage('')
  }

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'open',
      priority: newTicket.priority as 'low' | 'medium' | 'high',
      createdAt: new Date().toISOString(),
      lastReply: new Date().toISOString(),
      messages: [
        {
          id: '1',
          sender: 'user',
          message: newTicket.message,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    setTickets(prev => [ticket, ...prev])
    setShowNewTicket(false)
    setNewTicket({ subject: '', category: 'General', priority: 'medium', message: '' })
    setSelectedTicket(ticket)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (showNewTicket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setShowNewTicket(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Tickets
          </button>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h2>

              <div className="space-y-6">
                <Input
                  label="Subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    >
                      <option value="General">General</option>
                      <option value="ITR Filing">ITR Filing</option>
                      <option value="GST Filing">GST Filing</option>
                      <option value="Payment">Payment</option>
                      <option value="Document">Document</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCreateTicket}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <button
            onClick={() => setSelectedTicket(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to All Tickets
          </button>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTicket.subject}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>Ticket ID: <strong>{selectedTicket.id}</strong></span>
                    <span>•</span>
                    <span>{selectedTicket.category}</span>
                    <span>•</span>
                    <span className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority.toUpperCase()} Priority
                    </span>
                  </div>
                </div>
                {getStatusBadge(selectedTicket.status)}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`p-4 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-[#1E3A8A] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {msg.sender === 'user' ? 'You' : 'Support'} • {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'closed' && (
                <div className="flex gap-2 pt-4 border-t">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
            <p className="text-gray-600">Get help from our support team</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Open</p>
              <p className="text-3xl font-bold text-blue-600">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">
                {tickets.filter(t => t.status === 'in-progress').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {ticket.id}
                      </span>
                      <span>•</span>
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>{ticket.messages.length} messages</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last reply: {formatTime(ticket.lastReply)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tickets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-500 mb-6">Create your first support ticket to get help</p>
              <Button onClick={() => setShowNewTicket(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
