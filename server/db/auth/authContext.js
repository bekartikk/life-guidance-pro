function clip(value, max = 160) {
  return String(value || "").trim().slice(0, max);
}

export function buildExternalAuthContext({ userEmail = "", userId = "", profile = {} } = {}) {
  const profileContext = profile.profileContext || {};
  const externalUserId = clip(userId || userEmail || profileContext.fullName || "anonymous");
  const externalEmail = clip(userEmail);

  return {
    externalUserId,
    externalEmail,
    authProvider: "firebase",
    role: clip(profileContext.role || profile.role, 60),
  };
}
