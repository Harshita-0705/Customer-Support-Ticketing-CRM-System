import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ticketApi } from "../services/api";
import Spinner from "../components/Spinner";

const PRIORITIES = ["Normal", "High", "Urgent"];
const CATEGORIES = ["General", "Billing", "Technical", "Account", "Bug Report"];
const EMAIL_RX   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL = {
  customer_name: "", customer_email: "",
  subject: "", description: "",
  priority: "Normal", category: "General",
};

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  function validate(data) {
    const e = {};
    if (!data.customer_name.trim())  e.customer_name  = "Customer name is required";
    if (!data.customer_email.trim()) e.customer_email = "Email is required";
    else if (!EMAIL_RX.test(data.customer_email)) e.customer_email = "Enter a valid email address";
    if (!data.subject.trim())        e.subject        = "Issue title is required";
    if (!data.description.trim())    e.description    = "Description is required";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const ticket = await ticketApi.create(form);
      toast.success(`Ticket ${ticket.ticket_id} created!`);
      navigate(`/tickets/${ticket.ticket_id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 animate-slideUp max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-100">Create New Ticket</h1>
        <p className="text-sm text-[#7a8299] mt-0.5">Fill in the customer and issue details below</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card p-6 space-y-5">
          {/* Customer info */}
          <div>
            <h2 className="text-xs font-semibold text-[#4a5268] uppercase tracking-wide mb-4">
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Customer Name" required error={errors.customer_name}>
                <input
                  type="text" name="customer_name" value={form.customer_name}
                  onChange={handleChange} placeholder="Jane Doe"
                  className={`input ${errors.customer_name ? "border-red-500/60 focus:border-red-500" : ""}`}
                  autoComplete="name"
                />
              </Field>
              <Field label="Customer Email" required error={errors.customer_email}>
                <input
                  type="email" name="customer_email" value={form.customer_email}
                  onChange={handleChange} placeholder="jane@example.com"
                  className={`input ${errors.customer_email ? "border-red-500/60 focus:border-red-500" : ""}`}
                  autoComplete="email"
                />
              </Field>
            </div>
          </div>

          <hr className="border-[#2a3045]" />

          {/* Issue details */}
          <div>
            <h2 className="text-xs font-semibold text-[#4a5268] uppercase tracking-wide mb-4">
              Issue Details
            </h2>
            <div className="space-y-4">
              <Field label="Issue Title" required error={errors.subject}>
                <input
                  type="text" name="subject" value={form.subject}
                  onChange={handleChange} placeholder="Brief description of the issue"
                  className={`input ${errors.subject ? "border-red-500/60 focus:border-red-500" : ""}`}
                />
              </Field>
              <Field label="Description" required error={errors.description}>
                <textarea
                  name="description" value={form.description}
                  onChange={handleChange}
                  placeholder="Provide detailed information about the issue, steps to reproduce, etc."
                  rows={4}
                  className={`input resize-none ${errors.description ? "border-red-500/60 focus:border-red-500" : ""}`}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Priority">
                  <select name="priority" value={form.priority} onChange={handleChange} className="input">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Category">
                  <select name="category" value={form.category} onChange={handleChange} className="input">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner size="sm" /> : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            {loading ? "Creating…" : "Create Ticket"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#7a8299] uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
