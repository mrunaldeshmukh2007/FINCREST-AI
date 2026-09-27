import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Coins,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const API_BASE_URL = 'http://127.0.0.1:8000';

type SignupResponse = {
  message?: string;
  user_id?: number;
  error?: string;
};

type LoginResponse = {
  message?: string;
  user_id?: number;
  name?: string;
  email?: string;
  access?: string;
  refresh?: string;
  detail?: string;
  error?: string;
};

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('₹ INR (Indian Rupee)');

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // -----------------------------
    // Frontend validation
    // -----------------------------

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // STEP 1: CREATE ACCOUNT
      // Backend expects:
      // full_name, email, password
      // =====================================================

      console.log('SIGNUP: Creating account...');

      const signupResponse = await fetch(
        `${API_BASE_URL}/api/signup/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: cleanName,
            email: cleanEmail,
            password,
          }),
        },
      );

      const signupData: SignupResponse =
        await signupResponse.json().catch(() => ({}));

      console.log('SIGNUP STATUS:', signupResponse.status);
      console.log('SIGNUP RESPONSE:', signupData);

      if (!signupResponse.ok) {
        throw new Error(
          signupData.error ||
            'Account creation failed. Please try again.',
        );
      }

      // =====================================================
      // STEP 2: SAVE EXTRA PROFILE INFORMATION
      //
      // These fields are NOT currently accepted by the Django
      // signup endpoint, so we keep them locally for onboarding.
      // =====================================================

      localStorage.setItem(
        'fincrest_signup_profile',
        JSON.stringify({
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          country,
          currency,
        }),
      );

      // =====================================================
      // STEP 3: AUTOMATICALLY LOGIN
      //
      // Your backend /api/login/ accepts email/username and
      // password and returns JWT access + refresh tokens.
      // =====================================================

      console.log('SIGNUP: Account created.');
      console.log('LOGIN: Automatically logging in...');

      const loginResponse = await fetch(
        `${API_BASE_URL}/api/login/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: cleanEmail,
            password,
          }),
        },
      );

      const loginData: LoginResponse =
        await loginResponse.json().catch(() => ({}));

      console.log('LOGIN STATUS:', loginResponse.status);
      console.log('LOGIN RESPONSE:', loginData);

      if (!loginResponse.ok) {
        throw new Error(
          loginData.detail ||
            loginData.error ||
            'Account was created, but automatic login failed. Please sign in manually.',
        );
      }

      // =====================================================
      // STEP 4: VERIFY ACCESS TOKEN
      // =====================================================

      if (!loginData.access) {
        console.error(
          'LOGIN RESPONSE DID NOT CONTAIN ACCESS TOKEN:',
          loginData,
        );

        throw new Error(
          'Account was created, but the backend did not return an access token.',
        );
      }

      // =====================================================
      // STEP 5: SAVE JWT TOKENS
      //
      // This is the important fix for your Dashboard 401 errors.
      // =====================================================

      localStorage.setItem(
        'access_token',
        loginData.access,
      );

      if (loginData.refresh) {
        localStorage.setItem(
          'refresh_token',
          loginData.refresh,
        );
      }

      // Save basic user information too
      if (loginData.user_id) {
        localStorage.setItem(
          'user_id',
          String(loginData.user_id),
        );
      }

      localStorage.setItem(
        'user_name',
        loginData.name || cleanName,
      );

      localStorage.setItem(
        'user_email',
        loginData.email || cleanEmail,
      );

      console.log('LOGIN: Access token saved.');
      console.log(
        'ACCESS TOKEN EXISTS:',
        Boolean(localStorage.getItem('access_token')),
      );

      // =====================================================
      // STEP 6: SHOW SUCCESS SCREEN
      // =====================================================

      setSuccess(true);

      // Give the success animation time to display
      setTimeout(() => {
        navigate('/onboarding');
      }, 1800);
    } catch (err) {
      console.error('SIGNUP ERROR:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Account creation failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* =====================================================
          SUCCESS OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 18,
              }}
              className="glass-strong rounded-3xl p-10 text-center max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <PartyPopper className="w-10 h-10 text-emerald-400" />
              </motion.div>

              <h3
                className="text-2xl font-bold"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                Welcome to FinCrest!
              </h3>

              <p
                className="mt-2 text-sm"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Your account is ready. Let's set up your
                financial twin.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Taking you to onboarding...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MAIN SIGNUP CARD
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="w-full max-w-lg"
      >

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2.5 mb-8 justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <span
            className="font-bold text-xl"
            style={{
              color: 'var(--text-primary)',
            }}
          >
            FinCrest
            <span className="text-gradient"> AI</span>
          </span>
        </Link>

        {/* Card */}

        <div className="glass gradient-border rounded-3xl p-8">

          <h1
            className="text-3xl font-bold"
            style={{
              color: 'var(--text-primary)',
            }}
          >
            Create your account
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Start your journey to financial freedom today.
          </p>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* Full Name + Email */}

            <div className="grid sm:grid-cols-2 gap-4">

              <Field
                icon={<User className="w-4 h-4" />}
                label="Full Name"
                placeholder="Arjun Sharma"
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
              />

              <Field
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* Password + Confirm Password */}

            <div className="grid sm:grid-cols-2 gap-4">

              {/* Password */}

              <div>
                <label
                  className="text-sm font-medium"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Password
                </label>

                <div className="relative mt-1.5">

                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full glass rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{
                      color: 'var(--text-primary)',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  className="text-sm font-medium"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Confirm Password
                </label>

                <div className="relative mt-1.5">

                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value,
                      )
                    }
                    className="w-full glass rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{
                      color: 'var(--text-primary)',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>
              </div>

            </div>

            {/* Phone + Country */}

            <div className="grid sm:grid-cols-2 gap-4">

              <Field
                icon={
                  <Phone className="w-4 h-4" />
                }
                label="Phone"
                placeholder="+91 98765 43210"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

              <SelectField
                icon={
                  <Globe className="w-4 h-4" />
                }
                label="Country"
                value={country}
                onChange={setCountry}
                options={[
                  'India',
                  'United States',
                  'United Kingdom',
                  'Singapore',
                  'UAE',
                ]}
              />

            </div>

            {/* Currency */}

            <SelectField
              icon={
                <Coins className="w-4 h-4" />
              }
              label="Preferred Currency"
              value={currency}
              onChange={setCurrency}
              options={[
                '₹ INR (Indian Rupee)',
                '$ USD (US Dollar)',
                '€ EUR (Euro)',
                '£ GBP (Pound Sterling)',
              ]}
            />

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3"
              >
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Terms */}

            <label
              className="flex items-start gap-2.5 text-sm cursor-pointer"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded accent-blue-600"
              />

              <span>
                I accept the{' '}
                <a
                  href="#"
                  className="text-blue-400 hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-blue-400 hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              icon={
                loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
              disabled={loading}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </Button>

          </form>

          {/* Sign in */}

          <p
            className="mt-6 text-center text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-semibold text-blue-400 hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   INPUT FIELD
============================================================ */

function Field({
  icon,
  label,
  placeholder,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div>

      <label
        className="text-sm font-medium"
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </label>

      <div className="relative mt-1.5">

        <div
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {icon}
        </div>

        <input
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{
            color: 'var(--text-primary)',
          }}
        />

      </div>
    </div>
  );
}

/* ============================================================
   SELECT FIELD
============================================================ */

function SelectField({
  icon,
  label,
  options,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label
        className="text-sm font-medium"
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </label>

      <div className="relative mt-1.5">

        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {icon}
        </div>

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-slate-900"
            >
              {option}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}