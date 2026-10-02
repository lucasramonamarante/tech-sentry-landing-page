const TS_CONSENT_KEY='techsentry_consent';
const TS_ATTR_FIRST='techsentry_attr_first';
const TS_ATTR_LAST='techsentry_attr_last';
const TS_WHATSAPP='5511937364340';

function loadMetaPixel(){
  if(window.fbq)return;
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init','1086168663977296');
  fbq('track','PageView');
}

function loadLinkedIn(){
  if(window.lintrk)return;
  window._linkedin_partner_id='10536425';
  window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
  window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
  window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
  window.lintrk.q=[];
  const s=document.getElementsByTagName('script')[0],b=document.createElement('script');
  b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
  s.parentNode.insertBefore(b,s);
}

function enableAnalytics(){
  loadMetaPixel();
  loadLinkedIn();
  persistAttribution();
}

function setConsent(level){
  localStorage.setItem(TS_CONSENT_KEY,level);
  const b=document.getElementById('cookie-banner');
  if(b)b.classList.add('hidden');
  if(level==='analytics')enableAnalytics();
}

function trackEvent(name,data={}){
  if(localStorage.getItem(TS_CONSENT_KEY)!=='analytics')return;
  if(window.fbq)fbq('trackCustom',name,data);
}

function readAttribution(){
  const q=new URLSearchParams(location.search);
  const source=q.get('utm_source')||'direct';
  const medium=q.get('utm_medium')||'none';
  const campaign=q.get('utm_campaign')||'none';
  const content=q.get('utm_content')||'none';
  const term=q.get('utm_term')||'none';
  return {
    source,medium,campaign,content,term,
    page:location.pathname,
    referrer:document.referrer||'none',
    captured_at:new Date().toISOString()
  };
}

function persistAttribution(){
  if(localStorage.getItem(TS_CONSENT_KEY)!=='analytics')return;
  const attr=readAttribution();
  if(!localStorage.getItem(TS_ATTR_FIRST))localStorage.setItem(TS_ATTR_FIRST,JSON.stringify(attr));
  localStorage.setItem(TS_ATTR_LAST,JSON.stringify(attr));
}

function getAttributionForLead(){
  const current=readAttribution();
  if(localStorage.getItem(TS_CONSENT_KEY)==='analytics'){
    try{
      const last=JSON.parse(localStorage.getItem(TS_ATTR_LAST)||'null');
      return last||current;
    }catch(e){return current}
  }
  return current;
}

function openWhatsApp(context){
  const attr=getAttributionForLead();
  trackEvent('WhatsAppLead',{context,page:location.pathname,source:attr.source,campaign:attr.campaign});
  const lines=[
    'Olá, conheci a Tech Sentry pelo site e quero conversar sobre '+context+'.',
    '',
    'Origem: '+attr.source+' / '+attr.medium,
    'Campanha: '+attr.campaign,
    'Página: '+attr.page
  ];
  const msg=encodeURIComponent(lines.join('\n'));
  window.open('https://wa.me/'+TS_WHATSAPP+'?text='+msg,'_blank','noopener');
}

function toggleMenu(){
  const m=document.getElementById('mobile-menu'),b=document.getElementById('menu-button');
  if(!m)return;
  const hidden=m.classList.toggle('hidden');
  if(b)b.setAttribute('aria-expanded',String(!hidden));
}

document.addEventListener('DOMContentLoaded',()=>{
  const c=localStorage.getItem(TS_CONSENT_KEY);
  if(!c){
    const b=document.getElementById('cookie-banner');
    if(b)b.classList.remove('hidden');
  }
  if(c==='analytics')enableAnalytics();
  document.querySelectorAll('[data-track]').forEach(el=>{
    el.addEventListener('click',()=>trackEvent(el.dataset.track,{page:location.pathname}));
  });
});
