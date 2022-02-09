  
    
   function crearPDF(canvas){
    const img = canvas;
    
        var doc = new jsPDF({
            orientation: img.width>img.height?'l':'P', 
            unit: 'mm', 
            format: 'A4' 
        });
        doc.addImage(img, 'JPG', 0, 0);
        doc.save('Imagen A4.pdf');
    
    
}
function calcularRatio(imgWidth, imgHeigth, maxWidth, maxHeigth){
    var ratio = Math.min(maxWidth/imgWidth, maxHeigth/ imgHeigth);
    return { width: imgWidth*ratio, height: imgHeigth*ratio};
}

const $imagen = document.querySelector("#imagen");
const comprimirImagen = (imagenComoArchivo) => {

    return new Promise((resolve, reject) => {
        const $canvas = document.createElement("canvas");
        const imagen = new Image();
        let ratio;
        imagen.onload = () => {
            
            if (imagen.width<imagen.height) {
                    while (imagen.width>796 || imagen.height>1123) {
                        ratio = calcularRatio(imagen.width, imagen.height, 796, 1123);
                        imagen.width=ratio.width;
                        imagen.height=ratio.height;
                   } 
            }else{
                   
                   while (imagen.width>1123 || imagen.height>796) {
                        ratio = calcularRatio(imagen.width, imagen.height, 1123, 796);
                        imagen.width=ratio.width;
                        imagen.height=ratio.height;
                   } 
            }
            $canvas.width = imagen.width;
            $canvas.height = imagen.height;
            $canvas.getContext("2d").drawImage(imagen, 0, 0);
            $canvas.toBlob(
                (blob) => {
                    if (blob === null) {
                        return reject(blob);
                      
                    } else {
                        resolve(blob);
                       crearPDF(imagen);
                    }
                }
            );
        };
        imagen.src = URL.createObjectURL(imagenComoArchivo);
    });
};

document.querySelector("#btnDescargar").addEventListener("click", async () => {
    if ($imagen.files.length <= 0) {
        return;
    }
    const archivo = $imagen.files[0];
    const blob = await comprimirImagen(archivo);
});