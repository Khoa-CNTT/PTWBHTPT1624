const convertBlobToFile = async (blobUrl: string, fileName = "image.jpg") => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  export default convertBlobToFile