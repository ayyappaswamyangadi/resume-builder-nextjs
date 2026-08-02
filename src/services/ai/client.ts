/**
 * Placeholder AI client. No API key is wired up — every function below
 * resolves locally after a short simulated delay so the UI, loading states,
 * and error handling can be built against a stable contract today.
 *
 * To go live: swap `simulate()`'s body for a `fetch()` to your provider,
 * keeping each exported function's signature unchanged so every call site
 * in the app (see src/services/ai/*.ts) keeps working untouched.
 */
export async function simulate<T>(factory: () => T, delayMs = 900): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return factory()
}
