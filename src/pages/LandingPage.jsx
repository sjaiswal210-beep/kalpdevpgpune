import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Shield, Users, Wifi, MapPin, Phone, Mail, Star, ChevronRight, Heart } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Safe & Secure', desc: 'CCTV surveillance, secure entry, and 24/7 security for peace of mind.' },
  { icon: Wifi, title: 'High-Speed WiFi', desc: 'Uninterrupted internet connectivity for work and entertainment.' },
  { icon: Users, title: 'Community Living', desc: 'A vibrant community of like-minded professionals and students.' },
  { icon: Building2, title: 'Premium Rooms', desc: 'Well-furnished rooms with modern amenities and daily housekeeping.' },
];

const testimonials = [
  { name: 'Rahul Sharma', room: 'Room 201', text: 'Best PG experience! Clean rooms, great food, and amazing community.', rating: 5 },
  { name: 'Priya Patel', room: 'Room 302', text: 'Feels like home away from home. The management is very responsive.', rating: 5 },
  { name: 'Amit Kumar', room: 'Room 203', text: 'Affordable, comfortable, and well-maintained. Highly recommended!', rating: 4 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen font-poppins bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">KalpDev <span className="text-purple-600">PG</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition font-medium text-sm">Features</a>
            <a href="#rooms" className="text-gray-600 hover:text-purple-600 transition font-medium text-sm">Rooms</a>
            <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition font-medium text-sm">Reviews</a>
            <a href="#contact" className="text-gray-600 hover:text-purple-600 transition font-medium text-sm">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/student/login" className="px-4 py-2 text-sm font-semibold text-purple-600 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition">
              Student Login
            </Link>
            <Link to="/admin/login" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-premium transition">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-cream-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Premium PG Living</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              KalpDev PG —<br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Comfort • Safety • Better Living
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Experience premium paying guest accommodation with modern amenities, 
              a vibrant community, and hassle-free living in the heart of the city.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/student/login" className="btn-premium flex items-center gap-2">
                Book Your Bed <ChevronRight className="w-4 h-4" />
              </Link>
              <a href="#contact" className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-600 transition">
                Contact Us
              </a>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div>
                <div className="text-2xl font-bold text-gray-900">9</div>
                <div className="text-sm text-gray-500">Rooms</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">18</div>
                <div className="text-sm text-gray-500">Beds</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-500">Floors</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-700 shadow-2xl flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
              </div>
              <Building2 className="w-32 h-32 text-white/80" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">100% Safe</div>
                <div className="text-xs text-gray-500">24/7 Security</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose KalpDev PG?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide everything you need for a comfortable and productive stay.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <f.icon className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Availability */}
      <section id="rooms" className="py-20 px-6 bg-gradient-to-br from-purple-50 to-cream-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Room Availability</h2>
            <p className="text-gray-600">Our building has 3 floors with well-maintained rooms.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { floor: '1st Floor', rooms: '1 Room', beds: '2 Beds', color: 'from-blue-500 to-blue-600' },
              { floor: '2nd Floor', rooms: '4 Rooms', beds: '8 Beds', color: 'from-purple-500 to-purple-600' },
              { floor: '3rd Floor', rooms: '4 Rooms', beds: '8 Beds', color: 'from-indigo-500 to-indigo-600' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6`}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.floor}</h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="text-sm">{f.rooms}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-sm">{f.beds}</span>
                </div>
                <div className="mt-4 text-sm font-medium text-purple-600">₹3,500/month per bed</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Tenants Say</h2>
            <p className="text-gray-600">Real experiences from our happy residents.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.room}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-300 mb-8">Interested in a room? Have questions? Reach out to us anytime.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-sm text-gray-300">KalpDev PG, Near Main Market, City Center</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-300">+91 99999 99999</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-300">info@kalpdevpg.com</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none" />
              <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none resize-none"></textarea>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-white">KalpDev PG</span>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by KalpDev
          </p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-400 transition">
              WhatsApp
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition">Instagram</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-50"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
