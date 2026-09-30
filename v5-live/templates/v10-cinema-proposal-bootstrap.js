/* EMORA Cinema Proposal bootstrap.
   Shared V10 builds the base DOM. Hidden cover-contract nodes MUST exist before
   the flagship module exposes its ready flag; otherwise a fast Creator Studio
   config message can race the compatibility import and crash shared patch(). */
await import('/templates/v10-main.js?v=14');
await import('/templates/v10-cinema-compat.js?v=1');
await import('/templates/v10-cinema-proposal.js?v=1');
