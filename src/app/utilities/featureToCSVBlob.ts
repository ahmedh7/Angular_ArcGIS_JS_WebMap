export function featuresToCsvBlob(
  features: __esri.Graphic[],
  filename: string
  ): { name: string; blob: Blob } 
  {
  if (!features.length) {
    return {
      name: filename,
      blob: new Blob(["\uFEFF"], { type: "text/csv;charset=utf-8;" })
    };
  }

  const fields = Object.keys(features[0].attributes);
  const header = fields.join(",");
  const rows = features.map(f =>
    fields
      .map(field => {
        const val = f.attributes[field];
        const safe = ("" + (val ?? "")).replace(/"/g, '""');
        return `"${safe}"`;
      })
      .join(",")
  );

  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  return { name: filename, blob };
}
