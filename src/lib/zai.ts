import ZAI from "z-ai-web-dev-sdk";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

type ZAIInstance = Awaited<ReturnType<typeof ZAI.create>>;

let cached: ZAIInstance | null = null;
let initPromise: Promise<ZAIInstance> | null = null;

/**
 * Returns a configured ZAI client.
 *
 * On Vercel / production, set these env vars in Project Settings:
 *   - ZAI_API_KEY
 *   - ZAI_BASE_URL  (e.g. https://api.z.ai/api/paas/v4)
 *
 * Locally, the SDK also reads from `.z-ai-config` or `/etc/.z-ai-config`.
 * If env vars are present they take priority and we write a temporary
 * config file the SDK can read.
 */
export async function getZai(): Promise<ZAIInstance> {
  if (cached) return cached;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const apiKey = process.env.ZAI_API_KEY;
    const baseUrl = process.env.ZAI_BASE_URL;

    if (apiKey && baseUrl) {
      // Write a temp config the SDK can find. Prefer cwd if writable, else tmp.
      const configJson = JSON.stringify({ apiKey, baseUrl });
      const candidates = [
        path.join(process.cwd(), ".z-ai-config"),
        path.join(os.tmpdir(), ".z-ai-config"),
      ];
      for (const p of candidates) {
        try {
          await fs.writeFile(p, configJson, { mode: 0o600 });
          break;
        } catch {
          // try next
        }
      }
    }

    cached = await ZAI.create();
    return cached;
  })();

  return initPromise;
}
