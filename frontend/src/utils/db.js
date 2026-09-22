const DB_NAME = 'MontageStudioDB';
const STORE_NAME = 'images';

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function setStoredImage(key, base64OrBlob) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(base64OrBlob, key);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  } catch (e) {
    console.error('Failed to store image in IndexedDB:', e);
  }
}

export async function getStoredImage(key) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
    });
  } catch (e) {
    console.error('Failed to retrieve image from IndexedDB:', e);
    return null;
  }
}

export async function clearStoredImages() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  } catch (e) {
    console.error('Failed to clear IndexedDB:', e);
  }
}
