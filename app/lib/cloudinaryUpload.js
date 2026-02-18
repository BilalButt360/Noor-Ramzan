// lib/cloudinaryUpload.js
export const uploadToCloudinary = async (base64Image) => {
  try {
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    // Base64 se data part nikaalo
    const base64Data = base64Image.split(',')[1];
    
    // Form data banao
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Data}`);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'profile-pictures');
    
    // Cloudinary API call
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (data.secure_url) {
      return { 
        success: true, 
        url: data.secure_url,
        publicId: data.public_id 
      };
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};