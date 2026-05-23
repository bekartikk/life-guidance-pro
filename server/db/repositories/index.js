import { isSupabaseMirrorReady } from "../config.js";
import { noopAdaptiveRepository } from "./noopAdaptiveRepository.js";
import { supabaseAdaptiveRepository } from "./supabaseAdaptiveRepository.js";

export function getAdaptiveRepository() {
  return isSupabaseMirrorReady() ? supabaseAdaptiveRepository : noopAdaptiveRepository;
}
