'use client';

import BananaCat3D from './BananaCat3D';
import PopCat3D from './PopCat3D';
import HeartEyesCat3D from './HeartEyesCat3D';
import PoliteCat3D from './PoliteCat3D';
import ThumbsUpCat3D from './ThumbsUpCat3D';
import CuteCat from './CuteCat';

export default function FloatingMemeCats() {
  return (
    <group>
      {/* ── Section 0 (Hero): 3D Banana Cat & Waving Chibi Cat ── */}
      <group position={[0, 0, 0]}>
        <BananaCat3D position={[2.5, 0.6, 0.2]} scale={0.95} speed={1.4} />
        <CuteCat position={[-2.6, 0.8, -0.3]} color="#FFA07A" scale={0.9} variant="waving" />
      </group>

      {/* ── Section 1 (Gallery): 3D Heart Eyes Cat & Pop Cat ── */}
      <group position={[0, -5, 0]}>
        <HeartEyesCat3D position={[-2.7, 0.4, 0.3]} scale={1.05} speed={1.5} />
        <PopCat3D position={[2.7, -0.3, 0.1]} scale={1.0} speed={1.6} />
      </group>

      {/* ── Section 2 (Our Story): 3D Polite Cat & Kissing Calico Cat ── */}
      <group position={[0, -10, 0]}>
        <PoliteCat3D position={[2.6, 0.2, 0.2]} scale={1.1} speed={1.3} />
        <CuteCat position={[-2.6, -0.4, 0.1]} color="#F48FB1" scale={1.05} variant="waving" />
      </group>

      {/* ── Section 3 (50 Shades of Cats): Complete 3D Meme Trio ── */}
      <group position={[0, -16, 0]}>
        <BananaCat3D position={[-2.8, 0.3, 0.4]} scale={1.15} speed={1.5} />
        <PopCat3D position={[0, 1.4, 0.6]} scale={1.3} speed={1.8} />
        <ThumbsUpCat3D position={[2.8, -0.2, 0.3]} scale={1.15} speed={1.4} />
      </group>

      {/* ── Section 4 (Mini Game): Cheerleader Meme Cats ── */}
      <group position={[0, -22, 0]}>
        <HeartEyesCat3D position={[-2.9, 0.6, 0.3]} scale={1.1} speed={1.6} />
        <ThumbsUpCat3D position={[2.9, 0.4, 0.2]} scale={1.1} speed={1.5} />
      </group>

      {/* ── Section 5 (Reasons): Sleeping Cozy Cat & Polite Cat ── */}
      <group position={[0, -28, 0]}>
        <CuteCat position={[-2.6, -0.4, 0.2]} color="#FFA726" scale={1.15} variant="sleeping" />
        <PoliteCat3D position={[2.6, 0.5, 0.1]} scale={1.05} speed={1.2} />
      </group>

      {/* ── Section 6 (Finale): Victory Celebration Meme Cats ── */}
      <group position={[0, -34, 0]}>
        <PopCat3D position={[-2.5, 0.6, 0.4]} scale={1.25} speed={1.9} />
        <BananaCat3D position={[2.5, 0.5, 0.3]} scale={1.2} speed={1.6} />
        <HeartEyesCat3D position={[0, -1.8, 0.6]} scale={1.3} speed={1.5} />
      </group>
    </group>
  );
}
