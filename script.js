// LANG - WITH PERSISTENCE
function setLang(l){
  localStorage.setItem('sabeel-lang',l);
  document.body.classList.remove('lang-sw','lang-en','lang-ar');
  document.body.classList.add('lang-'+l);
  document.querySelectorAll('.lb').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.lb').forEach(b=>{
    if(b.textContent.trim().toLowerCase()===l||(l==='ar'&&b.textContent.trim()==='عربي'))b.classList.add('on');
  });
  document.documentElement.lang=l;
  document.documentElement.dir=l==='ar'?'rtl':'ltr';
}
// Restore language on page load
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('sabeel-lang')||'sw';
  setLang(savedLang);
});

// MODALS
function openModal(id){document.getElementById(id).classList.add('open');document.body.style.overflow='hidden';setPaymentStep(id,1);}
function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
function closeBg(e,id){if(e.target===document.getElementById(id))closeModal(id);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.ov.open').forEach(o=>o.classList.remove('open'));document.body.style.overflow='';}});

function setPaymentStep(modalId, step){
  const modal=document.getElementById(modalId); if(!modal) return;
  modal.querySelectorAll('.pay-step-panel').forEach(panel=>panel.classList.toggle('active', panel.dataset.step===String(step)));
  modal.querySelectorAll('.pay-step').forEach((pill,index)=>pill.classList.toggle('active', index===step-1));
  const status=modal.querySelector('.pay-step-status');
  if(status){
    status.innerHTML = step===1
      ? '<span data-sw>Hatua 1 ya 2</span><span data-en>Step 1 of 2</span><span data-ar>الخطوة 1 من 2</span>'
      : '<span data-sw>Hatua 2 ya 2</span><span data-en>Step 2 of 2</span><span data-ar>الخطوة 2 من 2</span>';
  }
}
function nextPaymentStep(modalId){setPaymentStep(modalId,2);}
function prevPaymentStep(modalId){setPaymentStep(modalId,1);}
function sendPromoCode(modalId){
  const modal=document.getElementById(modalId); if(!modal) return;
  const phone=modal.querySelector('input[type="tel"]')?.value.trim();
  const email=modal.querySelector('input[type="email"]')?.value.trim();
  if(!phone && !email){
    alert('Please enter your phone number or email to receive a promo code.');
    return;
  }
  alert('Promo code request sent. Please check ' + (phone || email) + '.');
}
function confirmPayment(modalId){
  const modal=document.getElementById(modalId); if(!modal) return;
  const promo=modal.querySelector('input[name="promo_code"]')?.value.trim();
  if(promo){
    alert('Promo code applied. Proceeding to pay now.');
  } else {
    alert('Proceeding to pay now.');
  }
  closeModal(modalId);
}

// AMOUNT SELECT
function selAmt(btn){btn.closest('.amt-g').querySelectorAll('.amt-b').forEach(b=>b.classList.remove('on'));btn.classList.add('on');}

// PAY METHOD
document.querySelectorAll('.pay-m').forEach(pm=>{
  pm.querySelectorAll('.pay-b').forEach(b=>{
    b.addEventListener('click',()=>{pm.querySelectorAll('.pay-b').forEach(x=>x.classList.remove('on'));b.classList.add('on');});
  });
});

// CALCULATORS
function calcKhums(){
  const i=parseFloat(document.getElementById('income').value)||0;
  const e=parseFloat(document.getElementById('expenses').value)||0;
  document.getElementById('khumsResult').textContent='TZS '+Math.round(Math.max(0,(i-e))*0.2).toLocaleString();
}
function calcZakat(){
  const w=parseFloat(document.getElementById('zakat-wealth').value)||0;
  document.getElementById('zakat-result').textContent='TZS '+Math.round(w*0.025).toLocaleString();
}
function calcFidyah(){
  const d=parseFloat(document.getElementById('fidyah-days').value)||0;
  document.getElementById('fidyah-result').textContent='TZS '+Math.round(d*7500).toLocaleString();
}

// SCROLL ANIMATIONS
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis');});},{threshold:.1});
document.querySelectorAll('.fiu,.dc').forEach(el=>io.observe(el));

// PROGRESS BAR
const pb=document.getElementById('pbar');
if(pb){new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)setTimeout(()=>{pb.style.width='45%';},400);});},{threshold:.4}).observe(pb.closest('section'));}

// NAV SCROLL
window.addEventListener('scroll',()=>{
  document.getElementById('mnav').style.background=window.scrollY>50?'rgba(7,26,14,1)':'rgba(7,26,14,.96)';
});

// HAMBURGER MENU
function toggleHamburger(){
  const menu=document.getElementById('ham-menu');
  if(menu)menu.classList.toggle('open');
}
function closeHamburger(){
  const menu=document.getElementById('ham-menu');
  if(menu)menu.classList.remove('open');
}
document.addEventListener('DOMContentLoaded',()=>{
  const hamBtn=document.getElementById('ham-btn');
  if(hamBtn)hamBtn.addEventListener('click',toggleHamburger);
  document.querySelectorAll('.ham-link').forEach(link=>{
    link.addEventListener('click',closeHamburger);
  });
  document.addEventListener('click',(e)=>{
    const menu=document.getElementById('ham-menu');
    const hamBtn=document.getElementById('ham-btn');
    if(menu&&!menu.contains(e.target)&&!hamBtn.contains(e.target)){
      closeHamburger();
    }
  });
});