// SummaryPanel.tsx
type Props = {
  total: number;
  deduped: number;
  removed: number;
  invalidRut?: number;
};
export default function SummaryPanel({
  total,
  deduped,
  removed,
  invalidRut = 0,
}: Props) {
  return (
    <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9 }}>
      <b>Resumen:</b> {deduped} filas únicas de {total} (removidas {removed}{' '}
      duplicadas)
      {invalidRut > 0 && (
        <span style={{ marginLeft: 8, color: '#f7b500' }}>
          · {invalidRut} RUT no válidos (Módulo 11)
        </span>
      )}
    </div>
  );
}
