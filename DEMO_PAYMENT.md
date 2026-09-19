# EMORA — Click / Payme demo checkout

This demo build uses a simulated web checkout for **Click** and **Payme**.

- No real money is charged.
- No real card details are sent to Click or Payme.
- The selected provider is stored on the project payment as `CLICK_DEMO` or `PAYME_DEMO`.
- After successful demo payment the project unlocks exactly like a confirmed production payment.
- Signature keeps its two-stage flow: activation payment, then final payment.

## Run

```bash
cp .env.example .env
npm start
```

Open `http://localhost:8787`.

For production, replace `/payments/demo` with provider-specific invoice creation + server callback/webhook verification before marking a transaction `PAID`.
