/* ============================================================
   Madrid — Scene Configuration
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    mountScrollWorld(document.getElementById('world'), {
        brand: { name: 'MADRID', href: '#top' },
        hint: 'scroll para volar',
        nav: true,
        diveScroll: 1.5,  // vh per scene
        connScroll: 0.6,  // vh per crossfade
        sections: [
            {
                id: 'hero',
                title: 'Madrid',
                body: 'La capital que nunca duerme. Una ciudad donde la historia y la modernidad conviven en cada esquina, cada plaza, cada atardecer.',
                eyebrow: 'Bienvenido a',
                still: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=90&w=1920',
                accent: '#f97316',
                tags: ['capital', 'españa', 'cultura']
            },
            {
                id: 'sol',
                title: 'Puerta del Sol',
                body: 'El Kilómetro Cero. Desde aquí parten todas las carreteras de España. El reloj que cuenta los segundos del Año Nuevo, la estatua del Oso y el Madroño, el bullicio infinito.',
                eyebrow: 'El corazón',
                still: 'https://images.unsplash.com/photo-1568844293985-323e5c9a7780?auto=format&fit=crop&q=90&w=1920',
                accent: '#ef4444',
                tags: ['kilómetro cero', 'tradiciones']
            },
            {
                id: 'granca',
                title: 'Gran Vía',
                body: 'El Broadway madrileño. Teatros emblemáticos, arquitectura art déco, tiendas que brillan de día y neón de noche. El pulso comercial de la ciudad.',
                eyebrow: 'La avenida',
                still: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=90&w=1920',
                accent: '#eab308',
                tags: ['teatro', 'shopping', 'arquitectura']
            },
            {
                id: 'retiro',
                title: 'Retiro',
                body: '125 hectáreas de silencio en el centro del ruido. El Palacio de Cristal, el Estanque Grande, los rosales de La Argentina. El pulmón verde donde Madrid se detiene a respirar.',
                eyebrow: 'El oasis',
                still: 'https://images.unsplash.com/photo-1569434672618-6d5339389a15?auto=format&fit=crop&q=90&w=1920',
                accent: '#22c55e',
                tags: ['naturaleza', 'palacio de cristal']
            },
            {
                id: 'debod',
                title: 'Templo de Debod',
                body: 'Un templo egipcio del siglo II a.C. en pleno Parque del Oeste. Regalo de Egipto a España en 1968. El mejor atardecer de Madrid se ve desde sus escalones.',
                eyebrow: 'Egipto en Madrid',
                still: 'https://images.unsplash.com/photo-1595981203253-382399a97a27?auto=format&fit=crop&q=90&w=1920',
                accent: '#a855f7',
                tags: ['atardecer', 'historia', 'gratis']
            },
            {
                id: 'bernabeu',
                title: 'Santiago Bernabéu',
                body: 'Más de 80.000 almas gritando a una. La catedral del fútbol europeo. Donde el Madrid levanta sus Copas de Europa y la afición llora de felicidad.',
                eyebrow: 'La catedral',
                still: 'https://images.unsplash.com/photo-1541761213175-8781a5d3e934?auto=format&fit=crop&q=90&w=1920',
                accent: '#3b82f6',
                tags: ['fútbol', 'Liga de Campeones']
            },
            {
                id: 'cibeles',
                title: 'Cibeles',
                body: 'La diosa de la fecundidad sobre su carro de leones. El Palacio de Comunicaciones —ahora Ayuntamiento— vigila la plaza. Aquí celebra el Madrid sus títulos.',
                eyebrow: 'El epicentro',
                still: 'https://images.unsplash.com/photo-1596648253395-1961716932e2?auto=format&fit=crop&q=90&w=1920',
                accent: '#f97316',
                tags: ['celebraciones', 'ayuntamiento'],
                cta: { label: 'Descubre Madrid', href: 'https://www.esmadrid.com' }
            }
        ]
    });
});
