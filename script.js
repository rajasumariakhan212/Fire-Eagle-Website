document.addEventListener('DOMContentLoaded',function(){
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.menu > ul > li > a').forEach(a=>{
    if((a.getAttribute('href')||'').toLowerCase()===current)a.classList.add('active');
  });

  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.menu');
  if(toggle){
    toggle.addEventListener('click',()=>menu.classList.toggle('open'));
  }

  document.querySelectorAll('.menu > ul > li > a').forEach(a=>{
    a.addEventListener('click',function(e){
      const li=this.parentElement;
      const sub=li.querySelector(':scope > ul');
      if(window.innerWidth<=991 && sub){
        e.preventDefault();
        li.classList.toggle('open');
      }
    });
  });

  const slides=[...document.querySelectorAll('.slide')];
  if(slides.length){
    let i=0;
    slides[0].classList.add('active');
    setInterval(()=>{
      slides[i].classList.remove('active');
      i=(i+1)%slides.length;
      slides[i].classList.add('active');
    },5000);
  }

  // The reference gallery uses a moving carousel. Three gallery images remain
  // visible at desktop width, with a continuous step-through transition.
  document.querySelectorAll('.gallery-track').forEach(track=>{
    const items=[...track.querySelectorAll('.gallery-item')];
    if(items.length<4)return;
    items.slice(0,3).forEach(item=>track.appendChild(item.cloneNode(true)));
    let index=0;
    const move=()=>{
      const item=track.querySelector('.gallery-item');
      if(!item)return;
      const width=item.getBoundingClientRect().width;
      track.style.transform=`translateX(-${index*width}px)`;
      index++;
      if(index>=items.length-2){
        setTimeout(()=>{
          track.style.transition='none';
          index=0;
          track.style.transform='translateX(0)';
          requestAnimationFrame(()=>requestAnimationFrame(()=>track.style.transition='transform 1s ease'));
        },1050);
      }
    };
    setInterval(move,4000);
  });

  // The reference client-logo carousel shows six items at desktop width and advances
  // by one item at a time. The duplicated set lets the loop restart without changing
  // the visible count or producing a blank frame.
  document.querySelectorAll('.clients-track').forEach(track=>{
    const originals=[...track.querySelectorAll('img')];
    if(originals.length<6)return;

    const visibleCount=6;
    const existingCount=originals.length;
    let index=0;
    let timer;

    const step=()=>{
      const item=track.querySelector('img');
      if(!item)return;
      const gap=parseFloat(getComputedStyle(track).gap)||0;
      const width=item.getBoundingClientRect().width+gap;

      track.style.transition='transform 1s ease';
      track.style.transform=`translate3d(-${index*width}px,0,0)`;
      index++;

      if(index>=existingCount-visibleCount+1){
        window.setTimeout(()=>{
          track.style.transition='none';
          index=0;
          track.style.transform='translate3d(0,0,0)';
          void track.offsetWidth;
          track.style.transition='transform 1s ease';
        },1100);
        index=0;
      }
    };

    const start=()=>{
      window.clearInterval(timer);
      timer=window.setInterval(step,3500);
    };

    start();
    window.addEventListener('resize',()=>{
      track.style.transition='none';
      track.style.transform='translate3d(0,0,0)';
      index=0;
      window.requestAnimationFrame(()=>{
        track.style.transition='transform 1s ease';
      });
    });
  });



  // Shared transition system for all pages. It animates existing elements only;
  // no content or layout is added or replaced.
  const revealSelectors=[
    '.topbar .inner>div',
    '.brand',
    '.hero',
    '.home-about .copy',
    '.home-about .photo',
    '.solutions .section-title',
    '.solutions .devider',
    '.solution',
    '.gallery-item',
    '.benefits .copy',
    '.benefits .image',
    '.clients img',
    '.inner-section .inner-image',
    '.inner-section .inner-copy',
    '.projects .project-heading',
    '.projects .table-wrap',
    '.contact-map',
    '.contact-grid',
    'footer .footer-grid>*',
    '.artha-footer .footer-grid>*'
  ];

  const revealTargets=[];
  revealSelectors.forEach(selector=>{
    document.querySelectorAll(selector).forEach((el)=>{
      if(!revealTargets.includes(el))revealTargets.push(el);
    });
  });

  revealTargets.forEach((el,index)=>{
    el.classList.add('reveal-on-scroll');
    if(index%3===1)el.classList.add('delay-1');
    if(index%3===2)el.classList.add('delay-2');
    if(el.matches('.home-about .copy,.inner-section .inner-copy,.benefits .copy,.contact-grid'))el.classList.add('from-left');
    if(el.matches('.home-about .photo,.inner-section .inner-image,.benefits .image,.contact-map'))el.classList.add('from-right');
  });

  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver((entries,observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach(el=>revealObserver.observe(el));
  }else{
    revealTargets.forEach(el=>el.classList.add('is-visible'));
  }

  const top=document.querySelector('.totop');
  if(top){
    window.addEventListener('scroll',()=>top.classList.toggle('show',window.scrollY>300));
    top.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  const form=document.querySelector('#form-contact1');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const s=document.querySelector('#mail_success'),er=document.querySelector('#mail_failed');
      if(s)s.style.display='block';
      if(er)er.style.display='none';
    });
  }
});
