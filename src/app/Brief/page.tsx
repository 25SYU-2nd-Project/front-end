// src/app/Brief/page.tsx
import { Suspense } from 'react';
import BriefPageClient from './pageClient';

export default function BriefPageWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BriefPageClient />
    </Suspense>
  );
}
