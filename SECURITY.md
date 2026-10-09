# Security policy

This is an educational project and is not ready for operating a commercial ride service.

Do not include credentials, personal trip details, or exploit instructions in public issues. Use GitHub private vulnerability reporting if the repository owner has enabled it; otherwise contact the owner privately through an established channel. A repository security policy does not automatically enable private reporting.

Only the current default branch is maintained. Keep authentication checks, account ownership checks, and driver-controlled state transitions intact. Never trust Sites identity headers outside the authenticated hosting boundary.

Known hardening gaps include commercial driver verification, transactional active-ride constraints, shared request rate limiting, and complete hosted browser testing. These are tracked as roadmap work rather than production guarantees.
