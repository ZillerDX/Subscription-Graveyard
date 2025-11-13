/**
 * Custom Select Component
 * Beautiful dropdown with full styling control and rounded corners
 */
import React, { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  label,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer text-lg font-bold shadow-sm hover:border-primary-400 transition-all text-left flex items-center justify-between ${
          value ? 'text-gray-900' : 'text-gray-500'
        } ${isOpen ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'}`}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <FiChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-300 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-slideDown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center justify-between group ${
                option.value === value ? 'bg-primary-100 text-primary-900 font-bold' : 'text-gray-900 font-semibold'
              } ${
                option.value === '' ? 'text-gray-500 font-semibold' : ''
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              <span className={option.value === value ? 'font-bold' : ''}>{option.label}</span>
              {option.value === value && (
                <FiCheck className="w-5 h-5 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
