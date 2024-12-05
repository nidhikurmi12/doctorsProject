import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const uploadFiles = async (
  files: File[],
  path: string
): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  try {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `${path}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error('Failed to upload files');
  }
};

export const uploadMultipleFileTypes = async (
  files: Record<string, File[]>,
  basePath: string
): Promise<Record<string, string[]>> => {
  if (!files || Object.keys(files).length === 0) return {};

  const uploadedUrls: Record<string, string[]> = {};

  try {
    for (const [key, fileList] of Object.entries(files)) {
      if (fileList && fileList.length > 0) {
        const urls = await uploadFiles(fileList, `${basePath}/${key}`);
        uploadedUrls[key] = urls;
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading multiple file types:', error);
    throw new Error('Failed to upload files');
  }
};