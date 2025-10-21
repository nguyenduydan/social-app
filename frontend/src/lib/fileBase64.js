export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) {
            return reject(new Error("Input must be a File or Blob"));
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
