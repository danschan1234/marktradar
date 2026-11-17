export default async () => {
  const bea = Boolean(Netlify.env.get('BEA_API_KEY'));
  const fmp = Boolean(Netlify.env.get('FMP_API_KEY'));
  return Response.json({ service:'MarktRadar', connected:{beaConfigured:bea, fmpConfigured:fmp}, note:'Configured means the environment variable exists, not that the provider accepts it.' },{headers:{'cache-control':'no-store'}});
};
