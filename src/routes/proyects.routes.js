

import { Router } from "express";
import { createProyect,
		getProyect,
		getProyectById,
		updateProyectById,
		deleteProyectById } from "../controllers/projects/proyects.controller";
import {authJwtVerified,
		isAdmin,
		isModerator}  from "../middlewares/index";
import Routes from "moongose/routes";
import {generatePDFhtml} from "../publicPDF/generatePDF";

const router = Router()

router.post('/createProject', [authJwtVerified, isAdmin],  createProyect);
router.get('/getProject', [authJwtVerified, isAdmin], getProyect);
router.put('/:proyectId', [authJwtVerified, isAdmin], updateProyectById);
router.delete('/:proyectId', [authJwtVerified, isAdmin],  deleteProyectById);
router.get('/:proyectId', getProyectById);
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');


router.post('/generate-pdf/pdfKit', (req, res) => {
    const users = req.body;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Configurar el encabezado de la respuesta para indicar que es un PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');

    // Escribir el contenido del PDF
    doc.text('Lista de Usuarios');
    users.forEach(user => {
        doc.font('Helvetica-Bold').fontSize(12).fillColor('blue').text(`ID: ${user.id}`);
        doc.font('Helvetica').fontSize(10).fillColor('black').text(`Nombre: ${user.name}`);
        doc.font('Helvetica').fontSize(10).fillColor('black').text(`Email: ${user.email}`);
        doc.moveDown();
    });

    // Finalizar el documento y convertirlo a un buffer
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        const stream = new Readable();
        stream.push(pdfData);
        stream.push(null);
        res.setHeader('Content-Length', pdfData.length);
        stream.pipe(res);
    });

    doc.end();
});

router.post('/generate/pdf', async (req, res) => {
    try {
        const data = req.body;
        const { buffer, headers } = await generatePDFhtml(data);
        console.log("buffer", { buffer, headers });
        //res.set(headers);
        res.send(buffer);
    } catch (error) {
		console.log('Error al generar el PDF:', error);	
        res.status(500).send('Error al generar el PDF');
    }
});

export default router;
