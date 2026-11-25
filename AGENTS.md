# AGENTS.md — Ferretería Los Maestros Frontend

## 1. Contexto académico

Proyecto correspondiente a la Evaluación Parcial 3 de Desarrollo FullStack II de Duoc UC.

El objetivo es integrar el frontend existente de Ferretería Los Maestros con los microservicios Spring Boot del backend, respetando los contenidos impartidos en clases y los indicadores de evaluación.

Priorizar soluciones funcionales, comprensibles y fáciles de explicar durante la defensa individual.

## 2. Documentación académica

Antes de realizar modificaciones, revisar completamente los documentos disponibles en la carpeta Documentacion:

- Guía 15.
- Guía 16.
- Guía 17.
- Guía 18.
- Instrucciones oficiales de la Evaluación Parcial 3.
- Rubrica.txt.

Si algún documento no está disponible o no puede leerse, informar antes de continuar.

Utilizar las guías y la rúbrica como referencia principal para las decisiones técnicas.

No publicar documentación académica en GitHub.

## 3. Alcance del repositorio

Repositorio frontend:

https://github.com/kevishowardgonzalez/ferreteria-los-maestros-react

Rama de trabajo: rama-yerickson.

Repositorio backend:

https://github.com/kevishowardgonzalez/ferreteria-backend

Rama de trabajo del backend: yeri.

Ambos repositorios deben mantenerse separados.

No modificar el backend desde este proyecto.

El backend contiene diez microservicios:

- ferreteria-auth: puerto 8081.
- ferreteria-usuarios: puerto 8082.
- ferreteria-roles: puerto 8083.
- ferreteria-categorias: puerto 8084.
- ferreteria-productos: puerto 8085.
- ferreteria-inventario: puerto 8086.
- ferreteria-boletas: puerto 8087.
- ferreteria-carrito: puerto 8088.
- ferreteria-contacto: puerto 8089.
- ferreteria-foro: puerto 8090.

Verificar los contratos, puertos y configuraciones definitivas antes de implementar cada integración.

## 4. Tecnologías permitidas

Mantener las tecnologías existentes y aquellas respaldadas por las guías académicas:

- JavaScript y JSX.
- React.
- Vite.
- Bootstrap.
- React Bootstrap.
- React Router DOM.
- Fetch API o mecanismo HTTP respaldado por las guías.
- Vitest.
- React Testing Library.
- JWT para autenticación.
- Variables de entorno de Vite.

El entorno actual utiliza Node.js 24.18.0 y npm 11.16.0. Su compatibilidad debe verificarse mediante instalación, pruebas y compilación.

No introducir TypeScript, Redux, Next.js, Tailwind ni nuevas arquitecturas o dependencias sin autorización.

No actualizar dependencias automáticamente.

Investigar la dependencia denominada "20" antes de decidir si corresponde eliminarla.

## 5. Conservación del proyecto existente

Mantener la identidad visual de Ferretería Los Maestros.

Conservar:

- Diseño y estilos.
- Componentes reutilizables.
- Distribución de las vistas.
- Navegación existente cuando sea compatible con la seguridad.
- Funcionalidades comerciales.
- Pruebas unitarias existentes.

No reconstruir el proyecto desde cero.

Evitar refactorizaciones masivas que no aporten al cumplimiento de la evaluación.

Respetar la organización existente de componentes, páginas, hooks y utilidades.

## 6. Roles y permisos

Los roles oficiales del backend son ADMIN, VENDEDOR y CLIENTE.

ADMIN:

- Acceso a todas las funcionalidades administrativas.
- Gestión de productos, categorías y usuarios.
- Consulta y gestión de ventas según los permisos del backend.

VENDEDOR:

- Consulta de productos.
- Consulta del listado y detalle de boletas.
- Sin permisos de creación, edición o eliminación.

CLIENTE:

- Acceso a la tienda.
- Consulta del catálogo.
- Gestión de su propio carrito.
- Realización de compras.
- Consulta de sus propias compras y perfil.

Los permisos adicionales deberán revisarse según las instrucciones del profesor.

Nunca determinar el rol mediante el correo electrónico, nombres de usuario o condiciones simuladas.

Normalizar los roles recibidos desde el backend sin modificar arbitrariamente sus valores.

## 7. Autenticación y sesiones

Reemplazar la autenticación simulada por la autenticación REST del backend.

Implementar:

- Inicio de sesión real.
- Registro real.
- Recepción y manejo del JWT.
- Persistencia de sesión según las guías.
- Recuperación de sesión al recargar la aplicación.
- Control de expiración del token.
- Cierre de sesión.
- Manejo de respuestas HTTP 401 y 403.

No almacenar contraseñas en localStorage, sessionStorage ni otros mecanismos de persistencia.

No incluir secretos JWT en el frontend.

No considerar un JWT decodificado como prueba suficiente de autenticidad.

El backend es responsable de validar el token y autorizar las operaciones.

Documentar las limitaciones de seguridad del mecanismo de persistencia utilizado.

No implementar mecanismos de renovación de tokens sin verificar previamente el contrato del backend.

## 8. Protección de rutas

Implementar rutas protegidas mediante React Router DOM.

Comprobar autenticación y rol antes de mostrar vistas privadas.

Impedir que un usuario acceda a vistas administrativas escribiendo directamente la URL.

Ocultar acciones que no correspondan al rol autenticado.

Redirigir apropiadamente a los usuarios no autenticados o sin permisos.

Las restricciones visuales complementan la seguridad del backend, pero no la reemplazan.

## 9. Integración REST

Centralizar las solicitudes HTTP para evitar código duplicado.

Utilizar variables de entorno para configurar las direcciones de los servicios.

Enviar Authorization: Bearer cuando corresponda.

Manejar:

- Estados de carga.
- Respuestas exitosas.
- Errores de validación.
- Errores de conexión.
- Sesiones expiradas.
- Permisos insuficientes.
- Recursos inexistentes.

No inventar endpoints, estructuras JSON ni códigos HTTP.

Verificar los contratos mediante el código del backend, Swagger o pruebas reales.

Preparar un archivo .env.example con configuraciones de ejemplo, sin credenciales.

Las variables VITE_ son visibles en el navegador y nunca deben contener secretos.

Considerar tanto el entorno local como el futuro despliegue en AWS mediante Nginx.

No afirmar que una integración funciona si no se ha comprobado.

## 10. Datos comerciales

Reemplazar progresivamente los datos simulados por información real del backend.

Integrar productos, categorías, usuarios, carrito y boletas según los contratos disponibles.

El backend debe ser la fuente de verdad para:

- Identificadores.
- Precios.
- Stock.
- Usuarios.
- Roles.
- Totales definitivos.
- Boletas.

El frontend puede calcular totales informativos, pero no debe establecer el precio definitivo de una venta.

No simular una compra exitosa cuando el backend haya rechazado la operación.

No vaciar el carrito antes de confirmar una compra exitosa.

No utilizar datos locales como respaldo silencioso cuando una solicitud real falle.

Mantener separados los datos simulados utilizados exclusivamente para pruebas.

## 11. Pruebas

Antes de modificar funcionalidades, ejecutar las pruebas existentes y registrar sus resultados.

Comandos disponibles:

- npm ci
- npm run test:run
- npm run coverage
- npm run build
- npm run dev

Actualizar las pruebas que dependan de comportamientos simulados cuando estos sean reemplazados por integraciones reales.

Agregar pruebas de:

- Autenticación.
- Registro.
- Persistencia de sesión.
- Cierre de sesión.
- Permisos.
- Rutas protegidas.
- Consumo REST.
- Manejo de errores.
- Operaciones comerciales.

No eliminar ni desactivar pruebas para conseguir resultados exitosos.

No reducir artificialmente los requisitos de cobertura.

No confundir cobertura de código con funcionamiento real de la integración.

Registrar los resultados reales de cada ejecución.

## 12. Etapas de trabajo

Etapa 0: Preparación del entorno y diagnóstico.

Etapa 1: Configuración de la comunicación REST.

Etapa 2: Autenticación, registro y manejo de sesión.

Etapa 3: Protección de rutas y permisos por roles.

Etapa 4: Integración de productos y categorías.

Etapa 5: Integración de usuarios y perfiles.

Etapa 6: Integración de carrito, compras y boletas.

Etapa 7: Integración de funcionalidades complementarias.

Etapa 8: Pruebas, cobertura y compilación.

Etapa 9: Despliegue, documentación y preparación de la defensa.

Trabajar únicamente en la etapa autorizada.

No avanzar automáticamente a la siguiente etapa.

Si una etapa depende de funcionalidades pendientes del backend, informar el bloqueo y no inventar soluciones simuladas para ocultarlo.

Revisar los cambios realizados manualmente por el usuario antes de continuar.

## 13. Restricciones de Git

Trabajar exclusivamente en rama-yerickson.

No realizar commits, push, merge, rebase, reset, clean ni cambios de rama sin autorización explícita.

No descartar modificaciones existentes.

No eliminar respaldos ni ejecutar git stash pop sin autorización.

No publicar:

- Documentación académica.
- Credenciales.
- Archivos .env reales.
- node_modules.
- Archivos compilados.
- Informes de cobertura generados automáticamente.

Mantener package.json y package-lock.json bajo control de versiones.

No eliminar archivos rastreados por Git sin autorización.

Comprobar git status y git diff antes y después de cada etapa.

## 14. Informe obligatorio

Al finalizar cada etapa, entregar un informe en español que incluya:

1. Documentación revisada.
2. Diagnóstico inicial.
3. Archivos creados.
4. Archivos modificados.
5. Archivos eliminados, si corresponde.
6. Explicación de los cambios.
7. Endpoints y contratos utilizados.
8. Pruebas ejecutadas y resultados.
9. Resultado de compilación.
10. Limitaciones y bloqueos.
11. Estado de Git.
12. Recomendaciones para la siguiente etapa.

Distinguir claramente las pruebas simuladas de las integraciones reales.

No afirmar que se ejecutaron pruebas o verificaciones que no fueron realizadas.

## 15. Prioridades generales

Priorizar el cumplimiento de la rúbrica, la seguridad, la integración funcional y la comprensión del código.

No implementar tecnologías innecesarias para la evaluación.

No modificar funcionalidades ajenas a la etapa autorizada.

Solicitar autorización antes de realizar cambios que afecten contratos, dependencias o decisiones importantes del proyecto.

Toda modificación debe poder ser explicada por los integrantes durante la defensa individual.

Mantener una metodología de trabajo progresiva, verificable y coordinada entre frontend y backend.