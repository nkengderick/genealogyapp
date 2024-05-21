import { useState } from 'react';

const useImgbb = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (image) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${'604e1ea29e9116c7b0b6c38531934a9d'}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.data.url);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { imageUrl, loading, error, uploadImage };
};

export default useImgbb;
