import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const GenerarWord = (presupuesto) => {
    // Crea el documento
    const document = new Document({
        sections: [
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
                        text: `Estado: ${presupuesto.estado || 'N/A'}`,
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
                                ],
                            }),
                            ...presupuesto.componentes.map((comp) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(comp.nombre)],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(comp.descripcion)],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(`$${comp.precio.toFixed(2)}`)],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(comp.cantidad.toString())],
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
                        text: `Total: $${presupuesto.total.toFixed(2)}`,
                        bold: true, // Aplica negritas al total
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 300 },
                    }),
                ],
            },
        ],
    });

    // Genera el documento y lo descarga
    Packer.toBlob(document).then((blob) => {
        saveAs(blob, `presupuesto_${presupuesto.nombre}.docx`);
    }).catch((err) => {
        console.error('Error al generar el documento:', err);
    });
};

export default GenerarWord;
