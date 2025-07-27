'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUniversity, FaSpinner, FaCheck, FaTimes, FaStar, FaUsers, FaGraduationCap, FaShieldAlt, FaHeadphones, FaVideo, FaCertificate, FaMobile, FaBrain, FaChartLine, FaClock, FaDownload, FaArrowRight, FaCreditCard, FaLock } from 'react-icons/fa';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry, NO_STATE } from '@/lib/data/states';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// List of countries from admin form
const COUNTRIES = Object.keys(statesByCountry).sort();

interface FormData {
  name: string;
  email: string;
  password: string;
  description: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

export default function InstitutionRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    description: '',
    country: '',
    state: '',
    city: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [customState, setCustomState] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
    setCustomState('');
    setCustomCity('');
    setFormData(prev => ({
      ...prev,
      country: value,
      state: '',
      city: '',
    }));
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('');
    setCustomCity('');
    setFormData(prev => ({
      ...prev,
      state: value,
      city: '',
    }));
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setFormData(prev => ({
      ...prev,
      city: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate location fields
    if (!selectedCountry) {
      setError('Please select a country');
      setLoading(false);
      return;
    }

    const hasStateData = selectedCountry && statesByCountry[selectedCountry]?.[0] !== NO_STATE;
    if (hasStateData) {
      if (!selectedState) {
        setError('Please select a state/province');
        setLoading(false);
        return;
      }
      if (!selectedCity) {
        setError('Please select a city');
        setLoading(false);
        return;
      }
    } else {
      if (!customState.trim()) {
        setError('Please enter a state/province');
        setLoading(false);
        return;
      }
      if (!customCity.trim()) {
        setError('Please enter a city');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/auth/register/institution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          description: formData.description,
          country: selectedCountry,
          state: hasStateData ? selectedState : customState,
          city: hasStateData ? selectedCity : customCity,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setRegistrationSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Check if the selected country has predefined states
  const hasStateData = selectedCountry && statesByCountry[selectedCountry]?.[0] !== NO_STATE;

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <FaUniversity className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful
          </h2>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Your institution account has been created successfully.
            </p>
            <p className="text-gray-600 mt-2">
              Please wait for admin approval before accessing your account.
            </p>
            <div className="mt-4 flex items-center justify-center">
              <FaSpinner className="animate-spin h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-600">Redirecting to login page...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaUniversity className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Institution
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an account to list your courses and manage bookings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Institution Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Institution Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  required
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a country</option>
                  {Object.keys(statesByCountry)
                    .filter(country => statesByCountry[country]?.[0] !== NO_STATE)
                    .sort((a, b) => a.localeCompare(b))
                    .map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {hasStateData ? (
              <>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province
                  </label>
                  <div className="mt-1">
                    <select
                      id="state"
                      name="state"
                      required
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      disabled={!selectedCountry}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a state</option>
                      {selectedCountry && statesByCountry[selectedCountry]
                        ?.sort((a, b) => a.localeCompare(b))
                        ?.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <select
                      id="city"
                      name="city"
                      required
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={!selectedState}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a city</option>
                      {selectedCountry && selectedState && 
                       citiesByCountryAndState[selectedCountry]?.[selectedState]
                        ?.sort((a, b) => a.localeCompare(b))
                        ?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      disabled={!selectedCountry}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      disabled={!selectedCountry}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  'Register Institution'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 