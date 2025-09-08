export const IncidentStatus = Object.freeze({
    REPORTED:      Object.freeze({ key: "REPORTED", value: 0, displayName: "Reported" }),
    IN_PROGRESS:   Object.freeze({ key: "IN_PROGRESS", value: 1, displayName: "In Progress" }),
    COMPLETED:     Object.freeze({ key: "COMPLETED", value: 2, displayName: "Completed" }),
    RETURNED:      Object.freeze({ key: "RETURNED", value: 3, displayName: "Returned" }),
    IN_REVIEW:     Object.freeze({ key: "IN_REVIEW", value: 4, displayName: "Under Observation" }),
    RESOLVED:      Object.freeze({ key: "RESOLVED", value: 5, displayName: "Resolved" })
});
