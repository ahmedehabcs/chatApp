function openDB() {
    return new Promise((resolve, reject) => {
        const dbReq = indexedDB.open("KeyDB", 1);
        dbReq.onupgradeneeded = () => {
            dbReq.result.createObjectStore("keys");
        };
        dbReq.onsuccess = () => resolve(dbReq.result);
        dbReq.onerror = () => reject("Failed to open IndexedDB");
    });
}

// Save private key
export async function savePrivateKey(key) {
    const db = await openDB();
    const tx = db.transaction("keys", "readwrite");
    tx.objectStore("keys").put(key, "privateKey");
    return tx.complete;
}

// Load private key
export async function getPrivateKey() {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction("keys", "readonly");
        const req = tx.objectStore("keys").get("privateKey");
        req.onsuccess = () => resolve(req.result || null);
    });
}

// Delete the whole IndexedDB database
export function clearDB() {
    return new Promise((resolve, reject) => {
        const openReq = indexedDB.open("KeyDB", 1);
        openReq.onsuccess = () => {
            const db = openReq.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.close();
                resolve(false);
                return;
            }
            const tx = db.transaction("keys", "readonly");
            const store = tx.objectStore("keys");
            const getReq = store.get("privateKey");
            getReq.onsuccess = () => {
                if (getReq.result) {
                    db.close();
                    const deleteReq = indexedDB.deleteDatabase("KeyDB");
                    deleteReq.onsuccess = () => resolve(true);
                    deleteReq.onerror = () => reject("Failed to delete IndexedDB");
                    deleteReq.onblocked = () => reject("Delete blocked: DB in use");
                } else {
                    db.close();
                    resolve(false);
                }
            };
        };
        openReq.onerror = () => reject("Failed to open IndexedDB");
    });
}