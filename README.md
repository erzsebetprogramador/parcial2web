# parcial2web
parcial de web contrato apy

**1. Ejemplo de respuesta JSON al consultar una tarea**
Mostré la respuesta `200 OK` de `GET /api/v1/tareas/t-1024`, con los cinco campos del modelo: `id`, `titulo`, `curso`, `fechaEntrega` y `estado`. Incluí también una variante con `estado: "completado"` y el caso del `404`.

**2. Código HTTP cuando la tarea no existe**
El código es **`404 Not Found`**, con este cuerpo:
```json
{
  "codigo": "TAREA_NO_ENCONTRADA",
  "mensaje": "No existe una tarea con id t-9999"
}
```
El`404` es correcto porque la petición está bien formada y autenticada, pero el recurso no existe. El `codigo` sirve para que la app reaccione sin depender del texto, y el `mensaje` ayuda a depurar. El mismo error aplica al `PATCH`.

**3. Cambio posterior que podría romper el contrato**
El ejemplo principal fue renombrar un campo, como `fechaEntrega` por `fecha_limite`, porque el cliente dejaría de encontrar el dato aunque la API siga respondiendo `200`. Otros cambios que también lo romperían:
- Cambiar el tipo de un campo, por ejemplo `curso` de texto a objeto.
- Modificar los valores del enum `estado`.
- Cambiar la estructura de la respuesta de lista.
- Cambiar códigos HTTP o de error.
- Hacer obligatorio un parámetro nuevo.

Los cambios compatibles, como agregar un campo opcional o un endpoint nuevo, no lo rompen. Si un cambio incompatible es inevitable, se publica como `/api/v2` y se mantiene `/api/v1` durante la transición.
