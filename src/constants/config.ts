type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    feedbacks: TSection;
    works: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: "Ahmed Magdy — Software Engineer",
    fullName: "Ahmed Magdy",
    email: "alshwwhy212@gmail.com",
  },
  hero: {
    name: "Ahmed Magdy",
    p: ["I build scalable backend systems,", "APIs, and real-time services"],
  },
  contact: {
    p: "Get in touch",
    h2: "Contact.",
    form: {
      name: {
        span: "Your Name",
        placeholder: "What's your name?",
      },
      email: { span: "Your Email", placeholder: "What's your email?" },
      message: {
        span: "Your Message",
        placeholder: "What do you want to say?",
      },
    },
  },
  sections: {
    about: {
      p: "Introduction",
      h2: "Overview.",
      content: `Strategic and results-oriented Software Engineer with a proven
      track record of designing, developing, and delivering scalable,
      high-performance software solutions across diverse technologies and
      architectures. Adept at translating complex business requirements into
      robust technical implementations, optimizing system performance, and
      ensuring software reliability and security. Experienced in full
      software development lifecycle, from conceptualization and architecture
      design to deployment and maintenance. Passionate about continuous
      improvement, modern engineering practices, and mentoring teams to
      achieve excellence. Driven by innovation and committed to building
      impactful, future-ready digital solutions.`,
    },
    experience: {
      p: "What I have done so far",
      h2: "Work Experience.",
    },
    feedbacks: {
      p: "What others say",
      h2: "Testimonials.",
    },
    works: {
      p: "My work",
      h2: "Projects.",
      content: `A selection of backend systems and integrations I've built across
      fintech, AI, and SaaS products. Each entry highlights the problem,
      the stack, and the impact — from cutting API latency in half to
      shipping AI-powered features used by thousands of users.`,
    },
  },
};
