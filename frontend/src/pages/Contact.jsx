import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  User, 
  AtSign, 
  FileText,
  Clock,
  Globe,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactAPI.sendMessage(formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-brand-100">
      <div className="bg-blob bg-blob-1 opacity-30"></div>
      <div className="bg-blob bg-blob-2 opacity-30"></div>
      
      <Navbar />

      <section className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-brand-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm"
             >
                <Sparkles size={12} />
                Connect with our team
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-6xl lg:text-8xl font-black text-slate-900 leading-none mb-8 tracking-tighter"
             >
               Get in <span className="text-brand-600">Touch.</span>
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-slate-500 font-medium"
             >
               Have questions about SignLink? Our team is here to help you bridge the communication gap.
             </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-4 space-y-8"
            >
              {[
                { icon: Mail, title: "Support Email", value: "support@signlink.ai", desc: "Our team usually responds within 24 hours." },
                { icon: MapPin, title: "Headquarters", value: "Innovation Hub, Silicon St.", desc: "Visit our research center for live demos." },
                { icon: Clock, title: "Working Hours", value: "Mon - Fri, 9AM - 6PM", desc: "Dedicated support during business hours." }
              ].map((item, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] group hover:bg-white transition-all duration-500">
                  <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-xl font-black text-slate-900 mb-2">{item.value}</p>
                  <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-8"
            >
              <div className="glass-card p-10 lg:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border-white/40">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <User size={12} /> Full Name
                      </label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AtSign size={12} /> Email Address
                      </label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <FileText size={12} /> Subject
                    </label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MessageSquare size={12} /> Your Message
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Describe your inquiry in detail..."
                      className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 active:scale-95 transition-all text-lg"
                  >
                    {isSubmitting ? "Syncing Logic..." : "Dispatch Message"}
                    <Send size={24} className="ml-3" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
