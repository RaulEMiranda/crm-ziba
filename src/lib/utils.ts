import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Cambia esto según tu API
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleDownloadPDF = async (data: {
  name: string;
  address: string;
  dni: string;
  createdAt: string;
  phone: string;
  priceTotal: number;
  products: {
    barcode: string[];
    quantity: number;
    name: string;
    price: string;
    priceTotal: string;
  }[];
}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const logoImageUrl = "https://i.postimg.cc/wjqSQmDj/ziba.jpg";
  const response = await fetch(logoImageUrl);
  const logoImageBytes = await response.arrayBuffer();
  const logoImage = await pdfDoc.embedJpg(logoImageBytes);
  const logoDimensions = logoImage.scale(0.3);

  page.drawImage(logoImage, {
    x: 50,
    y: 630,
    width: logoDimensions.width,
    height: logoDimensions.height,
  });

  page.drawRectangle({
    x: 53 + logoDimensions.width,
    y: 670,
    width: 320,
    height: 100,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });
  page.drawText("COMPROBANTE ELECTRONICO", {
    x: 75 + logoDimensions.width,
    y: 700,
    size: 18,
    font,
  });
  page.drawText("Zibá Mujer", {
    x: 175 + logoDimensions.width,
    y: 740,
    size: 18,
    font,
  });

  page.drawRectangle({
    x: 25,
    y: 575,
    width: page.getWidth() - 50,
    height: 80,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  page.drawText(`RUC: 20701751377`, { x: 50, y: 540, size: 9, font });
  page.drawText(`Señor(es): ${data.name}`, { x: 50, y: 630, size: 9, font });
  page.drawText(`Domicilio: ${data.address}`, { x: 50, y: 610, size: 9, font });
  page.drawText(`D.N.I.: ${data.dni}`, { x: 50, y: 590, size: 9, font });

  page.drawText(`Fecha de Emisión: ${data.createdAt}`, {
    x: 350,
    y: 630,
    size: 9,
    font,
  });
  page.drawText(`Teléfono: ${data.phone}`, { x: 350, y: 610, size: 9, font });
  page.drawText("Condición de Venta: CONTADO", {
    x: 350,
    y: 590,
    size: 9,
    font,
  });

  page.drawRectangle({
    x: 25,
    y: 540,
    width: page.getWidth() - 50,
    height: 30,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  page.drawText("Código", { x: 40, y: 550, size: 10, font });
  page.drawText("Cantidad", { x: 130, y: 550, size: 10, font });
  page.drawText("Descripción", { x: 200, y: 550, size: 10, font });
  page.drawText("Precio Unitario", { x: 420, y: 550, size: 10, font });
  page.drawText("Total", { x: 500, y: 550, size: 10, font });

  // Iteramos sobre los productos y los mostramos en el PDF
  let currentY = 520;
  data.products.forEach((product) => {
    // Dibuja cada código de barras en una línea separada

    page.drawText(product.name, { x: 200, y: currentY, size: 9, font });
    page.drawText(product.price, { x: 420, y: currentY, size: 9, font });
    page.drawText(product.priceTotal, { x: 500, y: currentY, size: 9, font });

    page.drawText(product.quantity.toString(), {
      x: 130,
      y: currentY,
      size: 9,
      font,
    });

    product.barcode.forEach((code) => {
      page.drawText(code, { x: 40, y: currentY, size: 9, font });
      currentY -= 10; // Ajusta el espaciado entre los códigos de barras
    });
    // Ajusta currentY según el número de códigos de barras para la siguiente fila de producto
    currentY -= Math.max(20, product.barcode.length * 10);
  });

  page.drawText("Son: DOS MIL CUARENTA Y UNO Y 00/100 Soles.", {
    x: 50,
    y: currentY - 30,
    size: 9,
    font,
  });

  const descriptionX = 380;
  const valueX = 550;
  const fontSize = 9;

  const gravadasDescription = "Operaciones gravadas: S/";
  const gravadasValue = (data.priceTotal * 0.82).toFixed(2).toString();
  const igvDescription = "I.G.V.: S/";
  const igvValue = (data.priceTotal * 0.18).toFixed(2).toString();
  const totalDescription = "Importe Total: S/";
  const totalValue = data.priceTotal.toFixed(2).toString();

  const gravadasDescriptionWidth = font.widthOfTextAtSize(
    gravadasDescription,
    fontSize
  );
  const igvDescriptionWidth = font.widthOfTextAtSize(igvDescription, fontSize);
  const totalDescriptionWidth = font.widthOfTextAtSize(
    totalDescription,
    fontSize
  );

  page.drawText(gravadasDescription, {
    x: descriptionX - gravadasDescriptionWidth + 70,
    y: currentY - 30,
    size: fontSize,
    font,
  });
  page.drawText(igvDescription, {
    x: descriptionX - igvDescriptionWidth + 70,
    y: currentY - 50,
    size: fontSize,
    font,
  });
  page.drawText(totalDescription, {
    x: descriptionX - totalDescriptionWidth + 70,
    y: currentY - 70,
    size: fontSize,
    font,
  });

  const gravadasWidth = font.widthOfTextAtSize(gravadasValue, fontSize);
  const igvWidth = font.widthOfTextAtSize(igvValue, fontSize);
  const totalWidth = font.widthOfTextAtSize(totalValue, fontSize);

  page.drawText(gravadasValue, {
    x: valueX - gravadasWidth,
    y: currentY - 30,
    size: fontSize,
    font,
  });
  page.drawText(igvValue, {
    x: valueX - igvWidth,
    y: currentY - 50,
    size: fontSize,
    font,
  });
  page.drawText(totalValue, {
    x: valueX - totalWidth,
    y: currentY - 70,
    size: fontSize,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Comprobante.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};
