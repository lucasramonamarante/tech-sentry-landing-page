const TS_UNIVERSE={
  itsm:{
    label:'Technology Operations',
    product:'Sentry-ITSM',
    status:'AVAILABLE',
    href:'/sentry-itsm/',
    accent:'#38d8ff',
    headline:'Operate technology with context.',
    copy:'Incidents, assets, CMDB, topology, observability and governed execution in one operational layer.',
    nodes:[['INCIDENT','Signal'],['CMDB','Context'],['TOPOLOGY','Impact'],['APPROVAL','Governance'],['VERIFY','Result']]
  },
  os:{
    label:'Business Operations',
    product:'Sentry-OS',
    status:'AVAILABLE',
    href:'/sentry-os/',
    accent:'#42e3a5',
    headline:'Operate the business as one system.',
    copy:'PDV, inventory, sales, customers and cash connected to the same operational context.',
    nodes:[['SALE','Signal'],['INVENTORY','Context'],['CUSTOMER','Relationship'],['CASH','Impact'],['RESULT','Outcome']]
  },
  nexus:{
    label:'Community Operations',
    product:'Sentry-Nexus',
    status:'IN DEVELOPMENT',
    href:'/sentry-nexus/',
    accent:'#a78bfa',
    headline:'Operate communities through relationships.',
    copy:'People, congregations, ministries, agenda and governed relationships designed as a connected community system.',
    nodes:[['FIELD','Structure'],['CONGREGATION','Node'],['PEOPLE','Community'],['AGENDA','Presence'],['GOVERNANCE','Control']]
  },
  home:{
    label:'Home Operations',
    product:'Sentry-Mobile Home',
    status:'PRODUCT DOMAIN',
    href:'/sentry-mobile-home/',
    accent:'#9f7aea',
    headline:'Operate the home as a connected environment.',
    copy:'A product domain for residential automation and simpler control across spaces and devices.',
    nodes:[['HOME','Domain'],['ROOMS','Context'],['DEVICES','Nodes'],['RULES','Control'],['STATE','Result']]
  }
};

function selectDomain(key){
  const d=TS_UNIVERSE[key];
  if(!d)return;
  document.body.dataset.domain=key;
  document.querySelectorAll('[data-domain-select]').forEach(btn=>btn.setAttribute('aria-selected',String(btn.dataset.domainSelect===key)));
  const product=document.getElementById('domain-product');
  const label=document.getElementById('domain-label');
  const status=document.getElementById('domain-status');
  const headline=document.getElementById('domain-headline');
  const copy=document.getElementById('domain-copy');
  const cta=document.getElementById('domain-cta');
  if(product)product.textContent=d.product;
  if(label)label.textContent=d.label;
  if(status)status.textContent=d.status;
  if(headline)headline.textContent=d.headline;
  if(copy)copy.textContent=d.copy;
  if(cta){cta.href=d.href;cta.textContent='Explore '+d.product+' →'}
  d.nodes.forEach((pair,i)=>{
    const node=document.querySelector('[data-cc-node="'+i+'"]');
    if(node)node.innerHTML=pair[0]+'<small>'+pair[1]+'</small>';
  });
  const pulseProduct=document.getElementById('pulse-product');
  const pulseStatus=document.getElementById('pulse-status');
  if(pulseProduct)pulseProduct.textContent=d.product;
  if(pulseStatus)pulseStatus.textContent=d.status;
}

function openCommand(){
  const m=document.getElementById('command-modal'); if(!m)return;
  m.classList.add('open');m.setAttribute('aria-hidden','false');
  const input=document.getElementById('command-input'); if(input){input.value='';input.focus()}
}
function closeCommand(){
  const m=document.getElementById('command-modal'); if(!m)return;
  m.classList.remove('open');m.setAttribute('aria-hidden','true');
}
function filterCommands(value){
  const q=(value||'').toLowerCase();
  document.querySelectorAll('[data-command]').forEach(el=>{
    el.style.display=el.dataset.command.includes(q)?'flex':'none';
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  selectDomain('itsm');
  document.querySelectorAll('[data-domain-select]').forEach(btn=>btn.addEventListener('click',()=>selectDomain(btn.dataset.domainSelect)));
  const input=document.getElementById('command-input');
  if(input)input.addEventListener('input',e=>filterCommands(e.target.value));
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}
    if(e.key==='Escape')closeCommand();
  });
  const items=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('visible'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  items.forEach(x=>io.observe(x));
});
