export const IncidentStatus = Object.freeze({
    REPORTED:      Object.freeze({ key: "REPORTED", value: 0, displayName: "Reported" }),
    IN_PROGRESS:   Object.freeze({ key: "IN_PROGRESS", value: 1, displayName: "In Progress" }),
    COMPLETED:     Object.freeze({ key: "COMPLETED", value: 2, displayName: "Completed" }),
    RETURNED:      Object.freeze({ key: "RETURNED", value: 3, displayName: "Returned" }),
    RESOLVED:      Object.freeze({ key: "RESOLVED", value: 4, displayName: "Resolved" })
});

export const IncidentPriority = Object.freeze({
    CRITICAL:  Object.freeze({ key: "CRITICAL", value: 1, displayName: "Critical" }),
    HIGH:      Object.freeze({ key: "HIGH", value: 2, displayName: "High" }),
    MEDIUM:    Object.freeze({ key: "MEDIUM", value: 3, displayName: "Medium" }),
    LOW:       Object.freeze({ key: "LOW", value: 4, displayName: "Low" })
});
