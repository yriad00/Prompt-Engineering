'use client';

import { useState } from 'react';

// Simple bank account type
interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings';
  transactions: Transaction[];
}

// Transaction type
interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
}

export default function BankingDashboard() {
  // Mock data for demonstration
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'Main Checking',
      balance: 2543.21,
      type: 'checking',
      transactions: [
        {
          id: 't1',
          date: new Date(2023, 9, 15),
          amount: 1250.00,
          description: 'Salary deposit',
          type: 'deposit'
        },
        {
          id: 't2',
          date: new Date(2023, 9, 16),
          amount: -45.99,
          description: 'Grocery store',
          type: 'withdrawal'
        }
      ]
    },
    {
      id: '2',
      name: 'Savings Account',
      balance: 12350.65,
      type: 'savings',
      transactions: [
        {
          id: 't3',
          date: new Date(2023, 9, 10),
          amount: 500.00,
          description: 'Monthly transfer',
          type: 'transfer'
        }
      ]
    }
  ]);

  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0].id);

  // Get the currently selected account
  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Banking Dashboard</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">My Accounts</h2>
            <nav>
              <ul>
                {accounts.map(account => (
                  <li key={account.id} className="mb-2">
                    <button
                      onClick={() => setSelectedAccount(account.id)}
                      className={`w-full text-left p-2 rounded-md transition ${
                        selectedAccount === account.id 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-600">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </div>
                      <div className="font-semibold mt-1">
                        ${account.balance.toFixed(2)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition"
              >
                + Add Account
              </button>
            </nav>
          </div>

          {/* Main account area */}
          <div className="md:col-span-3 space-y-4">
            {/* Account summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{currentAccount.name}</h2>
                  <p className="text-gray-600">
                    {currentAccount.type.charAt(0).toUpperCase() + currentAccount.type.slice(1)} Account
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Current Balance</div>
                  <div className="text-3xl font-bold text-blue-800">
                    ${currentAccount.balance.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition">
                  Transfer Money
                </button>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 p-3 rounded-md transition">
                  Pay Bills
                </button>
              </div>
            </div>

            {/* Recent transactions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAccount.transactions.map(transaction => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          {transaction.date.toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          {transaction.description}
                        </td>
                        <td className={`py-3 text-right ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.amount < 0 ? '-' : ''}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Transactions →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 