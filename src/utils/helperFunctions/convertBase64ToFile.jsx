export default function base64ToFile(base64String, fileName) {
  if(typeof base64String === "string"){
  // Split the Base64 string to get the actual data (ignoring the "data:*/*;base64," prefix)
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type
  const bstr = atob(arr[1]); // Decode Base64 string to binary data
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n); // Convert binary string to array
  }

  // Create a File object
  return new File([u8arr], fileName, { type: mime });
    }
    
  }
  