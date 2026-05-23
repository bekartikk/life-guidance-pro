import { buildExternalAuthContext } from "../auth/authContext.js";
import { getAdaptiveRepository } from "../repositories/index.js";

export async function persistAdaptivePlanArtifacts({
  userEmail,
  userId,
  profile,
  aiContext,
  aiMeta,
  planId,
  prompt,
  responseText,
  structuredPayload,
  cacheHit = false,
  latencyMs = null,
}) {
  const repo = getAdaptiveRepository();
  const authContext = buildExternalAuthContext({ userEmail, userId, profile });

  await Promise.allSettled([
    repo.persistMemorySnapshot({
      authContext,
      aiMeta,
      memory: aiMeta?.memoryProfile || aiContext?.memory?.profile || null,
    }),
    repo.persistBehaviorSnapshot({
      authContext,
      aiContext,
      aiMeta,
    }),
    repo.persistRecommendations({
      authContext,
      aiMeta,
    }),
    repo.persistConversation({
      authContext,
      kind: "guidance",
      planId,
      prompt,
      responseText,
      structuredPayload,
      aiMeta,
    }),
    repo.persistUsageEvent({
      authContext,
      endpoint: "/api/guidance",
      status: "success",
      aiMeta,
      cacheHit,
      latencyMs,
      payload: {
        roadmapFocus: profile.roadmapFocus,
        personality: aiMeta?.personality?.id || null,
      },
    }),
  ]);
}

export async function persistAdaptiveFollowupArtifacts({
  userEmail,
  userId,
  profile,
  aiContext,
  aiMeta,
  planId,
  prompt,
  responseText,
  structuredPayload,
  cacheHit = false,
  latencyMs = null,
}) {
  const repo = getAdaptiveRepository();
  const authContext = buildExternalAuthContext({ userEmail, userId, profile });

  await Promise.allSettled([
    repo.persistBehaviorSnapshot({
      authContext,
      aiContext,
      aiMeta,
    }),
    repo.persistRecommendations({
      authContext,
      aiMeta,
    }),
    repo.persistConversation({
      authContext,
      kind: "followup",
      planId,
      prompt,
      responseText,
      structuredPayload,
      aiMeta,
    }),
    repo.persistUsageEvent({
      authContext,
      endpoint: "/api/followup",
      status: "success",
      aiMeta,
      cacheHit,
      latencyMs,
      payload: {
        promptLength: String(prompt || "").length,
      },
    }),
  ]);
}
