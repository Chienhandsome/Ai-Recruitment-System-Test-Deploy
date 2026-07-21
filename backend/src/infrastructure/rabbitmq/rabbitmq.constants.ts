export const RABBITMQ_EXCHANGE = 'ai_recruitment_events';

export const RABBITMQ_ROUTING_KEYS = {
  RESUME_ANALYSIS_REQUESTED: 'resume.analysis.requested',
  RESUME_ANALYSIS_COMPLETED: 'resume.analysis.completed',
  RESUME_ANALYSIS_FAILED: 'resume.analysis.failed',
} as const;

export const RABBITMQ_QUEUES = {
  RESUME_ANALYSIS_QUEUE: 'resume_analysis_queue',
} as const;
