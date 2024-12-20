import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Share2,
  Calendar,
  Target,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Check as CheckIcon
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-2xl font-bold">KontentRupa</h1>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
                <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900">Testimonials</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">Log in</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Transform Your Content Into Multi-Platform Success
              </h1>
              <p className="text-xl text-gray-600">
                Repurpose your content intelligently across social media platforms. Save time, reach more, achieve more.
              </p>
              <div className="flex items-center gap-4">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-70"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-70"></div>
              <div className="relative">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="KontentRupa Dashboard"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Content Success</h2>
            <p className="text-gray-600">Powerful features to transform, schedule, and optimize your content across platforms.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Repurposing</h3>
              <p className="text-gray-600">Automatically transform your content while maintaining your brand voice.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Publishing</h3>
              <p className="text-gray-600">Post to all major social platforms with a single click.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Schedule posts at optimal times for maximum engagement.</p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audience Targeting</h3>
              <p className="text-gray-600">Customize content for different audience segments.</p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">Track performance and optimize your content strategy.</p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl border bg-white">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">Ensure your content maintains high standards across platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>3 social platforms</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>10 posts per month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic analytics</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">Get Started</Button>
            </div>

            {/* Pro Plan */}
            <div className="border rounded-lg p-8 shadow-md bg-blue-50 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>All social platforms</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited posts</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Custom solutions</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Content Creators</h2>
            <p className="text-gray-600">See what our customers have to say about KontentRupa</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="/testimonial1.jpg" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600">"KontentRupa has completely transformed how I manage my social media presence. The AI-powered repurposing saves me hours every week."</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="/testimonial2.jpg" alt="Mark" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Mark Chen</h4>
                  <p className="text-sm text-gray-600">Digital Marketer</p>
                </div>
              </div>
              <p className="text-gray-600">"The analytics and insights have helped us optimize our content strategy. Our engagement rates have increased by 150% since using KontentRupa."</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="/testimonial3.jpg" alt="Emily" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-600">Social Media Manager</p>
                </div>
              </div>
              <p className="text-gray-600">"The multi-platform publishing feature is a game-changer. What used to take my team hours now happens with just a few clicks."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of content creators who are already saving time and reaching more people.
            </p>
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">KontentRupa</h3>
              <p className="text-gray-600 text-sm">
                Transform your content intelligently across social media platforms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Use Cases</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            <p>© 2024 KontentRupa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;