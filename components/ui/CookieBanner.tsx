"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 text-white p-4 flex flex-col sm:flex-row justify-between items-center z-50">
      <p className="text-sm mb-4 sm:mb-0">We use essential cookies to ensure the platform works. By clicking "Accept", you agree to our use of cookies.</p>
      <button onClick={accept} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
        Accept
      </button>
    </div>
  );
}
