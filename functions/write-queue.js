// Système de file d'attente pour les écritures GitHub
class WriteQueue {
    constructor() {
        this.queue = new Map();
        this.processing = new Map();
    }

    // Ajouter une opération d'écriture à la file d'attente
    async enqueue(collection, operation) {
        if (!this.queue.has(collection)) {
            this.queue.set(collection, []);
        }

        return new Promise((resolve, reject) => {
            this.queue.get(collection).push({
                operation,
                resolve,
                reject
            });

            // Démarrer le traitement si ce n'est pas déjà en cours
            if (!this.processing.get(collection)) {
                this.processQueue(collection);
            }
        });
    }

    // Traiter la file d'attente pour une collection
    async processQueue(collection) {
        if (this.processing.get(collection)) return;
        this.processing.set(collection, true);

        while (this.queue.get(collection)?.length > 0) {
            const item = this.queue.get(collection)[0];
            try {
                const result = await item.operation();
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
            this.queue.get(collection).shift();
        }

        this.processing.set(collection, false);
    }

    // Vérifier si une collection est en cours de traitement
    isProcessing(collection) {
        return this.processing.get(collection) || false;
    }

    // Obtenir la longueur de la file d'attente pour une collection
    getQueueLength(collection) {
        return this.queue.get(collection)?.length || 0;
    }

    // Vider la file d'attente d'une collection (en cas d'erreur)
    clearQueue(collection) {
        const queue = this.queue.get(collection);
        if (queue) {
            queue.forEach(item => {
                item.reject(new Error('Queue cleared due to critical error'));
            });
            this.queue.set(collection, []);
        }
        this.processing.set(collection, false);
    }
}

// Instance unique de la file d'attente
const writeQueue = new WriteQueue();

module.exports = writeQueue;
