import { GeneratedImage } from "../types";

type StoredImage = GeneratedImage & { id: string };

const DB_NAME = "artflow-db";
const DB_VERSION = 1;
const STORE_NAME = "images";

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const runStore = async <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const createId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export const saveImage = async (image: GeneratedImage): Promise<string> => {
  const id = createId();
  const record: StoredImage = { id, ...image };
  await runStore("readwrite", (store) => store.put(record));
  return id;
};

export const saveImages = async (images: GeneratedImage[]): Promise<string[]> => {
  const ids: string[] = [];
  for (const image of images) {
    const id = await saveImage(image);
    ids.push(id);
  }
  return ids;
};

export const getImage = async (id: string): Promise<GeneratedImage | null> => {
  const result = await runStore<StoredImage | undefined>("readonly", (store) => store.get(id));
  if (!result) return null;
  return { base64: result.base64, mimeType: result.mimeType };
};

export const getImages = async (ids: string[]): Promise<GeneratedImage[]> => {
  const results: GeneratedImage[] = [];
  for (const id of ids) {
    const image = await getImage(id);
    if (image) results.push(image);
  }
  return results;
};

export const deleteImage = async (id: string): Promise<void> => {
  await runStore("readwrite", (store) => store.delete(id));
};

export const deleteImages = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    await deleteImage(id);
  }
};

export const clearImageStore = async (): Promise<void> => {
  await runStore("readwrite", (store) => store.clear());
};
