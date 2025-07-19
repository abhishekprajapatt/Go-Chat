export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-profile`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadFile;