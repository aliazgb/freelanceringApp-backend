app.use(cors({
    origin: "https://freelancerin-app-project-8dd2.vercel.app/",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  