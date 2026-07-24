export declare const PUBLIC_ROUTE_KEY = "auth:is-public";
export declare const REQUIRED_ROLES_KEY = "auth:required-roles";
export declare const AUTH_ROLES: readonly ["ADMIN", "RECRUITER", "CANDIDATE"];
export declare const PUBLIC_SIGNUP_ROLES: readonly ["RECRUITER", "CANDIDATE"];
export type AuthRole = (typeof AUTH_ROLES)[number];
export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];
export declare const ROLE_DETAILS: Record<AuthRole, {
    name: string;
    description: string;
}>;
