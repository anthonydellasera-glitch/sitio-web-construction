(function() {
      'use strict';

      /* ===== Carrusel del hero: acercamiento lento + relevo con fundido ===== */
      (function heroSlideshow() {
        const cont = document.getElementById('heroSlides');
        if (!cont) return;
        const slides = Array.prototype.slice.call(cont.querySelectorAll('.hero-slide'));
        if (slides.length < 2) return;

        // Si el usuario pidio menos animacion, solo alternamos las fotos sin zoom.
        const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ESPERA = 8000;   // tiempo en pantalla de cada foto
        const FUNDIDO = 2000;  // cruce entre una foto y la siguiente
        let actual = 0;
        let timer = null;

        function cargarRestantes() {
          slides.forEach(function(s) {
            if (!s.style.getPropertyValue('--img')) {
              s.style.setProperty('--img', "url('" + s.dataset.img + "')");
            }
          });
        }

        function mostrar(i) {
          const previo = actual;
          if (i === previo) return;
          const entra = slides[i];

          // Reinicia la animacion de acercamiento desde el principio.
          entra.classList.remove('is-zooming');
          void entra.offsetWidth;
          if (!quieto) entra.classList.add('is-zooming');
          entra.classList.add('is-active');

          slides[previo].classList.remove('is-active');
          // La foto que sale sigue acercandose hasta que termina de desvanecerse.
          setTimeout(function() {
            slides[previo].classList.remove('is-zooming');
          }, FUNDIDO);

          actual = i;
        }

        function avanzar() {
          mostrar((actual + 1) % slides.length);
        }

        function arrancar() {
          if (timer) return;
          timer = setInterval(avanzar, ESPERA + FUNDIDO);
        }

        function parar() {
          clearInterval(timer);
          timer = null;
        }

        if (quieto) slides[0].classList.remove('is-zooming');

        // Las fotos 2 a 4 se piden despues, para no frenar la primera pintada.
        if (document.readyState === 'complete') cargarRestantes();
        else window.addEventListener('load', cargarRestantes);

        arrancar();

        // Sin sentido animar con la pestaña oculta o el hero fuera de vista.
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) parar(); else arrancar();
        });

        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
              if (e.isIntersecting) arrancar(); else parar();
            });
          }, { threshold: 0 }).observe(cont);
        }
      })();

      const anio = document.getElementById('anio');
      if (anio) anio.textContent = new Date().getFullYear();

      const header = document.getElementById('header');
      const scrollTopBtn = document.getElementById('scrollTop');

      function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        if (scrollY > 500) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      const menuToggle = document.getElementById('menuToggle');
      const nav = document.getElementById('nav');
      const navLinks = nav.querySelectorAll('a');

      menuToggle.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('open');
        menuToggle.classList.toggle('abierto', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          nav.classList.remove('open');
          menuToggle.classList.remove('abierto');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        });
      });

      const sections = document.querySelectorAll('section[id]');
      function updateActiveNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        sections.forEach(function(section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          const link = nav.querySelector('a[href="#' + id + '"]');
          if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
              nav.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
              link.classList.add('active');
            }
          }
        });
      }
      window.addEventListener('scroll', updateActiveNav, { passive: true });

      /* La foto de "Quienes Somos" solo se mueve mientras se ve. */
      const fotoNosotros = document.querySelector('.about-image');
      if (fotoNosotros && 'IntersectionObserver' in window) {
        new IntersectionObserver(function(entries) {
          entries.forEach(function(e) {
            fotoNosotros.classList.toggle('en-vista', e.isIntersecting);
          });
        }, { threshold: 0.15 }).observe(fotoNosotros);
      } else if (fotoNosotros) {
        fotoNosotros.classList.add('en-vista');
      }

      const revealElements = document.querySelectorAll('.reveal');
      const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(function(el) { revealObserver.observe(el); });

      /* ===== Formulario de cotizacion =====
         El sitio es estatico (no hay servidor que reciba el POST), asi que la
         solicitud se arma como mensaje y se abre en WhatsApp al numero de AP.
         Para cambiar el destino solo se edita WHATSAPP de aqui abajo.
         Si algun dia hay correo, basta con cambiar DESTINO a 'correo' y poner
         la direccion en EMAIL. */
      const WHATSAPP = '50764914987';   // +507 6491-4987
      const EMAIL    = '';              // pendiente: correo de AP Servicios
      const DESTINO  = 'whatsapp';      // 'whatsapp' | 'correo'

      const contactForm = document.getElementById('contactForm');

      function armarMensaje(datos) {
        const etiquetas = {
          nombre: 'Nombre', empresa: 'Empresa', telefono: 'Telefono',
          correo: 'Correo', servicio: 'Servicio', ubicacion: 'Ubicacion',
          fecha: 'Fecha estimada', mensaje: 'Necesidad'
        };
        const lineas = ['Solicitud de cotizacion desde la web', ''];
        // Del desplegable interesa el texto visible, no el valor interno.
        const selServicio = contactForm.servicio;
        const etiquetaServicio = selServicio.selectedOptions.length
          ? selServicio.selectedOptions[0].textContent.trim()
          : '';
        Object.keys(etiquetas).forEach(function(k) {
          const v = k === 'servicio'
            ? etiquetaServicio
            : (datos.get(k) || '').toString().trim();
          if (v) lineas.push(etiquetas[k] + ': ' + v);
        });
        return lineas.join('\n');
      }

      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!this.reportValidity()) return;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const texto = armarMensaje(new FormData(this));

        let destinoURL;
        if (DESTINO === 'correo' && EMAIL) {
          destinoURL = 'mailto:' + EMAIL +
            '?subject=' + encodeURIComponent('Solicitud de cotizacion - AP Servicios') +
            '&body=' + encodeURIComponent(texto);
        } else {
          destinoURL = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
        }

        submitBtn.innerHTML = '<svg class="ic ic-girando" viewBox="0 0 512 512" aria-hidden="true"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg> Abriendo...';
        submitBtn.disabled = true;

        // Se abre en otra pestaña para no perder lo que el visitante escribio.
        const abierta = window.open(destinoURL, '_blank', 'noopener');
        if (!abierta) window.location.href = destinoURL;

        setTimeout(function() {
          submitBtn.innerHTML = '<svg class="ic" viewBox="0 0 448 512" aria-hidden="true"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> Listo, continua el envio';
          submitBtn.style.background = '#1f7a3d';
          submitBtn.style.borderColor = '#1f7a3d';
          setTimeout(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
          }, 3000);
        }, 600);
      });

      const statNumbers = document.querySelectorAll('.hero-stat .number');
      let countersAnimated = false;
      function animateCounters() {
        if (countersAnimated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          countersAnimated = true;
          statNumbers.forEach(function(el) {
            const text = el.textContent;
            const match = text.match(/([+]?)(\d+)/);
            if (!match) return;
            const prefix = match[1];
            const target = parseInt(match[2], 10);
            const suffix = text.replace(match[0], '');
            let current = 0;
            const duration = 1500;
            const stepTime = 16;
            const steps = duration / stepTime;
            const increment = target / steps;
            const timer = setInterval(function() {
              current += increment;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = prefix + Math.floor(current) + suffix;
            }, stepTime);
          });
        }
      }
      window.addEventListener('scroll', animateCounters, { passive: true });
      window.addEventListener('load', animateCounters);
    })();