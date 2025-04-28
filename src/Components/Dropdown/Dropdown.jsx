import React, { useEffect, useRef, useState } from 'react';
import styles from "./dropdown.module.css";

export default function Dropdown({children,title,btnStyle ,dropdownStyle , menuStyle}) {
    const [isDropped,setIsDropped] = useState(false);
    const dropdownRef = useRef(null);
    const handleDrop = ()=>{
        setIsDropped(!isDropped);
    }

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setIsDropped(false);
          }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);
  return (
    <div ref={dropdownRef} className={`${styles.dropdown} ${dropdownStyle} flex`}>
        <button onClick={handleDrop} className={`${btnStyle}`}>{title}</button>
        <div className={`${styles.dropdownMenu} ${isDropped?styles.dropped:""} ${menuStyle}`}>
            {children}
        </div>
    </div>
  )
}
