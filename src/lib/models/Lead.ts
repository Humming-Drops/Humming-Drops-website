import mongoose from 'mongoose';

// Define the JSON structure for a registration
const LeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  planId: { type: String, required: true }, // e.g., 'standard' or 'premium'
  status: { type: String, default: 'pending_confirmation' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model recompilation errors during Next.js hot-reloads
export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);