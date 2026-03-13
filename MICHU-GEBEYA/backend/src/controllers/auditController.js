import AuditLog from "../models/AuditLog.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Internal helper to create a log entry
export const logAction = async (adminId, action, target, details, ip) => {
    console.log(`[AuditLog] Attempting to log action: ${action} for admin: ${adminId}`);
    try {
        const log = await AuditLog.create({
            admin: adminId,
            action,
            target,
            details,
            ip,
        });
        console.log(`[AuditLog] Successfully created log: ${log._id}`);
    } catch (error) {
        console.error("[AuditLog] Failed to create audit log:", error);
    }
};

// Get all audit logs (Admin)
export const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find()
        .populate("admin", "fullName email")
        .sort({ timestamp: -1 })
        .limit(100); // Limit to last 100 logs for performance
    res.json(logs);
});
