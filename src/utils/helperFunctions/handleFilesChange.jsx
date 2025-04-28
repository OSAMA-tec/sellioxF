/* export default  async function handleFilesChange(e,setSelectedFiles,setValue,getValues){
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file)); // Generate URLs for files
    // Convert all files to Base64 and wait for all promises to resolve
    const files64base = await Promise.all(
    files.map((file) => convertToBase64(file)) // Convert each file to Base64
    );
    setSelectedFiles((prevFiles) => [...prevFiles, ...fileURLs]); 
     // Retrieve the current value of 'serviceImages' from the form state
    const currentBase64Files = getValues("serviceImages") || [];
     // Use setValue to update the 'serviceImages' field in React Hook Form
     setValue("serviceImages", [...currentBase64Files, ...files64base]);
}
 */
export default async function handleFilesChange(e, setSelectedFiles, setValue, getValues,maxImages =5) {
    const files = Array.from(e.target.files);
    const existingFiles = getValues("serviceImages") || []; // Get existing files 

    if (existingFiles.length + files.length > maxImages) {
        alert(`You can upload a maximum of ${maxImages} images.`);
        return;
    }

    const fileURLs = files.map((file) => URL.createObjectURL(file)); // Generate URLs for files
   /*  const files64base = await Promise.all(files.map((file) => convertToBase64(file))); */

    setSelectedFiles((prevFiles) => [...prevFiles, ...fileURLs]); // Update preview
    setValue("serviceImages", [...existingFiles, ...files]); // Update form data
   /*  setValue("serviceImages", [...existingFiles, ...files64base]); // Update form data */
}
