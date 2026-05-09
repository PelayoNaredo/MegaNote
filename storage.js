/**
 * MegaNote - storage.js
 * Módulo de persistencia para la aplicación de notas.
 * Maneja la comunicación con localStorage y la serialización de datos.
 */

const StorageModule = (function () {
    "use strict";

    const STORAGE_KEY = "meganote_data_v1";

    /**
     * Obtiene todas las notas almacenadas.
     * @returns {Array} Arreglo de objetos de nota.
     */
    function getNotes() {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (!rawData) return [];
            
            const parsedData = JSON.parse(rawData);
            return Array.isArray(parsedData) ? parsedData : [];
        } catch (error) {
            console.error("[Storage] Error al leer de localStorage:", error);
            return [];
        }
    }

    /**
     * Sobrescribe el almacenamiento con un nuevo arreglo de notas.
     * @param {Array} notes - El arreglo completo de notas.
     */
    function saveNotes(notes) {
        try {
            const dataToSave = JSON.stringify(notes);
            localStorage.setItem(STORAGE_KEY, dataToSave);
        } catch (error) {
            console.error("[Storage] Error al guardar en localStorage:", error);
        }
    }

    /**
     * Añade una nueva nota al almacenamiento.
     * @param {Object} note - Objeto de nota (id, title, content, date).
     */
    function addNote(note) {
        const notes = getNotes();
        notes.unshift(note); // Añadir al principio
        saveNotes(notes);
    }

    /**
     * Actualiza una nota existente.
     * @param {string|number} id - Identificador único de la nota.
     * @param {Object} changes - Campos a actualizar.
     */
    function updateNote(id, changes) {
        const notes = getNotes();
        const index = notes.findIndex(n => n.id === id);
        
        if (index !== -1) {
            notes[index] = { ...notes[index], ...changes, updatedAt: new Date().toISOString() };
            saveNotes(notes);
        }
    }

    /**
     * Elimina una nota por su ID.
     * @param {string|number} id - Identificador único de la nota.
     */
    function deleteNote(id) {
        const notes = getNotes();
        const filteredNotes = notes.filter(n => n.id !== id);
        saveNotes(filteredNotes);
    }

    // API Pública del módulo
    return {
        getNotes,
        saveNotes,
        addNote,
        updateNote,
        deleteNote
    };
})();

// Exportación para uso global o modular
if (typeof module !== "undefined" && module.exports) {
    module.exports = StorageModule;
} else {
    window.StorageModule = StorageModule;
}