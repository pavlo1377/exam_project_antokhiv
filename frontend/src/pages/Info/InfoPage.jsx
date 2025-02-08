function InfoPage() {
  return (
    <div className="text-center py-16 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">About This App</h1>
      <p className="text-lg text-blue-700 mb-10">
        Welcome to our scheduling app! This platform helps you manage your classes efficiently and stay organized.
      </p>

      <div className="flex md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
        <div className="flex-1 bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
          <p>
            We aim to simplify your academic life by providing a seamless scheduling experience.
          </p>
        </div>
        <div className="flex-1 bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Why Choose Us?</h2>
          <p>
            Our intuitive interface and powerful tools make scheduling easy and enjoyable.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-blue-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Us</h2>
        <ul className="text-blue-700 text-lg space-y-2">
          <li>
            <span className="font-semibold">Email:</span> pavlo.antohiv@gmail.com
          </li>
          <li>
            <span className="font-semibold">Telegram:</span> @anthvvvvv
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InfoPage;
