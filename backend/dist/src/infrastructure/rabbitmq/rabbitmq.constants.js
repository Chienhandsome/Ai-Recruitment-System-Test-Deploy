"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBITMQ_QUEUES = exports.RABBITMQ_ROUTING_KEYS = exports.RABBITMQ_EXCHANGE = void 0;
exports.RABBITMQ_EXCHANGE = 'ai_recruitment_events';
exports.RABBITMQ_ROUTING_KEYS = {
    RESUME_ANALYSIS_REQUESTED: 'resume.analysis.requested',
    RESUME_ANALYSIS_COMPLETED: 'resume.analysis.completed',
    RESUME_ANALYSIS_FAILED: 'resume.analysis.failed',
};
exports.RABBITMQ_QUEUES = {
    RESUME_ANALYSIS_QUEUE: 'resume_analysis_queue',
};
//# sourceMappingURL=rabbitmq.constants.js.map