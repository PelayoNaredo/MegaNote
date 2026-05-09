/* =========================================================
   MegaNote - main.js
   Lógica CRUD y Renderizado Dinámico.
   Sprint 2: Implementación de la interactividad y persistencia.
   ========================================================= */

(function () {
    "use strict";

    // Elementos del DOM
    const noteForm = document.getElementById("note-form");
    const noteTitleInput = document.getElementById("note-title");
    const noteContentInput = document.getElementById("note-content");
    const noteContainer = document.getElementById("note-container");

    /**
     * Inicializa la aplicación.
     */
    function init() {
        renderNotes();
        setupEventListeners();
        console.log("[MegaNote] App inicializada con éxito.");
    }

    /**
     * Configura los escuchadores de eventos principales.
     */
    function setupEventListeners() {
        // Evento para guardar nueva nota
        noteForm.addEventListener("submit", handleFormSubmit);

        // Delegación de eventos para acciones en las notas (Eliminar y Editar)
        noteContainer.addEventListener("click", handleNoteActions);
        
        // Evento para edición inline (blur)
        noteContainer.addEventListener("focusout", handleInlineEdit);
    }

    /**
     * Maneja el envío del formulario.
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (title && content) {
            const newNote = {
                id: Date.now(),
                title: title,
                content: content,
                createdAt: new Date().toISOString()
            };

            StorageModule.addNote(newNote);
            renderNotes();
            noteForm.reset();
            noteTitleInput.focus();
        }
    }

    /**
     * Maneja las acciones de los botones dentro de las notas.
     */
    function handleNoteActions(e) {
        const target = e.target;
        
        // Acción Eliminar
        if (target.classList.contains("btn-delete")) {
            const noteId = parseInt(target.closest(".note-item").dataset.id);
            if (confirm("¿SEGURO QUE QUIERES ELIMINAR ESTA NOTA?")) {
                StorageModule.deleteNote(noteId);
                renderNotes();
            }
        }
    }

    /**
     * Maneja la edición inline cuando el usuario deja de hacer foco en un elemento editable.
     */
    function handleInlineEdit(e) {
        const target = e.target;
        const noteElement = target.closest(".note-item");
        
        if (!noteElement) return;

        const noteId = parseInt(noteElement.dataset.id);
        const isTitle = target.tagName === "H3";
        const isContent = target.tagName === "P";

        if (isTitle || isContent) {
            const changes = isTitle 
                ? { title: target.innerText.trim() } 
                : { content: target.innerText.trim() };
            
            StorageModule.updateNote(noteId, changes);
        }
    }

    /**
     * Renderiza todas las notas en el contenedor.
     */
    function renderNotes() {
        const notes = StorageModule.getNotes();
        
        if (notes.length === 0) {
            noteContainer.innerHTML = `
                <div class="empty-state">
                    <p>NO HAY NOTAS. COMIENZA A ESCRIBIR.</p>
                </div>
            `;
            return;
        }

        noteContainer.innerHTML = notes.map(note => `
            <article class="brutalist-card note-item" data-id="${note.id}">
                <h3 contenteditable="true" spellcheck="false">${note.title}</h3>
                <p contenteditable="true" spellcheck="false">${note.content}</p>
                <div class="note-actions">
                    <button class="btn-delete" title="Eliminar nota">ELIMINAR</button>
                </div>
            </article>
        `).join("");
    }

    // Arranque de la aplicación
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();