// src/components/Button.tsx
"use client";

type ButtonProps = {
    children: React.ReactNode;  // Accepts anything inside the button (text, icons, etc)
    onClick?: () => void;       // Optional click handler function
  };
  
  export default function Button({ children, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        {children}
      </button>
    );
  }
  