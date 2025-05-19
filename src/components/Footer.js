export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm">
            © 2025 Skibidi AI. Skibidi Toilet Sigma Male.
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="https://discordapp.com/users/822863893692284948" target="_blank" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}