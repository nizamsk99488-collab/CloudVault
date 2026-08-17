function Features() {
  return (
    <div className="py-20 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">
        Why Choose CloudVault?
      </h2>

      <div className="flex justify-center gap-8">

        <div className="bg-gray-100 p-6 rounded-xl w-72 text-center shadow">
          <h3 className="text-2xl font-bold">☁️ Secure Storage</h3>
          <p className="mt-3 text-gray-600">
            Your files are stored safely in the cloud.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl w-72 text-center shadow">
          <h3 className="text-2xl font-bold">⚡ Fast Upload</h3>
          <p className="mt-3 text-gray-600">
            Upload files quickly with one click.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl w-72 text-center shadow">
          <h3 className="text-2xl font-bold">📱 Access Anywhere</h3>
          <p className="mt-3 text-gray-600">
            Open your files from mobile or computer.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Features;