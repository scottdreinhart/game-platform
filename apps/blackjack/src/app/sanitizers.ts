/**
 * Blackjack-specific sanitization utilities
 *
 * Uses shared sanitizers from @games/shared-sanitizers
 */

import {
  sanitizeHTML,
  escapeHTML,
  sanitizeURL,
} from '@games/shared-sanitizers'

/**
 * Sanitize player display name for safe rendering
 *
 * Converts any HTML in name to plain text
 */
export function sanitizePlayerName(name: string): string {
  return escapeHTML(name)
}

/**
 * Sanitize HTML content for game instructions
 *
 * Only allows safe tags like <p>, <strong>, <em>
 */
export function sanitizeGameInstructions(html: string): string {
  return sanitizeHTML(html)
}

/**
 * Sanitize URLs if game includes external links (help, documentation, etc.)
 */
export function sanitizeGameUrl(url: string): string {
  return sanitizeURL(url)
}
