document.addEventListener('DOMContentLoaded', function () {

    
    (function () {
        const carousel  = document.getElementById('glr-carousel');
        const trilha    = document.getElementById('glr-trilha');
        const total     = parseInt(carousel.dataset.total, 10);
        const indWrap   = document.getElementById('glr-indicadores');
        const contador  = document.getElementById('glr-contador');
        let atual       = 0;
        let timer;

        
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'glr-dot' + (i === 0 ? ' ativo' : '');
            d.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
            d.addEventListener('click', () => irPara(i));
            indWrap.appendChild(d);
        }

        function irPara(idx) {
            atual = (idx + total) % total;
            trilha.style.transform = `translateX(-${atual * 100}%)`;
            document.querySelectorAll('.glr-dot').forEach((d, i) =>
                d.classList.toggle('ativo', i === atual));
            contador.textContent = `${atual + 1} / ${total}`;
            resetTimer();
        }

        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(() => irPara(atual + 1), 5500);
        }

        document.getElementById('glr-prev').addEventListener('click', () => irPara(atual - 1));
        document.getElementById('glr-next').addEventListener('click', () => irPara(atual + 1));

        
        let startX = 0;
        trilha.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
        trilha.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) irPara(diff > 0 ? atual + 1 : atual - 1);
        });

        resetTimer();
    })();


    
    (function () {
        const btns  = document.querySelectorAll('.glr-btn-filtro');
        const cards = document.querySelectorAll('.glr-grade .glr-card');
        const aviso = document.getElementById('glr-sem-resultados');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('ativo'));
                btn.classList.add('ativo');
                const cat = btn.dataset.cat;
                let visiveis = 0;
                cards.forEach(card => {
                    const mostrar = cat === 'todos' || card.dataset.categoria === cat;
                    card.style.display = mostrar ? '' : 'none';
                    if (mostrar) visiveis++;
                });
                aviso.style.display = visiveis === 0 ? 'block' : 'none';
            });
        });
    })();


    
    (function () {
        const lightbox  = document.getElementById('glr-lightbox');
        const lbImg     = document.getElementById('glr-lb-img');
        const lbTitulo  = document.getElementById('glr-lb-titulo');
        const lbSub     = document.getElementById('glr-lb-sub');
        const lbCont    = document.getElementById('glr-lb-contador');
        const btnFechar = document.getElementById('glr-fechar');
        const btnPrev   = document.getElementById('glr-lb-prev');
        const btnNext   = document.getElementById('glr-lb-next');

        let indiceAtual = 0;
        let cardsVisiveis = [];

        function atualizarListaVisivel() {
            cardsVisiveis = Array.from(
                document.querySelectorAll('.glr-grade .glr-card:not([style*="display: none"])')
            );
        }

        function abrirLightbox(idx) {
            atualizarListaVisivel();
            indiceAtual = idx;
            const card = cardsVisiveis[indiceAtual];
            lbImg.src     = card.querySelector('img').src;
            lbImg.alt     = card.querySelector('img').alt;
            lbTitulo.textContent = card.dataset.titulo || '';
            lbSub.textContent    = card.dataset.sub    || '';
            lbCont.textContent   = `${indiceAtual + 1} / ${cardsVisiveis.length}`;
            lightbox.classList.add('aberto');
            document.body.style.overflow = 'hidden';
        }

        function fecharLightbox() {
            lightbox.classList.remove('aberto');
            document.body.style.overflow = '';
            lbImg.src = '';
        }

        function navegar(dir) {
            indiceAtual = (indiceAtual + dir + cardsVisiveis.length) % cardsVisiveis.length;
            abrirLightbox(indiceAtual);
        }

        
        document.querySelectorAll('.glr-grade .glr-card').forEach((card) => {
            card.addEventListener('click', () => {
                atualizarListaVisivel();
                const idxVisivel = cardsVisiveis.indexOf(card);
                if (idxVisivel !== -1) abrirLightbox(idxVisivel);
            });
        });

        btnFechar.addEventListener('click', fecharLightbox);
        btnPrev.addEventListener('click',   () => navegar(-1));
        btnNext.addEventListener('click',   () => navegar(+1));

        
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) fecharLightbox();
        });

        
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('aberto')) return;
            if (e.key === 'Escape')      fecharLightbox();
            if (e.key === 'ArrowLeft')   navegar(-1);
            if (e.key === 'ArrowRight')  navegar(+1);
        });

        
        let startX = 0;
        lightbox.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navegar(diff > 0 ? 1 : -1);
        });
    })();

});
