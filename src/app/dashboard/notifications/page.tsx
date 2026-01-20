'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, Filter, FileText, CreditCard, AlertCircle, Info, Clock } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'

interface Notification {
  id: string
  type: 'filing' | 'payment' | 'alert' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'filing',
      title: 'ITR Filing Update',
      message: 'Your ITR filing for FY 2023-24 has been submitted successfully.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,499 received for GST filing service.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'alert',
      title: 'Document Required',
      message: 'Please upload Form 16 to complete your ITR filing.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: '4',
      type: 'info',
      title: 'Tax Deadline Reminder',
      message: 'ITR filing deadline is 31st July 2024. File now to avoid penalties.',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'filing':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'info':
        return <Info className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-[#1E3A8A] text-white rounded-full text-sm font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-600">Stay updated with your account activity</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-[#1E3A8A]' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-[#1E3A8A] hover:text-[#3B82F6] text-sm font-medium"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Notification Settings</h3>
                <p className="text-sm text-gray-600">
                  You can manage your notification preferences in the{' '}
                  <a href="/dashboard/settings" className="text-[#1E3A8A] hover:underline font-medium">
                    Settings
                  </a>{' '}
                  page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
