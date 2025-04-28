import React, {useRef, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
 

export default function DefaultLogoImage(props){
  const { user } = props;
  // const user = useSelector(state=>state.listing.user);

    const canvasRef = useRef(null); 

    const generateRandomLightColor = () => {
      const r = Math.floor(200 + Math.random() * 55); // Light red range
      const g = Math.floor(200 + Math.random() * 55); // Light green range
      const b = Math.floor(200 + Math.random() * 55); // Light blue range
      return `rgb(${r}, ${g}, ${b})`;
    }; 

    const generateRandomDarkColor = () => {
      const r = Math.floor(Math.random() * 100); // Dark red range
      const g = Math.floor(Math.random() * 100); // Dark green range
      const b = Math.floor(Math.random() * 100); // Dark blue range
      return `rgb(${r}, ${g}, ${b})`;
    };

    useEffect(() => {
      if(!user) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d"); 

      ctx.beginPath();
      ctx.fillStyle = generateRandomLightColor();
      ctx.arc(100, 100, 50, 0, 2 * Math.PI);  
      ctx.fill(); 

      // const [firstChar, ...rest] = user.fullName; 
      // const [firstChar] = user.fullName; 
      const firstChar = user.fullName.charAt(0).toUpperCase();
      ctx.font = "30px Arial";
      ctx.fillStyle = generateRandomDarkColor();  
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(firstChar, 100, 100);
 
    }, [user]);
    // 
    return(
          <canvas ref={canvasRef} width={200} height={200} />

    ) 
  };
 