const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus()}});
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#service').value=link.dataset.service}));
document.querySelector('#enquiry').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#form-status').textContent='Preview complete. In the finished website, your enquiry will be sent to Pearson and you’ll see a confirmation here. Nothing has been sent or saved.'});

const paletteNames={'sky-cocoa':'SKY & COCOA',blue:'WORKSHOP BLUE',oxblood:'OXBLOOD',forest:'DEEP FOREST'};
document.querySelectorAll('[data-palette-choice]').forEach(button=>button.addEventListener('click',()=>{
 const choice=button.dataset.paletteChoice;
 document.documentElement.dataset.palette=choice;
 document.querySelector('#palette-name').textContent=paletteNames[choice];
 document.querySelectorAll('[data-palette-choice]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));

// Animate once on entry. Content stays visible when JavaScript or motion is unavailable.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const activeReveals=new Set();
const revealTargets=[...document.querySelectorAll('.hero-panel, .section-head, .project, .service-grid article, .about > .about-copy, .steps li, .areas > div, .faq > div, .contact-grid > div')];
let revealObserver;
if('IntersectionObserver' in window && Element.prototype.animate){
 revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const node=entry.target;
   revealObserver.unobserve(node);
   if(motionPreference.matches)return;
   const hero=node.classList.contains('hero-panel');
   const group=node.closest('.project-grid, .service-grid, .steps');
   const siblings=group?[...group.querySelectorAll('.project, article, li')]:[];
   const delay=hero?650:200+Math.max(0,siblings.indexOf(node))*300;
   const animation=node.animate([{opacity:0,transform:hero?'translateX(-100px)':'translateY(45px)'},{opacity:1,transform:'translate(0,0)'}],{duration:hero?1800:1300,delay,easing:'cubic-bezier(.22,.7,.25,1)',fill:'backwards'});
   activeReveals.add(animation);
   animation.onfinish=()=>activeReveals.delete(animation);
   animation.oncancel=()=>activeReveals.delete(animation);
  });
 },{threshold:0.16});
 revealTargets.forEach(node=>revealObserver.observe(node));
 motionPreference.addEventListener('change',event=>{if(event.matches){activeReveals.forEach(animation=>animation.cancel());activeReveals.clear()}});
 document.addEventListener('focusin',()=>{activeReveals.forEach(animation=>{if(animation.effect.target.contains(document.activeElement))animation.finish()})});
}
