const header = document.querySelector('.site-header');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 80));
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

const searchPanel = document.getElementById('searchPanel');
document.getElementById('searchOpen').addEventListener('click', () => { searchPanel.classList.toggle('open'); document.getElementById('searchInput').focus(); });
document.getElementById('searchClose').addEventListener('click', () => searchPanel.classList.remove('open'));
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const cards = [...document.querySelectorAll('.product-card')];
  const found = cards.filter(card => card.dataset.name.toLowerCase().includes(query));
  document.getElementById('searchResults').textContent = !query ? 'Masalan: iPhone, MacBook, iPad, Watch yoki AirPods' : found.length ? found.map(card => card.dataset.name).join(' • ') : 'Hech narsa topilmadi.';
  if (query) {
    cards.forEach(card => card.classList.toggle('hidden', !card.dataset.name.toLowerCase().includes(query)));
    document.getElementById('products').scrollIntoView({behavior:'smooth'});
  } else cards.forEach(card => card.classList.remove('hidden'));
});
searchInput.addEventListener('keydown', e => { if(e.key === 'Escape') searchPanel.classList.remove('open'); });

document.querySelectorAll('#categoryTabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#categoryTabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const track = document.getElementById('galleryTrack');
const slides = [...track.children];
const dots = document.getElementById('galleryDots');
let slideIndex = 0;
function visibleSlides(){ return window.innerWidth <= 650 ? 1 : 3; }
function maxIndex(){ return Math.max(0, slides.length - visibleSlides()); }
function renderCarousel(){
  slideIndex = Math.min(slideIndex, maxIndex());
  const gap = 18;
  const width = slides[0].getBoundingClientRect().width + gap;
  track.style.transform = `translateX(${-slideIndex * width}px)`;
  dots.innerHTML = '';
  for(let i=0;i<=maxIndex();i++){
    const dot=document.createElement('button');
    dot.setAttribute('aria-label',`Slayd ${i+1}`);
    dot.classList.toggle('active',i===slideIndex);
    dot.addEventListener('click',()=>{slideIndex=i;renderCarousel();});
    dots.appendChild(dot);
  }
}
document.getElementById('galleryPrev').addEventListener('click',()=>{slideIndex=slideIndex<=0?maxIndex():slideIndex-1;renderCarousel();});
document.getElementById('galleryNext').addEventListener('click',()=>{slideIndex=slideIndex>=maxIndex()?0:slideIndex+1;renderCarousel();});
window.addEventListener('resize',renderCarousel);
renderCarousel();
let carouselTimer = setInterval(()=>{slideIndex=slideIndex>=maxIndex()?0:slideIndex+1;renderCarousel();},4500);
track.addEventListener('mouseenter',()=>clearInterval(carouselTimer));
track.addEventListener('mouseleave',()=>{carouselTimer=setInterval(()=>{slideIndex=slideIndex>=maxIndex()?0:slideIndex+1;renderCarousel();},4500);});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll('.product-card,.feature-card,.mini-card,.service-grid article,.timeline article,.innovation-grid article').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(22px)';el.style.transition='opacity .65s ease, transform .65s ease';
  revealObserver.observe(el);
});
const style=document.createElement('style');
style.textContent='.revealed{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);
