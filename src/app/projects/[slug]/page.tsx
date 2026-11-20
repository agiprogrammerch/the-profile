import { notFound } from 'next/navigation';
import { projects, Project } from '@/data/projects';
import { fetchRepoStats } from '@/lib/github';
import ProjectDetail from './ProjectDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';
import MatrixCanvas from '@/components/MatrixCanvas';
import StarsCanvas from '@/components/StarsCanvas';
import ScrollProgress from '@/components/ScrollProgress';
import VisitBadge from '@/components/VisitBadge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Fetch GitHub stats for this project
  const repoStats = await fetchRepoStats(slug);

  return (
    <>
      <Cursor />
      <MatrixCanvas />
      <StarsCanvas />
      <ScrollProgress />
      <VisitBadge />
      <Navbar />
      <main id="main-content">
        <ProjectDetail project={project} repoStats={repoStats} />
      </main>
      <Footer />
    </>
  );
}