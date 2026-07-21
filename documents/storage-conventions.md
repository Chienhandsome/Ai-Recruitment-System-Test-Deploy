# Storage Conventions - Resume File Management

This document defines the storage conventions, file path formatting, security constraints, and upload/deletion policies for Supabase Storage in the AI Recruitment System.

---

## 1. Bucket Specifications

* **Bucket Name**: `resumes`
* **Privacy**: **Private** (`public: false`)
* **Maximum Allowed File Size**: `5 MB` (Configurable via `MAX_RESUME_FILE_SIZE_MB`)
* **Allowed MIME Types**:
  * PDF Document: `application/pdf`
  * Microsoft Word Document: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
* **Allowed File Extensions**: `.pdf`, `.docx`

---

## 2. Object Path Naming Conventions

All resume files are organized hierarchically within the private `resumes` bucket.

### Business Operation Paths (Phase 3+)
```text
jobs/{jobId}/applications/{applicationId}/{resumeId}-{safeFileName}
```
* Example: `jobs/7c9e6679-7425-40de-944b-e07fc1f90ae7/applications/a1b2c3d4/550e8400-e29b-41d4-a716-cv_nguyen_van_an.pdf`

### Test & Infrastructure Paths (Development & Testing)
```text
test/infrastructure/{uuid}-{safeFileName}
```
* Example: `test/infrastructure/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d-test_resume.pdf`

---

## 3. Security & Sanitization Rules

1. **Path Traversal Prevention**:
   * Object paths containing relative traversal patterns (`..`) are strictly rejected with an HTTP 400 `BadRequestException`.
2. **Filename Sanitization**:
   * All non-alphanumeric characters (except `.`, `_`, and `-`) in original filenames are automatically sanitized to `_`.
3. **No Overwrites by Default**:
   * File uploads use unique `UUIDv4` prefixes to prevent accidental overwrites.
4. **Signed Download URLs**:
   * Files are never exposed via permanent public URLs.
   * Downloads are authenticated via signed URLs generated with a configurable expiration time (Default: 300 seconds).

---

## 4. Deletion Policy

* File removal must target exact object paths (`removeResume(objectPath)`).
* Bulk bucket deletion or wildcard object deletion is forbidden in backend service methods.
