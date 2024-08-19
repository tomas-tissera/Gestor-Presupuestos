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
    doc.text('Detalles del Presupuesto', 60, 25); // Centrar texto ajustando la posición

    // Información del proyecto
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(54, 54, 54); // Color de texto secundario
    doc.text(`Nombre del Proyecto: ${presupuesto.nombre}`, 14, 50);

    // Ajustar automáticamente la descripción si es muy larga
    const descripcionLarga = doc.splitTextToSize(`Descripción: ${presupuesto.descripcion}`, 180); // Ajusta el ancho máximo
    doc.text(descripcionLarga, 14, 60);

    doc.text(`Total: $${presupuesto.total.toFixed(2)}`, 14, 70 + descripcionLarga.length * 10);

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
        startY: 80 + descripcionLarga.length * 10,
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
        margin: { top: 50, bottom: 40 },
        theme: 'grid' // Estilo de la tabla (puedes probar otros temas como 'striped')
    });

    // Pie de página con espacio para la firma y aclaración
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 34);
    doc.text('Firma:', 14, pageHeight - 40);
    doc.line(40, pageHeight - 40, 100, pageHeight - 40); // Línea para la firma

    doc.text('Aclaración:', 14, pageHeight - 30);
    doc.line(40, pageHeight - 30, 100, pageHeight - 30); // Línea para la aclaración

    // Guardar el PDF con el nombre del proyecto
    doc.save(`presupuesto_${presupuesto.nombre}.pdf`);
};

export default GenerarPDF;
