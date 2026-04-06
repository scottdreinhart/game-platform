import { useEffect, useMemo } from 'react'

type Enabled = boolean | (() => boolean)

export type KeyboardPhase = 'keydown' | 'keyup'

export interface KeyboardActionEvent {
	action: string
	phase: KeyboardPhase
	event: KeyboardEvent
}

export type KeyboardActionHandler = (input: KeyboardActionEvent) => void

export interface KeyboardActionBinding {
	action: string
	keys: string[]
	onTrigger: KeyboardActionHandler
	enabled?: Enabled
	preventDefault?: boolean
	allowRepeat?: boolean
	allowInInputs?: boolean
	phase?: KeyboardPhase
	/**
	 * If true, this binding is blocked and will not trigger.
	 * Useful for game-specific exceptions to global blockedKeys.
	 * Default: false
	 */
	blocked?: boolean
}

export interface UseKeyboardControlsOptions {
	enabled?: Enabled
	ignoreInputs?: boolean
	target?: Document | HTMLElement
	/**
	 * Keys that should be blocked globally (preventDefault + skip all bindings).
	 * Useful for cross-game standardization: games define once, ignore everywhere.
	 *
	 * Examples:
	 * - ['Tab'] — block browser focus trap
	 * - ['F1', 'F11'] — block browser help/fullscreen
	 * - ['Alt+Tab'] — block OS window switcher on Windows
	 *
	 * Supports same token format as binding keys:
	 * - 'KeyW' or 'w' for letter keys
	 * - 'ArrowUp' or 'up' for arrow keys
	 * - 'Enter', 'Space', 'Tab', 'Escape', etc.
	 * - 'ctrl+s', 'alt+f4' for modifier combos
	 *
	 * Per-binding override: set binding.blocked = true to skip it despite not being in blockedKeys.
	 * Inverse control: to allow a key despite it being blocked globally, set allowRepeat or enabled to false as escape hatch.
	 */
	blockedKeys?: string[]
}

const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

const isFormElement = (target: EventTarget | null): boolean => {
	if (!(target instanceof HTMLElement)) {
		return false
	}

	if (target.isContentEditable) {
		return true
	}

	return FORM_TAGS.has(target.tagName)
}

const isEnabled = (enabled: Enabled | undefined): boolean => {
	if (enabled === undefined) {
		return true
	}
	return typeof enabled === 'function' ? enabled() : enabled
}

const normalizeToken = (token: string): string => token.trim().toLowerCase().replace(/\s+/g, '')

const buildEventTokens = (event: KeyboardEvent): string[] => {
	const modifiers: string[] = []

	if (event.ctrlKey || event.metaKey) {
		modifiers.push('ctrl')
	}
	if (event.altKey) {
		modifiers.push('alt')
	}
	if (event.shiftKey) {
		modifiers.push('shift')
	}

	const code = event.code.toLowerCase()
	const key = event.key.toLowerCase() === ' ' ? 'space' : event.key.toLowerCase()

	const tokens = new Set<string>()

	const addTokenVariants = (base: string) => {
		tokens.add(base)
		if (modifiers.length > 0) {
			tokens.add(`${modifiers.join('+')}+${base}`)
		}
	}

	const keyAliases = new Set<string>()

	if (code.startsWith('key') && code.length === 4) {
		keyAliases.add(code.slice(3))
	}
	if (code.startsWith('digit') && code.length === 6) {
		keyAliases.add(code.slice(5))
	}
	if (code.startsWith('numpad') && code.length === 7) {
		keyAliases.add(code.slice(6))
	}

	if (key === 'escape') {
		keyAliases.add('esc')
	}
	if (key === 'arrowup') {
		keyAliases.add('up')
	}
	if (key === 'arrowdown') {
		keyAliases.add('down')
	}
	if (key === 'arrowleft') {
		keyAliases.add('left')
	}
	if (key === 'arrowright') {
		keyAliases.add('right')
	}

	addTokenVariants(code)
	addTokenVariants(key)
	addTokenVariants(`key:${key}`)

	for (const alias of keyAliases) {
		addTokenVariants(alias)
		addTokenVariants(`key:${alias}`)
	}

	return [...tokens]
}

/**
 * Check if a key token is in the blockedKeys set.
 * Normalizes tokens for comparison.
 */
const isKeyBlocked = (token: string, blockedKeys?: string[]): boolean => {
	if (!blockedKeys || blockedKeys.length === 0) {
		return false
	}
	const normalized = normalizeToken(token)
	return blockedKeys.some((blocked) => normalizeToken(blocked) === normalized)
}

export function useKeyboardControls(
	bindings: KeyboardActionBinding[],
	{ enabled = true, ignoreInputs = true, target, blockedKeys }: UseKeyboardControlsOptions = {},
): void {
	const host = target ?? document

	const bindingMap = useMemo(() => {
		const map = new Map<string, KeyboardActionBinding[]>()

		for (const binding of bindings) {
			for (const rawKey of binding.keys) {
				const token = normalizeToken(rawKey)
				const existing = map.get(token)
				if (existing) {
					existing.push(binding)
				} else {
					map.set(token, [binding])
				}
			}
		}

		return map
	}, [bindings])

	useEffect(() => {
		if (!isEnabled(enabled)) {
			return
		}

		const handleKeyboardEvent = (phase: KeyboardPhase) => (rawEvent: Event) => {
			if (!(rawEvent instanceof KeyboardEvent)) {
				return
			}

			const event = rawEvent
			const eventTokens = buildEventTokens(event)

			// Check if any token is globally blocked
			if (blockedKeys && blockedKeys.length > 0) {
				for (const token of eventTokens) {
					if (isKeyBlocked(token, blockedKeys)) {
						event.preventDefault()
						return
					}
				}
			}

			if (ignoreInputs && isFormElement(event.target)) {
				const candidateBindings = eventTokens
					.flatMap((token) => bindingMap.get(token) ?? [])
					.filter((binding) => binding.allowInInputs)

				for (const binding of candidateBindings) {
					if (binding.blocked) {
						continue
					}
					if ((binding.phase ?? 'keydown') !== phase) {
						continue
					}
					if (!isEnabled(binding.enabled)) {
						continue
					}
					if (event.repeat && !binding.allowRepeat) {
						continue
					}
					if (binding.preventDefault ?? true) {
						event.preventDefault()
					}
					binding.onTrigger({ action: binding.action, phase, event })
					return
				}

				return
			}

			for (const token of eventTokens) {
				const matches = bindingMap.get(token)
				if (!matches) {
					continue
				}

				for (const binding of matches) {
					if (binding.blocked) {
						continue
					}
					if ((binding.phase ?? 'keydown') !== phase) {
						continue
					}
					if (!isEnabled(binding.enabled)) {
						continue
					}
					if (event.repeat && !binding.allowRepeat) {
						continue
					}

					if (binding.preventDefault ?? true) {
						event.preventDefault()
					}

					binding.onTrigger({
						action: binding.action,
						phase,
						event,
					})
					return
				}
			}
		}

		const onKeyDown = handleKeyboardEvent('keydown')
		const onKeyUp = handleKeyboardEvent('keyup')

		host.addEventListener('keydown', onKeyDown)
		host.addEventListener('keyup', onKeyUp)

		return () => {
			host.removeEventListener('keydown', onKeyDown)
			host.removeEventListener('keyup', onKeyUp)
		}
	}, [bindingMap, enabled, host, ignoreInputs, blockedKeys])
}