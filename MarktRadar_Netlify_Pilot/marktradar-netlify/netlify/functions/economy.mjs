// BEA: NIPA Table T10105, Line 1: nominal US GDP in billions USD, quarterly.
const done = (data,status=200) => Response.json(data,{status,headers:{'cache-control':'public, max-age=0, s-maxage=21600, stale-while-revalidate=900','x-content-type-options':'nosniff'}});
export default async () => {
 const key=Netlify.env.get('BEA_API_KEY');
 if(!key)return done({ok:false,error:'BEA_NOT_CONFIGURED'},503);
 try {
  const params=new URLSearchParams({UserID:key,method:'GetData',datasetname:'NIPA',TableName:'T10105',Frequency:'Q',Year:'ALL',ResultFormat:'JSON'});
  const r=await fetch('https://apps.bea.gov/api/data/?'+params,{signal:AbortSignal.timeout(14000)});
  if(!r.ok)throw new Error('BEA HTTP '+r.status);
  const json=await r.json();
  const rows=json?.BEAAPI?.Results?.Data;
  if(!Array.isArray(rows))return done({ok:false,error:'BEA_RESPONSE_ERROR',detail:String(json?.BEAAPI?.Results?.Error?.APIErrorDescription||'No data returned').slice(0,180)},502);
  const points=rows.filter(x=>String(x.LineNumber)==='1'&&/^\d{4}Q[1-4]$/.test(String(x.TimePeriod))).map(x=>({period:x.TimePeriod,value:Number(String(x.DataValue).replace(/,/g,''))})).filter(x=>Number.isFinite(x.value)).sort((a,b)=>a.period.localeCompare(b.period));
  if(!points.length)return done({ok:false,error:'BEA_NO_GDP_VALUES'},502);
  return done({ok:true,source:'BEA',dataset:'NIPA T10105 Line 1',name:'US nominales BIP',unit:'Mrd. USD',frequency:'quarterly',observed:points.at(-1).period,latest:points.at(-1).value,points:points.slice(-60),fetchedAt:new Date().toISOString()});
 }catch(e){return done({ok:false,error:'BEA_FETCH_FAILED',detail:String(e.message).slice(0,150)},502)}
};
