// import * as Crypto from 'expo-crypto';

// // ⚠️ BEST PRACTICE:
// // In production, DO NOT expose apiSecret in frontend.
// // This matches your current setup for now.
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// export const generateSignature = async (timestamp) => {
//   const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
//   return await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA1,
//     stringToSign
//   );
// };

// export const uploadToCloudinary = async (fileUri) => {
//   try {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const signature = await generateSignature(timestamp);

//     const filename = fileUri.split('/').pop();
//     const match = /\.(\w+)$/.exec(filename || '');
//     const type = match ? `image/${match[1]}` : 'image/jpeg';

//     const formData = new FormData();
//     formData.append('file', {
//       uri: fileUri,
//       type,
//       name: filename,
//     });
//     formData.append('timestamp', timestamp.toString());
//     formData.append('signature', signature);
//     formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     const result = await response.json();

//     if (response.ok && result.secure_url) {
//       return {
//         success: true,
//         url: result.secure_url,
//         publicId: result.public_id,
//       };
//     }

//     throw new Error(result.error?.message || 'Upload failed');
//   } catch (error) {
//     console.error('Cloudinary Upload Error:', error);
//     return { success: false, error: error.message };
//   }
// };


import * as Crypto from "expo-crypto";

const CLOUDINARY_CONFIG = {
  cloudName: "dfyu429bz",
  apiKey: "612156488574362",
  apiSecret: "DcFnMTRrULw1wzIOVU0JQICdEQ4", // ⚠️ frontend only for now
};

/* =========================
   Generate SHA-1 Signature
========================= */
export const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;

  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
};

/* =========================
   Upload to Cloudinary
   (PDF + Image safe)
========================= */
export const uploadToCloudinary = async (file) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const fileUri = file.uri || file;
    const filename = file.name || fileUri.split("/").pop() || `file_${timestamp}`;

    // ✅ CORRECT MIME TYPE HANDLING
    const extension = filename.split(".").pop()?.toLowerCase();
    let mimeType = "application/octet-stream";

    if (extension === "pdf") mimeType = "application/pdf";
    else if (["jpg", "jpeg"].includes(extension)) mimeType = "image/jpeg";
    else if (extension === "png") mimeType = "image/png";

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: mimeType,
      name: filename,
    });

    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);

    // ✅ auto/upload supports both images & PDFs
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    console.log("Cloudinary response:", result);

    if (response.ok && result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    throw new Error(result.error?.message || "Cloudinary upload failed");
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
