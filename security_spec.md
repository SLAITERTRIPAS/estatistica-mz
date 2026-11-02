# Security Specification

## Data Invariants
- A submission must belong to a valid institution.
- Only an authenticated user with appropriate permissions can perform submissions.
- Users cannot modify roles on their profiles.
- Submissions cannot be modified after being approved unless by a central admin.

## The "Dirty Dozen" Payloads
1. Attempt to create a user with an elevated role (e.g., 'central') when not authorized.
2. Attempt to create an institution with an invalid ID format.
3. Attempt to update a submission status to 'approved' without being a central/national admin.
4. Attempt to create a submission for a non-existent institution.
5. Attempt to set an invalid email address (e.g., empty string).
6. Attempt to delete a submission by a non-owner/non-admin.
7. Attempt to inject ghost fields during update (e.g., `isAdmin: true`).
8. Attempt to update `createdAt` timestamp of a submission.
9. Attempt to create an institution with empty province.
10. Attempt to spoof the ownerId in a submission creation.
11. Attempt to update a submission status to an invalid value (e.g., 'pending_approval' if only 'pending_central' is valid).
12. Attempt to read PII data (email) of another user.

## The Test Runner
(Placeholder for firestore.rules.test.ts)
