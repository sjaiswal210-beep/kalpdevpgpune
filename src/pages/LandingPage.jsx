p{eLgSLgTLH}for;
xprLnP(){vs=Lgc();sgLT();n=LHo(){hro.tagle}{hero.tit}{heo.sil}{.s}initial={{opacity:0,x:30}}animate={{opacity:1,x:0}} trasondurion.7delay.2 className="relative"><img
              src={hero.heroImge}
              alt="KalpDev PG Buildig"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            />
            <dv classNae="bsolute -bottom-4 -left-4 bg-whie roundd-2xlshadw-xl -4 flex items-center gp-3">
              <div lassName="w-12 h-12 rounded-full bg-green-100 flex tems-center jusif-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <divclassName="font-semiboldtet-gray-900text-sm">10%Safe</div>      <divclassName="text-xstext-gray-500">Gaed + CCTV + Guad</div>
              </div>
            </div>
            <div className="bolute -top-4 -rgh-4 bg-whte rounded-2xl shadw-xl p-4 flex items-ceter gap-3">
              <div className"w-12 h-12rounde-full bg-purple-100 flex items-center jstify-center">
                <GaduCap className="w-6 h-6text-purple-60" />
              </div>
              <div>
               <iv className="font-smibod text-gr-900 text-sm">Career Support</div>
                <div className="text-xstext-gray-50">Referrals + Guidance</div>
              </div>
            </div>
          </motiondiv>
        </div>
     </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need, Under One Roof</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">From safety to career growth — we go beyond just providing a bed.</p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Availability */}
      <section id="rooms" className="py-20 px-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">Accommodation</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Room Availability</h2>
            <p className="text-gray-600">3 floors, 9 rooms, 18 beds — all fully furnished and ready to move in.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { floor: '1st Floor', rooms: '1 Room', beds: '2 Beds', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop' },
              { floor: '2nd Floor', rooms: '4 Rooms', beds: '8 Beds', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
              { floor: '3rd Floor', rooms: '4 Rooms', beds: '8 Beds', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <img src={f.img} alt={f.floor} className="w-full h-48 object-cover" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.floor}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span className="text-sm">{f.rooms}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-sm">{f.beds}</span>
                  </div>
                  <div className="text-sm font-semibold text-purple-600">&#8377;3,500/month per bed</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-4">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Tenants Say</h2>
            <p className="text-gray-600">Real experiences from our happy residents.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50/30"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
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
            <span className="inline-block px-4 py-1.5 bg-white/10 text-purple-300 rounded-full text-sm font-semibold mb-4">Contact Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-300 mb-8">Interested in a room? Have questions? Reach out to us anytime.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                <div><div className="font-medium">Address</div><div className="text-sm text-gray-300">KalpDev PG, Near Main Market, City Center</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                <div><div className="font-medium">Phone</div><div className="text-sm text-gray-300">+91 99999 99999</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                <div><div className="font-medium">Email</div><div className="text-sm text-gray-300">info@kalpdevpg.com</div></div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none" />
              <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 outline-none resize-none"></textarea>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition">Send Message</button>
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
          <p className="text-sm text-gray-400 flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by KalpDev</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-400 transition">WhatsApp</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition">Instagram</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-50" aria-label="Contact on WhatsApp">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );
}
