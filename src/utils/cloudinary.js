import * as Crypto from "expo-crypto";

// Use environment variables or fallback to provided defaults
const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "dfyu429bz",
  apiKey: process.env.CLOUDINARY_API_KEY || "612156488574362",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "DcFnMTRrULw1wzIOVU0JQICdEQ4",
};

/**
 * Generate SHA-1 Signature for Cloudinary API
 */
export const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
};

/**
 * Upload a file (image or PDF) to Cloudinary
 */
export const uploadToCloudinary = async (file) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const fileUri = file.uri || file;
    const filename = file.name || fileUri.split("/").pop() || `file_${timestamp}`;

    // Map extension to MIME type
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
