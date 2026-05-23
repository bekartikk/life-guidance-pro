/**
 * @typedef {Object} AdaptiveMemoryRecord
 * @property {string} external_user_id
 * @property {string} external_email
 * @property {string} memory_scope
 * @property {string} summary
 * @property {string} embedding_status
 * @property {string|null} embedding_model
 * @property {number[]|null} embedding_vector
 * @property {Record<string, unknown>} memory_json
 */

/**
 * @typedef {Object} AdaptiveConversationRecord
 * @property {string} external_user_id
 * @property {string} external_email
 * @property {string} conversation_type
 * @property {string|null} current_plan_id
 * @property {Record<string, unknown>} metadata_json
 */

/**
 * @typedef {Object} AdaptiveUsageEventRecord
 * @property {string} external_user_id
 * @property {string} external_email
 * @property {string} endpoint
 * @property {string} provider
 * @property {string} model
 * @property {string} status
 * @property {boolean} cache_hit
 * @property {number|null} latency_ms
 * @property {Record<string, unknown>} payload_json
 */

export {};
