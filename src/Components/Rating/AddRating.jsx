import { useState } from "react";
import { CiStar } from "react-icons/ci";
export default function AddRating({rating ,setRating,setValue}) {
  const stars = [1, 2, 3, 4, 5];
  /* const [rating, setRating] = useState(0); */
  const [hover, setHover] = useState(0);
  const handleSetRating = (star)=>{
    setRating(star);
    setValue("rating",star);
  }

  const handleRating = (i) => {
    return i <= (hover || rating) ? "#AC7D0C" : "black";
  };
  return (
    <section className="flex gap-3 items-center">
        <div className="flex gap-3">
            {stars.map((star, i) => {
            return (
                <CiStar 
                size={30}
                className="cursor-pointer"
                style={{ color: handleRating(star) }}
                key={i}
                onClick={() => handleSetRating(star)}
                onMouseEnter={() => {
                setHover(star);
                }}
                onMouseLeave={() => {
                setHover(0);
                }}
            /> 
            );
        })}
        </div>
        <div className="text-2xl">({rating})</div>
      
    </section>
  );
}
            {/* <CiStar 
            className=" p-4  cursor-pointer"
            style={{ backgroundColor: handleRating(star) }}
            key={i}
            onClick={() => {
              setRating(star);
            }}
            onMouseEnter={() => {
              setHover(star);
            }}
            onMouseLeave={() => {
              setHover(0);
            }}
          /> */}