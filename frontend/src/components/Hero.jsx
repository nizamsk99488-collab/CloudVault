function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <h1 className="text-5xl font-bold text-gray-800">
        Store Your Files Securely
      </h1>

      <p className="mt-5 text-lg text-gray-600">
        Upload, Download and Access your files from anywhere.
      </p>

      <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Get Started
      </button>
    </div>
  );
}

export default Hero;