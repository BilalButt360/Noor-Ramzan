// lib/imageUpload.js

/**
 * Compress and convert image to base64 within Firebase limits
 * Firebase Auth photoURL max length: 2048 characters
 * We'll compress to ensure base64 stays under this limit
 */

export const compressImage = async (file, maxSizeKB = 100) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions (max 400x400)
        const maxDim = 400
        if (width > height) {
          if (width > maxDim) {
            height = (height * maxDim) / width
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = (width * maxDim) / height
            height = maxDim
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Start with quality 0.7 and reduce if needed
        let quality = 0.7
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        
        // Keep reducing quality until under size limit
        while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        
        // Final check - if still too large, make it smaller
        if (dataUrl.length > maxSizeKB * 1024) {
          const smallerCanvas = document.createElement('canvas')
          smallerCanvas.width = width * 0.7
          smallerCanvas.height = height * 0.7
          const smallerCtx = smallerCanvas.getContext('2d')
          smallerCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height)
          dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.5)
        }
        
        resolve(dataUrl)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB original file limit
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image (JPG, PNG, GIF, or WebP)' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 10MB' }
  }
  
  return { valid: true }
}