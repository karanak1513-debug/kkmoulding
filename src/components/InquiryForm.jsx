import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { addInquiry } from '../firebase/db';

export default function InquiryForm({ prefillProduct = "", onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: prefillProduct ? `Interested in bulk ordering: ${prefillProduct}. Please share prices and details.` : '',
    productName: prefillProduct || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Name and Phone Number are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addInquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        productName: ''
      });
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      setError('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl shadow-lg border border-brand-wood/10">
        <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce mb-4" />
        <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-2">Inquiry Submitted!</h3>
        <p className="text-sm text-brand-dark/70 max-w-sm mb-6">
          Thank you for contacting K K Moulding. We have received your request and will call you back shortly.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setSuccess(false)}
            className="rounded-full bg-brand-wood px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark transition-colors duration-300"
          >
            Submit Another
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-full border border-brand-wood/30 px-6 py-2.5 text-sm font-semibold text-brand-wood hover:bg-brand-beige/20 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-brand-wood/10">
      <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-2">
        {prefillProduct ? `Get Quote for ${prefillProduct}` : 'Get a Bulk Quote'}
      </h3>
      <p className="text-sm text-brand-dark/60 mb-6">
        Fill out the form below, and our team will get in touch with you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-dark/75 mb-1">
            Your Name *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-wood/50">
              <User size={16} />
            </span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g. Karan Kapoor"
              className="w-full rounded-lg border border-brand-wood/20 bg-brand-light/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-wood focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-dark/75 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-wood/50">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="E.g. +91 9718503557"
                className="w-full rounded-lg border border-brand-wood/20 bg-brand-light/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-wood focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-dark/75 mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-wood/50">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E.g. customer@gmail.com"
                className="w-full rounded-lg border border-brand-wood/20 bg-brand-light/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-wood focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-dark/75 mb-1">
            Requirement Details *
          </label>
          <div className="relative">
            <span className="absolute top-3 left-0 flex items-start pl-3 text-brand-wood/50">
              <MessageSquare size={16} />
            </span>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Explain your bulk requirement (e.g. 500 feet crown moulding, dimensions, design preferences, wood type)..."
              className="w-full rounded-lg border border-brand-wood/20 bg-brand-light/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-wood focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-brand-wood/30 px-5 py-2.5 text-sm font-semibold text-brand-wood hover:bg-brand-beige/20 transition-all duration-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-wood px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
