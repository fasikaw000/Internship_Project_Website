export default function About() {
  return (
    <div className="bg-white min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 animate-slideUp">
        {/* Who We Are */}
        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600 inline-block">
            Who We Are
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mt-4 max-w-3xl">
            We are an online e-commerce platform built to bring you a wide range of quality products
            with a simple, secure shopping experience. From electronics and fashions to books and more,
            we connect you with what you need—delivered with care and customer focus at the heart of everything we do.
          </p>
        </section>

        {/* Mission & Vision grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <section className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To deliver quality products to our customers with reliable service, fair prices, and a seamless experience from browse to delivery.
            </p>
          </section>

          <section className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become a trusted e-commerce brand that customers choose first—known for quality, transparency, and outstanding support.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
