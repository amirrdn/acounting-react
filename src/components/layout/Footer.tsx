const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 mt-4">
      <div className="w-full py-4">
        <p className="text-sm text-center text-slate-300">
          © {new Date().getFullYear()} Accounting App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 