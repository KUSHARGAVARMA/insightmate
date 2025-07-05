"use client";

type CardProps = {
  title: string;
  description: string;
  clickCount?: number;
  onClick?: () => void;
  className?:string;
};

export default function Card({ title, description,className="",onClick }: CardProps) {
  return (
    <div className={`p-4 rounded-md shadow-md bg-white ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-base text-gray-700 mb-4">{description}</p>
      
    </div>
  );
}
//