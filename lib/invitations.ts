export interface InvitationData {
  slug: string;
  type: string;
  title: string;
  names: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  targetDate: string;
  theme: 'boda' | 'xv' | 'cumple' | 'bautizo' | 'baby-shower' | 'corporativo';
}

export const INVITATIONS: InvitationData[] = [
  {
    slug: 'demo-boda',
    type: 'Boda',
    title: 'Con alegría en nuestros corazones',
    names: 'Ana & Carlos',
    subtitle: 'Se unen en matrimonio',
    date: 'Sábado, 15 de Marzo 2025',
    time: '7:00 PM',
    location: 'Salón La Perla, Cancún, México',
    targetDate: '2026-03-15',
    theme: 'boda',
  },
  {
    slug: 'demo-xv',
    type: 'XV Años',
    title: 'Mis XV Años',
    names: 'Sofía Ramírez',
    subtitle: 'Te invita a celebrar esta noche mágica',
    date: 'Sábado, 21 de Junio 2025',
    time: '8:00 PM',
    location: 'Gran Salón Real, Guadalajara, México',
    targetDate: '2026-06-21',
    theme: 'xv',
  },
  {
    slug: 'demo-cumple',
    type: 'Cumpleaños',
    title: '¡Cumpleaños!',
    names: 'Mariana',
    subtitle: '¡Ven a celebrar mis 30 años!',
    date: 'Domingo, 10 de Agosto 2025',
    time: '6:00 PM',
    location: 'Rooftop Bar Sky, Ciudad de México',
    targetDate: '2026-08-10',
    theme: 'cumple',
  },
];

export function getInvitation(slug: string): InvitationData | undefined {
  return INVITATIONS.find((inv) => inv.slug === slug);
}
