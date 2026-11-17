const reply=(obj,status=200)=>Response.json(obj,{status,headers:{'cache-control':'public, max-age=0, s-maxage=3600, stale-while-revalidate=300','x-content-type-options':'nosniff'}});
const SYMBOLS=['MSFT','GOOGL','AMZN','META','NVDA'];
export default async () => {
 const key=Netlify.env.get('FMP_API_KEY');if(!key)return reply({ok:false,error:'FMP_NOT_CONFIGURED'},503);
 try{
  const results=await Promise.all(SYMBOLS.map(async symbol=>{
   const url='https://financialmodelingprep.com/stable/profile?'+new URLSearchParams({symbol,apikey:key});
   const response=await fetch(url,{signal:AbortSignal.timeout(12000)});
   const body=await response.json();
   if(!response.ok||!Array.isArray(body)||!body[0]||body[0].symbol!==symbol) return {symbol,available:false,error:response.status===402?'SUBSCRIPTION_REQUIRED':'UNAVAILABLE'};
   const x=body[0];return {symbol,available:true,name:x.companyName||symbol,price:Number.isFinite(Number(x.price))?Number(x.price):null,currency:x.currency||'USD',exchange:x.exchangeShortName||null,source:'FMP /stable/profile',quoteTimestamp:null};
  }));
  return reply({ok:results.some(x=>x.available),source:'Financial Modeling Prep',fetchedAt:new Date().toISOString(),warning:'Profile price is not guaranteed to be real-time; quote timestamp is not supplied.',companies:results});
 }catch(e){return reply({ok:false,error:'FMP_FETCH_FAILED',detail:String(e.message).slice(0,140)},502)}
};
