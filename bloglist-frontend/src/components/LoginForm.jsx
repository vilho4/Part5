import PropTypes from 'prop-types'
import login from '../services/login'

const LoginForm = ({ username, password, handleLogin, handleUsernameChange, handlePasswordChange }) => {
// console.log('loginform says hi')
    return (
        <form onSubmit={handleLogin}>
            <div>
                <h2>Login</h2>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={handleUsernameChange}
                />
            </div>
            <div>
          password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={handlePasswordChange}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )
}

login.PropTypes = {
    username:PropTypes.string.isRequired,
    password:PropTypes.string.isRequired,
    handleLogin:PropTypes.func.isRequired,
    handleUsernameChange:PropTypes.func.isRequired,
    handlePasswordChange:PropTypes.func.isRequired
}

export default LoginForm