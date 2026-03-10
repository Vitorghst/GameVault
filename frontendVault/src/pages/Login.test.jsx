import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'

// Mock do useAuth
const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o formulário de login corretamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    // Verifica se os campos principais estão presentes
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/ou continue com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
  })

  it('deve permitir digitar email e senha', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)

    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    expect(emailInput.value).toBe('teste@email.com')
    expect(passwordInput.value).toBe('123456')
  })

  it('deve chamar login e redirecionar ao submeter com sucesso', async () => {
    mockLogin.mockResolvedValueOnce({ success: true })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('teste@email.com', '123456')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('deve mostrar alerta quando login falhar', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    mockLogin.mockResolvedValueOnce({ success: false, error: 'Credenciais inválidas' })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'senha_errada' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Credenciais inválidas')
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    alertMock.mockRestore()
  })

  it('deve alternar a visibilidade da senha ao clicar no ícone', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText(/senha/i)
    const toggleButton = screen.getByRole('button', { name: /👁️|👁️‍🗨️/i })

    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('deve abrir popup do Google ao clicar no botão', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const googleButton = screen.getByRole('button', { name: /google/i })
    fireEvent.click(googleButton)

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('localhost:3000/api/auth/google'),
      'Google Login',
      expect.stringContaining('width=600')
    )

    openSpy.mockRestore()
  })

  it('deve desabilitar o botão enquanto está carregando', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(() => {})) // nunca resolve

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/entrando/i)).toBeInTheDocument()
    })
  })
})