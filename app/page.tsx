import {
  ArrowUpRight,
  BriefcaseBusiness,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ChatWidget from "@/components/ChatWidget"
import OpenChatShortcutButton from "@/components/OpenChatShortcutButton"

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Django",
  "Django REST Framework",
  "FastAPI",
  "Django Channels",
  "Celery",
  "React",
  "Next.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Redis",
  "AWS (EC2, S3, RDS)",
  "Nginx",
  "Cloudflare",
  "WebSockets",
  "PyJWT",
]

const achievements = [
  "Promoted to Senior Development Engineer at CaretCloud Technology Pvt Ltd",
  "Built and maintained 50+ production REST APIs",
  "Designed multi-tenant SaaS architecture with Django, DRF, and PostgreSQL",
  "Implemented SAML SSO and MFA for enterprise systems",
  "Developed cross-platform integrations with Google, Microsoft 365, Atlassian, and GitHub",
]

const experiences = [
  {
    role: "Senior Development Engineer",
    company: "CaretCloud Technology Pvt Ltd",
    period: "May 2024 - Mar 2026",
    location: "Bengaluru, India",
    highlights: [
      "Worked as a primary backend developer in a product SaaS environment.",
      "Designed multi-tenant architecture with Django, DRF, and PostgreSQL.",
      "Built and maintained 50+ REST APIs, internal service APIs, and a FastAPI integration service.",
      "Implemented SAML SSO and MFA, and used Redis and Celery for background jobs.",
      "Developed integrations with Google, Microsoft 365, Atlassian, and GitHub.",
    ],
  },
]

const projects = [
  {
    name: "Goatza",
    description:
      "Sports networking platform with real-time chat/notifications using Channels, Redis, WebSockets, and FCM.",
    stack: "Django, DRF, Next.js, PostgreSQL, Redis, WebSockets, FCM",
    link: "https://goatza.com",
  },
  {
    name: "Playoff",
    description:
      "Turf booking platform with booking workflows, participant chat, location-based search, and AWS EC2 deployment.",
    stack: "Django, DRF, AWS EC2, Nginx, Gunicorn, Daphne",
    link: "https://playoff-dusky.vercel.app/",
  },
  {
    name: "Enterprise Compliance SaaS Systems",
    description:
      "Multi-tenant backend platforms with SSO, MFA, integrations, and secure file handling.",
    stack: "Django, DRF, FastAPI, SAML SSO, MFA, Redis, Celery",
  },
]

const heroActionButtonClass =
  "bg-primary text-primary-foreground hover:bg-primary/90"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.25),transparent_62%)] blur-3xl" />
        <div className="absolute right-[-8rem] top-[30%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_65%)] blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full px-3">
                Python Full Stack Developer
              </Badge>
              <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Shabeeb TK
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Building reliable SaaS products with Python, Django, and modern
                frontend systems. I focus on backend architecture, secure APIs,
                React/Next.js user experiences, and clean production delivery.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Kerala, India
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Ex-Senior Development Engineer, CaretCloud
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:min-w-[250px]">
              <OpenChatShortcutButton />
              <Button asChild className={heroActionButtonClass}>
                <a
                  href="mailto:shabeebtk768@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="justify-between"
                >
                  Email Shabeeb
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild className={heroActionButtonClass}>
                <a
                  href="https://drive.google.com/file/d/16e8-AnarRn31QiTIK5XdOvHPAzoYlCEI/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="justify-between"
                >
                  View Resume
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="tel:+918848967775" className="justify-between">
                  +91 8848967775
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a
                    href="https://www.linkedin.com/in/shabeebtk/"
                    target="_blank"
                    rel="noreferrer"
                    className="justify-between"
                  >
                    LinkedIn
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a
                    href="https://api.whatsapp.com/send/?phone=918848967775&text=Hi+Shabeeb"
                    target="_blank"
                    rel="noreferrer"
                    className="justify-between"
                  >
                    WhatsApp
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {achievements.map((item) => (
            <Card key={item} className="border-border/70 bg-card/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 rounded-3xl border border-border/70 bg-card/65 p-5 sm:p-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Core Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="rounded-full px-3">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Experience
          </h2>
          {experiences.map((experience) => (
            <Card key={`${experience.company}-${experience.role}`} className="border-border/70 bg-card/70">
              <CardHeader>
                <CardTitle className="text-lg">{experience.role}</CardTitle>
                <CardDescription>
                  {experience.company} | {experience.period} | {experience.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Featured Projects
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.name} className="border-border/70 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.stack}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  {project.link && (
                    <Button asChild size="sm" variant="outline">
                      <a href={project.link} target="_blank" rel="noreferrer">
                        Open Project
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/70 p-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Why Hire Shabeeb
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Shabeeb brings strong backend ownership, product thinking, and
            frontend-backend full-stack execution. He has delivered enterprise
            SaaS systems, production integrations, and realtime user experiences
            with a focus on quality, scalability, and security.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Availability: Please contact directly to confirm current availability
            and notice period.
          </p>
        </section>

        <section className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Want to know more?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">
              Chat with the AI Assistant to learn more about my skills, experience, and projects!
            </p>
          </div>
          <OpenChatShortcutButton />
        </section>
      </main>

      <ChatWidget />
    </div>
  )
}
