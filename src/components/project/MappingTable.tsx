type Row = Record<string, string>;

function MappingTable({
  files,
  tables,
  targetFields,
  mapping,
  onChange,
}: {
  files: File[];
  tables: Row[][];
  targetFields: string[];
  mapping: Record<string, Record<string, string>>;
  onChange: (m: Record<string, Record<string, string>>) => void;
}) {
  const setMap = (uploadId: string, original: string, target: string) => {
    const next = structuredClone(mapping);
    next[uploadId][original] = target;
    onChange(next);
  };

  return (
    <div>
      {files.map((f, i) => {
        const uploadId = String(i);
        const headers = Object.keys(tables[i]?.[0] ?? {});
        return (
          <div key={uploadId} className="card">
            <strong>{f.name}</strong>
            <table style={{ width: '100%', marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Columna origen</th>
                  <th></th>
                  <th>Campo destino</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((h) => (
                  <tr key={h}>
                    <td>{h}</td>
                    <td>→</td>
                    <td>
                      <select
                        value={mapping[uploadId]?.[h] ?? ''}
                        onChange={(e) => setMap(uploadId, h, e.target.value)}
                      >
                        <option value="">—</option>
                        {targetFields.map((tf) => (
                          <option key={tf} value={tf}>
                            {tf}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default MappingTable;
