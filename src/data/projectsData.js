const projects = [
  {
    id: 1,
    title: 'Nextride — One-Way Car Rental Platform',
    description:
      'Nextride solves a common problem for travelers in Morocco: being forced to keep a rental car for an entire stay when they only need it for a one-way intercity trip. The platform enables flexible one-way rentals — pick up in one city and return at a partner agency in another — with a flat 50 MAD drop-off fee. Built on a national network of vetted partner agencies, it offers a simple online booking flow where users select departure and return locations, pay only for what they use, and enjoy a modern, reliable rental experience.',
    technologies: ['Laravel', 'MySQL', 'Blade', 'Tailwind CSS'],
    image: '/images/projects/next_ride/NEXT_RIDE.png',
    category: 'web',
    link: '',
    github: 'https://github.com/ali-kerroum/car-rental.git',
    videos: ['/videos/projects/nextride/user_interface.mp4', '/videos/projects/nextride/dashboard.mp4'],
    stats: {},
    skills: ['Product design', 'Backend architecture', 'Database modeling'],
    problem: 'Travelers in Morocco who rent a car for an intercity trip (e.g. Marrakech → Tanger) must keep it for their entire stay — even if they only need it for the initial journey. This creates unnecessary costs and limits flexibility, as traditional rental services rarely offer one-way or cross-city returns.',
    solution: [
      'One-way intercity rentals with cross-agency returns — rent in one city, return in another.',
      'Fixed transparent drop-off fee of just 50 MAD for returning at a different agency.',
      'National network of vetted partner agencies across major Moroccan cities.',
      'Simple, intuitive online booking with clear departure and return location selection.',
    ],
    benefits: [
      'Pay only for what you actually use.',
      'Full freedom to travel between cities without constraints.',
      'Reliable, modern experience backed by a partner agency network and efficient logistics.',
    ],
  },
  {
    id: 2,
    title: 'Spotify Data Visualization',
    description:
      'Executed exploratory data analysis on Spotify datasets to identify trends in artist performance, track popularity, and listener behavior.',
    technologies: ['Python', 'Pandas', 'Jupyter Notebook'],
    image: '/images/projects/dataViz_Spotify/dashboard1.jpg',
    category: 'data',
    link: '',
    github: 'https://github.com/ali-kerroum/Spotify-DataViz.git',
    images: [
      '/images/projects/dataViz_Spotify/dashboard1.jpg',
      '/images/projects/dataViz_Spotify/dashboard2.jpg',
      '/images/projects/dataViz_Spotify/dashboard3.png',
    ],
    stats: { dashboards: '3', analyses: '10+' },
    skills: ['Data cleaning', 'EDA', 'Visualization'],
  },
];

export default projects;
