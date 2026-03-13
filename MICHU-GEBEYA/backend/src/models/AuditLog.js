import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "SUSPEND_USER", "UPDATE_ORDER"
    target: { type: String }, // e.g., "User: 12345"
    details: { type: Object }, // Flexible JSON for specific change details
    ip: { type: String },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", auditLogSchema);
