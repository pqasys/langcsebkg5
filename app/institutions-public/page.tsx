'use client'

import Link from 'next/link'
import { 
  FaGlobe, 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaClock,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaGraduationCap,
  FaHandshake,
  FaRocket,
  FaAward,
  FaHeadphones,
  FaVideo,
  FaCertificate,
  FaMobile,
  FaBrain,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'



export default function InstitutionsPublicPage() {
  const benefits = [
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Access students from over 50 countries worldwide',
      details: ['International student base', 'Geographic expansion', 'Brand visibility', 'Cultural diversity']
    },
    {
      icon: FaUsers,
      title: 'Student Growth',
      description: 'Increase your student enrollment with our platform',
      details: ['Larger student pool', 'Automated marketing', 'Lead generation', 'Student retention']
    },
    {
      icon: FaChartLine,
      title: 'Revenue Growth',
      description: 'Boost your revenue with our commission-based model',
      details: ['Flexible pricing', 'Multiple currencies', 'Automated payments', 'Revenue analytics']
    },
    {
      icon: FaShieldAlt,
      title: 'Quality Assurance',
      description: 'Maintain high standards with our quality control system',
      details: ['Quality monitoring', 'Student feedback', 'Performance reviews', 'Continuous improvement']
    },
    {
      icon: FaClock,
      title: 'Time Savings',
      description: 'Focus on teaching while we handle the platform',
      details: ['Automated processes', 'Student management', 'Payment processing', 'Technical support']
    },
    {
      icon: FaStar,
      title: 'Brand Recognition',
      description: 'Build your reputation in the global education market',
      details: ['Professional profile', 'Student reviews', 'Success stories', 'Industry recognition']
    }
  ]

  const requirements = [
    {
      title: 'Accreditation',
      description: 'Must be an accredited language education institution',
      icon: FaAward
    },
    {
      title: 'Quality Standards',
      description: 'Demonstrate high-quality teaching standards and student satisfaction',
      icon: FaStar
    },
    {
      title: 'Technical Capability',
      description: 'Ability to deliver online courses with video and interactive content',
      icon: FaVideo
    },
    {
      title: 'Student Support',
      description: 'Provide adequate student support and feedback systems',
      icon: FaHeadphones
    }
  ]

  const onboardingSteps = [
    {
      step: '01',
      title: 'Application',
      description: 'Submit your institution application with required documentation',
      duration: '1-2 days'
    },
    {
      step: '02',
      title: 'Review',
      description: 'Our team reviews your application and conducts quality assessment',
      duration: '3-5 days'
    },
    {
      step: '03',
      title: 'Approval',
      description: 'Receive approval and access to our partner dashboard',
      duration: '1 day'
    },
    {
      step: '04',
      title: 'Setup',
      description: 'Configure your profile, courses, and payment settings',
      duration: '2-3 days'
    },
    {
      step: '05',
      title: 'Launch',
      description: 'Go live with your courses and start attracting students',
      duration: '1 day'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Maria Rodriguez',
      role: 'Director, Spanish Language Institute',
      institution: 'Madrid Language Academy',
      content: 'Partnering with Fluentish has transformed our reach. We now have students from 30+ countries and our revenue has increased by 150%.',
      rating: 5
    },
    {
      name: 'Prof. Hans Mueller',
      role: 'Founder, German Learning Center',
      institution: 'Berlin Sprachschule',
      content: 'The platform is incredibly user-friendly and the support team is exceptional. Our students love the interactive features.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'CEO, English Excellence',
      institution: 'London Language School',
      content: 'Fluentish helped us scale our business globally. The analytics and student management tools are invaluable.',
      rating: 5
    }
  ]

  const stats = [
    { number: '500+', label: 'Partner Institutions' },
    { number: '50+', label: 'Countries Reached' },
    { number: '100K+', label: 'Students Enrolled' },
    { number: '95%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Partner With Fluentish
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join the world's leading language learning platform and reach students globally. 
            Grow your institution with our comprehensive tools and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/institution-registration">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                <FaHandshake className="w-5 h-5 mr-2" />
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                <FaPhone className="w-5 h-5 mr-2" />
                Schedule Call
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Partner With Fluentish?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="shadow-md border-0 bg-white">
                <CardContent className="py-8 px-6 flex flex-col items-center">
                  <benefit.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 mb-2 text-center">{benefit.description}</p>
                  <ul className="text-gray-500 text-sm list-disc list-inside space-y-1">
                    {benefit.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 border-t border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">Flexible Subscription Plans for Institutions</h2>
          <p className="text-center text-lg text-blue-700 mb-10 max-w-2xl mx-auto">
            Choose the plan that fits your institution's needs. All plans include access to our global student base, advanced analytics, and dedicated support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Starter Plan */}
            <Card className="shadow-lg border-2 border-blue-200 bg-white">
              <CardContent className="py-10 px-6 flex flex-col items-center">
                <div className="text-blue-600 font-bold text-lg mb-2">Starter</div>
                <div className="text-4xl font-extrabold text-blue-900 mb-2">$99<span className="text-lg font-medium">/mo</span></div>
                <div className="text-blue-500 mb-2">or $990/year</div>
                <div className="text-sm text-blue-700 mb-4">25% commission</div>
                <ul className="text-gray-700 text-sm mb-6 space-y-1">
                  <li>Up to 10 courses</li>
                  <li>Up to 100 students</li>
                  <li>Email support</li>
                  <li>Basic analytics</li>
                </ul>
                <Link href="/auth/signup?type=institution">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Professional Plan */}
            <Card className="shadow-xl border-4 border-indigo-400 bg-white scale-105 z-10">
              <CardContent className="py-10 px-6 flex flex-col items-center">
                <div className="text-indigo-700 font-bold text-lg mb-2 flex items-center gap-2">Professional <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold ml-2">Most Popular</span></div>
                <div className="text-4xl font-extrabold text-indigo-900 mb-2">$299<span className="text-lg font-medium">/mo</span></div>
                <div className="text-indigo-500 mb-2">or $2,990/year</div>
                <div className="text-sm text-indigo-700 mb-4">15% commission</div>
                <ul className="text-gray-700 text-sm mb-6 space-y-1">
                  <li>Up to 50 courses</li>
                  <li>Up to 500 students</li>
                  <li>Priority support</li>
                  <li>Advanced analytics</li>
                  <li>Custom branding</li>
                  <li>API access</li>
                </ul>
                <Link href="/auth/signup?type=institution">
                  <Button size="lg" className="w-full bg-indigo-700 text-white hover:bg-indigo-800">Start Professional</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Enterprise Plan */}
            <Card className="shadow-lg border-2 border-purple-300 bg-white">
              <CardContent className="py-10 px-6 flex flex-col items-center">
                <div className="text-purple-700 font-bold text-lg mb-2">Enterprise</div>
                <div className="text-4xl font-extrabold text-purple-900 mb-2">$999<span className="text-lg font-medium">/mo</span></div>
                <div className="text-purple-500 mb-2">or $9,990/year</div>
                <div className="text-sm text-purple-700 mb-4">10% commission</div>
                <ul className="text-gray-700 text-sm mb-6 space-y-1">
                  <li>Unlimited courses</li>
                  <li>Unlimited students</li>
                  <li>24/7 support</li>
                  <li>White-label options</li>
                  <li>Dedicated account manager</li>
                </ul>
                <Link href="/contact">
                  <Button size="lg" className="w-full bg-purple-700 text-white hover:bg-purple-800">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-lg shadow border border-blue-100 bg-white">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-3 font-semibold text-blue-900">Feature</th>
                  <th className="px-6 py-3 font-semibold text-blue-900">Starter</th>
                  <th className="px-6 py-3 font-semibold text-blue-900">Professional</th>
                  <th className="px-6 py-3 font-semibold text-blue-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4">Courses</td>
                  <td className="px-6 py-4">Up to 10</td>
                  <td className="px-6 py-4">Up to 50</td>
                  <td className="px-6 py-4">Unlimited</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">Students</td>
                  <td className="px-6 py-4">Up to 100</td>
                  <td className="px-6 py-4">Up to 500</td>
                  <td className="px-6 py-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Support</td>
                  <td className="px-6 py-4">Email</td>
                  <td className="px-6 py-4">Priority</td>
                  <td className="px-6 py-4">24/7</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">Analytics</td>
                  <td className="px-6 py-4">Basic</td>
                  <td className="px-6 py-4">Advanced</td>
                  <td className="px-6 py-4">Advanced</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Branding</td>
                  <td className="px-6 py-4">Fluentish</td>
                  <td className="px-6 py-4">Custom</td>
                  <td className="px-6 py-4">White-label</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">Commission Rate</td>
                  <td className="px-6 py-4">25%</td>
                  <td className="px-6 py-4">15%</td>
                  <td className="px-6 py-4">10%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">API Access</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4">Yes</td>
                  <td className="px-6 py-4">Yes</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">Dedicated Manager</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-blue-800 font-semibold mb-2">Not sure which plan is right for you?</p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                Talk to Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Partnership Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We partner with high-quality language institutions that share our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requirements.map((requirement, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <requirement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{requirement.title}</h3>
                  <p className="text-gray-600">{requirement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple Onboarding Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 5 simple steps. Our team will guide you through every step of the process.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 hidden lg:block"></div>
            <div className="space-y-12">
              {onboardingSteps.map((step, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{step.step}</div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="text-sm text-blue-600 font-medium">Duration: {step.duration}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Partners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from language institutions that have successfully partnered with Fluentish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.institution}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Grow Your Institution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of language institutions that have already expanded their reach with Fluentish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?type=institution">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                <FaRocket className="w-5 h-5 mr-2" />
                Start Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                <FaEnvelope className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 