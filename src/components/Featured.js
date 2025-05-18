export default function Featured() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
          Featured Bot
        </h2>
        
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-800">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Assistant Name
              </h3>
              <p className="text-gray-400 mb-4">
                Most active AI assistant in the last 24 hours
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                  </svg>
                  <span>1.2k chats today</span>
                </div>
                
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}