import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hand, 
  Cpu, 
  Languages, 
  Volume2, 
  Target, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Play,
  MessageCircle,
  Globe,
  Camera,
  Code,
  Zap,
  ShieldCheck,
  Smartphone,
  Activity
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="glass-card p-10 rounded-[3rem] hover-lift group"
  >
    <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500">
      <Icon size={30} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-600 leading-relaxed font-medium text-sm">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: Cpu,
      title: "Real-time Detection",
      description: "Advanced AI models process webcam feed in real-time with ultra-low latency for seamless communication."
    },
    {
      icon: Languages,
      title: "English/Urdu Support",
      description: "Dual language output ensures accessibility for a wider audience, translating gestures into both English and Urdu."
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Integrated voice synthesis converts recognized gestures into clear, natural-sounding audio in multiple languages."
    },
    {
      icon: Target,
      title: "Custom Gestures",
      description: "Personalize your experience by training the system to recognize your unique signs and specialized vocabulary."
    },
    {
      icon: CheckCircle2,
      title: "High Accuracy",
      description: "Our refined deep learning architecture ensures high confidence scores even in varied lighting conditions."
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      description: "All processing is performed securely, ensuring your data and video feed remain protected and private."
    },
    {
      icon: Zap,
      title: "Emergency Mode",
      description: "Quick communication bridge for critical situations, generating urgent messages from gestures."
    },
    {
      icon: Activity,
      title: "Learning Assistant",
      description: "AI-powered practice sessions tailored to your progress to help you master sign language."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      <div className="bg-blob bg-blob-1 opacity-40"></div>
      <div className="bg-blob bg-blob-2 opacity-40"></div>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-64 lg:pb-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-brand-700 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping"></span>
                Next-Gen AI System 3.0
              </motion.div>
              
              <h1 className="text-7xl lg:text-9xl font-black text-slate-900 leading-[0.85] mb-10 tracking-tighter">
                AI-Powered <br />
                <span className="text-violet-600">Sign Language</span> <br />
                Translator  
              </h1>
              
              <p className="text-xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                SignLink helps people talk by turning hand signs into text and speech. Making communication easy for everyone using smart AI.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-14 h-20 rounded-[2rem] shadow-2xl shadow-brand-500/30 text-lg font-black uppercase tracking-widest">
                    Get Started
                    <ArrowRight className="ml-3" size={24} />
                  </Button>
                </Link>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-20 flex items-center justify-center lg:justify-start gap-12"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Stack</p>
                <div className="flex items-center gap-10 font-black text-slate-300">
                  <span className="text-xs hover:text-brand-600 transition-all cursor-default hover:scale-110">TensorFlow</span>
                  <span className="text-xs hover:text-brand-600 transition-all cursor-default hover:scale-110">MediaPipe</span>
                  <span className="text-xs hover:text-brand-600 transition-all cursor-default hover:scale-110">FastAPI</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex-1 relative w-full max-w-2xl"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.15)] border-[16px] border-white glass-card">
                <img 
                  src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200" 
                  alt="Person using sign language"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-12 left-12 right-12"
                >
                   <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl border-white/20">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI is Watching</span>
                      </div>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">"Talk easily with SignLink"</p>
                   </div>
                </motion.div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 z-20 glass-card p-10 rounded-[3rem] shadow-2xl border-white/40 hidden md:block"
              >
                 <div className="premium-gradient p-5 rounded-[2rem] text-white shadow-2xl shadow-brand-500/40 mb-5">
                    <Zap size={48} />
                 </div>
                 <p className="text-xs font-black text-slate-900 text-center uppercase tracking-widest">99.2% Acc</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight">Main Features</h2>
            <p className="text-xl text-slate-500 font-medium">
              SignLink uses smart AI to help you talk naturally with hand signs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-12 tracking-tight">How It <br />Works</h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Turn on Camera", description: "Start the camera on your phone or laptop to begin." },
                  { step: "02", title: "Smart AI", description: "The AI looks at your hand movements and understands them." },
                  { step: "03", title: "Text & Voice", description: "Your signs are turned into words and spoken in English or Urdu." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-8 group"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-2xl group-hover:bg-brand-600 transition-colors duration-500">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex-1 relative"
            >
               <div className="bg-white p-6 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-slate-100 group">
                  <img 
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200" 
                    alt="AI Landmark detection"
                    className="w-full rounded-[3rem] object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
               </div>
               
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-50 rounded-full border-4 border-dashed border-brand-200 opacity-50"
               ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="premium-gradient p-16 lg:p-24 rounded-[4rem] text-white text-center relative overflow-hidden shadow-[0_40px_80px_rgba(79,70,229,0.3)]"
           >
              <div className="absolute top-0 right-0 p-20 opacity-10">
                 <Hand size={300} />
              </div>
              <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tight relative z-10">Ready to talk <br />with everyone?</h2>
              <p className="text-xl text-brand-100 mb-14 max-w-3xl mx-auto font-medium relative z-10">
                Join many people using our AI to talk with hand signs. Start today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                 <Link to="/register">
                    <Button size="lg" className="bg-white text-slate-900 shadow-2xl hover:scale-105 transition-all">
                       Start Free Now
                    </Button>
                 </Link>
                 <Link to="/contact">
                    <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 px-16 h-20 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all">
                       Contact Us
                    </Button>
                 </Link>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-600 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-brand-600 p-2.5 rounded-xl text-white shadow-xl">
                  <Hand size={32} />
                </div>
                <span className="text-3xl font-black tracking-tighter">SignLink</span>
              </div>
              <p className="text-slate-400 max-w-md text-lg leading-relaxed mb-12 font-medium">
                Breaking down communication barriers with state-of-the-art AI technology. Empowering the global deaf community one sign at a time.
              </p>
              <div className="flex gap-5">
                 {[
                   { icon: MessageCircle, label: 'Facebook' },
                   { icon: Globe, label: 'Twitter' },
                   { icon: Camera, label: 'Instagram' },
                   { icon: Code, label: 'GitHub' }
                 ].map((social, i) => (
                   <motion.a 
                     key={i} 
                     href="#" 
                     whileHover={{ scale: 1.1, rotate: 5 }}
                     className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center hover:bg-brand-600 transition-all duration-500 border border-slate-800 hover:border-brand-500 group"
                   >
                     <social.icon size={20} className="text-slate-500 group-hover:text-white transition-all" />
                   </motion.a>
                 ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black mb-10 tracking-tight">Core Modules</h4>
              <ul className="space-y-6 text-slate-400 font-bold">
                <li><Link to="/translate" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-brand-600 group-hover:scale-150 transition-all"></div>Translator</Link></li>
                <li><Link to="/training" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-brand-600 group-hover:scale-150 transition-all"></div>Teach Signs</Link></li>
                <li><Link to="/history" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-brand-600 group-hover:scale-150 transition-all"></div>Past Signs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-black mb-10 tracking-tight">Identity</h4>
              <ul className="space-y-6 text-slate-400 font-bold">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">Neural Config</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm font-bold">
            <p className="tracking-widest uppercase text-[10px]">© 2026 SignLink AI Architecture. All rights reserved.</p>
            <div className="flex items-center gap-2">
               <span>Made with ❤️ for FYP</span>
               <div className="w-4 h-4 bg-slate-900 rounded-md"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
