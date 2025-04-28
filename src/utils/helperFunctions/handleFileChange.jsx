import convertToBase64 from "./convertToBase64";


export  const handleFileChange = async(event,setSelectedLogo,setValue) => {
    const file = event.target.files[0];
    
    if (file) {
    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file);

    
    setSelectedLogo(previewUrl);
    if(setValue){
    // convert file to base64
    setValue("logo",file)
    }
    
  };
}