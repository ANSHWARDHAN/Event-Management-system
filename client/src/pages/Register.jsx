import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
            } else {
                await verifyOtp(email, otp);
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Create an Account
                </h2>
                <p className="text-gray-500">Join Eventora today</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <p className="text-sm text-green-700 bg-green-50 p-3 mb-4 rounded border border-green-200">
                            OTP sent to your email. Verify your account.
                        </p>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            required
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="6-digit OTP"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm text-center tracking-widest font-bold"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
                >
                    {loading
                        ? "Processing..."
                        : showOTP
                        ? "Verify & Complete"
                        : "Sign Up"}
                </button>
            </form>

            {!showOTP && (
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-gray-900 font-bold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            )}
        </div>
    );
};

export default Register;