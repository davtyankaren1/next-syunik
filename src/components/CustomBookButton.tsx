import React from 'react';
import { MdOutlineRoomService } from "react-icons/md";
import './CustomBookButton.css';


type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export const CustomBookButton: React.FC<Props> = ({ label, onClick, className = '' }) => {
  return (
    <button onClick={onClick} className={`custom-button ${className}`} aria-label={label}>
      <MdOutlineRoomService className="custom-button__icon" size={24}/>
      <span aria-hidden className="custom-button__bg" />
      <span className="custom-button__text">{label}</span>
    </button>
  );
};
