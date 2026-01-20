'use client'

import { useState } from 'react'
import { CreditCard, Download, Search, Filter, CheckCircle, Clock, XCircle, Calendar, FileText, ExternalLink } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'

interface Payment {
  id: string
  orderId: string
  service: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  method: string
  date: string
  invoiceUrl?: string
}

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      service: 'ITR Filing - Salaried',
      amount: 999,
      status: 'completed',
      method: 'Credit Card',
      date: '2024-01-15',
      invoiceUrl: '/invoices/1',
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      service: 'GST Filing - Monthly',
      amount: 2499,
      status: 'completed',
      method: 'UPI',
      date: '2024-01-10',
      invoiceUrl: '/invoices/2',
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      service: 'CA Consultation',
      amount: 1499,
      status: 'pending',
      method: 'Pending',
      date: '2024-01-18',
    },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    }
    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredPayments = payments
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => 
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.service.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Billing</h1>
          <p className="text-gray-600">Track your payment history and download invoices</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {payments.filter(p => p.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {payments.filter(p => p.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stripe Integration Notice */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Payment System Ready</h3>
                <p className="text-sm text-gray-600">
                  Payment integration with Stripe is ready. Once you provide your Stripe keys, users will be able to make payments directly through this platform.
                </p>
                <div className="mt-3 flex gap-3">
                  <Button size="sm" disabled>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Add Payment Method (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'failed' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('failed')}
                >
                  Failed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No payments found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{payment.orderId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{payment.service}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{payment.method}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(payment.date).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.status === 'completed' && payment.invoiceUrl ? (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                          ) : payment.status === 'pending' ? (
                            <Button size="sm" disabled>
                              Pay Now (Soon)
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
