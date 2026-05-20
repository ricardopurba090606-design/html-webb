export default function App() {
  return (
    <main className="h-screen flex">
      <section className="w-72 bg-gray-500 p-4 h-full">
        <div className="flex justify-between items-center">
          
          <div className="flex gap-3 items-center">

            <div className="bg-blue-600 px-3 py-2 rounded-xl">
              <img
                src="/wallet.svg"
                alt="wallet"
                className="w-6 h-6 invert"
              />
            </div>

            <div>
              <h1 className="font-bold text-white">
                Acme Inc
              </h1>

              <p className="text-sm text-gray-200">
                Enterprise
              </p>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}