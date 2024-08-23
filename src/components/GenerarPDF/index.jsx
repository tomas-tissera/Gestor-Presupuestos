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

    // Añadir el enlace si la URL está presente
    if (presupuesto.url) {
        const linkYPosition = 70 + descripcionLarga.length * 5; // Ajustar la posición Y según la longitud de la descripción
        doc.setTextColor(0, 0, 255); // Color azul para el enlace
        doc.textWithLink('Adelanto de Web (click me)', 14, linkYPosition, { url: presupuesto.url });
        doc.setTextColor(54, 54, 54); // Restaurar color de texto
    }

    // Calcular subtotales y totales
    let subtotal = 0;
    const componentesData = presupuesto.componentes.map(comp => {
        const precio = Number(comp.precio) || 0;
        const cantidad = Number(comp.cantidad) || 0;
        const totalPorComponente = precio * cantidad; // Calcula el total por componente
        subtotal += totalPorComponente; // Sumar al subtotal

        return [
            comp.nombre,
            comp.descripcion,
            `$${precio.toFixed(2)}`,
            cantidad,
            `$${totalPorComponente.toFixed(2)}`
        ];
    });

    // Calcular impuestos basados en los porcentajes proporcionados
    let totalImpuestos = 0;
    let impuestosDetalles = [];
    if (Array.isArray(presupuesto.impuestos)) {
        presupuesto.impuestos.forEach(impuesto => {
            const porcentaje = Number(impuesto.porcentaje) || 0;
            const valorImpuesto = subtotal * (porcentaje / 100);
            totalImpuestos += valorImpuesto;

            // Guardar detalles de cada impuesto para mostrarlo en el PDF
            impuestosDetalles.push({
                nombre: impuesto.nombre,
                porcentaje: porcentaje,
                valor: valorImpuesto
            });
        });
    }

    const totalFinal = subtotal + totalImpuestos;

    // Tabla de componentes
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

    // Mostrar subtotales, impuestos y total de forma destacada
    const finalYPosition = doc.autoTable.previous.finalY + 10; // Obtener la posición Y final después de la tabla

    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 14, finalYPosition);

    // Mostrar cada impuesto si hay detalles
    let impuestosYPosition = finalYPosition + 10;
    if (impuestosDetalles.length > 0) {
        impuestosDetalles.forEach(impuesto => {
            doc.text(`Impuesto ${impuesto.nombre} (${impuesto.porcentaje}%): $${impuesto.valor.toFixed(2)}`, 14, impuestosYPosition);
            impuestosYPosition += 10;
        });
    }

    doc.text(`Total: $${totalFinal.toFixed(2)}`, 14, impuestosYPosition + 10);

    // Pie de página con espacio para la firma y aclaración
    const pageHeight = doc.internal.pageSize.height;
    let footerYPosition = pageHeight - 50; // Ajustar la posición del pie de página

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(34, 34, 34);
    if (footerYPosition>= 200) {
        console.log(footerYPosition);
        
        footerYPosition = 10;
        doc.addPage();
        // Añadir una nota legal o condiciones al final del documento
        doc.text('Aclaraciones:', 14, footerYPosition);
        const notaLegal = doc.splitTextToSize('Este presupuesto es válido por 15 días a partir de la fecha de emisión. Los términos y condiciones están sujetos a cambios.', 180);
        doc.text(notaLegal, 14, footerYPosition + 10);

        // Agregar la aclaración del presupuesto si está presente
        if (presupuesto.aclaracion) {
            const aclaracionLarga = doc.splitTextToSize(presupuesto.aclaracion, 180);
            footerYPosition += 30; // Ajustar la posición para la aclaración
            doc.text(aclaracionLarga, 14, footerYPosition);
        }

        // Mostrar el método de pago
        if (presupuesto.metodoPago) {
            footerYPosition += 10; // Ajustar la posición para el método de pago
            doc.text(`Método de Pago: ${presupuesto.metodoPago}`, 14, footerYPosition);
        }
    }else{
        // Añadir una nota legal o condiciones al final del documento
        doc.text('Aclaraciones:', 14, footerYPosition);
        const notaLegal = doc.splitTextToSize('Este presupuesto es válido por 15 días a partir de la fecha de emisión. Los términos y condiciones están sujetos a cambios.', 180);
        doc.text(notaLegal, 14, footerYPosition + 10);

        // Agregar la aclaración del presupuesto si está presente
        if (presupuesto.aclaracion) {
            const aclaracionLarga = doc.splitTextToSize(presupuesto.aclaracion, 180);
            footerYPosition += 30; // Ajustar la posición para la aclaración
            doc.text(aclaracionLarga, 14, footerYPosition);
        }

        // Mostrar el método de pago
        if (presupuesto.metodoPago) {
            footerYPosition += 10; // Ajustar la posición para el método de pago
            doc.text(`Método de Pago: ${presupuesto.metodoPago}`, 14, footerYPosition);
        }
    }
    

    // Espacio para la firma y aclaración
    if (footerYPosition >= 200) {
        footerYPosition-=10;
        doc.addPage();
        doc.text('Firma:', 14, footerYPosition);
        doc.line(40, footerYPosition, 80, footerYPosition); // Línea para la firma

        footerYPosition += 10; // Espacio adicional para la aclaración
        doc.text('Aclaración:', 14, footerYPosition);
        doc.line(40, footerYPosition, 80, footerYPosition); // Línea para la aclaración

        // Guardar el PDF con el nombre del proyecto
        doc.save(`presupuesto_${presupuesto.nombre.replace(/\s+/g, '_')}.pdf`);
    }else{

        footerYPosition += 20; // Espacio adicional para la firma
        doc.text('Firma:', 14, footerYPosition);
        doc.line(40, footerYPosition, 100, footerYPosition); // Línea para la firma
    
        footerYPosition += 10; // Espacio adicional para la aclaración
        doc.text('Aclaración:', 14, footerYPosition);
        doc.line(40, footerYPosition, 100, footerYPosition); // Línea para la aclaración
    
        // Guardar el PDF con el nombre del proyecto
        doc.save(`presupuesto_${presupuesto.nombre.replace(/\s+/g, '_')}.pdf`);
    }
};

export default GenerarPDF;
