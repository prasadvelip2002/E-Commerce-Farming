import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-agri-green text-white hover:bg-agri-green/90",
    secondary: "bg-agri-brown text-white hover:bg-agri-brown/90",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};
