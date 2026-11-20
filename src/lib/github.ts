export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

export interface RepoStats {
  stars: number;
  language: string | null;
  lastUpdated: string;
  url: string;
}

const GITHUB_USERNAME = 'agiprogrammer';
const GITHUB_API_BASE = 'https://api.github.com';

// Static fallback data for when API is unavailable or rate limited
const staticFallbacks: Record<string, RepoStats> = {
  echobaud: { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/echobaud' },
  phaseveil: { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/phaseveil' },
  'osint-center': { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/osint-center' },
  tensorgate: { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/tensorgate' },
  'cyber-virtual-mouse': { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/cyber-virtual-mouse' },
  'lan-drop': { stars: 0, language: 'Python', lastUpdated: '2025-01-15', url: 'https://github.com/agiprogrammer/lan-drop' },
};

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function fetchRepoStats(repoName: string): Promise<RepoStats> {
  const cacheKey = `github-repo-${repoName}`;

  // Check if we have a cached version (in-memory for serverless)
  // In production, this would use Redis or similar

  try {
    const response = await fetchWithTimeout(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Arush-Shakya-Portfolio/1.0',
        },
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repo: GitHubRepo = await response.json();

    return {
      stars: repo.stargazers_count,
      language: repo.language,
      lastUpdated: repo.updated_at.split('T')[0],
      url: repo.html_url,
    };
  } catch (error) {
    console.warn(`Failed to fetch GitHub stats for ${repoName}:`, error);
    // Return static fallback
    return staticFallbacks[repoName] || {
      stars: 0,
      language: null,
      lastUpdated: 'Unknown',
      url: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
    };
  }
}

export async function fetchAllRepoStats(repoNames: string[]): Promise<Record<string, RepoStats>> {
  const results: Record<string, RepoStats> = {};

  await Promise.all(
    repoNames.map(async (name) => {
      results[name] = await fetchRepoStats(name);
    })
  );

  return results;
}

export function getTotalStars(stats: Record<string, RepoStats>): number {
  return Object.values(stats).reduce((sum, repo) => sum + repo.stars, 0);
}