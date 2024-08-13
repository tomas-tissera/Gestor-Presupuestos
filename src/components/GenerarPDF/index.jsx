import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GenerarPDF = (presupuesto) => {
    const doc = new jsPDF();
    
    // Estilo del encabezado
    doc.setFont('Arial', 'bold');
    doc.setFontSize(20);
    doc.text('Detalles del Presupuesto', 14, 20);

    doc.setFontSize(14);
    doc.setFont('Arial', 'normal');
    doc.text(`Nombre del Proyecto: ${presupuesto.nombre}`, 14, 30);
    doc.text(`Descripción: ${presupuesto.descripcion}`, 14, 40);
    doc.text(`Total: $${presupuesto.total}`, 14, 50);

    // Tabla de componentes
    const componentesData = presupuesto.componentes.map(comp => [
        comp.nombre,
        comp.descripcion,
        `$${comp.precio}`,
        comp.cantidad,
        `$${comp.precio * comp.cantidad}`
    ]);

    doc.autoTable({
        startY: 60,
        head: [['Nombre', 'Descripción', 'Precio', 'Cantidad', 'Total']],
        body: componentesData,
        styles: {
            font: 'Arial',
            fontSize: 12,
            cellPadding: 4,
            halign: 'left',
            valign: 'middle',
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: [44, 62, 80], // Color de fondo de los encabezados
            textColor: 255, // Color del texto de los encabezados
            fontSize: 14
        },
        margin: { top: 50, bottom: 20 }
    });

    doc.save('presupuesto.pdf');
};

export default GenerarPDF;
