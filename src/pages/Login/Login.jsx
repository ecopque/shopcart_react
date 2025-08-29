//FILE: ./src/pages/Login/Login.jsx

import { useState, useEffect } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import './Login.css'

export default function Login() {
    // Estados para gerenciar o formulário
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isFormValid, setIsFormValid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // Hook para navegação
    const navigate = useNavigate()

    // Função para validar e-mail
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Função para validar senha
    const validatePassword = (password) => {
        return password.length >= 8
    }

    // Validação em tempo real sempre que e-mail ou senha mudarem
    useEffect(() => {
        // Valida e-mail
        if (email && !validateEmail(email)) {
            setEmailError('E-mail inválido, cabra!')
        } else {
            setEmailError('Aguardando e-mail...')
        }

        // Valida senha
        if (password && !validatePassword(password)) {
            setPasswordError('Senha deve ter pelo menos 8 caracteres.')
        } else {
            setPasswordError('Aguardando a senha...')
        }

        // Verifica se o formulário está válido
        const emailValid = email && validateEmail(email)
        const passwordValid = password && validatePassword(password)
        setIsFormValid(emailValid && passwordValid)
    
    }, [email, password])

    // Função para lidar com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault()

        if (isFormValid) {
            // Aqui podemos adicionar lógica de autenticação
            console.log('Login válido:', {email, password})

            // Navegue para a página de produtos
            navigate('/products')
        }
    }

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h1 className='login-title'>Login</h1>

                <form onSubmit={handleSubmit}>
                    {/* Campo de e-mail */}
                    <div className='form-group'>
                        <label htmlFor='email' className='form-label'>
                            E-mail
                        </label>
                        <input
                            type='email'
                            id='email'
                            className={`form-input ${emailError ? 'error' : email && !emailError ? 'valid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Digite seu e-mail'
                            required
                        />
                        // Mensagem de erro do email *condicional*
                        {emailError && <div className='error-message'>{emailError}</div>}
                    </div>

                    {/* Campo de senha */}
                    <div className='form-group'>
                        <label htmlFor='password' className='form-label'>
                            Senha
                        </label>
                        <input
                            type='password'
                            id='password'
                            className={`form-input ${passwordError ? 'error': password && !passwordError ? 'valid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Digite sua senha, cabra!'
                            required
                        />
                        // Mensagem de erro da senha *condicional*
                        {passwordError && <div className='error-message'>{passwordError}</div>}
                    </div>

                    {/* Botão de Login */}
                    <button
                        type='submit'
                        className='login-button'
                        disabled={!isFormValid}
                    >
                        {isFormValid ? 'Entrar' : 'Preencha todos os campos'}
                    </button>
                </form>

                {/* Mensagem de status */}
                {isFormValid && (
                    <div className='success-message'>
                        Formulário válido! Clique em entrar para continuar.
                    </div>
                )}
            </div>
        </div>
    )
}