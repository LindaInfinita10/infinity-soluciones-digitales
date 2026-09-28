import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Centralized commercial WhatsApp number in international format without + or spaces.
export const INFINITY_WHATSAPP = '5521992877821';
export const INFINITY_CALENDLY_URL = 'https://calendly.com/pm110190/30min';
export const INFINITY_LINKEDIN = 'https://www.linkedin.com/in/pilar-m-886307187/';
export const INFINITY_GITHUB = 'https://github.com/LindaInfinita10';

const translations = {
  es: {
    nav: { home: 'Inicio', services: 'Servicios', solutions: 'Soluciones', about: 'Nosotros', contact: 'Contacto', diagnosis: 'Solicitar diagnóstico', descriptor: 'Soluciones Digitales' },
    hero: { eyebrow: 'Soluciones digitales para negocios que avanzan', title: 'Soluciones digitales para hacer crecer tu negocio.', description: 'Desarrollamos sitios web, software, automatizaciones y soluciones con IA para empresas y emprendimientos.', cta: 'Contanos qué necesitás', solutions: 'Ver soluciones', tagline: 'Vos tenés el desafío. Nosotros desarrollamos la solución.' },
    serviceStrip: ['WEB', 'SOFTWARE', 'AUTOMATIZACIONES', 'INTELIGENCIA ARTIFICIAL'],
    servicesTitle: 'Lo que tu negocio necesita para avanzar.',
    services: [
      { title: 'Sitios Web', description: 'Sitios institucionales, landing pages y plataformas web pensadas para vender, comunicar y posicionar mejor tu negocio.', benefit: 'Más consultas calificadas y una marca que transmite confianza.', icon: 'web' },
      { title: 'E-commerce', description: 'Tiendas online con plataforma de pagos integrada, gestión de productos, pedidos, envíos y herramientas para vender las 24 horas.', benefit: 'Vendé desde donde estés y hacé crecer tu negocio sin depender de un local físico.', icon: 'commerce' },
      { title: 'Software a medida', description: 'Sistemas y herramientas personalizadas para organizar, gestionar y hacer más eficiente tu negocio.', benefit: 'Más control, menos fricción y decisiones con información real.', icon: 'software' },
      { title: 'Automatizaciones e IA', description: 'Conectamos herramientas, automatizamos tareas e incorporamos inteligencia artificial para optimizar procesos y atención.', benefit: 'Ahorrá tiempo, reducí costos y enfocáte en hacer crecer tu negocio.', icon: 'automation' }
    ],
    solutions: { eyebrow: 'El punto de partida', title: 'Tu negocio tiene un problema. Nosotros construimos la solución.' },
    problems: ['Procesos manuales que consumen horas', 'Una web que ya no representa tu negocio', 'Consultas que se pierden por falta de seguimiento', 'Tareas repetitivas que frenan al equipo', 'Herramientas que no se hablan entre sí', 'Falta de una presencia digital profesional'],
    audiences: { eyebrow: 'Tu negocio, sin límites', title: 'Soluciones para cada etapa.', description: 'Desde un emprendimiento hasta una empresa con procesos complejos, nuestras soluciones se adaptan a tu realidad.', cards: [
      ['Comercios', 'Vendé online y llegá a más clientes sin depender de los costos de un local físico.'], ['Emprendedores', 'Convertí tu idea en un negocio real con herramientas digitales que te permitan crecer.'], ['PyMEs', 'Optimizá procesos, automatizá tareas y escalá tu crecimiento.'], ['Empresas', 'Sistemas a medida, integraciones, automatización e IA para operaciones más eficientes.']
    ]},
    process: { eyebrow: 'Nuestra forma de trabajar', title: 'Del problema al progreso.', description: 'Un proceso claro para convertir una necesidad en una solución que funciona.', cards: [
      ['Diagnóstico', 'Entendemos tu operación, tus objetivos y dónde está la oportunidad.', 'Escuchamos antes de proponer.', 'search'], ['Estrategia', 'Priorizamos una solución concreta, viable y alineada al negocio.', 'Convertimos ideas en dirección.', 'strategy'], ['Desarrollo', 'Diseñamos y construimos con foco en experiencia y resultados.', 'Hacemos que la solución suceda.', 'build'], ['Lanzamiento', 'Ponemos la solución en marcha y acompañamos cada detalle.', 'Llegamos al mundo real contigo.', 'launch'], ['Evolución', 'Medimos, aprendemos y hacemos crecer lo que construimos.', 'Lo mejor siempre puede seguir mejorando.', 'evolve']
    ]},
    contact: { eyebrow: 'Hablemos', title: 'Contanos qué necesita tu negocio.', intro: 'Primero entendemos el problema. Después te proponemos la solución.', instruction: 'Podés contarnos tu necesidad por WhatsApp o agendar una reunión de diagnóstico.', meeting: '30 minutos para entender tu negocio, detectar el problema y evaluar qué solución digital puede ayudarte.', points: ['Entendemos tu necesidad', 'Evaluamos oportunidades', 'Definimos próximos pasos'], formTitle: 'Solicitá un diagnóstico', formDescription: 'Contanos brevemente qué necesitás y nos ponemos en contacto.', name: 'Nombre', namePlaceholder: '¿Con quién hablamos?', company: 'Empresa / emprendimiento', companyPlaceholder: 'Nombre de tu negocio', email: 'Email', emailPlaceholder: 'tu@email.com', whatsapp: 'WhatsApp', whatsappPlaceholder: 'Tu número de contacto', need: '¿Qué necesitás?', needPlaceholder: 'Elegí una opción', message: 'Mensaje', messagePlaceholder: 'Contanos brevemente qué problema querés resolver', continue: 'Continuar por WhatsApp', schedule: 'Agendar diagnóstico', note: 'Sin compromiso. Primero entendemos tu necesidad.', whatsappCta: 'Contanos qué necesitás', calendly: 'Agendar diagnóstico', noCalendar: 'El calendario de diagnóstico estará disponible próximamente.', configure: 'Configurá INFINITY_CALENDLY_URL en src/app/app.ts con la URL real de Calendly.', modalTitle: 'Diagnóstico inicial — 30 min', modalDescription: 'Una reunión para entender tu negocio, detectar el desafío y evaluar qué solución digital puede ayudarte.', back: 'Volver al contacto', whatsappNotice: 'Configurá INFINITY_WHATSAPP en src/app/app.ts para activar este canal.' },
    needs: ['Sitio web', 'E-commerce', 'Software a medida', 'Automatización', 'Inteligencia Artificial', 'Integraciones', 'Otro', 'No estoy seguro / necesito asesoramiento'],
    footer: { description: 'Transformamos necesidades de negocio en soluciones digitales que ayudan a vender, optimizar y crecer.', services: 'WEB · E-COMMERCE · SOFTWARE · AUTOMATIZACIONES · IA', solutionsTitle: 'Soluciones', solutions: ['Sitios Web', 'E-commerce', 'Software a medida', 'Automatizaciones', 'Inteligencia Artificial', 'Integraciones'], contactTitle: 'Hablemos', phone: '+55 21 99287-7821', whatsapp: 'Hablar por WhatsApp', calendlyText: 'Agendá una reunión de diagnóstico', calendly: 'Agendar reunión', socialTitle: 'Redes', instagram: 'Instagram', instagramSoon: 'Instagram — próximamente', linkedin: 'LinkedIn', github: 'GitHub', privacy: 'Privacidad', terms: 'Términos', argentina: 'Argentina', brazil: 'Brasil', latam: 'LATAM', copyright: '© 2026 INFINITY Soluciones Digitales', ctaTitle: '¿Tenés un desafío en tu negocio?', ctaDescription: 'Contanos qué necesitás. Analizamos tu situación y buscamos la solución digital adecuada para vos.' }
  },
  pt: {
    nav: { home: 'Início', services: 'Serviços', solutions: 'Soluções', about: 'Nós', contact: 'Contato', diagnosis: 'Solicitar diagnóstico', descriptor: 'Soluções Digitais' },
    hero: { eyebrow: 'Soluções digitais para negócios que avançam', title: 'Soluções digitais para fazer seu negócio crescer.', description: 'Desenvolvemos sites, software, automações e soluções com IA para empresas e empreendedores.', cta: 'Conte pra gente o que você precisa', solutions: 'Ver soluções', tagline: 'Você tem o desafio. Nós desenvolvemos a solução.' },
    serviceStrip: ['SITES', 'SOFTWARE', 'AUTOMAÇÕES', 'INTELIGÊNCIA ARTIFICIAL'],
    servicesTitle: 'O que seu negócio precisa para avançar.',
    services: [
      { title: 'Sites', description: 'Sites institucionais, landing pages e plataformas web pensadas para vender, comunicar e posicionar melhor o seu negócio.', benefit: 'Mais clientes, mais vendas e maior visibilidade.', icon: 'web' },
      { title: 'E-commerce', description: 'Lojas online com pagamentos integrados, gestão de produtos, pedidos, envios e ferramentas para vender 24 horas por dia.', benefit: 'Venda de onde estiver e faça seu negócio crescer sem depender de uma loja física.', icon: 'commerce' },
      { title: 'Software sob medida', description: 'Sistemas e ferramentas personalizadas para organizar, gerenciar e tornar seu negócio mais eficiente.', benefit: 'Mais controle, menos trabalho manual e decisões melhores.', icon: 'software' },
      { title: 'Automações e IA', description: 'Conectamos ferramentas, automatizamos tarefas e incorporamos inteligência artificial para otimizar processos e atendimento.', benefit: 'Economize tempo, reduza custos e foque no que realmente importa.', icon: 'automation' }
    ],
    solutions: { eyebrow: 'O ponto de partida', title: 'Seu negócio tem um desafio. Nós desenvolvemos a solução.' },
    problems: ['Processos manuais que consomem horas', 'Um site que já não representa seu negócio', 'Consultas que se perdem por falta de acompanhamento', 'Tarefas repetitivas que travam a equipe', 'Ferramentas que não conversam entre si', 'Falta de uma presença digital profissional'],
    audiences: { eyebrow: 'Seu negócio, sem limites', title: 'Soluções para cada etapa.', description: 'De um empreendimento a uma empresa com processos complexos, nossas soluções se adaptam à sua realidade.', cards: [
      ['Comércios', 'Venda online e alcance mais clientes sem depender dos custos de uma loja física.'], ['Empreendedores', 'Transforme sua ideia em um negócio real com ferramentas digitais para crescer.'], ['PMEs', 'Otimize processos, automatize tarefas e escale seu crescimento.'], ['Empresas', 'Sistemas sob medida, integrações, automação e IA para operações mais eficientes.']
    ]},
    process: { eyebrow: 'Nossa forma de trabalhar', title: 'Do desafio ao progresso.', description: 'Um processo claro para transformar uma necessidade em uma solução que funciona.', cards: [
      ['Diagnóstico', 'Entendemos sua operação, seus objetivos e onde está a oportunidade.', 'Ouvimos antes de propor.', 'search'], ['Estratégia', 'Priorizamos uma solução concreta, viável e alinhada ao negócio.', 'Transformamos ideias em direção.', 'strategy'], ['Desenvolvimento', 'Projetamos e construímos com foco em experiência e resultados.', 'Fazemos a solução acontecer.', 'build'], ['Lançamento', 'Colocamos a solução no ar e acompanhamos cada detalhe.', 'Chegamos ao mundo real com você.', 'launch'], ['Evolução', 'Medimos, aprendemos e fazemos crescer o que construímos.', 'O melhor sempre pode evoluir.', 'evolve']
    ]},
    contact: { eyebrow: 'Vamos conversar', title: 'Conte pra gente o que seu negócio precisa.', intro: 'Primeiro entendemos o problema. Depois propomos a solução.', instruction: 'Você pode contar sua necessidade pelo WhatsApp ou agendar uma reunião de diagnóstico.', meeting: '30 minutos para entender seu negócio, identificar o desafio e avaliar qual solução digital pode ajudar.', points: ['Entendemos sua necessidade', 'Avaliamos oportunidades', 'Definimos os próximos passos'], formTitle: 'Solicite um diagnóstico', formDescription: 'Conte brevemente o que você precisa e entraremos em contato.', name: 'Nome', namePlaceholder: 'Com quem estamos falando?', company: 'Empresa / empreendimento', companyPlaceholder: 'Nome do seu negócio', email: 'E-mail', emailPlaceholder: 'seu@email.com', whatsapp: 'WhatsApp', whatsappPlaceholder: 'Seu número de contato', need: 'O que você precisa?', needPlaceholder: 'Escolha uma opção', message: 'Mensagem', messagePlaceholder: 'Conte brevemente qual problema quer resolver', continue: 'Continuar pelo WhatsApp', schedule: 'Agendar diagnóstico', note: 'Sem compromisso. Primeiro entendemos sua necessidade.', whatsappCta: 'Conte pra gente o que você precisa', calendly: 'Agendar diagnóstico', noCalendar: 'O calendário de diagnóstico estará disponível em breve.', configure: 'Configure INFINITY_CALENDLY_URL em src/app/app.ts com a URL real do Calendly.', modalTitle: 'Diagnóstico inicial — 30 min', modalDescription: 'Uma reunião para entender seu negócio, identificar o desafio e avaliar qual solução digital pode ajudar.', back: 'Voltar ao contato', whatsappNotice: 'Configure INFINITY_WHATSAPP em src/app/app.ts para ativar este canal.' },
    needs: ['Site', 'E-commerce', 'Software sob medida', 'Automação', 'Inteligência Artificial', 'Integrações', 'Outro', 'Não tenho certeza / preciso de orientação'],
    footer: { description: 'Transformamos necessidades de negócio em soluções digitais que ajudam a vender, otimizar e crescer.', services: 'SITES · E-COMMERCE · SOFTWARE · AUTOMAÇÕES · IA', solutionsTitle: 'Soluções', solutions: ['Sites', 'E-commerce', 'Software sob medida', 'Automações', 'Inteligência Artificial', 'Integrações'], contactTitle: 'Vamos conversar', phone: '+55 21 99287-7821', whatsapp: 'Falar pelo WhatsApp', calendlyText: 'Agende uma reunião de diagnóstico', calendly: 'Agendar reunião', socialTitle: 'Redes', instagram: 'Instagram', instagramSoon: 'Instagram — em breve', linkedin: 'LinkedIn', github: 'GitHub', privacy: 'Privacidade', terms: 'Termos', argentina: 'Argentina', brazil: 'Brasil', latam: 'LATAM', copyright: '© 2026 INFINITY Soluções Digitais', ctaTitle: 'Tem um desafio no seu negócio?', ctaDescription: 'Conte para nós o que você precisa. Analisamos sua situação e buscamos a solução digital ideal para o seu negócio.' }
  }
} as const;

const needTranslations = {
  es: {
    eyebrow: 'La solución empieza por tu necesidad',
    title: 'Encontrá la solución que tu negocio necesita.',
    description: 'No necesitás saber de tecnología. Contanos qué querés resolver y te ayudamos a encontrar la mejor forma de hacerlo.',
    bridge: 'No importa el tamaño de tu negocio. Empezamos por entender qué necesitás resolver.',
    cards: [
      { label: 'QUIERO TENER PRESENCIA ONLINE', title: 'Necesito una web profesional', description: 'Mostrá lo que hacés, generá confianza y convertí visitas en nuevas consultas.', solution: 'Sitios web · Landing pages', result: 'Más visibilidad y oportunidades.', cta: 'Quiero mi web', icon: 'web' },
      { label: 'QUIERO VENDER ONLINE', title: 'Quiero vender por internet', description: 'Vendé tus productos las 24 horas sin depender exclusivamente de un local físico.', solution: 'E-commerce · Pagos online · Pedidos · Envíos', result: 'Vendé desde donde estés.', cta: 'Quiero vender online', icon: 'commerce' },
      { label: 'NECESITO ORGANIZAR MI NEGOCIO', title: 'Necesito un sistema para mi negocio', description: 'Centralizá información, gestión y operaciones en una herramienta diseñada para tu forma de trabajar.', solution: 'Software a medida · Sistemas de gestión', result: 'Más control. Menos desorden.', cta: 'Necesito un sistema', icon: 'software' },
      { label: 'PIERDO TIEMPO EN TAREAS REPETITIVAS', title: 'Quiero automatizar tareas', description: 'Automatizamos procesos repetitivos para que tu equipo deje de hacer manualmente lo que la tecnología puede resolver.', solution: 'Automatizaciones · Integraciones', result: 'Ahorrá tiempo y reducí errores.', cta: 'Quiero automatizar', icon: 'automation' },
      { label: 'QUIERO INCORPORAR INTELIGENCIA ARTIFICIAL', title: 'Quiero usar IA en mi negocio', description: 'Incorporamos inteligencia artificial donde realmente puede mejorar atención, procesos y productividad.', solution: 'IA · Asistentes · Procesos inteligentes', result: 'Trabajá de forma más inteligente.', cta: 'Quiero incorporar IA', icon: 'ai' },
      { label: 'NO SÉ QUÉ SOLUCIÓN NECESITO', title: 'Tengo un problema, pero no sé cómo resolverlo', description: 'No necesitás llegar con una solución técnica. Primero entendemos tu negocio y después evaluamos qué tecnología tiene sentido.', solution: 'Diagnóstico inicial', result: 'Empezamos por entender el problema.', cta: 'Agendar diagnóstico', icon: 'diagnosis' }
    ],
    footerTitle: '¿No encontraste exactamente lo que necesitás?', footerDescription: 'Contanos el problema. Nosotros evaluamos la solución.', whatsapp: 'Hablar por WhatsApp', calendly: 'Agendar diagnóstico'
  },
  pt: {
    eyebrow: 'A solução começa pela sua necessidade',
    title: 'Encontre a solução que seu negócio precisa.',
    description: 'Você não precisa entender de tecnologia. Conte o que quer resolver e ajudamos a encontrar a melhor forma de fazer isso.',
    bridge: 'Não importa o tamanho do seu negócio. Começamos entendendo o que você precisa resolver.',
    cards: [
      { label: 'QUERO TER PRESENÇA ONLINE', title: 'Preciso de um site profissional', description: 'Mostre o que você faz, gere confiança e transforme visitas em novas consultas.', solution: 'Sites · Landing pages', result: 'Mais visibilidade e oportunidades.', cta: 'Quero meu site', icon: 'web' },
      { label: 'QUERO VENDER ONLINE', title: 'Quero vender pela internet', description: 'Venda seus produtos 24 horas por dia sem depender exclusivamente de uma loja física.', solution: 'E-commerce · Pagamentos · Pedidos · Envios', result: 'Venda de onde estiver.', cta: 'Quero vender online', icon: 'commerce' },
      { label: 'PRECISO ORGANIZAR MEU NEGÓCIO', title: 'Preciso de um sistema para meu negócio', description: 'Centralize informações, gestão e operações em uma ferramenta feita para sua forma de trabalhar.', solution: 'Software sob medida · Sistemas de gestão', result: 'Mais controle. Menos desorganização.', cta: 'Preciso de um sistema', icon: 'software' },
      { label: 'PERCO TEMPO COM TAREFAS REPETITIVAS', title: 'Quero automatizar tarefas', description: 'Automatizamos processos repetitivos para que sua equipe não faça manualmente o que a tecnologia pode resolver.', solution: 'Automações · Integrações', result: 'Economize tempo e reduza erros.', cta: 'Quero automatizar', icon: 'automation' },
      { label: 'QUERO INCORPORAR INTELIGÊNCIA ARTIFICIAL', title: 'Quero usar IA no meu negócio', description: 'Incorporamos inteligência artificial onde ela realmente pode melhorar atendimento, processos e produtividade.', solution: 'IA · Assistentes · Processos inteligentes', result: 'Trabalhe de forma mais inteligente.', cta: 'Quero incorporar IA', icon: 'ai' },
      { label: 'NÃO SEI QUAL SOLUÇÃO PRECISO', title: 'Tenho um problema, mas não sei como resolver', description: 'Você não precisa chegar com uma solução técnica. Primeiro entendemos seu negócio e avaliamos qual tecnologia faz sentido.', solution: 'Diagnóstico inicial', result: 'Começamos entendendo o problema.', cta: 'Agendar diagnóstico', icon: 'diagnosis' }
    ],
    footerTitle: 'Não encontrou exatamente o que precisa?', footerDescription: 'Conte o problema. Nós avaliamos a solução.', whatsapp: 'Falar pelo WhatsApp', calendly: 'Agendar diagnóstico'
  }
} as const;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly menuOpen = signal(false);
  protected readonly calendlyOpen = signal(false);
  protected readonly whatsappNotice = signal('');
  protected readonly language = signal<'es' | 'pt'>('es');
  protected readonly copy = computed(() => translations[this.language()]);
  protected readonly needsCopy = computed(() => needTranslations[this.language()]);
  protected readonly highlightedNeed = signal<number | null>(null);
  protected readonly whatsappConfigured = Boolean(INFINITY_WHATSAPP);
  protected readonly calendlyConfigured = Boolean(INFINITY_CALENDLY_URL);
  protected readonly calendlyUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(INFINITY_CALENDLY_URL);
  protected readonly whatsappUrl = `https://wa.me/${INFINITY_WHATSAPP}`;
  protected readonly calendlyExternalUrl = INFINITY_CALENDLY_URL;
  protected readonly linkedinUrl = INFINITY_LINKEDIN;
  protected readonly githubUrl = INFINITY_GITHUB;
  protected readonly diagnosisForm = this.formBuilder.nonNullable.group({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    need: '',
    message: ''
  });

  constructor() {
    const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem('infinity_language');
    this.language.set(saved === 'pt' ? 'pt' : 'es');
    this.updateDocumentLanguage();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected setLanguage(language: 'es' | 'pt'): void {
    this.language.set(language);
    localStorage.setItem('infinity_language', language);
    this.updateDocumentLanguage();
  }

  private updateDocumentLanguage(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.language() === 'pt' ? 'pt-BR' : 'es';
    }
  }

  protected sendWhatsApp(): void {
    const form = this.diagnosisForm.getRawValue();
    const hasFormDetails = Object.values(form).some((value) => value.trim().length > 0);
    const message = hasFormDetails
      ? this.language() === 'pt'
        ? [
            'Olá, INFINITY 👋',
            '',
            `Meu nome é ${form.name || '[nome]'} e falo em nome de ${form.company || '[empresa]'}.`,
            '',
            `Estou buscando ajuda com:\n${form.need || '[serviço selecionado]'}`,
            '',
            `Preciso resolver:\n${form.message || '[problema]'}`,
            '',
            `Meu e-mail:\n${form.email || '[e-mail]'}`,
            '',
            'Gostaria de receber uma orientação para encontrar a melhor solução para o meu negócio.'
          ].join('\n')
        : [
            'Hola INFINITY 👋',
            '',
            `Soy ${form.name || '[nombre]'} de ${form.company || '[empresa]'}.`,
            '',
            `Estoy buscando ayuda con:\n${form.need || '[servicio seleccionado]'}`,
            '',
            `Necesito resolver:\n${form.message || '[problema]'}`,
            '',
            `Mi email:\n${form.email || '[email]'}`,
            '',
            'Me gustaría recibir orientación para encontrar la mejor solución para mi negocio.'
          ].join('\n')
      : this.language() === 'pt'
        ? 'Olá, INFINITY 👋 Gostaria de contar uma necessidade do meu negócio e entender qual solução vocês poderiam me oferecer.'
        : 'Hola INFINITY 👋 Quisiera contarles una necesidad de mi negocio y conocer qué solución podrían ofrecerme.';

    if (!this.whatsappConfigured) {
      this.whatsappNotice.set(this.copy().contact.whatsappNotice);
      return;
    }

    window.open(`https://wa.me/${INFINITY_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }

  protected openCalendly(): void {
    this.calendlyOpen.set(true);
  }

  protected closeCalendly(): void {
    this.calendlyOpen.set(false);
  }

  protected focusNeed(index: number): void {
    const target = index === 0 || index === 1 || index === 5 ? 0 : index === 2 ? 2 : index === 4 ? 4 : 3;
    this.highlightedNeed.set(target);
    document.getElementById(`need-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => this.highlightedNeed.set(null), 1200);
  }
}
