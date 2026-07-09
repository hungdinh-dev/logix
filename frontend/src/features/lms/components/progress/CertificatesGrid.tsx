import { Award, Download, Lock } from 'lucide-react';
import type { Certificate } from '../../types/progress.types';

function CertCard({ cert }: { cert: Certificate }) {
  if (cert.locked) {
    return (
      <div className="relative flex flex-col items-center rounded-xl border-2 border-border bg-muted p-5 opacity-60">
        <div className="relative mb-3">
          <Award className="h-12 w-12 text-muted-foreground" />
          <Lock className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-muted text-muted-foreground" />
        </div>
        <p className="mb-1 text-center text-sm font-semibold text-muted-foreground">{cert.courseName}</p>
        <p className="text-xs text-muted-foreground">Complete course to unlock</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl border-2 bg-card p-5 shadow-sm border-green-500/30">
      <Award className="mb-3 h-12 w-12 text-green-700 dark:text-green-400" />
      <p className="mb-1 text-center text-sm font-semibold text-foreground">{cert.courseName}</p>
      <p className="mb-4 text-xs text-muted-foreground">Completed {cert.completedDate}</p>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-green-500 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 transition-colors hover:bg-green-500/10"
      >
        <Download className="h-3.5 w-3.5" />
        Download PDF
      </button>
    </div>
  );
}

interface CertificatesGridProps {
  readonly certificates: readonly Certificate[];
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  return (
    <div id="certificates">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Certificates &amp; Badges</h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" />
          Download All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
