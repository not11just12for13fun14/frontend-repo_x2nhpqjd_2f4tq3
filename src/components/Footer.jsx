function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-blue-200/70">© {new Date().getFullYear()} Digital Art Presentation</p>
        <div className="flex items-center gap-4 text-blue-200/70 text-xs">
          <a href="#gallery" className="hover:text-white">Gallery</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
