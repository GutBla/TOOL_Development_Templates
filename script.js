// =============================================
// CONFIGURACIÓN E INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeCarousel();
    analyzeColorContrast();
    setupTemplateEventListeners();
});

/**
 * Inicializa todos los datepickers de la aplicación
 */
function initializeDatePickers() {
    // Configuración para campos de fecha
    flatpickr("input[placeholder='Seleccione fecha']", {
        locale: "es",
        dateFormat: "d/m/Y",
        allowInput: true
    });
    
    // Configuración para campos de hora
    flatpickr("input[placeholder='Seleccione hora']", {
        locale: "es",
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        allowInput: true
    });
    
    // Configuración para campos de fecha en tablas
    flatpickr("td .flatpickr-input", {
        locale: "es",
        dateFormat: "d/m/Y",
        allowInput: true
    });
}

/**
 * Configura event listeners específicos de plantillas
 */
function setupTemplateEventListeners() {
    // Inicializar templates específicos después de un delay
    setTimeout(() => {
        const activeTemplate = document.querySelector('.template-container[style*="display: block"]');
        if (activeTemplate) {
            const templateId = activeTemplate.id.replace('-template', '');
            initializeSpecificTemplate(templateId);
        }
    }, 500);
}

// =============================================
// GESTIÓN DEL CARRUSEL
// =============================================

/**
 * Inicializa y configura el carrusel de plantillas
 */
function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 40;

    /**
     * Actualiza la posición del carrusel y la navegación
     */
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentIndex / 3));
        });
    }

    // Event listeners para navegación
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 3) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Event listeners para puntos de navegación
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index * 3;
            updateCarousel();
        });
    });
    
    // Efectos hover para las tarjetas
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    updateCarousel();
}

// =============================================
// UTILIDADES DE COLOR Y CONTRASTE
// =============================================

/**
 * Calcula la luminosidad de un color hexadecimal
 */
function getLuminance(hexColor) {
    let r = 0, g = 0, b = 0;
    if (hexColor.length === 7) {
        r = parseInt(hexColor.substr(1, 2), 16);
        g = parseInt(hexColor.substr(3, 2), 16);
        b = parseInt(hexColor.substr(5, 2), 16);
    }
    
    const rsrgb = r / 255;
    const gsrgb = g / 255;
    const bsrgb = b / 255;
    
    const rLinear = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const gLinear = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const bLinear = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determina si un color es claro (necesita texto oscuro)
 */
function isLightColor(hexColor) {
    const luminance = getLuminance(hexColor);
    return luminance > 0.5;
}

/**
 * Analiza y ajusta colores de todas las tarjetas
 */
function analyzeColorContrast() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const cardBackground = card.querySelector('.card-background');
        const computedStyle = window.getComputedStyle(cardBackground);
        const bgColor = computedStyle.backgroundColor;
        
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const hexColor = '#' + 
                parseInt(rgb[0]).toString(16).padStart(2, '0') +
                parseInt(rgb[1]).toString(16).padStart(2, '0') +
                parseInt(rgb[2]).toString(16).padStart(2, '0');
            
            if (isLightColor(hexColor)) {
                card.classList.add('light-background');
            }
        }
    });
}

// =============================================
// GESTIÓN DE PLANTILLAS
// =============================================

/**
 * Muestra una plantilla específica y oculta las demás
 */
function showTemplate(templateId) {
    // Ocultar todas las plantillas
    document.querySelectorAll('.template-container').forEach(template => {
        template.style.display = 'none';
    });
    
    // Ocultar elementos principales
    document.querySelector('.carousel-container').style.display = 'none';
    document.querySelector('.hero h2').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    // Mostrar plantilla seleccionada
    document.getElementById(templateId + '-template').style.display = 'block';
    
    // Inicializar plantillas específicas
    initializeSpecificTemplate(templateId);
}

/**
 * Inicializa funcionalidades específicas de cada plantilla
 */
function initializeSpecificTemplate(templateId) {
    switch(templateId) {
        case 'roadmap':
            setTimeout(() => generateRoadmapChart(), 500);
            break;
        case 'definition-ready':
            setTimeout(() => {
                calculateDoRStatus();
                initializeDoRChecklist();
            }, 500);
            break;
        case 'definition-done':
            setTimeout(() => {
                calculateDoDStatus();
                initializeDoDChecklist();
            }, 500);
            break;
        case 'requirements':
        case 'traceability':
        case 'planning-poker':
        case 'change-request':
        case 'architecture-decision':
            // No necesitan inicialización especial
            break;
    }
}

/**
 * Oculta todas las plantillas y muestra la vista principal
 */
function hideTemplates() {
    document.querySelectorAll('.template-container').forEach(template => {
        template.style.display = 'none';
    });
    
    document.querySelector('.carousel-container').style.display = 'block';
    document.querySelector('.hero h2').style.display = 'block';
    document.querySelector('.header').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
}

// =============================================
// GESTIÓN DE TABLAS
// =============================================

/**
 * Agrega una nueva fila a una tabla
 */
function addRow(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const lastRow = tbody.lastElementChild;
    const newRow = lastRow.cloneNode(true);
    
    // Limpiar valores
    newRow.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type !== 'radio') {
            input.value = '';
        }
    });

    // Re-inicializar flatpickr en nuevos campos
    initializeDatePickersInRow(newRow);

    tbody.appendChild(newRow);
    
    // Actualizaciones específicas por tabla
    handleTableSpecificUpdates(tableId);
    
    showNotification('Fila añadida correctamente');
}

/**
 * Inicializa datepickers en una fila específica
 */
function initializeDatePickersInRow(row) {
    row.querySelectorAll('.flatpickr-input').forEach(input => {
        if (input.getAttribute('placeholder') === 'Seleccione fecha') {
            flatpickr(input, {
                locale: "es",
                dateFormat: "d/m/Y",
                allowInput: true
            });
        } else if (input.getAttribute('placeholder') === 'Seleccione hora') {
            flatpickr(input, {
                locale: "es",
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                allowInput: true
            });
        }
    });
}

/**
 * Maneja actualizaciones específicas por tipo de tabla
 */
function handleTableSpecificUpdates(tableId) {
    const updateHandlers = {
        'planning-table': updateEstimationTotal,
        'sprintbacklog-table': updateSprintEstimationTotal,
        'dor-criteria-table': updateDoRChecklistNumbers,
        'dor-checklist-table': updateDoRChecklistNumbers,
        'dod-criteria-table': updateDoDChecklistNumbers,
        'dod-checklist-table': updateDoDChecklistNumbers
    };
    
    if (updateHandlers[tableId]) {
        updateHandlers[tableId]();
        
        // Para checklists, agregar event listeners adicionales
        if (tableId.includes('checklist')) {
            initializeChecklistRow(tableId);
        }
    }
}

/**
 * Elimina la última fila de una tabla
 */
function removeRow(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    if (rows.length > 1) {
        tbody.removeChild(rows[rows.length - 1]);
        showNotification('Fila eliminada correctamente');
        handleTableSpecificUpdates(tableId);
    } else {
        showNotification('Debe haber al menos una fila en la tabla');
    }
}

// =============================================
// CÁLCULOS Y ACTUALIZACIONES DE TABLAS
// =============================================

/**
 * Actualiza el total de estimación en Sprint Planning
 */
function updateEstimationTotal() {
    const estimationInputs = document.querySelectorAll('#planning-table .estimation-point');
    let total = 0;
    
    estimationInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
    });
    
    document.getElementById('estimation-total').textContent = total;
}

/**
 * Actualiza el total de estimación en Sprint Backlog
 */
function updateSprintEstimationTotal() {
    const estimationInputs = document.querySelectorAll('#sprintbacklog-table .sprint-estimation-point');
    let total = 0;
    
    estimationInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
    });
    
    document.getElementById('sprint-estimation-total').textContent = total;
}

// =============================================
// GESTIÓN DE ARCHIVOS E IMÁGENES
// =============================================

/**
 * Previsualiza una imagen cargada
 */
function previewImage(input, previewId, containerId) {
    const preview = document.getElementById(previewId);
    const container = document.getElementById(containerId);
    const label = document.getElementById(containerId.replace('container', 'label'));
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            label.style.display = 'none';
            container.querySelector('.remove-image-btn').style.display = 'flex';
        }
        
        reader.readAsDataURL(file);
        showNotification('Imagen cargada correctamente');
    }
}

/**
 * Elimina una imagen previsualizada
 */
function removeImage(inputId, previewId, containerId, labelId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const container = document.getElementById(containerId);
    const label = document.getElementById(labelId);
    
    input.value = '';
    preview.src = '';
    preview.style.display = 'none';
    label.style.display = 'block';
    container.querySelector('.remove-image-btn').style.display = 'none';
    
    showNotification('Imagen eliminada correctamente');
}

/**
 * Maneja la previsualización de múltiples archivos
 */
function previewMultipleFiles(input, listId) {
    const filesList = document.getElementById(listId);
    filesList.innerHTML = '';
    
    if (input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.style.cssText = 'padding: 5px; margin: 2px 0; background: #f1f5f9; border-radius: 4px; font-size: 0.8rem;';
            fileItem.innerHTML = `
                <i class="fas fa-file"></i> ${file.name} 
                <button onclick="removeFileFromList(${index}, '${input.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            filesList.appendChild(fileItem);
        });
        showNotification(`${input.files.length} archivo(s) cargado(s) correctamente`);
    }
}

/**
 * Elimina un archivo de la lista de previsualización
 */
function removeFileFromList(index, inputId) {
    const input = document.getElementById(inputId);
    const dt = new DataTransfer();
    
    Array.from(input.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    input.files = dt.files;
    const event = new Event('change');
    input.dispatchEvent(event);
}

// Funciones específicas para tipos de archivo
function previewUserStoryFiles(input) {
    previewMultipleFiles(input, 'userstory-files-list');
}

function previewBugFiles(input) {
    previewMultipleFiles(input, 'bug-files-list');
}

function previewTaskFiles(input) {
    previewMultipleFiles(input, 'task-files-list');
}

function previewTestCaseFiles(input) {
    previewMultipleFiles(input, 'testcase-files-list');
}

// =============================================
// EXPORTACIÓN Y CAPTURA
// =============================================

/**
 * Captura una plantilla como imagen
 */
function captureTemplate(templateId) {
    // Ocultar elementos de interfaz antes de capturar
    const elementsToHide = [
        ...document.querySelectorAll('.simple-add-row'),
        ...document.querySelectorAll('.simple-remove-row'),
        ...document.querySelectorAll('.btn-container'),
        ...document.querySelectorAll('.icon-btn')
    ];
    
    elementsToHide.forEach(element => {
        element.style.display = 'none';
    });
    
    const element = document.getElementById(templateId);
    
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = templateId + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Imagen guardada con éxito');
        
        // Restaurar elementos de interfaz
        elementsToHide.forEach(element => {
            element.style.display = '';
        });
    });
}

/**
 * Exporta una plantilla a formato Markdown
 */
function exportToMarkdown(templateId) {
    const template = document.getElementById(templateId);
    let markdown = '';
    
    // Título de la plantilla
    const title = template.querySelector('.template-title').textContent;
    markdown += `# ${title}\n\n`;
    
    // Campos del formulario
    const inputs = template.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type !== 'radio' || (input.type === 'radio' && input.checked)) {
            const label = input.closest('.form-item')?.querySelector('label');
            if (label && input.value) {
                markdown += `**${label.textContent}:** ${input.value}\n\n`;
            }
        }
    });
    
    // Datos de tablas
    const tables = template.querySelectorAll('table');
    tables.forEach(table => {
        const headers = [];
        table.querySelectorAll('thead th').forEach(header => {
            headers.push(header.textContent);
        });
        
        markdown += `### ${table.previousElementSibling?.textContent || 'Tabla'}\n\n`;
        markdown += '| ' + headers.join(' | ') + ' |\n';
        markdown += '|' + headers.map(() => '---').join('|') + '|\n';
        
        table.querySelectorAll('tbody tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td input, td textarea, td select').forEach(cell => {
                if (cell.tagName === 'SELECT') {
                    rowData.push(cell.options[cell.selectedIndex]?.text || '');
                } else {
                    rowData.push(cell.value);
                }
            });
            markdown += '| ' + rowData.join(' | ') + ' |\n';
        });
        
        markdown += '\n';
    });
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(markdown).then(() => {
        showNotification('Markdown copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar: ', err);
        showNotification('Error al copiar Markdown');
    });
}

// =============================================
// GESTIÓN DE EQUIPOS Y PARTICIPANTES
// =============================================

/**
 * Genera opciones de Scrum Master a partir de participantes
 */
function generateScrumMasterOptions(participantsTextareaId, scrumMasterSelectId, icon = 'fas fa-user') {
    const textarea = document.getElementById(participantsTextareaId);
    const select = document.getElementById(scrumMasterSelectId);
    
    // Limpiar opciones existentes (excepto la primera)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    const participantsText = textarea.value;
    const participants = participantsText.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.replace('•', '').trim());
    
    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        option.setAttribute('data-icon', icon);
        select.appendChild(option);
    });
    
    showNotification('Opciones de Scrum Master generadas');
}

/**
 * Agrega participantes a una tabla
 */
function addParticipantsToTable(participantsTextareaId, tableId) {
    const textarea = document.getElementById(participantsTextareaId);
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    
    tbody.innerHTML = '';
    
    const participantsText = textarea.value;
    const participants = participantsText.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.replace('•', '').trim());
    
    participants.forEach(participant => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" value="${participant}"></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
        `;
        tbody.appendChild(newRow);
    });
    
    showNotification('Participantes añadidos a la tabla');
}

// Alias para retro table (misma funcionalidad)
function addParticipantsToRetroTable(participantsTextareaId, tableId) {
    addParticipantsToTable(participantsTextareaId, tableId);
}

// =============================================
// SISTEMA DE NOTIFICACIONES
// =============================================

/**
 * Muestra una notificación temporal
 */
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// =============================================
// FUNCIONALIDADES DE ROADMAP
// =============================================

/**
 * Calcula la duración automáticamente entre fechas
 */
function calculateDuration(startDateId, endDateId, durationFieldId) {
    const startDateInput = document.getElementById(startDateId);
    const endDateInput = document.getElementById(endDateId);
    const durationField = document.getElementById(durationFieldId);
    
    if (startDateInput && endDateInput && durationField) {
        const startDate = parseDate(startDateInput.value);
        const endDate = parseDate(endDateInput.value);
        
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            durationField.value = diffDays + ' días';
        }
    }
}

/**
 * Parsea una fecha en formato DD/MM/AAAA
 */
function parseDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return null;
}

/**
 * Genera el gráfico de roadmap
 */
function generateRoadmapChart() {
    const timeline = document.getElementById('roadmap-timeline');
    if (!timeline) return;

    const milestones = extractMilestonesData();
    const sprints = extractSprintsData();

    if (milestones.length === 0 && sprints.length === 0) {
        timeline.innerHTML = '<div class="roadmap-loading">No hay datos para generar el gráfico. Agregue hitos y sprints.</div>';
        return;
    }

    let html = `
        <div class="timeline-header">
            <div class="timeline-title">Línea de Tiempo del Proyecto</div>
            <div class="timeline-legend">
                <div class="legend-item">
                    <div class="legend-color milestone"></div>
                    <span>Hito</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color sprint"></div>
                    <span>Sprint</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color planeado"></div>
                    <span>Planeado</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color en-progreso"></div>
                    <span>En Progreso</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color completado"></div>
                    <span>Completado</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color atrasado"></div>
                    <span>Atrasado</span>
                </div>
            </div>
        </div>
    `;

    const allItems = [...milestones, ...sprints].sort((a, b) => {
        const dateA = parseDate(a.startDate || a.date);
        const dateB = parseDate(b.startDate || b.date);
        return dateA - dateB;
    });

    allItems.forEach(item => {
        if (item.type === 'milestone') {
            html += generateMilestoneTimelineItem(item);
        } else if (item.type === 'sprint') {
            html += generateSprintTimelineItem(item);
        }
    });

    timeline.innerHTML = html;
    showNotification('Gráfico de roadmap generado correctamente');
}

/**
 * Extrae datos de hitos del roadmap
 */
function extractMilestonesData() {
    const milestones = [];
    const table = document.getElementById('roadmap-milestones-table');
    
    if (!table) return milestones;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const name = cells[0].querySelector('input')?.value || 'Hito sin nombre';
            const description = cells[1].querySelector('textarea')?.value || '';
            const startDate = cells[2].querySelector('input')?.value || '';
            const endDate = cells[3].querySelector('input')?.value || '';
            const responsible = cells[4].querySelector('input')?.value || '';
            const status = cells[5].querySelector('select')?.value || 'planeado';
            
            if (startDate && endDate) {
                milestones.push({
                    type: 'milestone',
                    name,
                    description,
                    startDate,
                    endDate,
                    responsible,
                    status,
                    date: endDate
                });
            }
        }
    });
    
    return milestones;
}

/**
 * Extrae datos de sprints del roadmap
 */
function extractSprintsData() {
    const sprints = [];
    const table = document.getElementById('roadmap-sprints-table');
    
    if (!table) return sprints;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const name = cells[0].querySelector('input')?.value || 'Sprint sin nombre';
            const objective = cells[1].querySelector('textarea')?.value || '';
            const startDate = cells[2].querySelector('input')?.value || '';
            const endDate = cells[3].querySelector('input')?.value || '';
            const duration = cells[4].querySelector('input')?.value || '';
            
            if (startDate && endDate) {
                sprints.push({
                    type: 'sprint',
                    name,
                    objective,
                    startDate,
                    endDate,
                    duration,
                    status: 'en-progreso'
                });
            }
        }
    });
    
    return sprints;
}

/**
 * Genera un elemento de timeline para hitos
 */
function generateMilestoneTimelineItem(milestone) {
    const progressWidth = calculateProgressWidth(milestone.startDate, milestone.endDate, milestone.status);
    
    return `
        <div class="timeline-item milestone">
            <div class="timeline-date">
                ${formatDate(milestone.endDate)}
            </div>
            <div class="timeline-content">
                <div class="timeline-milestone-marker"></div>
                <div class="timeline-label">${milestone.name}</div>
                <div class="timeline-bar">
                    <div class="timeline-progress ${milestone.status}" style="width: ${progressWidth}%"></div>
                </div>
                <div class="timeline-resource">${milestone.responsible}</div>
            </div>
        </div>
    `;
}

/**
 * Genera un elemento de timeline para sprints
 */
function generateSprintTimelineItem(sprint) {
    const progressWidth = calculateProgressWidth(sprint.startDate, sprint.endDate, sprint.status);
    
    return `
        <div class="timeline-item sprint">
            <div class="timeline-date">
                ${formatDate(sprint.startDate)} - ${formatDate(sprint.endDate)}
            </div>
            <div class="timeline-content">
                <div class="timeline-sprint-marker"></div>
                <div class="timeline-label">${sprint.name}</div>
                <div class="timeline-bar">
                    <div class="timeline-progress ${sprint.status}" style="width: ${progressWidth}%"></div>
                </div>
                <div class="timeline-resource">${sprint.duration}</div>
            </div>
        </div>
    `;
}

/**
 * Calcula el ancho de progreso basado en fechas
 */
function calculateProgressWidth(startDate, endDate, status) {
    if (status === 'completado') return 100;
    if (status === 'planeado') return 0;
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const today = new Date();
    
    if (!start || !end) return 50;
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

/**
 * Formatea una fecha para mostrar
 */
function formatDate(dateString) {
    if (!dateString) return 'Fecha no definida';
    return dateString;
}

/**
 * Exporta el gráfico de roadmap como imagen
 */
function exportRoadmapChart() {
    const timeline = document.getElementById('roadmap-timeline');
    if (!timeline) return;
    
    html2canvas(timeline, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'roadmap-chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Gráfico exportado como imagen');
    });
}

// =============================================
// DEFINITION OF READY (DoR)
// =============================================

/**
 * Actualiza el estado visual de un ítem del checklist DoR
 */
function updateChecklistStatus(selectElement) {
    const row = selectElement.closest('tr');
    const value = selectElement.value;
    
    if (value === 'si') {
        row.style.backgroundColor = '#f0fdf4';
        row.style.borderLeft = '4px solid #10b981';
    } else if (value === 'no') {
        row.style.backgroundColor = '#fef2f2';
        row.style.borderLeft = '4px solid #ef4444';
    } else {
        row.style.backgroundColor = '#f8fafc';
        row.style.borderLeft = '4px solid #6b7280';
    }
    
    calculateDoRStatus();
}

/**
 * Calcula el estado general del DoR
 */
function calculateDoRStatus() {
    const checklistTable = document.getElementById('dor-checklist-table');
    if (!checklistTable) return;
    
    const rows = checklistTable.querySelectorAll('tbody tr');
    let completed = 0;
    let total = 0;
    
    rows.forEach(row => {
        const select = row.querySelector('select');
        if (select && select.value === 'si') {
            completed++;
        }
        if (select && select.value !== 'na') {
            total++;
        }
    });
    
    const completedElement = document.getElementById('dor-completed');
    const pendingElement = document.getElementById('dor-pending');
    const percentageElement = document.getElementById('dor-percentage');
    const statusElement = document.getElementById('dor-status');
    
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = total - completed;
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (percentageElement) percentageElement.textContent = percentage + '%';
    
    if (statusElement) {
        if (percentage === 100) {
            statusElement.textContent = 'Listo';
            statusElement.className = 'summary-value ready';
        } else if (percentage >= 80) {
            statusElement.textContent = 'Casi Listo';
            statusElement.style.background = '#f59e0b';
        } else {
            statusElement.textContent = 'No Listo';
            statusElement.style.background = '#ef4444';
        }
    }
    
    showNotification(`Estado DoR calculado: ${percentage}% completado`);
}

/**
 * Inicializa el checklist DoR
 */
function initializeDoRChecklist() {
    const checklistTable = document.getElementById('dor-checklist-table');
    if (checklistTable) {
        const selects = checklistTable.querySelectorAll('select');
        selects.forEach(select => {
            updateChecklistStatus(select);
        });
    }
}

/**
 * Mueve un ítem del checklist hacia arriba
 */
function moveChecklistItemUp(button) {
    const row = button.closest('tr');
    const previousRow = row.previousElementSibling;
    
    if (previousRow && previousRow.tagName === 'TR') {
        row.parentNode.insertBefore(row, previousRow);
        updateChecklistNumbers();
        showNotification('Ítem movido hacia arriba');
    }
}

/**
 * Mueve un ítem del checklist hacia abajo
 */
function moveChecklistItemDown(button) {
    const row = button.closest('tr');
    const nextRow = row.nextElementSibling;
    
    if (nextRow && nextRow.tagName === 'TR') {
        row.parentNode.insertBefore(nextRow, row);
        updateChecklistNumbers();
        showNotification('Ítem movido hacia abajo');
    }
}

/**
 * Actualiza los números del checklist DoR
 */
function updateDoRChecklistNumbers() {
    const criteriaTable = document.getElementById('dor-criteria-table');
    const checklistTable = document.getElementById('dor-checklist-table');
    
    if (criteriaTable) {
        const criteriaRows = criteriaTable.querySelectorAll('tbody tr');
        criteriaRows.forEach((row, index) => {
            const numberInput = row.querySelector('td:first-child input');
            if (numberInput) {
                numberInput.value = index + 1;
            }
        });
    }
    
    if (checklistTable) {
        const checklistRows = checklistTable.querySelectorAll('tbody tr');
        checklistRows.forEach((row, index) => {
            const criteriaInput = row.querySelector('td:first-child input');
            if (criteriaInput) {
                criteriaInput.placeholder = `Criterio ${index + 1}`;
            }
        });
    }
}

// =============================================
// DEFINITION OF DONE (DoD)
// =============================================

/**
 * Actualiza el estado visual de un ítem del checklist DoD
 */
function updateDoDChecklistStatus(selectElement) {
    const row = selectElement.closest('tr');
    const value = selectElement.value;
    
    if (value === 'si') {
        row.style.backgroundColor = '#f0fdf4';
        row.style.borderLeft = '4px solid #10b981';
    } else if (value === 'no') {
        row.style.backgroundColor = '#fef2f2';
        row.style.borderLeft = '4px solid #ef4444';
    } else {
        row.style.backgroundColor = '#f8fafc';
        row.style.borderLeft = '4px solid #6b7280';
    }
    
    calculateDoDStatus();
}

/**
 * Calcula el estado general del DoD
 */
function calculateDoDStatus() {
    const checklistTable = document.getElementById('dod-checklist-table');
    if (!checklistTable) return;
    
    const rows = checklistTable.querySelectorAll('tbody tr');
    let completed = 0;
    let total = 0;
    
    rows.forEach(row => {
        const select = row.querySelector('select');
        if (select && select.value === 'si') {
            completed++;
        }
        if (select && select.value !== 'na') {
            total++;
        }
    });
    
    const completedElement = document.getElementById('dod-completed');
    const pendingElement = document.getElementById('dod-pending');
    const percentageElement = document.getElementById('dod-percentage');
    const statusElement = document.getElementById('dod-status');
    
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = total - completed;
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (percentageElement) percentageElement.textContent = percentage + '%';
    
    if (statusElement) {
        if (percentage === 100) {
            statusElement.textContent = 'Terminado';
            statusElement.className = 'summary-value done';
        } else if (percentage >= 80) {
            statusElement.textContent = 'Casi Terminado';
            statusElement.className = 'summary-value partial';
        } else {
            statusElement.textContent = 'No Terminado';
            statusElement.className = 'summary-value';
            statusElement.style.background = '#ef4444';
        }
    }
    
    showNotification(`Estado DoD calculado: ${percentage}% completado`);
}

/**
 * Inicializa el checklist DoD
 */
function initializeDoDChecklist() {
    const checklistTable = document.getElementById('dod-checklist-table');
    if (checklistTable) {
        const selects = checklistTable.querySelectorAll('select');
        selects.forEach(select => {
            updateDoDChecklistStatus(select);
        });
    }
}

/**
 * Mueve un ítem del checklist DoD hacia arriba
 */
function moveDoDChecklistItemUp(button) {
    const row = button.closest('tr');
    const previousRow = row.previousElementSibling;
    
    if (previousRow && previousRow.tagName === 'TR') {
        row.parentNode.insertBefore(row, previousRow);
        updateDoDChecklistNumbers();
        showNotification('Ítem movido hacia arriba');
    }
}

/**
 * Mueve un ítem del checklist DoD hacia abajo
 */
function moveDoDChecklistItemDown(button) {
    const row = button.closest('tr');
    const nextRow = row.nextElementSibling;
    
    if (nextRow && nextRow.tagName === 'TR') {
        row.parentNode.insertBefore(nextRow, row);
        updateDoDChecklistNumbers();
        showNotification('Ítem movido hacia abajo');
    }
}

/**
 * Actualiza los números del checklist DoD
 */
function updateDoDChecklistNumbers() {
    const criteriaTable = document.getElementById('dod-criteria-table');
    const checklistTable = document.getElementById('dod-checklist-table');
    
    if (criteriaTable) {
        const criteriaRows = criteriaTable.querySelectorAll('tbody tr');
        criteriaRows.forEach((row, index) => {
            const numberInput = row.querySelector('td:first-child input');
            if (numberInput) {
                numberInput.value = index + 1;
            }
        });
    }
    
    if (checklistTable) {
        const checklistRows = checklistTable.querySelectorAll('tbody tr');
        checklistRows.forEach((row, index) => {
            const activityInput = row.querySelector('td:first-child input');
            if (activityInput) {
                activityInput.placeholder = `Actividad ${index + 1}`;
            }
        });
    }
}

/**
 * Inicializa una fila de checklist recién agregada
 */
function initializeChecklistRow(tableId) {
    const newRow = document.querySelector(`#${tableId} tbody tr:last-child`);
    const select = newRow.querySelector('select');
    if (select) {
        const updateFunction = tableId.includes('dor') ? updateChecklistStatus : updateDoDChecklistStatus;
        select.addEventListener('change', function() {
            updateFunction(this);
        });
    }
}