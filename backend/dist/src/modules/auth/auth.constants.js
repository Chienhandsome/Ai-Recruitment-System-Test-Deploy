"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_DETAILS = exports.PUBLIC_SIGNUP_ROLES = exports.AUTH_ROLES = exports.REQUIRED_ROLES_KEY = exports.PUBLIC_ROUTE_KEY = void 0;
exports.PUBLIC_ROUTE_KEY = 'auth:is-public';
exports.REQUIRED_ROLES_KEY = 'auth:required-roles';
exports.AUTH_ROLES = ['ADMIN', 'RECRUITER', 'CANDIDATE'];
exports.PUBLIC_SIGNUP_ROLES = ['RECRUITER', 'CANDIDATE'];
exports.ROLE_DETAILS = {
    ADMIN: {
        name: 'Administrator',
        description: 'System Administrator',
    },
    RECRUITER: {
        name: 'Recruiter',
        description: 'Recruitment Staff',
    },
    CANDIDATE: {
        name: 'Candidate',
        description: 'Job Applicant',
    },
};
//# sourceMappingURL=auth.constants.js.map