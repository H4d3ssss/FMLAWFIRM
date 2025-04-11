import { useState } from 'react'

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })

    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email format is invalid"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        console.log('Login attempt:', formData)
        // Proceed with login logic
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 w-full max-w-md p-6 bg-white rounded-xl shadow-md"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-700">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2">Remember me</span>
                    </label>

                    <div className="text-sm">
                        <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log In
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Create one
                    </a>
                </p>
            </form>
        </div>
    )
}

export default LoginForm
