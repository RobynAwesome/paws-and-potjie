import type { ExperienceProfile } from './experience';

export type SceneContract = {
  schema: 'kpgs.scene_contract.v1';
  scene: 'kitchen';
  intent: 'experience';
  runtime: {
    tier: ExperienceProfile['tier'];
    animate: boolean;
    reducedMotion: boolean;
    saveData: boolean;
  };
  boundary: 'INTERACTION ≠ PRODUCT CLAIM';
  receipt: { schema: 'kpgs.scene_receipt.v1'; network: false };
};

export function createSceneContract(profile: ExperienceProfile): SceneContract {
  return {
    schema: 'kpgs.scene_contract.v1',
    scene: 'kitchen',
    intent: 'experience',
    runtime: {
      tier: profile.tier,
      animate: !profile.reducedMotion && !profile.saveData,
      reducedMotion: profile.reducedMotion,
      saveData: profile.saveData,
    },
    boundary: 'INTERACTION ≠ PRODUCT CLAIM',
    receipt: { schema: 'kpgs.scene_receipt.v1', network: false },
  };
}

export function mountSceneContract(contract: SceneContract) {
  const root = document.documentElement;
  root.dataset.kpgsSchema = contract.schema;
  root.dataset.kpgsScene = contract.scene;
  root.dataset.kpgsTier = contract.runtime.tier;
  root.dataset.kpgsMotion = contract.runtime.animate ? 'full' : 'reduced';

  const detail = {
    schema: contract.receipt.schema,
    event: 'scene_mounted',
    ts: new Date().toISOString(),
    scene: contract.scene,
    tier: contract.runtime.tier,
    network: contract.receipt.network,
  };
  performance.mark(`kpgs:scene_mounted:${contract.scene}`);
  window.dispatchEvent(new CustomEvent('kpgs:receipt', { detail }));
}
