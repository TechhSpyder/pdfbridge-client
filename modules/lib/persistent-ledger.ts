/**
 * Failsafe Local Ledger (IndexedDB)
 * 
 * Prevents Ghost Settlements by caching the transaction signatures deterministically 
 * within the cold storage of the browser. This survives page reloads, tab crashes, 
 * and network dropouts.
 */

const DB_NAME = "PDFBridgeSettlementHub";
const STORE_NAME = "intentSignatures";
const DB_VERSION = 1;

function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "intentId" });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export const PersistentLedger = {
  /**
   * Caches a signature for a specific intent ID.
   */
  async saveSignature(intentId: string, signature: string): Promise<void> {
    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        
        const timestamp = Date.now();
        const request = store.put({ intentId, signature, timestamp });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e: any) {
      console.warn("[PERSISTENT LEDGER] Failed to save signature cache:", e.message);
    }
  },

  /**
   * Retrieves a cached signature for a specific intent ID.
   */
  async getSignature(intentId: string): Promise<string | null> {
    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(intentId);

        request.onsuccess = (event: any) => {
          if (event.target.result) {
            resolve(event.target.result.signature);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => resolve(null); // Return null rather than blowing up execution
      });
    } catch (e: any) {
      console.warn("[PERSISTENT LEDGER] Failed to read signature cache:", e.message);
      return null;
    }
  },

  /**
   * Purges an intent from the local cache once successfully reconciled on the backend.
   */
  async clearSignature(intentId: string): Promise<void> {
    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(intentId);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e: any) {
      console.warn("[PERSISTENT LEDGER] Failed to clear signature cache:", e.message);
    }
  }
};
