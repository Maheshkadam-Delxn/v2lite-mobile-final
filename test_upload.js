const fs = require('fs');
const crypto = require('crypto');

const CLOUDINARY_CONFIG = {
    cloudName: "dfyu429bz",
    apiKey: "612156488574362",
    apiSecret: "DcFnMTRrULw1wzIOVU0JQICdEQ4",
};

const generateSignature = (timestamp) => {
    // Alphabetical order: access_mode, timestamp
    const stringToSign = `access_mode=public&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    return crypto.createHash('sha1').update(stringToSign).digest('hex');
};

const uploadToCloudinary = async () => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = generateSignature(timestamp);
        const filePath = './src/assets/flow.pdf';

        if (!fs.existsSync(filePath)) {
            throw new Error("Test file not found");
        }

        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer], { type: 'application/pdf' });

        const formData = new FormData();
        formData.append("file", blob, "flow.pdf");
        formData.append("access_mode", "public");
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("api_key", CLOUDINARY_CONFIG.apiKey);

        // Endpoint: raw/upload
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/raw/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (response.ok && result.secure_url) {
            console.log("ResourceType: " + result.resource_type);
            console.log("Access Mode: " + result.access_mode);
            fs.writeFileSync('url.txt', result.secure_url);
            console.log("URL written to url.txt");
        } else {
            console.log("FAILED to upload: " + JSON.stringify(result));
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
};

uploadToCloudinary();
