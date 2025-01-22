# Arquitectura en capas (N-Tier) en el Backend

# => CAPA DE PRESENTACION  - La capa routes define las rutas del negocio, ademas llama a la capa controller y el controllers maneja las solicitudes HTTP, ademas llama a la capa de aplicacion 
```
/routes/productRoutes.js
/controllers/productController.js

```
# => CAPA DE APLICACION - Esta capa contiene la logica del negocio y llama a la capa de acceso a datos 
```
/services/productService.js
```
# => CAPA DE ACCESO A DATOS - Esta capa interactua con la capa models para poder realizar las operaciones CRUD tipicas en la base de datos
```
repositories/productRepositories
```
# => MODELOS - Esta capa define la estructura de documentos de la base de datos 
```
/models/productModel.js
```
# => CAPA DE DATOS - Esta capa configura la conexion con la base de datos 
```
/db/index.js
```
# CONFIGURACION DEL SERVIDOR