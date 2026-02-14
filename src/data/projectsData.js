const projects = [
  {
    id: 1,
    title: 'Nextride — One-Way Car Rental Platform',
    description:
      'Developed a one-way intercity car-rental platform that allows customers to pick up and return vehicles across partner agencies in different cities.',
    technologies: ['Laravel', 'MySQL', 'Blade', 'Tailwind CSS'],
    image: '/images/projects/next_ride/NEXT_RIDE.png',
    category: 'web',
    link: '',
    github: 'https://github.com/ali-kerroum/car-rental.git',
    videos: ['/videos/projects/nextride/user_interface.mp4', '/videos/projects/nextride/dashboard.mp4'],
    stats: {},
    skills: ['Product design', 'Backend architecture', 'Database modeling'],
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
