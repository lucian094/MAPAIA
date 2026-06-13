# Ingeniería de prompts

El nombre suena intimidante. La idea detrás es simple: el agente hace lo que
le pedís, no lo que querés. Si el pedido es vago, el resultado es vago. Si el
pedido es preciso y con contexto suficiente, el resultado tiene muchas más
chances de ser útil de entrada.

"Ingeniería de prompts" no es un arte oscuro ni una certificación. Es el
hábito de escribir instrucciones como si le hablás a un colega inteligente que
llegó hoy a tu proyecto y que **todavía no sabe nada de él**.

Si algún término te resulta nuevo, el
[glosario](../01-fundamentos/glosario.md) te cubre.

## Los cinco principios

### 1. Especificidad: del qué vago al qué concreto

"Mejorá el código" puede significar un millón de cosas. "Extraé la lógica de
validación de `registro.ts` a una función pura `validarEmail(email: string):
boolean`" tiene una sola interpretación posible. Cuanto más específico el
pedido, menos vuelta de loop desperdiciada, menos costo, menos sorpresas.

### 2. Contexto: lo que el agente no ve, no existe

El agente trabaja con lo que está en el repo y lo que vos le contás. Las
convenciones no escritas del proyecto, el porqué histórico de esa solución
rara, la decisión que se tomó hace tres meses: nada de eso lo puede adivinar.
Dáselo explícito. Una oración de contexto evita tres iteraciones de corrección.

### 3. Ejemplos: el formato más efectivo

Si querés un estilo de código, un formato de log, o un tono de documentación,
mostrar es más eficaz que describir. Un fragmento de código real que dice
"quiero algo así" vale más que dos párrafos de prosa explicando el estilo.

### 4. Asignar rol (con criterio)

Decirle al agente "actuá como un revisor de código senior" cambia el enfoque
de la respuesta: pasa a buscar problemas activamente en vez de simplemente
ejecutar. Esto funciona bien cuando querés una perspectiva crítica o un modo
de trabajo específico. No hace falta hacerlo en cada prompt — reservalo para
cuando el rol cambia algo real.

### 5. Iterar: el primer prompt es un borrador

El prompt perfecto en el primer intento es la excepción. Lo normal es una
ronda corta de ajustes: el agente entrega, vos ves qué faltó, corregís el
pedido, repetís. No lo des a diseñar como un documento de requerimientos —
tratalo como una conversación.

## Tabla: prompt malo → prompt bueno

| Qué se quería | Prompt malo | Prompt bueno | Por qué mejora |
|---|---|---|---|
| Validar un campo | "Agregá validación al formulario" | "En `src/forms/registro.ts`, validá que el campo `email` no esté vacío y tenga formato `usuario@dominio.ext`. Devolvé mensajes de error en español." | Archivo destino, regla precisa, formato de salida |
| Escribir tests | "Hacé tests para la función nueva" | "Escribí tests unitarios para `parsearFecha(str: string)` en `tests/utils.test.ts`. Cubrí: formato válido, fecha inexistente (31 de febrero), string vacío y null." | Nombre de función, archivo de destino, casos a cubrir |
| Refactorizar | "Mejorá este código" | "Extraé la lógica de cálculo de descuento de `checkout.ts` a una función pura sin efectos secundarios. Los tests actuales deben seguir pasando." | Qué extraer, dónde, criterio de éxito verificable |
| Revisar PR | "Revisá mi código" | "Revisá `src/api/usuario.ts` como senior de seguridad: buscá inputs sin sanitizar, acceso a datos sin autorización, y mensajes de error que filtren información interna." | Rol asignado, archivo concreto, qué buscar |
| Documentar | "Documentá las funciones" | "Agregá JSDoc a las funciones exportadas de `src/lib/rutas.ts`. Incluí `@param`, `@returns` y un ejemplo de uso por función. Estilo: una oración descriptiva, no restatement del nombre." | Qué documentar, formato, criterio de calidad |

## Anti-patrones comunes

### Pedir todo de una

```text
# MAL
Reescribí la autenticación, actualizá los tests, documentá los endpoints
y asegurate de que todo siga andando.
```

El agente va a intentar hacer las cuatro cosas a la vez y probablemente haga
cada una a medias. Las tareas largas se rompen en pasos: primero la lógica,
luego los tests, luego la documentación. Cada paso tiene su propio criterio de
éxito.

### El prompt vago con expectativas altas

```text
# MAL
Mejorá el rendimiento de la app.
```

Sin saber qué está lento, qué es "bueno", ni qué no se puede tocar, el agente
va a hacer algo — probablemente cambios que no te importan — con total
confianza. Un prompt así tiene garantía de frustración.

```text
# MEJOR
El tiempo de carga de /dashboard supera los 3 segundos en producción.
El profiler muestra que `cargarReporteMensual()` en `src/api/reporte.ts`
hace 12 queries secuenciales. Consolidalas en una sola query con JOINs.
No toques los otros endpoints por ahora.
```

### No dar criterio de éxito

Si el prompt no define cuándo la tarea está terminada, el agente tampoco lo
sabe. El resultado más probable es que termine cuando "parezca listo" — que
puede estar muy lejos de lo que necesitás.

Regla simple: si no podés describir cómo verificarías que la tarea salió bien,
el prompt todavía no está listo.

### No iterar

El prompt salió, la respuesta no fue lo que esperabas, conclusión: "los
agentes no sirven". Este es el error más caro. Casi nunca el primer intento es
el mejor. Identificá qué faltó en el pedido, ajustá, volvé a correr. En dos o
tres iteraciones podés llegar a resultados que en el primer intento parecían
imposibles.

### Asumir contexto que el agente no tiene

```text
# MAL
Usá el mismo patrón que usamos para los reportes.
```

¿Qué patrón? ¿De qué reportes? El agente no estuvo en esa reunión, no leyó
ese Slack, no tiene esa memoria. Si existe un patrón que querés replicar,
mostráselo: pegá el fragmento de código o apuntá al archivo.

### Confundir "el agente entendió" con "el agente terminó bien"

El agente siempre responde con confianza, haya o no terminado correctamente.
"Listo, los tests pasan" no es evidencia de que los tests pasen — es lo que
el modelo predijo que era una respuesta apropiada. La verificación siempre es
tuya: correr el build, revisar el diff, ejecutar los tests vos mismo. Delegar
la verificación al mismo agente que hizo el trabajo es delegar la nota al
mismo alumno que rindió el examen.

## Ejemplos con contexto

### Ejemplo 1: tarea bien armada desde el inicio

**Objetivo:** agregar un endpoint REST nuevo sin romper los existentes.

```text
Agregá un endpoint GET /api/usuarios/:id en `src/api/usuarios.ts`.
Debe devolver el objeto usuario sin el campo `passwordHash`.
Si el usuario no existe, retornar 404 con `{ error: "Usuario no encontrado" }`.
Los tests van en `tests/api/usuarios.test.ts` — hay ejemplos en ese archivo
de cómo mockeamos la base de datos. Cuando termines, corré la suite y
mostrame el resultado.
```

Por qué funciona: archivo destino, comportamiento exacto para el caso feliz y
el error, referencia a cómo testear, criterio de éxito explícito (la suite
pasa).

### Ejemplo 2: prompt de revisión con rol asignado

**Objetivo:** revisión crítica antes de un merge.

```text
Revisá `src/lib/autenticacion.ts` como si fueras un auditor de seguridad.
Buscá específicamente:
- Tokens o secretos hardcodeados
- Inputs del usuario que llegan a queries sin sanitizar
- Mensajes de error que revelen información del sistema
Para cada hallazgo: línea, descripción del riesgo, sugerencia de fix.
```

Por qué funciona: el rol define el enfoque (buscar activamente), la lista
acota qué mirar, el formato pedido hace el resultado directamente accionable.

### Ejemplo 3: iteración después de un resultado parcial

Primera vuelta — el agente generó la función pero sin manejo de errores:

```text
# Primera vuelta
Escribí una función `obtenerClima(ciudad: string)` que llame a la API
pública de Open-Meteo y devuelva temperatura actual en °C.
```

Segunda vuelta — afinando con lo que faltó:

```text
La función quedó bien, pero no maneja errores de red ni ciudades inválidas.
Agregá:
- Try/catch alrededor del fetch; si falla, lanzar Error("No se pudo obtener el clima")
- Validar que `ciudad` no sea string vacío antes de llamar a la API
Los tipos deben seguir siendo los mismos, no rompas la interfaz.
```

Esto es iteración normal, no fracaso del primer intento.

### Ejemplo 4: dar un ejemplo del formato esperado

**Objetivo:** que el agente genere logs con un formato consistente con el resto
del código, no el que se le ocurra.

```text
Agregá logging en las funciones de `src/lib/importador.ts`. Usá el mismo
estilo que ya existe en `src/lib/exportador.ts`:

  logger.info("[importador] iniciando proceso", { archivo, filas });
  logger.error("[importador] error al parsear", { linea, error: err.message });

Prefijo entre corchetes con el nombre del módulo, siempre incluir el contexto
relevante como segundo parámetro. No uses console.log.
```

Por qué funciona: en vez de describir el estilo, lo mostrás con fragmentos
reales. El agente puede imitar un ejemplo concreto mucho más fielmente que
seguir una descripción abstracta.

## La relación con el contexto de proyecto

Un prompt bien escrito tapa los huecos que el agente no puede llenar solo. Pero
hacerlo en cada pedido es costoso y cansa. La solución de fondo es documentar
el contexto una sola vez — en un archivo `AGENT.md` o en instrucciones del
proyecto — y que el agente lo lea de entrada. De eso se trata el siguiente
artículo.

Lo que viste acá es la mitad del circuito: cómo pedís. La otra mitad es qué
contexto permanente le dejás disponible.

## → Siguiente paso

El prompt es el pedido puntual. El contexto es todo lo que el agente necesita
saber para responder bien en cualquier pedido. Organizarlo bien es la
diferencia entre repetir información en cada prompt y tener un agente que ya
entiende tu proyecto →
[Contexto y estructura](contexto-y-estructura.md)
