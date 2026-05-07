import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Hand, 
  Cpu, 
  Languages, 
  Volume2, 
  Target, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  const features = [
    {
      icon: Cpu,
      title: "Real-time Detection",
      description: "Advanced AI models process webcam feed in real-time with ultra-low latency for seamless communication.",
      delay: 0
    },
    {
      icon: Languages,
      title: "English/Urdu Support",
      description: "Dual language output ensures accessibility for a wider audience, translating gestures into both English and Urdu.",
      delay: 100
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Integrated voice synthesis converts recognized gestures into clear, natural-sounding audio in multiple languages.",
      delay: 200
    },
    {
      icon: Target,
      title: "Custom Gestures",
      description: "Personalize your experience by training the system to recognize your unique signs and specialized vocabulary.",
      delay: 300
    },
    {
      icon: MessageSquare,
      title: "Chat Mode",
      description: "A dedicated interface for two-way communication, bridging the gap between signers and non-signers.",
      delay: 400
    },
    {
      icon: CheckCircle2,
      title: "High Accuracy",
      description: "Our refined deep learning architecture ensures high confidence scores even in varied lighting conditions.",
      delay: 500
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-100/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-accent-100/30 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-bold mb-8 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
                The Future of Accessibility
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
                AI-Powered <span className="text-brand-600">Sign Language</span> Translator
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SignLink bridges the communication gap by translating hand gestures into real-time text and speech. Empowering the deaf and hard-of-hearing community through technology.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto px-10">
                    Start Translation
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-10">
                  <Play className="mr-2 fill-brand-600 text-brand-600" size={20} />
                  View Demo
                </Button>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Built with</p>
                <div className="flex items-center gap-6 font-bold text-slate-500">
                  <span className="text-lg">TensorFlow</span>
                  <span className="text-lg">React</span>
                  <span className="text-lg">FastAPI</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200" 
                  alt="Person using sign language"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                   <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predicting...</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">"Hello, how can I help you?"</p>
                   </div>
                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-accent-500 text-white p-6 rounded-2xl shadow-xl animate-bounce-slow hidden md:block">
                 <Languages size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Powerful Features for Seamless Communication</h2>
            <p className="text-lg text-slate-600">
              SignLink is designed with precision and accessibility in mind, offering a suite of tools to make communication natural and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">How SignLink Works</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Capture", description: "Position yourself in front of the webcam and start the live translation mode." },
                  { step: "02", title: "Process", description: "Our AI engine analyzes hand landmarks and motion patterns in real-time." },
                  { step: "03", title: "Translate", description: "Gestures are instantly converted into text and speech output in your chosen language." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-200">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200" 
                 alt="AI Landmark detection"
                 className="w-full rounded-[32px] object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                  <Hand size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight">SignLink</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
                Breaking down communication barriers with state-of-the-art AI technology. Empowering the global deaf community one sign at a time.
              </p>
              <div className="flex gap-4">
                 {/* Social placeholders */}
                 {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer border border-slate-800"></div>)}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Translator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chat Mode</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2026 SignLink AI. All rights reserved.</p>
            <p>Made with ❤️ for University Final Year Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
