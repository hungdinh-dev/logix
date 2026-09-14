import type { Skill, ProficiencyLevel } from '../../types/progress.types';

const PROFICIENCY_COLORS: Record<ProficiencyLevel, { bar: string; dot: string; label: string }> = {
  advanced: { bar: '#5db872', dot: '#5db872', label: 'Advanced' },
  intermediate: { bar: '#e8a55a', dot: '#e8a55a', label: 'Intermediate' },
  beginner: { bar: '#c64545', dot: '#c64545', label: 'Beginner' },
};

interface SkillsPanelProps {
  readonly skills: readonly Skill[];
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-foreground">Skills Covered</h2>

      {/* Legend */}
      <div className="mb-4 flex items-center gap-4">
        {(['advanced', 'intermediate', 'beginner'] as ProficiencyLevel[]).map((lvl) => (
          <div key={lvl} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: PROFICIENCY_COLORS[lvl].dot }}
            />
            <span className="text-[10px] text-muted-foreground">{PROFICIENCY_COLORS[lvl].label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {skills.map((skill) => {
          const { bar, dot } = PROFICIENCY_COLORS[skill.level];
          return (
            <div key={skill.id}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
                  <span className="text-xs font-medium text-foreground">{skill.name}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: bar }}>
                  {skill.percent}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.percent}%`, backgroundColor: bar }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
