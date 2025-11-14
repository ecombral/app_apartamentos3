import Papa from 'papaparse';
import { useEffect, useState } from 'react';

// hook: fetch a published CSV sheet and parse with PapaParse
// returns { data, loading, error }
export default function useGoogleSheet(sheetUrl, refreshSeconds = 60) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aborted = false;

    async function fetchSheet(){
      setLoading(true);
      setError(null);
      try{
        const res = await fetch(sheetUrl);
        const txt = await res.text();
        const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true });
        if (!aborted) setData(parsed.data || []);
      }catch(err){
        if (!aborted) setError(err);
      }finally{
        if (!aborted) setLoading(false);
      }
    }

    fetchSheet();
    const id = setInterval(fetchSheet, Math.max(5, refreshSeconds) * 1000);
    return ()=>{ aborted = true; clearInterval(id); };
  }, [sheetUrl, refreshSeconds]);

  return { data, loading, error };
}
