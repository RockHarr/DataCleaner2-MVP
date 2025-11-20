# DataCleaner — MVP

MVP para **unificar y limpiar planillas CSV** típicas del sector público chileno  
(RUT, nombres, regiones), consolidándolas en **un solo dataset utilizable**.

Pensado para equipos de gestión, transparencia, planificación y estadísticas que
trabajan con datos provenientes de distintas fuentes (Excel, sistemas heredados, oficinas regionales).

---

## uncionalidades

- **Subir múltiples CSV** y previsualizar columnas.
- **Mapeo de columnas** de origen → campos destino (`rut`, `nombres`, `region`).
- **Limpieza automática**:
  - `rut`: trim, colapsar espacios, **formateo** y normalización.
  - `nombres`: trim + **Title Case**.
  - `region`: trim + colapsar espacios + **normalización a nombre oficial** (maneja “V A L P A R A Í S O”, etc.).
- **Deduplicación por RUT** (opcional, conserva la última aparición).
- **Exportación CSV “modo Excel”**:
  - Separador configurable (`,` o `;`).
  - **BOM + CRLF** para que Excel abra acentos correctamente.

---


Uso

Sube tus CSV (arrastrar/soltar o botón “Elegir archivos”).

Define el mapeo para cada archivo (columna origen → rut, nombres, region).

(Opcional) Activa “Quitar duplicados por RUT”.

En Exportar, selecciona:

Separador: ; (Excel LatAm) o ,.

Compatibilidad Excel (BOM+CRLF): ✔️ recomendado.

Haz clic en Exportar CSV y abre el archivo en Excel.

Reglas de limpieza

RUT

trim + normalizeWhitespace (colapsa espacios).

normalizeRut: limpia caracteres, deja DV y aplica formato xx.xxx.xxx-D.

Nombres

trim + normalizeWhitespace + toTitleCase.

Región

trim + normalizeWhitespace + normalizeRegion.

Corrige variantes con y sin tildes, mayúsculas separadas por espacios, etc.

src/
  components/
    project/
      UploadArea.tsx       # Subida de CSV (drag & drop)
      MappingTable.tsx     # UI de mapeo de columnas
      ExportBar.tsx        # Opciones de exportación
      SummaryPanel.tsx     # Totales / únicas / removidas
  lib/
    datacleaner/
      consolidate.ts       # Une tablas según mapeo → matriz unificada
      clean.ts             # Reglas de limpieza (RUT, nombres, región)
      dedupe.ts            # Dedupe por RUT
      exportCsv.ts         # Export con BOM + CRLF + separador
  services/
    csvService.ts          # Parser CSV (PapaParse / File API)
    schemaService.ts       # Persistencia de mapeos (localStorage)
types.ts                   # Tipos de Row, config, etc.
samples/
  personas_a.csv
  personas_b.csv
  personas_c.csv


  Scripts

npm run dev — Vite en modo desarrollo.

npm run build — Build de producción.

npm run preview — Sirve el build localmente.

Troubleshooting

Excel muestra caracteres raros (Ã, �, etc.).
Exporta con “Compatibilidad Excel (BOM+CRLF)” ✔️.
Si tu Excel espera ; como separador (config regional), marca ;.

Los nombres salen con espacios dobles/puntos raros.
Revisa que tu fuente no traiga caracteres invisibles.
La app ya colapsa espacios; puedes sumar reglas adicionales (ver Roadmap).

Roadmap breve

 Validación DV de RUT (Módulo 11) con conteo de inválidos.

 Ampliar REGION_MAP con más variantes.

 Regla extra para nombres: remover puntos residuales (A. Perez → A Perez opcional).

 Soporte .xlsx (entrada/salida) y plantillas de mapeo nombradas.

 Reporte JSON de consolidación/limpieza.


 

 Créditos

Hecho por Rockwell Harrison Hernández y Spark (tu copiloto)

Deploy trigger: $(date)
 
