samples/ – DataCleaner pruebas

Esta carpeta contiene CSV de prueba para validar el flujo completo: subir → mapear → limpiar → (dedupe opcional) → exportar.

Archivos
Archivo	Encoding	Propósito principal	Casuísticas destacadas
personas_test_mixed.csv	UTF-8 (sin BOM)	Mezcla “realista” de problemas	Región en letras separadas (V A L P A R A Í S O), alias (RM, Bio Bio), duplicados por RUT, DV inválido, espacios múltiples, nombres con puntos (A. Perez)
personas_test_win1252.csv	Windows-1252	Verificar fallback de decodificación	Tildes/eñes típicas de Excel/Windows; debe leerse sin “mojibake”
personas_test_extra_cols.csv	UTF-8 (con fila vacía intercalada)	Encabezados y columnas “raras”	Headers distintos (full_name, reg, rut_chile), fila vacía, duplicado exacto, DV inválido, valores con ; dentro del texto

Descargas directas:

personas_test_mixed.csv

personas_test_win1252.csv

personas_test_extra_cols.csv

Cómo mapear en la app

Para cada archivo:

rut ⟵ RUT o rut_chile

nombres ⟵ NOMBRE COMPLETO o full_name

region ⟵ REGIÓN o reg

La app guarda el mapeo en localStorage, así puedes refrescar y seguir.

Qué valida cada archivo
1) personas_test_mixed.csv

Región “espaciada”: V A L P A R A Í S O → Valparaíso (el normalizador colapsa letras separadas).

Alias de región: RM, Bio Bio, Valparaiso → nombres oficiales (p. ej. Metropolitana de Santiago, Biobío, Valparaíso).

Duplicados por RUT: p. ej. 11.111.111-1, 22.222.222-2.

RUT inválido: 12.345.678-9 (DV incorrecto) — el resumen cuenta inválidos si activaste el validador.

Nombre con ruido: A. Perez, dobles espacios, mayúsculas sostenidas: quedan Title Case y con espacios colapsados.

2) personas_test_win1252.csv

Debe abrir sin mojibake gracias al fallback windows-1252 del csvService.

Revisa que tildes y eñes se vean correctas (Valparaíso, Biobío, Niño, Peñalillo).

3) personas_test_extra_cols.csv

Headers distintos (para forzar mapeo).

Fila vacía intercalada (el parser la ignora con skipEmptyLines).

Duplicado exacto por RUT (si activas Quitar duplicados por RUT, desaparece).

DV inválido en un registro (aparece en el contador de inválidos del resumen).

Valores con ; dentro del texto (no rompen si exportas con separador ;, porque se escapan con comillas).

Resultado esperado (limpieza)

Con las reglas por defecto:

rut: formato xx.xxx.xxx-D y espacios colapsados.

nombres: Title Case y espacios normalizados.

region: nombres oficiales (corrige alias, tildes, y letras separadas).

Con dedupe por RUT activado:

Se mantiene la última aparición de cada RUT (el panel muestra cuántas filas fueron removidas).

Exportación y Excel

Al exportar, usa:

Separador ; (recomendado para configuración regional ES/LatAm).

Compatibilidad Excel (BOM + CRLF) ✅ para que se vean bien las tildes.

En el README principal hay más detalles de codificación.

Lista de verificación rápida

 El preview muestra conteo total / únicas / removidas.

 Regiones problemáticas (V A L P A R A Í S O, Bio Bio, RM) quedan normalizadas.

 Duplicados desaparecen con el toggle activado.

 RUT inválidos aparecen contados en el resumen (si activaste el validador).

 El CSV exportado abre en Excel con tildes correctas (BOM+CRLF) y separador elegido.