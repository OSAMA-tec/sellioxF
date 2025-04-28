import React, { Suspense, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import { FaChevronRight ,FaChevronLeft} from "react-icons/fa";
import { getCategoryIcon } from '../../utils/helperFunctions/getCategoryIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchSubCategory } from '../../redux/slices/search.slice';
const Swiper = React.memo((
    {
    slides=[],
    itemsPerView = 7,
    setSelectedCategory,
    selectedCategory
    })=>{
    const searchCategory = useSelector(state=>state.search.category);
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalPages = Math.ceil(slides.length / itemsPerView ) ;
    const handlePrev = () => {
        setCurrentIndex((index)=>index -1);
    };
    const handleNext = () => {
        setCurrentIndex((index)=>index +1);
    };

    const handleSetCategory = (category)=>{      
      if(searchCategory === category){
        dispatch(setSearchSubCategory(""))
      }else{
        dispatch(setSearchSubCategory({category}))
      } 
    }
    const slicedSlide = slides?.slice(currentIndex, currentIndex+itemsPerView);
    
    return (
        <div className='capitalize flex items-center'>
          <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0} 
          className='bg-blue-300 p-2 rounded-full hover:bg-blue-500 disabled:bg-blue-300'>
            <FaChevronLeft />
          </button>
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full gap-5`}>
        <Suspense  fallback={<Spinner />}>
            {slicedSlide && slicedSlide?.map((p,i)=>{
              const Icon = getCategoryIcon(p.header); 
            return(
                <div 
                onClick={()=>handleSetCategory(p.header)}
                key={i} 
                className={`flex flex-col items-center  gap-2 hover:text-inputAccent2 hover:cursor-pointer ${searchCategory === p.header ?"!text-primaryA0" :""} `}>
                   <Icon size={24} className="text-grayAccent1" />
                  {/* <span>{p.icon}</span> */}
                  <span className='text-center'>{p.header}</span>
                </div>  
            )})}
        </Suspense>
        </div>
        <button 
        onClick={handleNext} 
        disabled={currentIndex === slides.length -itemsPerView} 
        className='bg-blue-300 p-2 rounded-full hover:bg-blue-500 disabled:bg-blue-300'>
          <FaChevronRight />
        </button>
        </div>
        );
});

export default Swiper;
