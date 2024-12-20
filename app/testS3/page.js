'use client';

import { useState } from 'react';

export default function Page() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // 新增 state 用來顯示圖片

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    const response = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type, userId: 5 }),
    });

    if (response.ok) {
      const { url, fields } = await response.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        alert('Upload successful!');

        // 通過文件的 Key 獲取預簽名的讀取 URL
        const getUrlResponse = await fetch(`/api/test?key=${fields.key}`);

        if (getUrlResponse.ok) {
          const { signedUrl } = await getUrlResponse.json();
          setImageUrl(signedUrl); // 更新圖片顯示的 URL
        } else {
          console.error('Error generating signed URL for image.');
          alert('Failed to generate image URL.');
        }
      } else {
        console.error('S3 Upload Error:', uploadResponse);
        alert('Upload failed.');
      }
    } else {
      alert('Failed to get pre-signed URL.');
    }

    setUploading(false);
  };

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setFile(files[0]);
            }
          }}
          accept="image/png, image/jpeg"
        />
        <button type="submit" disabled={uploading}>
          Upload
        </button>
      </form>

      {imageUrl && (
        <div>
          <h2>Uploaded Image</h2>
          <img src={imageUrl} alt="Uploaded file" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </div>
      )}
    </main>
  );
}
