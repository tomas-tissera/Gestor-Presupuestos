import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GenerarPDF = (presupuesto) => {
    const doc = new jsPDF();

    // Añadir el logo
    const imgData = '/icon.png'; // Ruta a tu imagen de logo
    doc.addImage(imgData, 'PNG', 14, 10, 30, 20); // Posición y tamaño del logo

    // Estilo del encabezado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(34, 34, 34); // Color de texto oscuro
    doc.text('Presupuesto', 60, 25); // Centrar texto ajustando la posición

    // Información del proyecto
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(54, 54, 54); // Color de texto secundario
    doc.text(`Nombre del Proyecto: ${presupuesto.nombre}`, 14, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 55);

    // Ajustar automáticamente la descripción si es muy larga
    const descripcionLarga = doc.splitTextToSize(`Descripción: ${presupuesto.descripcion}`, 180); // Ajusta el ancho máximo
    doc.text(descripcionLarga, 14, 60);

    
    doc.textWithLink('Adelanto de Web.(click me)', 14, 90 + descripcionLarga.length , {url: 'https://isaac-newton.netlify.app/'});
    

    // Mostrar el total de forma destacada
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Total: $${presupuesto.total}`, 150, 100 + descripcionLarga.length);
    
    // Tabla de componentes
    const componentesData = presupuesto.componentes.map(comp => {
        // Asegurarse de que precio y cantidad sean números
        const precio = Number(comp.precio) || 0;
        const cantidad = Number(comp.cantidad) || 0;
        const totalPorComponente = precio * cantidad; // Calcula el total por componente

        return [
            comp.nombre,
            comp.descripcion,
            `$${precio.toFixed(2)}`,
            cantidad,
            `$${totalPorComponente.toFixed(2)}`
        ];
    });

    doc.autoTable({
        startY: 80 + descripcionLarga.length * 5,
        head: [['Nombre', 'Descripción', 'Precio', 'Cantidad', 'Total']],
        body: componentesData,
        styles: {
            font: 'Helvetica',
            fontSize: 12,
            cellPadding: 5,
            halign: 'center',
            valign: 'middle',
            overflow: 'linebreak', // Hace que el texto continúe en la siguiente línea si es muy largo
        },
        headStyles: {
            fillColor: [44, 62, 80], // Color de fondo de los encabezados
            textColor: 255, // Color del texto de los encabezados
            fontSize: 14
        },
        margin: { top: 80, bottom: 40 },
        theme: 'grid' // Estilo de la tabla (puedes probar otros temas como 'striped')
    });

    // Pie de página con espacio para la firma y aclaración
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(34, 34, 34);
    doc.text('Firma:', 14, pageHeight - 40);
    doc.line(40, pageHeight - 40, 100, pageHeight - 40); // Línea para la firma

    doc.text('Aclaración:', 14, pageHeight - 30);
    doc.line(40, pageHeight - 30, 100, pageHeight - 30); // Línea para la aclaración

    // Añadir una nota legal o condiciones al final del documento
    // Ajustar automáticamente la descripción si es muy larga
    doc.text('Notas:', 14, pageHeight - 20);
    const notaLarga = doc.splitTextToSize("Este presupuesto es válido por 15 días a partir de la fecha de emisión. Los términos y condiciones están sujetos a cambios.", 180); // Ajusta el ancho máximo
    doc.text(notaLarga,14, pageHeight - 10);

    // Guardar el PDF con el nombre del proyecto
    doc.save(`presupuesto_${presupuesto.nombre.replace(/\s+/g, '_')}.pdf`);
};

export default GenerarPDF;
