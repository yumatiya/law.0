import { render, screen, fireEvent } from '@testing-library/react'
import AuthPage from './AuthPage'

describe('AuthPage', () => {
  test('renders auth form correctly', () => {
    render(<AuthPage />)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('validates empty inputs on submit', () => {
    render(<AuthPage />)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})
