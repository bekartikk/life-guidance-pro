export function buildSupabaseIdentityHint(user) {
  if (!user) return null;

  return {
    externalUserId: user.uid,
    externalEmail: user.email || "",
    provider: "firebase",
  };
}
