const KEY = 'dc2:mappings:v1';
export function saveMappings(
  projectId: string,
  data: Record<string, Record<string, string>>
) {
  const all = JSON.parse(localStorage.getItem(KEY) || '{}');
  all[projectId] = data;
  localStorage.setItem(KEY, JSON.stringify(all));
}
export function loadMappings(projectId: string) {
  const all = JSON.parse(localStorage.getItem(KEY) || '{}');
  return (all[projectId] || {}) as Record<string, Record<string, string>>;
}
