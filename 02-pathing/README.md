# El sistema de rutas

MAPAIA no se lee de corrido, y esa es quizás su decisión de diseño más
importante. El mismo contenido produce resultados muy distintos según quién
lo recorre y en qué orden: lo que a una persona le construye criterio, a otra
le repite lo obvio y a una tercera le esconde justo lo que necesitaba. Esta
carpeta implementa el **pathing por punto de partida**: te autodiagnosticás,
elegís tu línea y seguís una ruta pensada para tu situación.

## Por qué no hay una ruta única

La evidencia pública es contundente en los dos extremos. Los desarrolladores
que usan IA con criterio completan tareas hasta un **55,8 % más rápido**
(Peng et al., GitHub/MIT, 2023). Los que la usan sin metodología pueden
rendir *peor* que sin IA: PwC (2025) midió entre un **7 % y un 10 % menos**
en perfiles junior sin guía — el llamado *Junior Penalty*.

Las mismas herramientas, resultados opuestos. La diferencia no está en la
herramienta: está en el punto de partida de quien la usa. Por eso el tutorial
genérico — "instalá tal cosa, copiá este prompt" — le erra a casi todo el
mundo, aunque a cada quien le erra distinto:

- A quien recién arranca le falta lo que ningún tutorial le da: **criterio**
  para evaluar lo que el agente produce. Su riesgo es la dependencia ciega.
- A quien lleva años en el oficio le sobra criterio y le falta otra cosa:
  **vencer la fricción** de incorporar una herramienta de la que desconfía
  con razón. Su riesgo es descartar todo antes de tiempo, o adoptarlo a
  regañadientes y mal.
- A quien ya usa agentes todos los días no le sirve que le expliquen qué es
  un prompt. Necesita **sistematizar**: pasar de la intuición personal a
  prácticas medibles y transferibles. Su riesgo es la meseta.
- Y a quien no escribe código pero convive con agentes — porque su equipo
  los usa, porque los evalúa, porque le venden humo a diario — le falta el
  **mapa conceptual** para participar de la conversación. Su riesgo es
  decidir (o dejarse convencer) a ciegas.

Cuatro situaciones, cuatro rutas. Eso es el pathing.

## Cómo funciona

1. **Hacé la [autoevaluación](autoevaluacion.md).** Seis preguntas, dos
   minutos, sin respuestas correctas: solo una foto honesta de dónde estás
   parado hoy.
2. **Caés en uno de los tres perfiles.** Cada perfil tiene su archivo, con su
   diagnóstico, sus reglas de juego y su plan.
3. **Seguís la ruta de lectura de tu perfil.** Cada perfil ordena el resto
   del contenido de MAPAIA según lo que más te aporta y en el orden que más
   te conviene.

En el [sitio de MAPAIA](https://lucian094.github.io/MAPAIA/) esto se ve como
un **mapa de metro**: cada perfil es una línea de color, cada tema una
estación, y los temas compartidos entre perfiles son transbordos. Acá en
GitHub, cada perfil lista su ruta como una lista ordenada con links. Es lo
mismo, con menos dibujito.

## Cómo sacarle el jugo a tu ruta

Unas pocas reglas de uso que valen para las tres líneas:

1. **Respetá el orden la primera vez.** Las rutas están ordenadas para que
   cada estación se apoye en la anterior. Después de la primera pasada,
   saltá a gusto: el orden es un andamio, no una doctrina.
2. **Leé con la herramienta abierta.** MAPAIA no es teoría para acumular:
   casi todo lo que vas a leer se entiende el doble probándolo en el momento
   sobre un proyecto tuyo (uno de juguete sirve perfecto).
3. **No te saltees los fundamentos por orgullo.** Aunque tu perfil sea
   avanzado, el vocabulario común de MAPAIA sale de ahí; quince minutos de
   repaso te ahorran malentendidos después.
4. **Volvé al [glosario](../01-fundamentos/glosario.md) sin culpa.** Está
   para eso, y en el sitio tiene búsqueda.

## Las cuatro líneas

### 🌸 Línea Exploradora

**Para quién:** todavía no programás (ni estás aprendiendo), pero los
agentes de IA ya te tocan de cerca: trabajás con desarrolladores, evaluás
herramientas, tomás decisiones sobre tecnología, o simplemente querés
entender de qué se trata antes de que te lo cuenten mal.

**El problema que ataca:** la conversación sobre agentes está llena de humo
— demos espectaculares, promesas de marketing y pánico en partes iguales.
Sin un modelo mental propio, quedás a merced del que mejor vende.

**El foco:** entender qué es un agente y qué no, qué puede esperarse de
verdad, y construir el vocabulario para hablar de igual a igual con quienes
los usan — todo sin escribir una línea de código.

→ Empezá por [perfil-explorador.md](perfil-explorador.md).

### 🟢 Línea Inicial

**Para quién:** sabés programar — estás estudiando, saliendo de un bootcamp
o en tus primeros trabajos — pero todavía no acumulaste años de proyectos
reales con usuarios, deadlines y código heredado.

**El problema que ataca:** la IA te puede acompañar desde el primer día, y
justo por eso te puede formar mal. Si el agente escribe y vos aceptás, el
criterio no aparece nunca. Esta línea está diseñada para que la IA te haga
mejor desarrollador en lugar de reemplazar tu aprendizaje.

**El foco:** desarrollar criterio, aprender a evaluar lo que el agente
produce y construir el hábito de verificar antes que el de confiar.

→ Empezá por [perfil-inicial.md](perfil-inicial.md).

### 🔵 Línea Experimentada

**Para quién:** tenés años de experiencia profesional. La IA todavía no
entró en serio a tu flujo de trabajo: no te convence, no encontraste el
momento, o la probaste y la dejaste.

**El problema que ataca:** la fricción inicial es real — las primeras
semanas con un agente se sienten más lentas que tu flujo de siempre — y la
desconfianza también es razonable. Esta línea apunta a que integres la
herramienta aprovechando tu experiencia, sin sentir que perdés el control
del código que firmás.

**El foco:** vencer la fricción inicial con tareas de bajo riesgo, integrar
el agente a tu flujo existente y convertir tu escepticismo en el activo que
es: criterio de revisión ya entrenado.

→ Empezá por [perfil-experimentado.md](perfil-experimentado.md).

### 🟣 Línea Nativa

**Para quién:** ya usás agentes de IA todos los días. Probablemente seas la
persona a la que tu equipo le pregunta "¿cómo le pediste eso?".

**El problema que ataca:** el uso intensivo no es lo mismo que el uso
sistemático. Tu flujo funciona, pero vive en tu cabeza: no está escrito, no
se mide y no se transfiere. Esta línea apunta a romper esa meseta.

**El foco:** sistematizar tus prácticas, medir qué mejora de verdad,
extender tus herramientas (MCP, skills, plugins) y transferir lo que sabés
al resto del equipo.

→ Empezá por [perfil-nativo.md](perfil-nativo.md).

## En una tabla

| Línea | Venís de | Tu riesgo | Tu foco |
|---|---|---|---|
| 🌸 Exploradora | No escribís código | Decidir a ciegas | Modelo mental y vocabulario |
| 🟢 Inicial | Estudiar o tus primeros trabajos | Dependencia ciega | Criterio y verificación |
| 🔵 Experimentada | Años de oficio, poca IA | Descartar antes de tiempo | Integrar sin perder control |
| 🟣 Nativa | Agentes todos los días | La meseta del autodidacta | Sistematizar, medir, extender |

## Qué hay en esta carpeta

| Archivo | Qué es |
|---|---|
| [autoevaluacion.md](autoevaluacion.md) | El cuestionario (un filtro + 6 preguntas) que te asigna un perfil |
| [perfil-explorador.md](perfil-explorador.md) | La Línea Exploradora: entender agentes sin escribir código |
| [perfil-inicial.md](perfil-inicial.md) | La Línea Inicial: diagnóstico, reglas de oro y ruta de lectura |
| [perfil-experimentado.md](perfil-experimentado.md) | La Línea Experimentada: ídem, para quien viene del oficio |
| [perfil-nativo.md](perfil-nativo.md) | La Línea Nativa: ídem, para quien ya vive entre agentes |

Cada perfil sigue la misma estructura, a propósito: para quién es, qué
riesgo ataca, cómo trabajar mientras lo recorrés, la ruta de lectura
ordenada y las señales de que ya estás para otra línea. Si querés comparar
perfiles antes de elegir, esa simetría te lo hace fácil.

## El test orienta, no encierra

El perfil que te dé la autoevaluación es un punto de partida, no una
sentencia. Las líneas comparten estaciones (en el mapa son los transbordos):
podés cambiar de línea cuando quieras, leer estaciones de otra ruta, o
recorrer todo el contenido de punta a punta si ese es tu estilo. Cada perfil
incluye además las señales concretas de que ya estás para moverte a la
siguiente línea.

Si al terminar el test quedaste entre dos perfiles, leé la descripción de
ambos y elegí el que describe mejor tu *semana típica*, no tu mejor día.

## ¿Y si todavía no programás?

Para eso está la 🌸 [Línea Exploradora](perfil-explorador.md): los
fundamentos de MAPAIA se leen sin escribir código, y el perfil explorador
los encuadra para quien mira los agentes desde afuera del teclado. Eso sí:
las secciones de práctica y extensibilidad son técnicas — la ruta
exploradora es deliberadamente más corta, y si en algún momento arrancás a
programar, la [Línea Inicial](perfil-inicial.md) te espera.

## Preguntas frecuentes

**¿Puedo leer todo MAPAIA de corrido, sin perfil?**
Claro. Las rutas optimizan el orden y el énfasis, no esconden contenido:
todos los archivos están a la vista en el repo y enlazados desde el índice
del sitio. El pathing existe para que el camino corto sea el correcto, no
para cerrar puertas.

**¿El test guarda mis datos en algún lado?**
No. En el sitio, el resultado se guarda únicamente en el almacenamiento
local de tu navegador (para resaltar tu línea en el mapa); no hay backend,
cuentas ni analytics del resultado. Y en GitHub el "test" es este archivo
de texto: más privado, imposible.

**¿Qué pasa si mi situación cambia?**
Cambiás de línea y listo. Los perfiles incluyen las señales concretas de
que ya te queda chica tu ruta actual; cuando las reconozcas, pasate a la
siguiente. En el sitio podés cambiar la línea resaltada desde el propio
mapa, sin rehacer el test.

**¿Las rutas van a crecer?**
Ya crecieron: las secciones de práctica y de extensibilidad están publicadas
y cada línea suma sus estaciones. Si a futuro se agregan temas, los archivos
de perfil se actualizan con la ruta extendida, así que tu punto de entrada
sigue siendo el mismo.

**¿Por qué cuatro perfiles y no cinco, o diez?**
Porque estas cuatro situaciones cubren a la gran mayoría de los lectores
posibles, y cada perfil extra diluye a los demás. Preferimos pocas rutas
bien mantenidas: si una masa crítica de lectores no encaja en ninguna, ese
será el momento de repensarlo.

## → Siguiente paso

Dos minutos, seis preguntas: [hacé la autoevaluación](autoevaluacion.md) y
encontrá tu línea.
