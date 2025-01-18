import pdf from 'html-pdf';
import fs from 'fs';
import handlebars from 'handlebars';

export const generatePDFhtml = (data) => {
    console.log("data", data);
    return new Promise((resolve, reject) => {
        const htmlTemplate = fs.readFileSync('./src/public/template.html', 'utf-8');
        const template = handlebars.compile(htmlTemplate);
        const htmlContent = template({ 
            customer: data.customer,
            datosDeCompra: data.datosDeCompra,
            formaDePago: data.formaDePago,
            mandate: data.mandate,
            venta: data.venta
        });
        const options = {       
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            footer: {
                height: '15mm',
                contents: '<footer><h2>Gracias por su confianza.</h2></footer>'
            }
        };
        // Crear PDF y devolverlo como buffer
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }
            resolve({
                buffer: buffer,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="archivo.pdf"',
                    'Content-Length': buffer.length
                }
            });
        });
    });
};

