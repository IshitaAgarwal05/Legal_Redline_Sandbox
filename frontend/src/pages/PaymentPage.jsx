import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppState } from '../state/StateContext';

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useAppState();
    const [loading, setLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState('input'); // 'input', 'processing', 'success'
    const [upiId, setUpiId] = useState('');
    const [phone, setPhone] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const pollInterval = useRef(null);

    const plan = location.state?.plan || { id: 'monthly_199', name: 'Monthly Pro', price: '199' };

    useEffect(() => {
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    const handleInitiatePayment = async (e) => {
        e.preventDefault();
        if (!upiId.includes('@')) {
            toast.error("Please enter a valid UPI ID");
            return;
        }

        if (phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setPaymentStep('processing');

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/payment/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan_id: plan.id,
                    upi_id: upiId,
                    phone: phone
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Payment initiation failed');

            if (data.status === 'mock_success') {
                dispatch({ type: 'SET_USER', payload: data.user });
                setPaymentStep('success');
                toast.success("Sandbox Mode: Plan upgraded.");
                setTimeout(() => navigate('/'), 3000);
            } else if (data.status === 'pending') {
                setOrderId(data.order_id);
                setPaymentUrl(data.pl_url);
                toast.info("UPI Request sent! Check your phone/SMS.");
                startPolling(data.order_id);
            }

        } catch (error) {
            toast.error(error.message);
            setPaymentStep('input');
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (id) => {
        pollInterval.current = setInterval(async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/payment/status/${id}?plan_id=${plan.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.status === 'paid') {
                    clearInterval(pollInterval.current);
                    dispatch({ type: 'SET_USER', payload: data.user });
                    setPaymentStep('success');
                    toast.success("Payment Verified! Your plan is updated.");
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Checkout</h2>
                    <p className="text-blue-100 mt-2 font-medium">{plan.name} - ₹{plan.price}</p>
                </div>

                <div className="p-8">
                    {paymentStep === 'input' && (
                        <form onSubmit={handleInitiatePayment} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number (for SMS notification)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            required
                                            className="block w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            placeholder="9876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">📞</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        UPI ID (GPay, PhonePe, Paytm)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            className="block w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            placeholder="yourname@bank"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">📱</div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-400 leading-relaxed text-center">
                                We will send a **Payment Link** to your phone via SMS.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? 'Initiating...' : 'Send Payment Request'}
                                <span className="text-xl">➔</span>
                            </button>
                        </form>
                    )}

                    {paymentStep === 'processing' && (
                        <div className="text-center py-12 space-y-8">
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl">📡</div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Waiting for Payment...</h3>
                                <p className="text-gray-400 text-sm px-4">
                                    Please open your **UPI App** or check your **SMS** for the payment link.
                                </p>
                                {paymentUrl && (
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-500 mb-3">Didn't get a notification?</p>
                                        <a
                                            href={paymentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block py-2 px-6 bg-gray-700 hover:bg-gray-600 text-blue-400 font-bold rounded-lg border border-blue-500/30 transition-all text-sm"
                                        >
                                            Open Payment Link ↗
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 space-y-2">
                                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Transaction ID</div>
                                <code className="text-blue-400 text-xs bg-gray-900 px-3 py-1 rounded-full uppercase">
                                    {orderId || 'PENDING_SERVER'}
                                </code>
                            </div>
                        </div>
                    )}

                    {paymentStep === 'success' && (
                        <div className="text-center py-12 space-y-6">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 text-4xl animate-bounce">
                                ✓
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Payment Received!</h3>
                                <p className="text-gray-400">Your account has been upgraded successfully.</p>
                            </div>
                            <p className="text-xs text-gray-500">Redirecting to home...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
