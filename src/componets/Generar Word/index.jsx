import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Función para formatear la fecha en formato dd/MM/yyyy
const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript empiezan en 0
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

// Función para generar el documento Word
const GenerarWord = (presupuesto) => {
    // Obtén la fecha actual formateada
    const fecha = getFormattedDate();

    // Calcular subtotales, impuestos y total final
    let subtotal = 0;
    const componentesData = presupuesto.componentes.map(comp => {
        const precio = Number(comp.precio) || 0;
        const cantidad = Number(comp.cantidad) || 0;
        const totalPorComponente = precio * cantidad;
        subtotal += totalPorComponente;
        return {
            nombre: comp.nombre,
            descripcion: comp.descripcion,
            precio: `$${precio.toFixed(2)}`,
            cantidad,
            totalPorComponente: `$${totalPorComponente.toFixed(2)}`
        };
    });

    let totalImpuestos = 0;
    let impuestosDetalles = [];
    if (Array.isArray(presupuesto.impuestos)) {
        presupuesto.impuestos.forEach(impuesto => {
            const porcentaje = Number(impuesto.porcentaje) || 0;
            const valorImpuesto = subtotal * (porcentaje / 100);
            totalImpuestos += valorImpuesto;
            impuestosDetalles.push({
                nombre: impuesto.nombre,
                porcentaje,
                valor: `$${valorImpuesto.toFixed(2)}`
            });
        });
    }

    const totalFinal = subtotal + totalImpuestos;

    // Crear las secciones del documento
    let sections = [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: 'Detalles del Presupuesto',
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: `Nombre del Proyecto: ${presupuesto.nombre}`,
                    bold: true,
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    text: `Descripción: ${presupuesto.descripcion}`,
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    text: `Fecha: ${fecha}`,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Total: $${totalFinal.toFixed(2)}`,
                            bold: true,
                            size: 24,
                        })
                    ],
                    heading: HeadingLevel.HEADING_3,
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: 'Componentes:',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                }),
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({
                                        text: 'Nombre',
                                        bold: true,
                                        alignment: AlignmentType.CENTER,
                                    })],
                                }),
                                new TableCell({
                                    width: { size: 40, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({
                                        text: 'Descripción',
                                        bold: true,
                                        alignment: AlignmentType.CENTER,
                                    })],
                                }),
                                new TableCell({
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({
                                        text: 'Precio',
                                        bold: true,
                                        alignment: AlignmentType.CENTER,
                                    })],
                                }),
                                new TableCell({
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({
                                        text: 'Cantidad',
                                        bold: true,
                                        alignment: AlignmentType.CENTER,
                                    })],
                                }),
                                new TableCell({
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({
                                        text: 'Total',
                                        bold: true,
                                        alignment: AlignmentType.CENTER,
                                    })],
                                }),
                            ],
                        }),
                        ...componentesData.map(comp =>
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(comp.nombre)],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(comp.descripcion)],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(comp.precio)],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(comp.cantidad.toString())],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(comp.totalPorComponente)],
                                    }),
                                ],
                            })
                        ),
                    ],
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                        bottom: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                        left: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                        right: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, space: 0 },
                    },
                }),
                new Paragraph({
                    text: 'Resumen:',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),
                new Paragraph({
                    text: `Subtotal: $${subtotal.toFixed(2)}`,
                    spacing: { after: 100 },
                }),
                ...impuestosDetalles.map(impuesto =>
                    new Paragraph({
                        text: `Impuesto ${impuesto.nombre} (${impuesto.porcentaje}%): ${impuesto.valor}`,
                        spacing: { after: 100 },
                    })
                ),
                new Paragraph({
                    text: `Total Final: $${totalFinal.toFixed(2)}`,
                    bold: true,
                    spacing: { after: 200 },
                }),
            ],
        },
    ];

    // Añadir sección de notas, aclaraciones y firma
    sections.push({
        properties: {},
        children: [
            new Paragraph({
                text: 'Notas:',
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
                text: 'Este presupuesto es válido por 15 días a partir de la fecha de emisión. Los términos y condiciones están sujetos a cambios.',
                spacing: { after: 200 },
            }),
            new Paragraph({
                text: 'Aclaraciones:',
                heading: HeadingLevel.HEADING_3,
                spacing: { after: 100 },
            }),
            new Paragraph({
                text: presupuesto.aclaracion || 'No se han proporcionado aclaraciones adicionales.',
                spacing: { after: 200 },
            }),
            new Paragraph({
                text: '', // Espacio adicional
                spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
                text: 'Firma: ___________________________',
                spacing: { after: 100 },
            }),
            new Paragraph({
                text: '', // Espacio adicional
                spacing: { before: 50, after: 50 },
            }),
            new Paragraph({
                text: 'Aclaración: ___________________________',
                spacing: { after: 100 },
            }),
        ],
    });

    // Crear el documento
    const document = new Document({
        sections: sections,
    });

    // Genera el documento y lo descarga
    Packer.toBlob(document).then((blob) => {
        saveAs(blob, `presupuesto_${presupuesto.nombre}.docx`);
    }).catch((err) => {
        console.error('Error al generar el documento:', err);
    });
};

export default GenerarWord;
