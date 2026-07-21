export declare const RABBITMQ_EXCHANGE = "ai_recruitment_events";
export declare const RABBITMQ_ROUTING_KEYS: {
    readonly RESUME_ANALYSIS_REQUESTED: "resume.analysis.requested";
    readonly RESUME_ANALYSIS_COMPLETED: "resume.analysis.completed";
    readonly RESUME_ANALYSIS_FAILED: "resume.analysis.failed";
};
export declare const RABBITMQ_QUEUES: {
    readonly RESUME_ANALYSIS_QUEUE: "resume_analysis_queue";
};
