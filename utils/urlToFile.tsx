export const convertUrlToFile = async ({ fileUrl, fileName = "image.png", fileType = "image/png" }: { fileUrl: string, fileName?: string, fileType?: string }) => {
    // Fetch the image from the URL as a Blob
    const response = await fetch(fileUrl);
    if (response.ok) {
        const blob = await response.blob();
        return new File([blob], fileName, { type: fileType });
    }

    return null;
}