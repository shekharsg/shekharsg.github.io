(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const pubs = document.querySelectorAll('.publication-entry');
  if (filterButtons.length && pubs.length) {
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      pubs.forEach(pub => {
        const show = filter === 'all' || pub.dataset.type === filter;
        pub.classList.toggle('hidden', !show);
      });
      document.querySelectorAll('.publication-group-title').forEach(group => {
        const showGroup = filter === 'all' || group.dataset.pubGroup === filter;
        group.classList.toggle('hidden', !showGroup);
      });
    }));
  }

  const figures = document.querySelectorAll('.zoomable');
  if (figures.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button aria-label="Close image">&times;</button><img alt="Expanded research figure">';
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    const close = () => { lb.classList.remove('open'); document.body.classList.remove('menu-open'); };
    figures.forEach(fig => fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt || 'Expanded research figure';
      lb.classList.add('open');
      document.body.classList.add('menu-open');
    }));
    lb.querySelector('button').addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
})();

// Collaboration network: CV-grounded, dependency-free SVG visualization.
(() => {
  const svgs = document.querySelectorAll('.collab-network');
  if (!svgs.length) return;

  const NS = 'http://www.w3.org/2000/svg';
  const nodes = [
    {id:'ssg', name:'Shekhar S. Goyal', short:'SSG', role:'Research Scientist · UFZ', group:'core', x:470, y:305, tags:['nitrogen','food','water','team'], copy:'Environmental systems scientist connecting agricultural nutrients, food trade, water systems and environmental data science.'},
    {id:'rohini', name:'Rohini Kumar', short:'RK', role:'Research collaborator', group:'core', x:470, y:82, tags:['nitrogen','food','water'], strength:'strong', copy:'Co-author across the four peer-reviewed/accepted papers listed in the CV and collaborator on current nitrogen, trade and river-temperature research.'},
    {id:'udit', name:'Udit Bhatia', short:'UB', role:'Research collaborator · PhD advisor', group:'food', x:255, y:118, tags:['nitrogen','food'], strength:'strong', copy:'PhD advisor and co-author across the India nitrogen-budget, interstate-trade, crop-restructuring and sustainable-nitrogen-management research arc.'},
    {id:'wim', name:'Wim de Vries', short:'WdV', role:'Research collaborator', group:'nitrogen', x:690, y:118, tags:['nitrogen'], strength:'medium', copy:'Collaborator on sustainable nitrogen management in India and European environmental nitrogen-management research.'},
    {id:'masooma', name:'Masooma Batool', short:'MB', role:'Research collaborator · UNLOCK postdoc', group:'nitrogen', x:810, y:235, tags:['nitrogen','team'], strength:'medium', copy:'Co-author on European nitrogen-management manuscripts and Postdoctoral Researcher in the UNLOCK project (2026).'},
    {id:'sarrazin', name:'F. J. Sarrazin', short:'FJS', role:'Research collaborator', group:'nitrogen', x:830, y:375, tags:['nitrogen'], strength:'medium', copy:'Co-author on current European environmental nitrogen-management manuscripts.'},
    {id:'ros', name:'G. H. Ros', short:'GHR', role:'Research collaborator', group:'nitrogen', x:735, y:515, tags:['nitrogen'], strength:'medium', copy:'Co-author on current European nitrogen-management manuscripts spanning environmental indicators and pollution reduction.'},
    {id:'raviraj', name:'Raviraj Dave', short:'RD', role:'Research collaborator', group:'food', x:275, y:505, tags:['nitrogen','food'], copy:'Co-author on the Communications Earth & Environment paper on Indian interstate trade and nutrient pollution and the 2025 EGU contribution.'},
    {id:'adrija', name:'Adrija Datta', short:'AD', role:'Research collaborator · Visiting PhD scholar', group:'food', x:130, y:380, tags:['food','team'], copy:'Collaborator on global crop-trade research and a Visiting PhD Scholar mentored under the IIT Gandhinagar overseas visiting scheme.'},
    {id:'giardino', name:'C. Giardino', short:'CG', role:'Research collaborator', group:'water', x:105, y:245, tags:['water'], copy:'Co-author on the current satellite-derived land-surface-temperature river-water-temperature manuscript.'},
    {id:'bresciani', name:'M. Bresciani', short:'MBR', role:'Research collaborator', group:'water', x:145, y:115, tags:['water'], copy:'Co-author on spatially distributed river-water-temperature modelling using satellite-derived land-surface temperature.'},
    {id:'muhlbauer', name:'S. Mühlbauer', short:'SM', role:'Research collaborator', group:'water', x:110, y:520, tags:['water'], copy:'Co-author on the current satellite-informed river-water-temperature modelling manuscript.'},
    {id:'schmidt', name:'C. Schmidt', short:'CS', role:'Research collaborator', group:'water', x:350, y:565, tags:['water'], strength:'medium', copy:'Co-author on river-temperature modelling and the 2026 high-resolution river-temperature atlas conference contribution.'},
    {id:'nihal', name:'Nihal Jalal', short:'NJ', role:'Research team · supervision', group:'team', x:470, y:570, tags:['team'], relation:'team', copy:'Research Assistant / Graduate Researcher at the University of Leipzig; research supervision within the UNLOCK project.'},
    {id:'perinban', name:'Perinban Parameshwaran', short:'PP', role:'Research team · supervision', group:'team', x:600, y:565, tags:['team'], relation:'team', copy:'Research Assistant / Graduate Researcher; research supervision within the UNLOCK project.'},
    {id:'shaonli', name:'Shaonli Mishra', short:'SMI', role:'Research team · mentoring', group:'team', x:710, y:405, tags:['team'], relation:'team', copy:'Master’s / graduate thesis co-supervision and research mentoring at IIT Gandhinagar.'}
  ];

  const compactIds = new Set(['ssg','rohini','udit','wim','masooma','adrija','schmidt','bresciani']);
  const labelOffset = {ssg:58, rohini:45, udit:42, wim:42, masooma:42, sarrazin:42, ros:42, raviraj:42, adrija:42, giardino:42, bresciani:42, muhlbauer:42, schmidt:42, nihal:42, perinban:42, shaonli:42};

  function el(name, attrs={}) {
    const e = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, String(v)));
    return e;
  }

  function splitName(name) {
    if (name.length <= 15) return [name];
    const parts = name.split(' ');
    if (parts.length === 2) return parts;
    const mid = Math.ceil(parts.length/2);
    return [parts.slice(0,mid).join(' '), parts.slice(mid).join(' ')];
  }

  function render(svg) {
    const compact = svg.dataset.compact === 'true';
    svg.innerHTML = '';
    svg.dataset.filter = 'all';

    const halo1 = el('circle',{cx:470,cy:305,r:150,class:'network-halo'});
    const halo2 = el('circle',{cx:470,cy:305,r:250,class:'network-halo'});
    svg.append(halo1, halo2);

    const visibleNodes = nodes.filter(n => !compact || compactIds.has(n.id));
    const edgeLayer = el('g',{'aria-hidden':'true'});
    const nodeLayer = el('g');
    svg.append(edgeLayer,nodeLayer);

    visibleNodes.filter(n=>n.id!=='ssg').forEach(n => {
      const cls = ['collab-edge', n.relation==='team'?'team':'research'];
      if(n.strength) cls.push(n.strength);
      const line = el('line',{x1:470,y1:305,x2:n.x,y2:n.y,class:cls.join(' '),'data-node':n.id,'data-tags':n.tags.join(' ')});
      edgeLayer.appendChild(line);
    });

    visibleNodes.forEach(n => {
      const g = el('g',{class:`collab-node group-${n.group}${n.id==='ssg'?' self':''}`,transform:`translate(${n.x} ${n.y})`,tabindex:'0',role:'button','aria-label':n.name,'data-node':n.id,'data-tags':n.tags.join(' ')});
      const r = n.id==='ssg' ? (compact?34:40) : (n.strength==='strong'?29:n.strength==='medium'?25:22);
      g.appendChild(el('circle',{cx:0,cy:0,r}));
      const initials=el('text',{x:0,y:1,class:'node-initials'}); initials.textContent=n.short; g.appendChild(initials);
      const lines=splitName(n.name);
      lines.forEach((line,i)=>{ const t=el('text',{x:0,y:(labelOffset[n.id]||42)+(i*15),class:'node-name'}); t.textContent=line; g.appendChild(t); });
      const title=el('title'); title.textContent=`${n.name} — ${n.role}`; g.appendChild(title);
      const activate=()=>selectNode(n,svg,compact);
      g.addEventListener('click',activate);
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
      nodeLayer.appendChild(g);
    });
  }

  function selectNode(node, svg, compact) {
    if(compact && node.id!=='ssg') { window.location.href=`collaborations.html#network-${node.id}`; return; }
    svg.querySelectorAll('.collab-node').forEach(n=>n.classList.toggle('selected',n.dataset.node===node.id));
    const details=document.querySelector('.network-details');
    if(!details) return;
    details.querySelector('[data-network-title]').textContent=node.name;
    details.querySelector('[data-network-role]').textContent=node.role;
    details.querySelector('[data-network-copy]').textContent=node.copy;
    const tags=details.querySelector('[data-network-tags]');
    const names={nitrogen:'Nutrient systems',food:'Food & trade',water:'Water & temperature',team:'Team / mentoring'};
    tags.innerHTML=node.tags.map(t=>`<span>${names[t]}</span>`).join('');
    history.replaceState(null,'',`#network-${node.id}`);
  }

  function applyFilter(filter) {
    svgs.forEach(svg=>{
      svg.dataset.filter=filter;
      svg.querySelectorAll('.collab-node').forEach(g=>{
        if(g.dataset.node==='ssg'){g.classList.remove('hidden');return;}
        const show=filter==='all'||g.dataset.tags.split(' ').includes(filter);
        g.classList.toggle('hidden',!show);
      });
      svg.querySelectorAll('.collab-edge').forEach(line=>{
        const show=filter==='all'||line.dataset.tags.split(' ').includes(filter);
        line.classList.toggle('hidden',!show);
      });
    });
  }

  svgs.forEach(render);
  document.querySelectorAll('.network-filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.network-filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); applyFilter(btn.dataset.networkFilter);
  }));

  const hash=location.hash.match(/^#network-(.+)$/);
  if(hash){
    const node=nodes.find(n=>n.id===hash[1]);
    const full=[...svgs].find(s=>s.dataset.compact==='false');
    if(node&&full) selectNode(node,full,false);
  }
})();
