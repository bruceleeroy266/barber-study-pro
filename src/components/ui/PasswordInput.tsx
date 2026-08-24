'use client'

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react'
import { Eye, EyeOff } from 'lucide-react'

export type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({
    className = '',
    id,
    disabled,
    spellCheck = false,
    autoCapitalize = 'none',
    autoCorrect = 'off',
    ...props
  }, ref) {
    const [isVisible, setIsVisible] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const retainedValue = useRef('')
    const restoreAfterToggle = useRef(false)
    const actionLabel = isVisible ? 'Hide password' : 'Show password'

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    useLayoutEffect(() => {
      if (restoreAfterToggle.current && inputRef.current) {
        inputRef.current.value = retainedValue.current
        restoreAfterToggle.current = false
      }
    }, [isVisible])

    const toggleVisibility = () => {
      retainedValue.current = inputRef.current?.value ?? ''
      restoreAfterToggle.current = true
      setIsVisible((visible) => !visible)
    }

    return (
      <div className="relative">
        <input
          {...props}
          ref={inputRef}
          id={id}
          type={isVisible ? 'text' : 'password'}
          disabled={disabled}
          spellCheck={spellCheck}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          className={`${className} pr-14`}
        />
        <button
          type="button"
          aria-controls={id}
          aria-label={actionLabel}
          aria-pressed={isVisible}
          title={actionLabel}
          disabled={disabled}
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-1 my-auto flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVisible ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
