import React, { useState, useEffect } from 'react';
import { paymentService, walletService } from '../services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('payment');
  const [cardPaymentData, setCardPaymentData] = useState({
    amount: '',
    currency: 'USD',
    cardToken: '',
    description: ''
  });
  const [cryptoPaymentData, setCryptoPaymentData] = useState({
    amount: '',
    cryptoType: 'bitcoin',
    recipientAddress: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await walletService.getWallet();
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await paymentService.cardPayment(cardPaymentData);
      setMessage(`Payment successful! Transaction ID: ${response.data.transaction.id}`);
      setCardPaymentData({
        amount: '',
        currency: 'USD',
        cardToken: '',
        description: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Card payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await paymentService.cryptoPayment(cryptoPaymentData);
      setMessage(`Crypto payment initiated! Transaction ID: ${response.data.transaction.id}`);
      setCryptoPaymentData({
        amount: '',
        cryptoType: 'bitcoin',
        recipientAddress: '',
        description: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Crypto payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Crypto Payer Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Wallet Info */}
        {wallet && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Wallet Information</h2>
            <p className="text-gray-600">
              <strong>Address:</strong> {wallet.address || 'Not configured'}
            </p>
            <p className="text-gray-600">
              <strong>Balance:</strong> {wallet.balance} BTC
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'payment'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💳 Card Payment
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'crypto'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🪙 Crypto Payment
            </button>
          </div>

          <div className="p-6">
            {message && (
              <div className={`mb-4 p-4 rounded ${
                message.includes('successful') || message.includes('initiated')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {activeTab === 'payment' && (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cardPaymentData.amount}
                      onChange={(e) => setCardPaymentData({...cardPaymentData, amount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Currency</label>
                    <select
                      value={cardPaymentData.currency}
                      onChange={(e) => setCardPaymentData({...cardPaymentData, currency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Card Token</label>
                  <input
                    type="text"
                    placeholder="Enter Stripe token"
                    value={cardPaymentData.cardToken}
                    onChange={(e) => setCardPaymentData({...cardPaymentData, cardToken: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={cardPaymentData.description}
                    onChange={(e) => setCardPaymentData({...cardPaymentData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Pay with Card'}
                </button>
              </form>
            )}

            {activeTab === 'crypto' && (
              <form onSubmit={handleCryptoPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.00000001"
                      value={cryptoPaymentData.amount}
                      onChange={(e) => setCryptoPaymentData({...cryptoPaymentData, amount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Crypto Type</label>
                    <select
                      value={cryptoPaymentData.cryptoType}
                      onChange={(e) => setCryptoPaymentData({...cryptoPaymentData, cryptoType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="bitcoin">Bitcoin</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="usdc">USDC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={cryptoPaymentData.recipientAddress}
                    onChange={(e) => setCryptoPaymentData({...cryptoPaymentData, recipientAddress: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={cryptoPaymentData.description}
                    onChange={(e) => setCryptoPaymentData({...cryptoPaymentData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Send Crypto'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
