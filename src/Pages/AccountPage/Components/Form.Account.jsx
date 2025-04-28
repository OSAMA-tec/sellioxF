import React from "react";
import PaymentForm from "../../../Components/PaymentForm/PaymentForm";
import CardsContainer from "../../../Components/CardsContainer/CardsContainer";
import MyCard from "../../../Components/Card/MyCard";

export default function FormAccount({
  isExpanded,
  handleExpanded,
  refetchCredits,
}) {
  return (
    <div
      className={`fixed w-screen inset-0 z-9999 flex justify-center items-center overflow-y-auto touch-auto ${
        !isExpanded ? "hidden" : ""
      } `}
    >
      <div
        className="w-full h-full absolute z-20 bg-black opacity-40"
        onClick={handleExpanded}
      ></div>
      <div
        className={`bg-white shadow-2xl rounded-lg w-3/6 flex-col px-4 py-6 relative z-30 my-8 max-h-[90vh] overflow-y-auto touch-auto md:w-3/6 w-[80%] ${
          isExpanded ? "flex" : "hidden"
        }`}
      >
        <h3>add card details</h3> 
        <MyCard
          handleExpanded={handleExpanded}
          refetchCredits={refetchCredits}
        />
      </div>
    </div>
  );
}
