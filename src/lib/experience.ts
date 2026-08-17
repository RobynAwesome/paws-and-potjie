export type ExperienceTier = 'lite' | 'balanced' | 'full';

export type ExperienceProfile = {
  tier: ExperienceTier;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType: string;
  cores: number;
  memory: number;
  narrow: boolean;
};

type Connection = { saveData?: boolean; effectiveType?: string };
type AdaptiveNavigator = Navigator & { connection?: Connection; deviceMemory?: number };

export function getExperienceProfile(): ExperienceProfile {
  if (typeof window === 'undefined') {
    return { tier: 'balanced', reducedMotion: false, saveData: false, effectiveType: 'unknown', cores: 4, memory: 4, narrow: false };
  }

  const nav = navigator as AdaptiveNavigator;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(nav.connection?.saveData);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.matchMedia('(max-width: 720px)').matches;
  const effectiveType = nav.connection?.effectiveType ?? 'unknown';

  const tier: ExperienceTier = saveData || cores <= 2 || memory <= 2 || /2g/.test(effectiveType)
    ? 'lite'
    : narrow || cores <= 4 || memory <= 4 || effectiveType === '3g'
      ? 'balanced'
      : 'full';

  return { tier, reducedMotion, saveData, effectiveType, cores, memory, narrow };
}
