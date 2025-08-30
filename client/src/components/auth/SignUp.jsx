import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Building2, Leaf, Shield, ShoppingCart, Gavel } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      value: 'producer',
      label: 'Producer',
      description: 'Green hydrogen facility operator',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'verifier',
      label: 'Verifier',
      description: 'Certification body or auditor',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      description: 'Industrial consumer',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      value: 'regulator',
      label: 'Regulator',
      description: 'Government authority',
      icon: Gavel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    companyName: Yup.string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must not exceed 100 characters')
      .required('Company name is required'),
    role: Yup.string()
      .oneOf(['producer', 'verifier', 'buyer', 'regulator'], 'Invalid role selected')
      .required('Role is required'),
    
    // Role-specific validations
    facilityDetails: Yup.object().when('role', {
      is: 'producer',
      then: (schema) => schema.shape({
        facilityName: Yup.string().required('Facility name is required'),
        location: Yup.string().required('Facility location is required'),
        capacity: Yup.number().positive('Capacity must be positive').required('Capacity is required'),
        technology: Yup.string().required('Technology type is required')
      }),
      otherwise: (schema) => schema.nullable()
    }),
    
    certificationBody: Yup.object().when('role', {
      is: 'verifier',
      then: (schema) => schema.shape({
        bodyName: Yup.string().required('Certification body name is required'),
        accreditationNumber: Yup.string().required('Accreditation number is required'),
        scope: Yup.string().required('Certification scope is required')
      }),
      otherwise: (schema) => schema.nullable()
    }),
    
    industryType: Yup.string().when('role', {
      is: 'buyer',
      then: (schema) => schema.oneOf(['steel', 'ammonia', 'transport', 'chemical', 'other'], 'Invalid industry type').required('Industry type is required'),
      otherwise: (schema) => schema.nullable()
    })
  });

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: '',
    facilityDetails: {
      facilityName: '',
      location: '',
      capacity: '',
      technology: ''
    },
    certificationBody: {
      bodyName: '',
      accreditationNumber: '',
      scope: ''
    },
    industryType: ''
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const result = await signup(values);
      if (result.success) {
        navigate('/verify-otp', { 
          state: { 
            email: values.email,
            companyName: values.companyName 
          } 
        });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setFieldError(err.field || 'email', err.message);
        });
      } else {
        setFieldError('email', error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderRoleSpecificFields = (values, setFieldValue) => {
    switch (values.role) {
      case 'producer':
        return (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800">Facility Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facility Name</label>
                <Field
                  name="facilityDetails.facilityName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <ErrorMessage name="facilityDetails.facilityName" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Field
                  name="facilityDetails.location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <ErrorMessage name="facilityDetails.location" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (MW)</label>
                <Field
                  name="facilityDetails.capacity"
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <ErrorMessage name="facilityDetails.capacity" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technology</label>
                <Field
                  name="facilityDetails.technology"
                  as="select"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select Technology</option>
                  <option value="alkaline">Alkaline Electrolysis</option>
                  <option value="pem">PEM Electrolysis</option>
                  <option value="solid-oxide">Solid Oxide Electrolysis</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="facilityDetails.technology" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>
          </div>
        );

      case 'verifier':
        return (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800">Certification Body Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Body Name</label>
                <Field
                  name="certificationBody.bodyName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="certificationBody.bodyName" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation Number</label>
                <Field
                  name="certificationBody.accreditationNumber"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="certificationBody.accreditationNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <Field
                  name="certificationBody.scope"
                  as="textarea"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="certificationBody.scope" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>
          </div>
        );

      case 'buyer':
        return (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800">Industry Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry Type</label>
              <Field
                name="industryType"
                as="select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Industry Type</option>
                <option value="steel">Steel Manufacturing</option>
                <option value="ammonia">Ammonia Production</option>
                <option value="transport">Transportation</option>
                <option value="chemical">Chemical Industry</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="industryType" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join GreenChain
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start trading green hydrogen credits
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <Field
                    name="companyName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter your company name"
                  />
                  <ErrorMessage name="companyName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <div
                          key={role.value}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            values.role === role.value
                              ? `${role.borderColor} ${role.bgColor} ring-2 ring-offset-2 ring-green-500`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setFieldValue('role', role.value);
                            setSelectedRole(role.value);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`h-6 w-6 ${role.color}`} />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{role.label}</div>
                              <div className="text-sm text-gray-500">{role.description}</div>
                            </div>
                            {values.role === role.value && (
                              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Role-specific fields */}
                {renderRoleSpecificFields(values, setFieldValue)}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                    Sign in
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <Link to="/home" className="font-medium text-gray-500 hover:text-gray-700">
                    ← Back to Home
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;